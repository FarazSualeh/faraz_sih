import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import {
  ArrowLeft,
  Cpu,
  Gamepad2,
  Keyboard,
  Puzzle,
  Shield,
  Zap,
} from "lucide-react";
import Phaser from "phaser";
import type { UserData } from "../App";
import { PhaserManager } from "../lib/phaser-manager";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface TechnologyGameProps {
  language: string;
  onBack: () => void;
  userData?: UserData;
}

/* Translations */
const translations = {
  en: {
    title: "Technology Games",
    selectGame: "Select a Game",
    backToDashboard: "Back to Dashboard",
    binaryMatch: "Binary Match",
    binaryMatchDesc:
      "Toggle bits to represent a decimal number.",
    keyboardNinja: "Keyboard Ninja",
    keyboardNinjaDesc:
      "Press the shown keys quickly to score points.",
    partsPuzzle: "Computer Parts Puzzle",
    partsPuzzleDesc:
      "Assemble the computer from puzzle pieces.",
    internetSafety: "Internet Safety Quest",
    internetSafetyDesc:
      "Choose safe actions to earn Cyber Shield points.",
    playNow: "Play Now",
    backToGames: "Back to Games",
    retry: "Retry",
    howToPlay: "How to Play",
    backToMenu: "Back to Menu",
    instructions: "Instructions",
  },
  hi: {
    title: "टेक्नॉलॉजी गेम्स",
    selectGame: "एक खेल चुनें",
    backToDashboard: "डैशबोर्ड पर वापस",
    binaryMatch: "बाइनरी मैच",
    binaryMatchDesc: "दशमलव नंबर को बाइनरी में बनाएं।",
    keyboardNinja: "कीबोर्ड निंजा",
    keyboardNinjaDesc: "दिखाए गए कीज़ तीव्रता से दबाएं।",
    partsPuzzle: "कम्प्यूटर पार्ट्स पज़ल",
    partsPuzzleDesc: "कम्प्यूटर के हिस्सों को जोड़ें।",
    internetSafety: "इंटरनेट सुरक्षा क्वेस्ट",
    internetSafetyDesc:
      "सुरक्षित विकल्प चुनकर साइबर शील्ड कमाएँ।",
    playNow: "अभी खेलें",
    backToGames: "खेलों पर वापस",
    retry: "पुनः प्रयास करें",
    howToPlay: "कैसे खेलें",
    backToMenu: "मेनू पर वापस",
    instructions: "निर्देश",
  },
  od: {
    title: "ଟେକ୍ନୋଲୋି ଖେଳ",
    selectGame: "ଏକ ଖେଳ ବାଛନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    binaryMatch: "ବାଇନାରୀ ମେଚ୍",
    binaryMatchDesc: "ଦଶମିକ କୁ ବାଇନାରୀରେ ତିଆରି କରନ୍ତୁ।",
    keyboardNinja: "କୀବୋର୍ଡ ନିଞ୍ଜା",
    keyboardNinjaDesc: "ଦିଆଯାଇଥିବା କୀଗୁଡ଼ିକୁ ଦ୍ରୁତ ଦବାନ୍ତୁ।",
    partsPuzzle: "କମ୍ପ୍ୟୁଟର ପାର୍ଟସ୍ ପଜଲ",
    partsPuzzleDesc: "କମ୍ପ୍ୟୁଟର ଅଂଶଗୁଡ଼ିକୁ ଯୋଗ କରନ୍ତୁ।",
    internetSafety: "ଇଣ୍ଟରନେଟ୍ ସୁରକ୍ଷା କ୍ୱେଷ୍ଟ",
    internetSafetyDesc: "ସୁରକ୍ଷିତ ଗତିବିଧି ଚୟନ କରନ୍ତୁ।",
    playNow: "ଖେଳନ୍ତୁ",
    backToGames: "ଖେଳକୁ ଫେରନ୍ତୁ",
    retry: "ପୁନଃ ପ୍ରୟାସ କରନ୍ତୁ",
    howToPlay: "କିପରି ଖେଳିବେ",
    backToMenu: "ମେନୁକୁ ଫେରନ୍ତୁ",
    instructions: "ନିର୍ଦ୍ଦେଶାବଳୀ",
  },
};

type GameType =
  | "menu"
  | "binary-match"
  | "keyboard-ninja"
  | "parts-puzzle"
  | "internet-safety"
  | "how-to-binary"
  | "how-to-keyboard"
  | "how-to-parts"
  | "how-to-internet";

/* Get difficulty from grade - Level 1 for 6-8, Level 2 for 9-10, Level 3 for 11-12 */
function getDifficultyFromGrade(grade?: string): number {
  if (!grade) return 1;
  const gradeNum = parseInt(grade);
  if (gradeNum <= 8) return 1;
  if (gradeNum <= 10) return 2;
  return 3;
}

// Global game control for retry functionality
let globalGameControl = {
  shouldRestart: false,
  currentScene: null as Phaser.Scene | null
};

/* ---------- React wrapper component ---------- */
export function TechnologyGame({
  language,
  onBack,
  userData,
}: TechnologyGameProps) {
  const [currentGame, setCurrentGame] =
    useState<GameType>("menu");
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const validLanguage =
    language && ["en", "hi", "od"].includes(language)
      ? language
      : "en";
  const t =
    translations[validLanguage as keyof typeof translations] ||
    translations.en;
  const difficulty = getDifficultyFromGrade(userData?.grade);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      PhaserManager.destroyGame();
      phaserGameRef.current = null;
    };
  }, []);

  // Handle game creation and context events
  useEffect(() => {
    if (currentGame !== "menu" && !currentGame.startsWith("how-to-") && gameContainerRef.current) {
      // Use PhaserManager to create game
      (async () => {
        const config = getGameConfig(currentGame);
        const game = await PhaserManager.createGame(config);
        if (game) {
          phaserGameRef.current = game;
        }
      })();
    }
    
    // Cleanup when switching games
    return () => {
      PhaserManager.destroyGame();
      phaserGameRef.current = null;
    };
  }, [currentGame]);

  // Base config + mapping to scene classes (inline wrapper extends style)
  const getGameConfig = (
    gameType: GameType,
  ): Phaser.Types.Core.GameConfig => {
    const baseConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      parent: gameContainerRef.current!,
      backgroundColor: "#0b1220",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
      },
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 0 }, debug: false },
      },
      audio: {
        noAudio: true, // Disable audio to prevent AudioContext errors
      },
      render: {
        antialias: false,
        pixelArt: false,
        roundPixels: true,
        transparent: false,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'low-power',
        batchSize: 512,
      },
      fps: {
        target: 60,
        forceSetTimeOut: false,
        min: 30,
        smoothStep: true,
      },
      disableContextMenu: true,
      callbacks: {
        preBoot: (game: Phaser.Game) => {
          game.events.on('boot', () => {
            // Game booted successfully
          });
        },
        postBoot: (game: Phaser.Game) => {
          if (game.canvas) {
            const canvas = game.canvas as HTMLCanvasElement;
            canvas.addEventListener('webglcontextlost', (event: Event) => {
              event.preventDefault();
              console.warn('WebGL context lost - attempting recovery');
            }, false);
            canvas.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored');
            }, false);
          }
        }
      }
    };

    switch (gameType) {
      case "binary-match":
        return {
          ...baseConfig,
          scene: class extends BinaryMatchScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "keyboard-ninja":
        return {
          ...baseConfig,
          scene: class extends KeyboardNinjaScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "parts-puzzle":
        return {
          ...baseConfig,
          scene: class extends PartsPuzzleScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "internet-safety":
        return {
          ...baseConfig,
          scene: class extends InternetSafetyScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      default:
        return baseConfig;
    }
  };

  const handleBackToMenu = async () => {
    await PhaserManager.destroyGame();
    phaserGameRef.current = null;
    setCurrentGame("menu");
    // Refresh AOS animations to fix visibility issue
    setTimeout(() => AOS.refresh(), 100);
  };

  const handleRetry = () => {
    globalGameControl.shouldRestart = true;
    if (globalGameControl.currentScene) {
      globalGameControl.currentScene.scene.restart();
    }
  };

  const getGameInstructions = (gameId: string) => {
    const instructions = {
      'binary-match': {
        en: {
          title: 'Binary Match - How to Play',
          steps: [
            '🔢 A decimal number will be displayed at the top',
            '💡 Click on the binary bits (0 or 1) to toggle them',
            '➕ Each bit position represents a power of 2 (1, 2, 4, 8...)',
            '✅ Match the binary value to the decimal number',
            '🎯 Get multiple correct answers to win!',
            '📊 Higher difficulty = larger numbers',
            '📱 On mobile: Tap bits to toggle them'
          ]
        },
        hi: {
          title: 'बाइनरी मैच - कैसे खेलें',
          steps: [
            '🔢 शीर्ष पर एक दशमलव संख्या प्रदर्शित होगी',
            '💡 बाइनरी बिट्स (0 या 1) पर क्लिक करके उन्हें टॉगल करें',
            '➕ प्रत्येक बिट स्थिति 2 की शक्ति का प्रतिनिधित्व करती है',
            '✅ बाइनरी मान को दशमलव संख्या से मिलाएं',
            '🎯 जीतने के लिए कई सही उत्तर प्राप्त करें!',
            '📊 उच्च कठिनाई = बड़ी संख्याएं',
            '📱 मोबाइल पर: बिट्स को टॉगल करने के लिए टैप करें'
          ]
        },
        od: {
          title: 'ବାଇନାରୀ ମେଚ୍ - କିପରି ଖେଳିବେ',
          steps: [
            '🔢 ଶୀର୍ଷରେ ଏକ ଦଶମିକ ସଂଖ୍ୟା ପ୍ରଦର୍ଶିତ ହେବ',
            '💡 ବାଇନାରୀ ବିଟ୍ଗୁଡ଼ିକରେ (0 କିମ୍ବା 1) କ୍ଲିକ୍ କରି ସେଗୁଡ଼ିକୁ ଟଗଲ୍ କରନ୍ତୁ',
            '➕ ପ୍ରତ୍ୟେକ ବିଟ୍ ସ୍ଥାନ 2 ର ଶକ୍ତିକୁ ପ୍ରତିନିଧିତ୍ୱ କରେ',
            '✅ ବାଇନାରୀ ମୂଲ୍ୟକୁ ଦଶମିକ ସଂଖ୍ୟା ସହିତ ମେଳାନ୍ତୁ',
            '🎯 ଜିତିବାକୁ ଅନେକ ସଠିକ୍ ଉତ୍ତର ପାଆନ୍ତୁ!',
            '📊 ଅଧିକ କଷ୍ଟସାଧ୍ୟତା = ବଡ଼ ସଂଖ୍ୟା',
            '📱 ମୋବାଇଲରେ: ବିଟ୍ଗୁଡ଼ିକୁ ଟଗଲ୍ କରିବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      },
      'keyboard-ninja': {
        en: {
          title: 'Keyboard Ninja - How to Play',
          steps: [
            '⌨️ Random keys will appear on screen',
            '⚡ Press the correct key on your keyboard quickly',
            '⏱️ You have limited time to press each key',
            '✅ Correct key presses earn you points',
            '❌ Wrong or slow responses lose points',
            '🎯 Get a high score before time runs out!',
            '📱 On mobile: Tap the displayed keys'
          ]
        },
        hi: {
          title: 'कीबोर्ड निंजा - कैसे खेलें',
          steps: [
            '⌨️ स्क्रीन पर यादृच्छिक कीज़ दिखाई देंगी',
            '⚡ अपने कीबोर्ड पर सही कीज़ को जल्दी से दबाएं',
            '⏱️ प्रत्येक कीज़ दबाने के लिए आपके पास सीमित समय है',
            '✅ सही कीज़ दबाने से आपको अंक मिलते हैं',
            '❌ गलत या धीमी प्रतिक्रियाओं से अंक कम होते हैं',
            '🎯 समय समाप्त होने से पहले उच्च स्कोर प्राप्त करें!',
            '📱 मोबाइल पर: प्रदर्शित कीज़ पर टैप करें'
          ]
        },
        od: {
          title: 'କୀବୋର୍ଡ ନିଞ୍ଜା - କିପରି ଖେଳିବେ',
          steps: [
            '⌨️ ସ୍କ୍ରିନରେ ଯାଦୃଚ୍ଛିକ କି ଦେଖାଯିବ',
            '⚡ ଆପଣଙ୍କ କୀବୋର୍ଡରେ ସଠିକ୍ କିକୁ ଶୀଘ୍ର ଦବାନ୍ତୁ',
            '⏱️ ପ୍ରତ୍ୟେକ କି ଦବାଇବା ପାଇଁ ଆପଣଙ୍କର ସୀମିତ ସମୟ ଅଛି',
            '✅ ସଠିକ୍ କି ଦବାଇବା ଆପଣଙ୍କୁ ପଏଣ୍ଟ ଅର୍ଜନ କରେ',
            '❌ ଭୁଲ କିମ୍ବା ମନ୍ଥର ପ୍ରତିକ୍ରିୟା ପଏଣ୍ଟ ହରାଇଥାଏ',
            '🎯 ସମୟ ସମାପ୍ତ ହେବା ପୂର୍ବରୁ ଉଚ୍ଚ ସ୍କୋର ପାଆନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: ପ୍ରଦର୍ଶିତ କିଗୁଡ଼ିକରେ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      },
      'parts-puzzle': {
        en: {
          title: 'Computer Parts Puzzle - How to Play',
          steps: [
            '🖥️ Computer parts are scattered on the screen',
            '🧩 Drag each part to its correct position',
            '📍 Parts include: Monitor, CPU, Keyboard, Mouse',
            '✅ Correctly placed parts snap into position',
            '🎯 Assemble all parts to complete the computer!',
            '📊 Higher difficulty = more parts to assemble',
            '📱 On mobile: Drag parts with your finger'
          ]
        },
        hi: {
          title: 'कम्प्यूटर पार्ट्स पज़ल - कैसे खेलें',
          steps: [
            '🖥️ कम्प्यूटर के पुर्जे स्क्रीन पर बिखरे हुए हैं',
            '🧩 प्रत्येक पुर्जे को उसकी सही स्थिति में खींचें',
            '📍 पुर्जों में शामिल हैं: मॉनिटर, सीपीयू, कीबो��्ड, माउस',
            '✅ सही ढंग से रखे गए पुर्जे स्थिति में स्नैप होते हैं',
            '🎯 कम्प्यूटर को पूरा करने के लिए सभी पुर्जों को इकट्ठा करें!',
            ' उच्च कठिनाई = इकट्ठा करने के लिए अधिक पुर्जे',
            '📱 मोबाइल पर: अपनी उंगली से पुर्जों को खींचें'
          ]
        },
        od: {
          title: 'କମ୍ପ୍ୟୁଟର ପାର୍ଟସ୍ ପଜଲ - କିପରି ଖେଳିବେ',
          steps: [
            '🖥️ କମ୍ପ୍ୟୁଟର ଅଂଶଗୁଡ଼ିକ ସ୍କ୍ରିନରେ ବିଛାଯାଇଛି',
            '🧩 ପ୍ରତ୍ୟେକ ଅଂଶକୁ ଏହାର ସଠିକ୍ ସ୍ଥାନକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ',
            '📍 ଅଂଶଗୁଡ଼ିକ ଅନ୍ତର୍ଭୁକ୍ତ: ମନିଟର, ସିପିୟୁ, କୀବୋର୍ଡ, ମାଉସ୍',
            '✅ ସଠିକ୍ ଭାବରେ ରଖାଯାଇଥିବା ଅଂଶଗୁଡ଼ିକ ସ୍ଥାନରେ ସ୍ନାପ୍ ହୁଏ',
            '🎯 କମ୍ପ୍ୟୁଟର ସଂପୂର୍ଣ୍ଣ କରିବା ପାଇଁ ସମସ୍ତ ଅଂଶ ଏକତ୍ର କରନ୍ତୁ!',
            '📊 ଅଧିକ କଷ୍ଟସାଧ୍ୟତା = ଏକତ୍ର କରିବା ପାଇଁ ଅଧିକ ଅଂଶ',
            '📱 ମୋବାଇଲରେ: ଆପଣଙ୍କ ଆଙ୍ଗୁଠିରେ ଅଂଶଗୁଡ଼ିକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ'
          ]
        }
      },
      'internet-safety': {
        en: {
          title: 'Internet Safety Quest - How to Play',
          steps: [
            '🛡️ Scenarios about internet safety will appear',
            '✅ Choose the SAFE option (green button)',
            '❌ Avoid the UNSAFE option (red button)',
            '📊 Earn Cyber Shield points for correct choices',
            '⚠️ Wrong choices lose points',
            '🎯 Get a high Cyber Shield score!',
            '📱 On mobile: Tap your choice'
          ]
        },
        hi: {
          title: 'इंटरनेट सुरक्षा क्वेस्ट - कैसे खेलें',
          steps: [
            '🛡️ इंटरनेट सुरक्षा के बारे में परिदृश्य दिखाई देंगे',
            '✅ सुरक्षित विकल्प चुनें (हरा बटन)',
            '❌ असुरक्षित विकल्प से बचें (लाल बटन)',
            '📊 सही विकल्पों के लिए साइबर शील्ड अंक अर्जित करें',
            '⚠️ गलत विकल्प अंक खो देते हैं',
            '🎯 उच्च साइबर शील्ड स्कोर प्राप्त करें!',
            '📱 मोबाइल पर: अपने विकल्प पर टैप करें'
          ]
        },
        od: {
          title: 'ଇଣ୍ଟରନେଟ୍ ସୁରକ୍ଷା କ୍ୱେଷ୍ଟ - କିପରି ଖେଳିବେ',
          steps: [
            '🛡️ ଇଣ୍ଟରନେଟ୍ ସୁରକ୍ଷା ବିଷୟରେ ଦୃଶ୍ୟ ଦେଖାଯିବ',
            '✅ ସୁରକ୍ଷିତ ବିକଳ୍ପ ଚୟନ କରନ୍ତୁ (ସବୁଜ ବଟନ୍)',
            '❌ ଅସୁରକ୍ଷିତ ବିକଳ୍ପରୁ ଦୂରେଇ ରୁହନ୍ତୁ (ଲାଲ ବଟନ୍)',
            '📊ସଠିକ୍ ପସନ୍ଦ ପାଇଁ ସାଇବର ଶିଲ୍ଡ ପଏଣ୍ଟ ଅର୍ଜନ କରନ୍ତୁ',
            '⚠️ ଭୁଲ ପସନ୍ଦ ପଏଣ୍ଟ ହରାଇଥାଏ',
            '🎯ଉଚ୍ଚ ସାଇବର ଶିଲ୍ଡ ସକୋର ପାଆନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: ଆପଣଙ୍କ ପସନ୍ଦରେ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      }
    };

    return instructions[gameId as keyof typeof instructions];
  };

  const games = [
    {
      id: "binary-match",
      name: t.binaryMatch,
      description: t.binaryMatchDesc,
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
    },
    {
      id: "keyboard-ninja",
      name: t.keyboardNinja,
      description: t.keyboardNinjaDesc,
      icon: Keyboard,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      id: "parts-puzzle",
      name: t.partsPuzzle,
      description: t.partsPuzzleDesc,
      icon: Puzzle,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      id: "internet-safety",
      name: t.internetSafety,
      description: t.internetSafetyDesc,
      icon: Shield,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
    },
  ];

  // How to Play pages
  if (currentGame.startsWith('how-to-')) {
    const gameId = currentGame.replace('how-to-', '');
    const fullGameId = gameId === 'binary' ? 'binary-match' :
                        gameId === 'keyboard' ? 'keyboard-ninja' :
                        gameId === 'parts' ? 'parts-puzzle' :
                        'internet-safety';
    const instructions = getGameInstructions(fullGameId);
    const gameInstructions = instructions?.[validLanguage as keyof typeof instructions] || instructions?.en;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={handleBackToMenu} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToMenu}
          </Button>

          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl md:text-3xl text-center">
                {gameInstructions?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl mb-4">{t.instructions}</h3>
              <div className="space-y-3">
                {gameInstructions?.steps.map((step: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setCurrentGame(fullGameId as GameType)}
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                size="lg"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                {t.playNow}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentGame === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50 to-lime-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600">{t.selectGame}</p>
            {userData?.grade && (
              <Badge variant="secondary" className="mt-2">
                Grade {userData.grade} - Difficulty Level{" "}
                {difficulty}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game, index) => {
              const Icon = game.icon as any;
              return (
                <Card
                  key={game.id}
                  className={`hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${game.bgColor} border-2 cursor-pointer transform hover:scale-105`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardHeader>
                    <div
                      className={`w-16 h-16 mx-auto bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-xl">
                      {game.name}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <Button
                      onClick={() =>
                        setCurrentGame(game.id as GameType)
                      }
                      className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg text-white`}
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      {t.playNow}
                    </Button>
                    <Button
                      onClick={() => {
                        const howToId = game.id === 'binary-match' ? 'how-to-binary' :
                                       game.id === 'keyboard-ninja' ? 'how-to-keyboard' :
                                       game.id === 'parts-puzzle' ? 'how-to-parts' :
                                       'how-to-internet';
                        setCurrentGame(howToId as GameType);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      📖 {t.howToPlay}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            onClick={handleBackToMenu}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToGames}
          </Button>
          <Button
            variant="default"
            onClick={handleRetry}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            {t.retry}
          </Button>
        </div>

        <div
          ref={gameContainerRef}
          className="rounded-xl overflow-hidden shadow-2xl border-4 border-white"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            height: "600px",
          }}
        />

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Use keyboard keys or mouse to interact (if
            applicable)
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   Inline Phaser Scenes for Technology
   1) BinaryMatchScene
   2) KeyboardNinjaScene
   3) PartsPuzzleScene
   4) InternetSafetyScene
   =================================================================== */

/* ----------------- BinaryMatchScene ----------------- */
class BinaryMatchScene extends Phaser.Scene {
  private promptText!: Phaser.GameObjects.Text;
  private bits: Phaser.GameObjects.Text[] = [];
  private target: number = 0;
  private bitCount = 8;
  private feedback!: Phaser.GameObjects.Text;
  private rounds = 0;
  private maxRounds = 5;

  constructor(private difficulty: number = 1) {
    super({ key: "BinaryMatchScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.target = Phaser.Math.Between(
      1,
      this.difficulty === 1
        ? 20
        : this.difficulty === 2
          ? 60
          : 200,
    );
    this.bitCount =
      this.difficulty === 1
        ? 6
        : this.difficulty === 2
          ? 8
          : 10;

    this.add
      .rectangle(width / 2, 40, 760, 64, 0x0b1220)
      .setOrigin(0.5);
    this.promptText = this.add
      .text(width / 2, 80, `Represent: ${this.target}`, {
        fontSize: "28px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // bits display
    const startX = width / 2 - (this.bitCount - 1) * 28;
    for (let i = 0; i < this.bitCount; i++) {
      const x = startX + i * 56;
      const t = this.add
        .text(x, 220, "0", {
          fontSize: "36px",
          color: "#fff",
          backgroundColor: "#333",
          padding: { x: 14, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive();
      t.setData("index", i);
      t.on("pointerdown", () => this.toggleBit(i));
      this.bits.push(t);
    }

    this.feedback = this.add
      .text(width / 2, 520, `Round: ${this.rounds}/${this.maxRounds}`, {
        fontSize: "22px",
        color: "#ffd54f",
      })
      .setOrigin(0.5);
  }

  private toggleBit(i: number) {
    const t = this.bits[i];
    const cur = t.text === "1" ? "0" : "1";
    t.setText(cur);
    this.checkAnswer();
  }

  private checkAnswer() {
    // read bits msb -> lsb
    let binStr = "";
    for (let i = 0; i < this.bitCount; i++) {
      binStr += this.bits[i].text;
    }
    // parse as binary
    const value = parseInt(binStr, 2);
    if (value === this.target) {
      this.rounds++;
      this.feedback.setText(`✅ Correct! Round: ${this.rounds}/${this.maxRounds}`);
      this.tweens.add({
        targets: this.feedback,
        scale: 1.12,
        duration: 160,
        yoyo: true,
      });
      
      if (this.rounds >= this.maxRounds) {
        // Game complete
        this.time.delayedCall(700, () => {
          this.showGameComplete();
        }, [], this);
      } else {
        // small celebration and new target
        this.time.delayedCall(
          700,
          () => {
            this.target = Phaser.Math.Between(
              1,
              this.difficulty === 1
                ? 20
                : this.difficulty === 2
                  ? 60
                  : 200,
            );
            for (const b of this.bits) b.setText("0");
            this.promptText.setText(`Represent: ${this.target}`);
            this.feedback.setText(`Round: ${this.rounds}/${this.maxRounds}`);
          },
          [],
          this,
        );
      }
    } else {
      this.feedback.setText(`Round: ${this.rounds}/${this.maxRounds}`);
    }
  }

  private showGameComplete() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      500,
      250,
      0x000000,
      0.85
    );
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 40,
        "🎉 All Rounds Complete!",
        { fontSize: "28px", color: "#76ff03" }
      )
      .setOrigin(0.5);

    const retryBtn = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 40, "🔄 RETRY", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retryBtn.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}

/* ----------------- KeyboardNinjaScene ----------------- */
class KeyboardNinjaScene extends Phaser.Scene {
  private targetKey!: string;
  private keyText!: Phaser.GameObjects.Text;
  private score = 0;
  private timeLeft = 30;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;

  constructor(private difficulty: number = 1) {
    super({ key: "KeyboardNinjaScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.add
      .rectangle(width / 2, 40, 760, 64, 0x0b1220)
      .setOrigin(0.5);
    this.keyText = this.add
      .text(width / 2, 220, "", {
        fontSize: "96px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "20px",
      color: "#ffd",
    });
    this.timerText = this.add.text(
      width - 120,
      20,
      `Time: ${this.timeLeft}`,
      { fontSize: "20px", color: "#ffd" },
    );

    this.nextKey();
    this.input.keyboard!.on("keydown", (e: KeyboardEvent) =>
      this.onKey(e.key.toUpperCase()),
    );
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });
  }

  private nextKey() {
    // choose random A-Z or digits if difficulty higher
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.targetKey = pool.charAt(
      Phaser.Math.Between(0, pool.length - 1),
    );
    this.keyText.setText(this.targetKey);
  }

  private onKey(k: string) {
    if (k === this.targetKey) {
      this.score += 1;
      this.scoreText.setText(`Score: ${this.score}`);
      this.tweens.add({
        targets: this.keyText,
        scale: 1.2,
        duration: 120,
        yoyo: true,
      });
      this.nextKey();
    } else {
      // small shake
      this.cameras.main.shake(80, 0.01);
    }
  }

  private tick() {
    this.timeLeft -= 1;
    this.timerText.setText(`Time: ${this.timeLeft}`);
    if (this.timeLeft <= 0) {
      this.timerEvent?.remove(false);
      this.endGame();
    }
  }

  private endGame() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      450,
      250,
      0x000000,
      0.85,
    );
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 50,
        "⏱️ Time Up!",
        { fontSize: "36px", color: "#fff" },
      )
      .setOrigin(0.5);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `Score: ${this.score}`,
        { fontSize: "24px", color: "#ffd" },
      )
      .setOrigin(0.5);

    const retryBtn = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 60, "🔄 RETRY", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retryBtn.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}

/* ----------------- PartsPuzzleScene ----------------- */
class PartsPuzzleScene extends Phaser.Scene {
  private pieces: Phaser.GameObjects.Container[] = [];
  private targetPositions: {
    x: number;
    y: number;
    key: string;
  }[] = [];
  private placedCount = 0;

  constructor(private difficulty: number = 1) {
    super({ key: "PartsPuzzleScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.add
      .rectangle(width / 2, 40, 760, 64, 0x0b1220)
      .setOrigin(0.5);
    this.add.text(
      20,
      18,
      "Drag the pieces to assemble the computer",
      { color: "#fff" },
    );

    // define 4 target spots
    const startX = 220;
    const startY = 180;
    const names = ["CPU", "MON", "KB", "MS"];
    names.forEach((n, i) => {
      const tx = startX + i * 140;
      const ty = startY;
      this.add
        .rectangle(tx, ty, 100, 80, 0x111827)
        .setStrokeStyle(2, 0x374151);
      this.add
        .text(tx, ty + 50, n, {
          color: "#888",
          fontSize: "14px",
        })
        .setOrigin(0.5);
      this.targetPositions.push({ x: tx, y: ty, key: n });
    });

    // create shuffled pieces at bottom
    const piecesOrder = Phaser.Utils.Array.Shuffle(
      names.slice(),
    );
    piecesOrder.forEach((k, i) => {
      const x = 120 + i * 160;
      const y = 420;
      const rect = this.add
        .rectangle(0, 0, 100, 80, 0x06b6d4)
        .setStrokeStyle(2, 0x083344);
      const label = this.add
        .text(0, 0, k, { color: "#001", fontSize: "16px" })
        .setOrigin(0.5);
      const c = this.add.container(x, y, [rect, label]);
      c.setSize(100, 80);
      c.setInteractive(
        new Phaser.Geom.Rectangle(-50, -40, 100, 80),
        Phaser.Geom.Rectangle.Contains,
      );
      this.input.setDraggable(c);
      (c as any).startX = x;
      (c as any).startY = y;
      c.on("drag", (_p: any, dx: number, dy: number) => {
        c.x = dx;
        c.y = dy;
      });
      c.on("dragend", () => this.checkPieceDrop(c, k));
      this.pieces.push(c);
    });
  }

  private checkPieceDrop(
    c: Phaser.GameObjects.Container,
    key: string,
  ) {
    // snap if near correct target
    for (const t of this.targetPositions) {
      const dist = Phaser.Math.Distance.Between(
        c.x,
        c.y,
        t.x,
        t.y,
      );
      if (dist < 60 && t.key === key) {
        c.x = t.x;
        c.y = t.y;
        c.disableInteractive();
        this.placedCount++;
        if (this.placedCount >= this.targetPositions.length) {
          this.showSuccess();
        }
        return;
      }
    }
    // else return
    this.tweens.add({
      targets: c,
      x: (c as any).startX,
      y: (c as any).startY,
      duration: 260,
      ease: "Back.easeOut",
    });
  }

  private showSuccess() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      450,
      250,
      0x000000,
      0.85,
    );
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 40,
        "🎉 Assembled!",
        { fontSize: "36px", color: "#76ff03" },
      )
      .setOrigin(0.5);

    const retryBtn = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 40, "🔄 RETRY", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retryBtn.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}

/* ----------------- InternetSafetyScene ----------------- */
class InternetSafetyScene extends Phaser.Scene {
  private questions: { text: string; correct: "yes" | "no" }[] =
    [];
  private index = 0;
  private score = 0;
  private promptText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private yesBtn!: Phaser.GameObjects.Rectangle;
  private noBtn!: Phaser.GameObjects.Rectangle;

  constructor(private difficulty: number = 1) {
    super({ key: "InternetSafetyScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.questions = [
      {
        text: "A friend sends an unknown link. Click it?",
        correct: "no",
      },
      {
        text: "Someone asks for your password. Share it?",
        correct: "no",
      },
      {
        text: "Use strong password for accounts?",
        correct: "yes",
      },
      {
        text: "Install apps only from trusted stores?",
        correct: "yes",
      },
    ];

    this.add
      .rectangle(width / 2, 40, 760, 64, 0x0b1220)
      .setOrigin(0.5);
    this.promptText = this.add
      .text(width / 2, 200, this.questions[this.index].text, {
        fontSize: "28px",
        color: "#fff",
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);
    this.scoreText = this.add.text(20, 20, "Cyber Shield: 0", {
      fontSize: "18px",
      color: "#ffd",
    });

    // yes/no buttons
    this.yesBtn = this.add
      .rectangle(width / 2 - 120, 360, 160, 64, 0x06b6d4)
      .setInteractive();
    this.noBtn = this.add
      .rectangle(width / 2 + 120, 360, 160, 64, 0xff6b6b)
      .setInteractive();
    this.add
      .text(width / 2 - 120, 360, "YES", {
        color: "#001",
        fontSize: "22px",
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2 + 120, 360, "NO", {
        color: "#001",
        fontSize: "22px",
      })
      .setOrigin(0.5);

    this.yesBtn.on("pointerdown", () => this.answer("yes"));
    this.noBtn.on("pointerdown", () => this.answer("no"));
  }

  private answer(choice: "yes" | "no") {
    const q = this.questions[this.index];
    if (choice === q.correct) {
      this.score += 10;
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.05,
        duration: 140,
        yoyo: true,
      });
    } else {
      this.cameras.main.shake(150, 0.01);
    }
    this.index++;
    if (this.index >= this.questions.length) {
      this.endQuiz();
    } else {
      this.promptText.setText(this.questions[this.index].text);
      this.scoreText.setText(`Cyber Shield: ${this.score}`);
    }
  }

  private endQuiz() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      450,
      280,
      0x000000,
      0.85,
    );
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 60,
        "🛡️ Quest Complete",
        { fontSize: "32px", color: "#76ff03" },
      )
      .setOrigin(0.5);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `Cyber Shield: ${this.score}`,
        { fontSize: "20px", color: "#ffd" },
      )
      .setOrigin(0.5);

    const retryBtn = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 60, "🔄 RETRY", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retryBtn.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}
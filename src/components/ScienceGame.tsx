import { useState, useEffect, useRef } from "react";
import AOS from "aos";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Gamepad2,
  Zap,
  Cpu,
  Leaf,
  Battery,
} from "lucide-react";
import Phaser from "phaser";
import type { UserData } from "../App";
import { PhaserManager } from "../lib/phaser-manager";

interface ScienceGameProps {
  language: string;
  onBack: () => void;
  userData?: UserData;
}

/* Translations (matching pattern used in MathGame) */
const translations = {
  en: {
    title: "Science Games",
    selectGame: "Select a Game",
    backToDashboard: "Back to Dashboard",
    circuitConnect: "Circuit Connect",
    circuitConnectDesc:
      "Assemble a working circuit to light the bulb!",
    statesMatter: "States of Matter",
    statesMatterDesc:
      "Sort items into solid, liquid, or gas bins.",
    plantParts: "Plant Parts",
    plantPartsDesc: "Label and place parts of a plant.",
    foodChain: "Food Chain",
    foodChainDesc: "Build the correct food chain sequence.",
    playNow: "Play Now",
    backToGames: "Back to Games",
    retry: "Retry",
    howToPlay: "How to Play",
    backToMenu: "Back to Menu",
    instructions: "Instructions",
  },
  hi: {
    title: "विज्ञान खेल",
    selectGame: "एक खेल चुनें",
    backToDashboard: "डैशबोर्ड पर वापस",
    circuitConnect: "सर्किट जोड़ें",
    circuitConnectDesc: "बल्ब को जलाने के लिए सर्किट बनाएँ!",
    statesMatter: "पदार्थ की अवस्थाएँ",
    statesMatterDesc: "आइटम्स को ठोस/तरल/गैस में रखें।",
    plantParts: "पौधे के भाग",
    plantPartsDesc: "पौधे के भागों को चिन्हित करें।",
    foodChain: "खाद्य श्रृंखला",
    foodChainDesc: "सही खाद्य श्रृंखला बनाओ।",
    playNow: "अभी खेलें",
    backToGames: "खेलों पर वापस",
    retry: "पुनः प्रयास करें",
    howToPlay: "कैसे खेलें",
    backToMenu: "मेनू पर वापस",
    instructions: "निर्देश",
  },
  od: {
    title: "ବିଜ୍ଞାନ ଖେଳ",
    selectGame: "ଏକ ଖେଳ ବାଛନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    circuitConnect: "ସର୍କିଟ ଯୋଡନ୍ତୁ",
    circuitConnectDesc:
      "ବଲ୍ବକୁ ଜଲାଇବା ପାଇଁ ସର୍କିଟ ତିଆରି କରନ୍ତୁ!",
    statesMatter: "ପଦାର୍ଥ ଅବସ୍ଥା",
    statesMatterDesc:
      "ସାମଗ୍ରୀଗୁଡିକୁ ଠୋସ/ତରଳ/ଗ୍ୟାସରେ ବିଭାଜିତ କରନ୍ତୁ।",
    plantParts: "ଗଛର ଅଂଶ",
    plantPartsDesc: "ଗଛର ଅଂଶଗୁଡିକୁ ସ୍ଥାନ ଦିଅନ୍ତୁ।",
    foodChain: "ଖାଦ୍ୟ ଶୃଖଳା",
    foodChainDesc: "ସଠିକ୍ ଖାଦ୍ୟ ଶୃଖଳା ତିଆରି କରନ୍ତୁ।",
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
  | "circuit-connect"
  | "states-matter"
  | "plant-parts"
  | "food-chain"
  | "how-to-circuit"
  | "how-to-states"
  | "how-to-plant"
  | "how-to-food";

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

/* ---- ScienceGame React component (UI + Phaser mount) ---- */
export function ScienceGame({
  language,
  onBack,
  userData,
}: ScienceGameProps) {
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
      if (phaserGameRef.current) {
        try {
          phaserGameRef.current.destroy(true, false);
        } catch (e) {
          // Ignore errors during cleanup
        }
        phaserGameRef.current = null;
      }
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
    };

    switch (gameType) {
      case "circuit-connect":
        return {
          ...baseConfig,
          scene: class extends CircuitConnectScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "states-matter":
        return {
          ...baseConfig,
          scene: class extends StatesOfMatterScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "plant-parts":
        return {
          ...baseConfig,
          scene: class extends PlantPartsScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "food-chain":
        return {
          ...baseConfig,
          scene: class extends FoodChainScene {
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
      'circuit-connect': {
        en: {
          title: 'Circuit Connect - How to Play',
          steps: [
            '🔌 You need to build a complete circuit to light the bulb',
            '⚡ Drag circuit parts from the bottom area to the slots',
            '📍 Parts must be placed in correct order: Battery → Switch → Bulb → Wire',
            '✅ If placed correctly, the bulb will light up!',
            '❌ Wrong order will reset the circuit',
            '🎯 Complete the circuit to win!',
            '📱 On mobile: Drag parts with your finger'
          ]
        },
        hi: {
          title: 'सर्किट जोड़ें - कैसे खेलें',
          steps: [
            '🔌 आपको बल्ब जलाने के लिए एक पूर्ण सर्किट बनाना होगा',
            '⚡ नीचे के क्षेत्र से सर्किट के पुर्जों को स्लॉट में खींचें',
            '📍 पुर्जों को सही क्रम में रखा जाना चाहिए: बैटरी → स्विच → बल्ब → तार',
            '✅ सही तरीके से रखने पर बल्ब जल जाएगा!',
            '❌ गलत क्रम सर्किट को रीसेट कर देगा',
            '🎯 सर्किट को पूरा करने के लिए जीतें!',
            '📱 मोबाइल पर: अपनी उंगली से पुर्जों को खींचें'
          ]
        },
        od: {
          title: 'ସର୍କିଟ ଯୋଡନ୍ତୁ - କିପରି ଖେଳିବେ',
          steps: [
            '🔌 ବଲ୍ବକୁ ଜଳାଇବା ପାଇଁ ଆପଣଙ୍କୁ ଏକ ସଂପୂର୍ଣ୍ଣ ସର୍କିଟ ନିର୍ମାଣ କରିବାକୁ ପଡିବ',
            '⚡ ତଳ ଅଞ୍ଚଳରୁ ସର୍କିଟ ଅଂଶଗୁଡ଼ିକୁ ସ୍ଲଟ୍ଗୁଡ଼ିକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ',
            '📍 ଅଂଶଗୁଡ଼ିକ ସଠିକ୍ କ୍ରମରେ ରଖିବା ଆବଶ୍ୟକ: ବ୍ୟାଟେରୀ → ସୁଇଚ୍ → ବଲ୍ବ → ତାର',
            '✅ ସଠିକ୍ ଭାବରେ ରଖିଲେ ବଲ୍ବ ଜଳିବ!',
            '❌ ଭୁଲ କ୍ରମ ସର୍କିଟକୁ ରିସେଟ୍ କରିବ',
            '🎯 ସର୍କିଟ ସଂପୂର୍ଣ୍ଣ କରିବାକୁ ଜିତନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: ଆପଣଙ୍କ ଆଙ୍ଗୁଠିରେ ଅଂଶଗୁଡ଼ିକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ'
          ]
        }
      },
      'states-matter': {
        en: {
          title: 'States of Matter - How to Play',
          steps: [
            '🧊 Items will fall from the top of the screen',
            '📦 Three bins: SOLID, LIQUID, and GAS',
            '👆 Drag each item to the correct bin',
            '✅ Correct placement earns you 10 points',
            '❌ Wrong placement shakes the screen',
            '🎯 Sort as many items correctly as possible!',
            '📱 On mobile: Drag items with your finger'
          ]
        },
        hi: {
          title: 'पदार्थ की अवस्थाएँ - कैसे खेलें',
          steps: [
            '🧊 आइटम स्क्रीन के ऊपर से गिरेंगे',
            '📦 तीन बिन: ठोस, तरल और गैस',
            '👆 प्रत्येक आइटम को सही बिन में खींचें',
            '✅ सही प्लेसमेंट आपको 10 अंक देता है',
            '❌ गलत प्लेसमेंट स्क्रीन को हिलाता है',
            '🎯 जितना संभव हो उतने आइटम को सही ढंग से सॉर्ट करें!',
            '📱 मोबाइल पर: अपनी उंगली से आइटम को खींचें'
          ]
        },
        od: {
          title: 'ପଦାର୍ଥ ଅବସ୍ଥା - କିପରି ଖେଳିବେ',
          steps: [
            '🧊 ଆଇଟମ୍ଗୁଡ଼ିକ ସ୍କ୍ରିନର ଉପରୁ ପଡ଼ିବ',
            '📦 ତିନୋଟି ବିନ୍: ଠୋସ, ତରଳ ଏବଂ ଗ୍ୟାସ',
            '👆 ପ୍ରତ୍ୟେକ ଆଇଟମକୁ ସଠିକ୍ ବିନ୍ରେ ଡ୍ରାଗ୍ କରନ୍ତୁ',
            '✅ ସଠିକ୍ ସ୍ଥାନିତ କରିବା ଆପଣଙ୍କୁ 10 ପଏଣ୍ଟ ଅର୍ଜନ କରେ',
            '❌ ଭୁଲ ସ୍ଥାନିତ କରିବା ସ୍କ୍ରିନକୁ ହଲାଇଥାଏ',
            '🎯 ଯଥାସମ୍ଭବ ସଠିକ୍ ଭାବରେ ଅନେକ ଆଇଟମ୍ ସର୍ଟ କରନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: ଆପଣଙ୍କ ଆଙ୍ଗୁଠିରେ ଆଇଟମ୍ଗୁଡ଼ିକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ'
          ]
        }
      },
      'plant-parts': {
        en: {
          title: 'Plant Parts - How to Play',
          steps: [
            '🌱 A plant diagram is shown on the screen',
            '📋 Labels for plant parts appear on the left',
            '👆 Click a label (root, stem, leaf, or flower)',
            '📍 Then click on the plant where that part belongs',
            '✅ Correct placement adds the label to the plant',
            '🎯 Label all parts correctly to win!',
            '📱 On mobile: Tap labels and plant locations'
          ]
        },
        hi: {
          title: 'पौधे के भाग - कैसे खेलें',
          steps: [
            '🌱 स्क्रीन पर एक पौधे का आरेख दिखाया गया है',
            '📋 बाईं ओर पौधे के भागों के लेबल दिखाई देते हैं',
            '👆 एक लेबल पर क्लिक करें (जड़, तना, पत्ती या फूल)',
            '📍 फिर पौधे पर क्लिक करें जहां वह भाग है',
            '✅ सही प्लेसमेंट पौधे में लेबल जोड़ता है',
            '🎯 जीतने के लिए सभी भागों को सही ढंग से लेबल करें!',
            '📱 मोबाइल पर: लेबल और पौधे के स्थानों पर टैप करें'
          ]
        },
        od: {
          title: 'ଗଛର ଅଂଶ - କିପରି ଖେଳିବେ',
          steps: [
            '🌱 ସ୍କ୍ରିନରେ ଏକ ଗଛର ଚିତ୍ର ଦେଖାଯାଏ',
            '📋 ବାମ ପ���ର୍ଶ୍ୱରେ ଗଛର ଅଂଶଗୁଡ଼ିକ ପାଇଁ ଲେବଲ୍ ଦେଖାଯାଏ',
            '👆 ଏକ ଲେବଲ୍ କ୍ଲିକ୍ କରନ୍ତୁ (ମୂଳ, ଡାଳ, ପତ୍ର, କିମ୍ବା ଫୁଲ)',
            '📍 ତାପରେ ଗଛରେ କ୍ଲିକ୍ କରନ୍ତୁ ଯେଉଁଠି ସେହି ଅଂଶ ଅଛି',
            '✅ ସଠିକ୍ ସ୍ଥାନିତ କରିବା ଗଛରେ ଲେବଲ୍ ଯୋଗ କରେ',
            '🎯 ଜିତିବାକୁ ସମସ୍ତ ଅଂଶକୁ ସଠିକ୍ ଭାବରେ ଲେବଲ୍ କରନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: ଲେବଲ୍ ଏବଂ ଗଛର ସ୍ଥାନଗୁଡ଼ିକରେ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      },
      'food-chain': {
        en: {
          title: 'Food Chain - How to Play',
          steps: [
            '🌿 Build the correct food chain sequence',
            '📊 Sequence: Grass → Grasshopper → Frog → Snake',
            '👆 Click on items in the correct order',
            '✅ Correct choices turn green',
            '❌ Wrong choices shake the screen',
            '🎯 Complete the entire chain to win!',
            '📱 On mobile: Tap items in sequence'
          ]
        },
        hi: {
          title: 'खाद्य श्रृंखला - कैसे खेलें',
          steps: [
            '🌿 सही खाद्य श्रृंखला अनुक्रम बनाएं',
            '📊 अनुक्रम: घास → टिड्डा → मेंढक → सांप',
            '👆 सही क्रम में आइटम पर क्लिक करें',
            '✅ सही विकल्प हरे हो जाते हैं',
            '❌ गलत विकल्प स्क्रीन को हिलाते हैं',
            '🎯 जीतने के लिए पूरी श्रृंखला पूरी करें!',
            '📱 मोबाइल पर: क्रम में आइटम पर टैप करें'
          ]
        },
        od: {
          title: 'ଖାଦ୍ୟ ଶୃଖଳା - କିପରି ଖେଳିବେ',
          steps: [
            '🌿 ସଠିକ୍ ଖାଦ୍ୟ ଶୃଖଳା କ୍ରମ ନିର୍ମାଣ କରନ୍ତୁ',
            '📊 କ୍ରମ: ଘାସ → ଫଡିଙ୍ଗ → ବେଙ୍ଗ → ସାପ',
            '👆 ସଠିକ୍ କ୍ରମରେ ଆଇଟମ୍ଗୁଡ଼ିକରେ କ୍ଲିକ୍ କରନ୍ତୁ',
            '✅ ସଠିକ୍ ପସନ୍ଦ ସବୁଜ ହୋଇଯାଏ',
            '❌ ଭୁଲ ପସନ୍ଦ ସ୍କ୍ରିନକୁ ହଲାଇଥାଏ',
            '🎯 ଜିତିବାକୁ ସମ୍ପୂର୍ଣ୍ଣ ଶୃଖଳା ସଂପୂର୍ଣ୍ଣ କରନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: କ୍ରମରେ ଆଇଟମ୍ଗୁଡ଼ିକରେ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      }
    };

    return instructions[gameId as keyof typeof instructions];
  };

  const games = [
    {
      id: "circuit-connect",
      name: t.circuitConnect,
      description: t.circuitConnectDesc,
      icon: Battery,
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
    },
    {
      id: "states-matter",
      name: t.statesMatter,
      description: t.statesMatterDesc,
      icon: Leaf,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      id: "plant-parts",
      name: t.plantParts,
      description: t.plantPartsDesc,
      icon: Leaf,
      color: "from-lime-400 to-green-500",
      bgColor: "from-lime-50 to-green-50",
    },
    {
      id: "food-chain",
      name: t.foodChain,
      description: t.foodChainDesc,
      icon: Cpu,
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
    },
  ];

  // How to Play pages
  if (currentGame.startsWith('how-to-')) {
    const gameId = currentGame.replace('how-to-', '');
    const fullGameId = gameId === 'circuit' ? 'circuit-connect' :
                        gameId === 'states' ? 'states-matter' :
                        gameId === 'plant' ? 'plant-parts' :
                        'food-chain';
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
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
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
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setCurrentGame(fullGameId as GameType)}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
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

  /* UI: Menu */
  if (currentGame === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 p-4">
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
                        const howToId = game.id === 'circuit-connect' ? 'how-to-circuit' :
                                       game.id === 'states-matter' ? 'how-to-states' :
                                       game.id === 'plant-parts' ? 'how-to-plant' :
                                       'how-to-food';
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

  /* UI: Game container + back button + retry button */
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
            Use arrow keys ← → or SPACE to interact (if
            applicable)
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   Phaser Scenes for Science (defined inline like in MathGame.tsx)
   Four scenes: CircuitConnectScene, StatesOfMatterScene,
   PlantPartsScene, FoodChainScene
   =================================================================== */

/* 1) CircuitConnectScene */
class CircuitConnectScene extends Phaser.Scene {
  private slots: Phaser.GameObjects.Rectangle[] = [];
  private parts: Phaser.GameObjects.Container[] = [];
  private placedOrder: (string | null)[] = [];
  private correctOrder = ["battery", "switch", "bulb", "wire"];
  private statusText!: Phaser.GameObjects.Text;
  private retryButton?: Phaser.GameObjects.Text;

  constructor(private difficulty: number = 1) {
    super({ key: "CircuitConnectScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.add
      .rectangle(width / 2, 32, 760, 64, 0x0b1220)
      .setOrigin(0.5);
    this.add.text(
      20,
      18,
      "Drag parts into the slots to complete the circuit",
      { color: "#fff", fontSize: "16px" },
    );

    // create slots
    const baseX = 120;
    for (let i = 0; i < 4; i++) {
      const slot = this.add
        .rectangle(baseX + i * 170, 160, 140, 80, 0x111827)
        .setStrokeStyle(2, 0x374151);
      slot.setData("index", i);
      slot.setData("occupied", false);
      this.slots.push(slot);
      this.placedOrder[i] = null;
    }

    // create parts row (shuffled)
    const keys = Phaser.Utils.Array.Shuffle([
      "battery",
      "switch",
      "bulb",
      "wire",
    ]);
    keys.forEach((k, idx) => {
      const cont = this.createPart(k, 120 + idx * 170, 340);
      this.parts.push(cont);
    });

    this.statusText = this.add
      .text(
        this.scale.width / 2,
        480,
        "Place parts in correct order",
        { fontSize: "18px", color: "#ffd" },
      )
      .setOrigin(0.5);
  }

  private createPart(key: string, x: number, y: number) {
    const box = this.add
      .rectangle(0, 0, 120, 56, 0x06b6d4)
      .setStrokeStyle(2, 0x083344);
    const label = this.add
      .text(0, 0, key.toUpperCase(), {
        color: "#061423",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    const container = this.add.container(x, y, [box, label]);
    container.setSize(120, 56);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-60, -28, 120, 56),
      Phaser.Geom.Rectangle.Contains,
    );
    this.input.setDraggable(container);

    // save start pos
    (container as any).startX = x;
    (container as any).startY = y;

    container.on("drag", (_p: any, dx: number, dy: number) => {
      container.x = dx;
      container.y = dy;
    });

    container.on("dragend", () => {
      let snapped = false;
      for (const s of this.slots) {
        const dist = Phaser.Math.Distance.Between(
          container.x,
          container.y,
          s.x,
          s.y,
        );
        if (dist < 80 && !s.getData("occupied")) {
          container.x = s.x;
          container.y = s.y;
          s.setData("occupied", true);
          s.setData("partKey", key);
          this.placedOrder[s.getData("index")] = key;
          snapped = true;
          break;
        }
      }
      if (!snapped) {
        this.tweens.add({
          targets: container,
          x: (container as any).startX,
          y: (container as any).startY,
          duration: 260,
          ease: "Back.easeOut",
        });
      }
      this.checkCircuit();
    });

    return container;
  }

  private checkCircuit() {
    if (this.placedOrder.some((v) => v === null)) return;
    const ok = this.correctOrder.every(
      (c, i) => this.placedOrder[i] === c,
    );
    if (ok) {
      this.statusText.setText(
        "✅ Circuit Complete! Bulb is ON",
      );
      const bulbSlot = this.slots[2];
      this.tweens.add({
        targets: bulbSlot,
        fillAlpha: { from: 0.6, to: 1 },
        duration: 300,
        yoyo: true,
        repeat: 4,
      });
      this.parts.forEach((p) => p.disableInteractive?.());
      
      // Show retry button
      this.showRetryButton();
    } else {
      this.statusText.setText("❌ Incorrect — resetting");
      this.time.delayedCall(
        700,
        () => {
          this.placedOrder = [null, null, null, null];
          this.slots.forEach((s) =>
            s.setData("occupied", false),
          );
          this.parts.forEach((p: any) => {
            this.tweens.add({
              targets: p,
              x: p.startX,
              y: p.startY,
              duration: 300,
              ease: "Back.easeOut",
            });
          });
          this.statusText.setText(
            "Place parts in correct order",
          );
        },
        [],
        this,
      );
    }
  }

  private showRetryButton() {
    this.retryButton = this.add
      .text(this.scale.width / 2, 540, "🔄 RETRY", {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.retryButton.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}

/* 2) StatesOfMatterScene */
class StatesOfMatterScene extends Phaser.Scene {
  private bins: {
    key: string;
    rect: Phaser.GameObjects.Rectangle;
  }[] = [];
  private itemsGroup!: Phaser.GameObjects.Group;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private spawnEvent?: Phaser.Time.TimerEvent;

  constructor(private difficulty: number = 1) {
    super({ key: "StatesOfMatterScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.add.text(
      20,
      20,
      "Drag items into Solid / Liquid / Gas",
      { color: "#fff" },
    );

    const keys = ["solid", "liquid", "gas"];
    keys.forEach((k, i) => {
      const x = 160 + i * 240;
      const rect = this.add
        .rectangle(x, 160, 220, 140, 0x111827)
        .setStrokeStyle(2, 0x374151);
      this.add
        .text(x, 140, k.toUpperCase(), { color: "#fff" })
        .setOrigin(0.5);
      this.bins.push({ key: k, rect });
    });

    this.itemsGroup = this.add.group();
    this.scoreText = this.add.text(
      width - 140,
      24,
      "Score: 0",
      { fontSize: "18px", color: "#ffd" },
    );

    this.spawnEvent = this.time.addEvent({
      delay: 1200,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnItem() {
    const types = [
      { label: "Ice", kind: "solid" },
      { label: "Steam", kind: "gas" },
      { label: "Water", kind: "liquid" },
      { label: "Metal", kind: "solid" },
      { label: "Vapor", kind: "gas" },
      { label: "Milk", kind: "liquid" },
    ];
    const pick = Phaser.Math.RND.pick(types);
    const x = Phaser.Math.Between(80, this.scale.width - 80);
    const cont = this.add.container(x, -20);
    const circle = this.add.circle(0, 0, 28, 0x4ecdc4);
    const text = this.add
      .text(0, 0, pick.label, {
        fontSize: "14px",
        color: "#000",
      })
      .setOrigin(0.5);
    cont.add([circle, text]);
    cont.setSize(60, 60);
    cont.setData("kind", pick.kind);
    cont.setInteractive();
    this.input.setDraggable(cont);
    this.itemsGroup.add(cont);

    // drop down
    this.tweens.add({
      targets: cont,
      y: 260,
      duration: 1400,
      ease: "Quad.easeIn",
    });

    cont.on("drag", (_p: any, dx: number, dy: number) => {
      cont.x = dx;
      cont.y = dy;
    });

    cont.on("dragend", () => {
      for (const b of this.bins) {
        if (
          Phaser.Geom.Rectangle.Contains(
            b.rect.getBounds(),
            cont.x,
            cont.y,
          )
        ) {
          this.checkDrop(cont, b.key);
          return;
        }
      }
      // else return
      this.tweens.add({
        targets: cont,
        y: 260,
        duration: 300,
        ease: "Back.easeOut",
      });
    });
  }

  private checkDrop(
    item: Phaser.GameObjects.Container,
    binKey: string,
  ) {
    const kind = item.getData("kind");
    if (kind === binKey) {
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.tweens.add({
        targets: item,
        scale: 0.4,
        alpha: 0,
        duration: 300,
        onComplete: () => item.destroy(),
      });
    } else {
      this.cameras.main.shake(200, 0.01);
      this.tweens.add({
        targets: item,
        x: Phaser.Math.Between(80, this.scale.width - 80),
        y: 260,
        duration: 300,
      });
    }
  }
}

/* 3) PlantPartsScene */
class PlantPartsScene extends Phaser.Scene {
  private labels: Phaser.GameObjects.Text[] = [];
  private slots = [
    { name: "root", x: 300, y: 420, filled: false },
    { name: "stem", x: 300, y: 340, filled: false },
    { name: "leaf", x: 380, y: 300, filled: false },
    { name: "flower", x: 300, y: 220, filled: false },
  ];
  private feedback!: Phaser.GameObjects.Text;
  private score = 0;
  private selectedLabel?: Phaser.GameObjects.Text;

  constructor(private difficulty: number = 1) {
    super({ key: "PlantPartsScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.add.text(
      20,
      20,
      "Click a label then click the plant where it belongs",
      { color: "#fff" },
    );

    // simple plant drawing
    const g = this.add.graphics();
    g.fillStyle(0x6b8e23, 1);
    g.fillRect(280, 320, 40, 120);
    g.fillStyle(0x228b22, 1);
    g.fillEllipse(300, 300, 140, 60);
    g.fillStyle(0xff69b4, 1);
    g.fillEllipse(300, 200, 60, 60);

    const names = ["root", "stem", "leaf", "flower"];
    names.forEach((n, i) => {
      const l = this.add
        .text(40, 100 + i * 44, n.toUpperCase(), {
          backgroundColor: "#fff",
          color: "#000",
          padding: { x: 8, y: 6 },
        })
        .setInteractive();
      l.on("pointerdown", () => this.preparePlaceLabel(n, l));
      this.labels.push(l);
    });

    this.feedback = this.add
      .text(width / 2, 520, "Score: 0", {
        color: "#ffd",
        fontSize: "20px",
      })
      .setOrigin(0.5);
  }

  private preparePlaceLabel(
    name: string,
    labelObj: Phaser.GameObjects.Text,
  ) {
    this.selectedLabel = labelObj;
    labelObj.setAlpha(0.6);

    this.input.once(
      "pointerdown",
      (p: Phaser.Input.Pointer) => {
        const slot = this.slots.find(
          (s) => s.name === name && !s.filled,
        );
        if (!slot) {
          labelObj.setAlpha(1);
          return;
        }
        this.add
          .text(slot.x, slot.y, name.toUpperCase(), {
            color: "#000",
            backgroundColor: "#fff",
            padding: { x: 6, y: 4 },
          })
          .setOrigin(0.5);
        slot.filled = true;
        labelObj.destroy();
        this.score += 10;
        this.feedback.setText(`Score: ${this.score}`);
        this.selectedLabel = undefined;

        // Check if all slots filled
        if (this.slots.every(s => s.filled)) {
          this.showRetryButton();
        }
      },
    );
  }

  private showRetryButton() {
    this.add
      .text(this.scale.width / 2, 560, "🔄 RETRY", {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.restart();
      });
  }
}

/* 4) FoodChainScene */
class FoodChainScene extends Phaser.Scene {
  private chain = ["grass", "grasshopper", "frog", "snake"];
  private currentIndex = 0;
  private items: Phaser.GameObjects.Text[] = [];
  private status!: Phaser.GameObjects.Text;

  constructor(private difficulty: number = 1) {
    super({ key: "FoodChainScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    this.add.text(
      20,
      20,
      "Click the next animal in the food chain sequence",
      { color: "#fff" },
    );

    this.status = this.add
      .text(width / 2, 520, "Start with GRASS", {
        color: "#ffd",
        fontSize: "18px",
      })
      .setOrigin(0.5);

    const pool = [
      "grass",
      "rabbit",
      "grasshopper",
      "frog",
      "snake",
      "bird",
    ];
    pool.forEach((p, i) => {
      const t = this.add
        .text(80 + i * 110, 360, p.toUpperCase(), {
          backgroundColor: "#fff",
          color: "#000",
          padding: { x: 8, y: 6 },
        })
        .setInteractive();
      t.on("pointerdown", () => this.onPick(p, t));
      this.items.push(t);
    });

    this.add
      .text(
        width / 2,
        120,
        "Sequence: Grass → Grasshopper → Frog → Snake",
        { color: "#fff" },
      )
      .setOrigin(0.5);
  }

  private onPick(
    pick: string,
    textObj: Phaser.GameObjects.Text,
  ) {
    const expected = this.chain[this.currentIndex];
    if (pick === expected) {
      textObj.setStyle({ backgroundColor: "#00ff88" });
      this.currentIndex++;
      if (this.currentIndex >= this.chain.length) {
        this.status.setText("🎉 Chain completed!");
        this.showRetryButton();
      } else {
        this.status.setText(
          `Good! Next: ${this.chain[this.currentIndex].toUpperCase()}`,
        );
      }
    } else {
      this.cameras.main.shake(200, 0.01);
      this.status.setText(
        `❌ Wrong! You needed ${expected.toUpperCase()}`,
      );
    }
  }

  private showRetryButton() {
    this.add
      .text(this.scale.width / 2, 560, "🔄 RETRY", {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.restart();
      });
  }
}
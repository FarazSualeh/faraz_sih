// src/EngineeringGame.tsx
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
  Box,
  Blocks,
  Wrench,
  Zap,
  Bot,
} from "lucide-react";
import Phaser from "phaser";
import type { UserData } from "../App";
import { PhaserManager } from "../lib/phaser-manager";

interface EngineeringGameProps {
  language: string;
  onBack: () => void;
  userData?: UserData;
}

const translations = {
  en: {
    title: "Engineering Games",
    selectGame: "Select a Game",
    backToDashboard: "Back to Dashboard",
    buildRobot: "Build a Robot",
    buildRobotDesc: "Assemble robot parts in the correct order!",
    bridgeBuilder: "Bridge Builder",
    bridgeBuilderDesc: "Build bridges to connect platforms!",
    simpleMachine: "Simple Machine Match",
    simpleMachineDesc: "Match machines to real-world tools.",
    marbleRun: "Marble Run",
    marbleRunDesc: "Design ramps and guide the marble to the goal.",
    playNow: "Play Now",
    backToGames: "Back to Games",
    retry: "Retry",
    howToPlay: "How to Play",
    backToMenu: "Back to Menu",
    instructions: "Instructions",
  },
  hi: {
    title: "इंजी��ियरिंग खेल",
    selectGame: "एक खेल चुनें",
    backToDashboard: "डैशबोर्ड पर वापस",
    buildRobot: "रोबोट बनाएं",
    buildRobotDesc: "रोबोट के पुर्जों को सही क्रम में जोड़ें!",
    bridgeBuilder: "ब्रिज बिल्डर",
    bridgeBuilderDesc: "प्लेटफार्मों को जोड़ने के लिए पुल बनाएं!",
    simpleMachine: "सरल मशीन मैच",
    simpleMachineDesc: "मशीनों को उनके उपयोग से मिलाएँ।",
    marbleRun: "मार्बल रन",
    marbleRunDesc: "रैंप बनाकर मार्बल को लक्ष्य तक पहुंचाएं।",
    playNow: "अभी खेलें",
    backToGames: "खेलों पर वापस",
    retry: "पुनः प्रयास करें",
    howToPlay: "कैसे खेलें",
    backToMenu: "मेनू पर वापस",
    instructions: "निर्देश",
  },
  od: {
    title: "ଏଂଜିନିଯରିଂ ଖେଳ",
    selectGame: "ଏକ ଖେଳ ବାଛନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    buildRobot: "ରୋବଟ୍ ନିର୍ମାଣ",
    buildRobotDesc: "ରୋବଟ୍ ଅଂଶଗୁଡ଼ିକୁ ସଠିକ୍ କ୍ରମରେ ଯୋଡନ୍ତୁ!",
    bridgeBuilder: "ବ୍ରିଜ୍ ବିଲ୍ଡର୍",
    bridgeBuilderDesc: "ପ୍ଲାଟଫର୍ମଗୁଡ଼ିକୁ ସଂଯୋଗ କରିବା ପାଇଁ ବ୍ରିଜ୍ ନିର୍ମାଣ କରନ୍ତୁ!",
    simpleMachine: "ସରଳ ମେସିନ୍ ମ୍ୟାଚ୍",
    simpleMachineDesc: "ମେସିନ୍ଗୁଡ଼ିକୁ ତାଙ୍କର ବ୍ୟବହାର ସହିତ ମେଳାନ୍ତୁ ।",
    marbleRun: "ମାର୍ବଲ୍ ରନ୍",
    marbleRunDesc: "ର୍ୟାମ୍ପ ତିଆରି କରି ଗୋଲକୁ ମାର୍ବଲକୁ ନେଉନ୍ତୁ ।",
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
  | "build-robot"
  | "bridge-builder"
  | "simple-machine"
  | "marble-run"
  | "how-to-robot"
  | "how-to-bridge"
  | "how-to-machine"
  | "how-to-marble";

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

/* ===================================================================
   React wrapper - shows menu/cards and mounts Phaser in a container
   =================================================================== */
export function EngineeringGame({
  language,
  onBack,
  userData,
}: EngineeringGameProps) {
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

  const getGameConfig = (
    gameType: GameType,
  ): Phaser.Types.Core.GameConfig => {
    const baseConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      parent: gameContainerRef.current!,
      backgroundColor: "#071025",
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
      case "build-robot":
        return {
          ...baseConfig,
          scene: class extends BuildRobotScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "bridge-builder":
        return {
          ...baseConfig,
          physics: {
            default: "matter",
            matter: { 
              gravity: { y: 1 }, 
              debug: false,
              enableSleeping: true
            },
          },
          scene: class extends BridgeBuilderScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "simple-machine":
        return {
          ...baseConfig,
          scene: class extends SimpleMachineScene {
            constructor() {
              super(difficulty);
            }
          },
        };
      case "marble-run":
        return {
          ...baseConfig,
          physics: {
            default: "arcade",
            arcade: { gravity: { x: 0, y: 800 }, debug: false },
          },
          scene: class extends MarbleRunScene {
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
      'build-robot': {
        en: {
          title: 'Build a Robot - How to Play',
          steps: [
            '🤖 Click on robot parts at the bottom of the screen',
            '📍 Parts must be placed in the correct order from bottom to top',
            '⏱️ You have limited time to place each part (harder levels = less time)',
            '✅ The part will snap into place if correct',
            '❌ Wrong parts will shake and return to their position',
            '🎯 Complete the robot before time runs out!',
            '📊 Higher difficulty = more parts and less time',
            '📱 On mobile: Tap the parts to select and place them'
          ]
        },
        hi: {
          title: 'रोबोट बनाएं - कैसे खेलें',
          steps: [
            '🤖 स्क्रीन के नीचे रोबोट के पुर्जों पर क्लिक करें',
            '📍 पुर्जों को नीचे से ऊपर सही क्रम में रखा जाना चाहिए',
            '⏱️ प्रत्येक भाग को रखने के लिए आपके पास सीमित समय है',
            '✅ सही होने पर पुर्जा अपनी जगह पर चला जाएगा',
            '❌ गलत पुर्जे हिलेंगे और अपनी जगह ��र लौट जाएंगे',
            '🎯 समय समाप्त होने से पहले रोबोट को पूरा करें!',
            '📊 उच्च कठिनाई = अधिक भाग और कम समय',
            '📱 मोबाइल पर: पुर्जों को चुनने और रखने के लिए टैप करें'
          ]
        },
        od: {
          title: 'ରୋବଟ୍ ନିର୍ମାଣ - କିପରି ଖେଳିବେ',
          steps: [
            '🤖 ସ୍କ୍ରିନର ତଳେ ରୋବଟ୍ ଅଂଶଗୁଡ଼ିକରେ କ୍ଲିକ୍ କରନ୍ତୁ',
            '📍 ଅଂଶଗୁଡ଼ିକ ତଳୁ ଉପରକୁ ସଠିକ୍ କ୍ରମରେ ରଖିବା ଆବଶ୍ୟକ',
            '⏱️ ପ୍ରତ୍ୟେକ ଅଂଶ ରଖିବା ପାଇଁ ଆପଣଙ୍କର ସୀମିତ ସମୟ ଅଛି',
            '✅ ସଠିକ୍ ହେଲେ ଅଂଶଟି ସ୍ଥାନରେ ସ୍ନାପ୍ ହେବ',
            '❌ ଭୁଲ ଅଂଶଗୁଡ଼ିକ ହଲିବ ଏବଂ ସେମାନଙ୍କ ସ୍ଥାନକୁ ଫେରିବ',
            '🎯 ସମୟ ସମାପ୍ତ ହେବା ପୂର୍ବରୁ ରୋବଟ୍ ସଂପୂର୍ଣ୍ଣ କରନ୍ତୁ!',
            '📊 ଅଧିକ କଷ୍ଟସାଧ୍ୟତା = ଅଧିକ ଅଂଶ ଏବଂ କମ୍ ସମୟ',
            '📱 ମୋବାଇଲରେ: ଅଂଶଗୁଡ଼ିକୁ ଚୟନ ଏବଂ ସ��ଥାନିତ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      },
      'bridge-builder': {
        en: {
          title: 'Bridge Builder - How to Play',
          steps: [
            '🌉 Build a bridge to connect two platforms',
            '📏 Drag beam pieces from the palette at the bottom',
            '🔨 Place beams strategically to create a strong structure',
            '🚗 Press TEST button to send a vehicle across your bridge',
            '💪 Bridge must be strong enough to support the vehicle',
            '✅ If vehicle reaches the other side - You Win!',
            '💥 If bridge collapses - Try Again!',
            '📊 Higher difficulty = longer gap and heavier vehicle',
            '📱 On mobile: Drag beams with your finger'
          ]
        },
        hi: {
          title: 'ब्रिज बिल्डर - कैसे खेलें',
          steps: [
            '🌉 दो प्लेटफार्मों को जोड़ने के लिए एक पुल बनाएं',
            '📏 नीच��� पैलेट से बीम के टुकड़ों को खींचें',
            '🔨 मजबूत संरचना बनाने के ��िए रणनीतिक रूप से बीम रखें',
            '🚗 अ���ने पुल पर वाहन भेजने के लिए TEST बटन दबाएं',
            '💪 पुल वाहन का समर्थन करने के लिए पर्याप्त मजबूत होना चाहिए',
            '✅ यदि वाहन दूसरी तरफ पहुंचता है - आप जीत गए!',
            '💥 यदि पुल गिर जाता है - फिर से प्रयास करें!',
            '📊 उच्च कठिनाई = लंबा अंतर और भारी वाहन',
            '📱 मोबाइल पर: अपनी उंगली से बीम खींचें'
          ]
        },
        od: {
          title: 'ବ୍ରିଜ୍ ବିଲ୍ଡର୍ - କିପରି ଖେଳିବେ',
          steps: [
            '🌉 ଦୁଇଟି ପ୍ଲାଟଫର୍ମକୁ ସଂଯୋଗ କରିବା ପାଇଁ ଏକ ବ୍ରିଜ୍ ନିର୍ମାଣ କରନ୍ତୁ',
            '📏 ତଳେ ପ୍ୟାଲେଟରୁ ବିମ୍ ଖଣ୍ଡଗୁଡ଼ିକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ',
            '🔨 ଏକ ଶକ୍ତିଶାଳୀ ସଂରଚନା ସୃଷ୍ଟି କରିବାକୁ ରଣନୀତିକ ଭା��ରେ ବିମ୍ ରଖନ୍ତୁ',
            '🚗 ଆପଣଙ୍କ ବ୍ରିଜ୍ ଉପରେ ଏକ ଯାନ ପଠାଇବାକୁ TEST ବଟନ୍ ଦବାନ୍ତୁ',
            '💪 ବ୍ରିଜ୍ ଯାନକୁ ସମର୍ଥନ କରିବାକୁ ଯଥେଷ୍ଟ ଶକ୍ତିଶାଳୀ ହେବା ଆବଶ୍ୟକ',
            '✅ ଯଦି ଯାନ ଅନ୍ୟ ପାର୍ଶ୍ୱରେ ପହଞ୍ଚେ - ଆପଣ ଜିତିଲେ!',
            '💥 ଯଦି ବ୍ରିଜ୍ ଭାଙ୍ଗିଯାଏ - ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ!',
            '📊 ଅଧିକ କଷ୍ଟସାଧ୍ୟତା = ଲମ୍ବା ବ୍ୟବଧାନ ଏବଂ ଭାରୀ ଯାନ',
            '📱 ମୋବାଇଲରେ: ଆପଣଙ୍କ ଆଙ୍ଗୁଠିରେ ବିମ୍ ଡ୍ରାଗ୍ କରନ୍ତୁ'
          ]
        }
      },
      'simple-machine': {
        en: {
          title: 'Simple Machine Match - How to Play',
          steps: [
            '🔧 You\'ll see simple machines on the left side',
            '🛠️ Real-world examples appear on the right side',
            '👆 Click a machine name on the left',
            '👉 Then click its matching example on the right',
            '✅ Correct matches will disappear',
            '❌ Wrong matches will shake the screen',
            '🏆 Match all machines to win!',
            '📱 On mobile: Tap to select and match'
          ]
        },
        hi: {
          title: 'सरल मशीन मैच - कैसे खेलें',
          steps: [
            '🔧 आपको बाईं ओर सरल मशीनें दिखाई देंगी',
            '🛠️ वास्तविक दुनिया के उदाहरण दाईं ओर दिखाई देते हैं',
            '👆 बाईं ओर मशीन के नाम पर क्लिक करें',
            '👉 फिर दाईं ओर उसके मेल खाते उदाहरण पर क्लिक करें',
            '✅ सही मैच गायब हो जाएंगे',
            '❌ गलत मैच स्क्रीन को हिला देंगे',
            '🏆 जीतने के लिए सभी मशीनों का मिलान करें!',
            '📱 मोबाइल पर: चयन और मिलान के लिए टैप करें'
          ]
        },
        od: {
          title: 'ସରଳ ମେସିନ୍ ମ୍ୟାଚ୍ - କିପରି ଖେଳିବେ',
          steps: [
            '🔧 ଆପଣ ବାମ ପାର୍ଶ୍ୱରେ ସରଳ ମେସିନ୍ ଦେଖିବେ',
            '🛠️ ବାସ୍ତବ ଦୁନିଆର ଉଦାହରଣ ଡାହାଣ ପାର୍ଶ୍ୱରେ ଦେଖାଯାଏ',
            '👆 ବାମ ପାର୍ଶ୍ୱରେ ଏକ ମେସିନ୍ ନାମ କ୍ଲିକ୍ କରନ୍ତୁ',
            '👉 ତାପରେ ଡାହାଣ ପାର୍ଶ୍ୱରେ ଏହାର ମେଳ ଖାଉଥିବା ଉଦାହରଣ କ୍ଲିକ୍ କରନ୍ତୁ',
            '✅ ସଠିକ୍ ମେଳଗୁଡ଼ିକ ଅଦୃଶ୍ୟ ହେବ',
            '❌ ଭୁଲ ମେଳଗୁଡ଼ିକ ସ୍କ୍ରିନକୁ ହଲାଇବ',
            '🏆 ଜିତିବାକୁ ସମସ୍ତ ମେସିନ୍ ମେ��ାନ୍ତୁ!',
            '📱 ମୋବାଇଲରେ: ଚୟନ ଏବଂ ମେଳାଇବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ'
          ]
        }
      },
      'marble-run': {
        en: {
          title: 'Marble Run - How to Play',
          steps: [
            '🔹 Drag ramp pieces from the bottom of the screen',
            '📐 Place ramps to create a path for the marble',
            '🎯 Position ramps so marble reaches the goal (bottom right)',
            '▶️ Press GO button to launch the marble',
            '⚡ Marble follows physics - it will roll and bounce!',
            '🔄 Use Retry if marble doesn\'t reach the goal',
            '📱 On mobile: Drag with your finger to place ramps'
          ]
        },
        hi: {
          title: 'मार्बल रन - कैसे खेलें',
          steps: [
            '🔹 स्क्रीन के नीचे से रैंप के टुकड़ों को खींचें',
            '📐 मार्बल के लिए एक रास्ता बनाने के लिए रैंप रखें',
            '🎯 रैंप की स्थिति इस प्रकार रखें कि मार्बल लक्ष्य तक पहुंचे (नीचे दाएं)',
            '▶️ मार्बल लॉन्च करने के लिए GO बटन दबाएं',
            '⚡ मार्बल भौतिकी का पालन करता है - यह लुढ़केगा और उछ��ेगा!',
            '🔄 यदि मार्बल लक्ष्य तक नहीं पहुंचता है तो पुनः प्रयास का उपयोग करें',
            '📱 मोबाइल पर: रैंप रखने के लिए अपनी उंगली से खींचें'
          ]
        },
        od: {
          title: 'ମାର୍ବଲ୍ ରନ୍ - କିପରି ଖେଳିବେ',
          steps: [
            '🔹 ସ୍କ୍ରିନର ତଳୁ ର୍ୟାମ୍ପ ଖଣ୍ଡଗୁଡ଼ିକୁ ଡ୍ରାଗ୍ କରନ୍ତୁ',
            '📐 ମାର୍ବଲ ପାଇଁ ଏକ ପଥ ସୃଷ୍ଟି କରିବାକୁ ର୍ୟାମ୍ପଗୁଡ଼ିକୁ ରଖନ୍ତୁ',
            '🎯 ର୍ୟାମ୍ପଗୁଡ଼ିକୁ ସ୍ଥାନିତ କରନ୍ତୁ ଯାହାଦ୍ୱାରା ମାର୍ବଲ ଲକ୍ଷ୍ୟରେ ପହଞ୍ଚେ (ତଳ ଡାହାଣ)',
            '▶️ ମାର୍ବଲ ଲଞ୍ଚ କରିବାକୁ GO ବଟନ୍ ଦବାନ୍ତୁ',
            '⚡ ମାର୍ବଲ ପଦାର୍ଥ ବିଜ୍ଞାନ ଅନୁସରଣ କରେ - ଏହା ଗଡ଼ିବ ଏବଂ ବାଉନ୍ସ ହେବ!',
            '🔄 ଯଦି ମାର୍ବଲ ଲକ୍ଷ୍ୟରେ ପହଞ୍ଚେ ନାହିଁ ତେବେ ପୁନଃ ପ୍ରୟାସ ବ୍ୟବହାର କରନ୍ତୁ',
            '📱 ମୋବାଇଲରେ: ର୍ୟାମ୍ପଗୁଡ଼ିକୁ ରଖିବା ପାଇଁ ଆପଣଙ୍କ ଆଙ୍ଗୁଠିରେ ଡ୍ରାଗ୍ କରନ୍ତୁ'
          ]
        }
      }
    };

    return instructions[gameId as keyof typeof instructions];
  };

  const games = [
    {
      id: "build-robot",
      name: t.buildRobot,
      description: t.buildRobotDesc,
      icon: Bot,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      id: "bridge-builder",
      name: t.bridgeBuilder,
      description: t.bridgeBuilderDesc,
      icon: Blocks,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      id: "simple-machine",
      name: t.simpleMachine,
      description: t.simpleMachineDesc,
      icon: Wrench,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
    },
    {
      id: "marble-run",
      name: t.marbleRun,
      description: t.marbleRunDesc,
      icon: Box,
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
    },
  ];

  // How to Play pages
  if (currentGame.startsWith('how-to-')) {
    const gameId = currentGame.replace('how-to-', '');
    const instructions = getGameInstructions(gameId);
    const gameInstructions = instructions?.[validLanguage as keyof typeof instructions] || instructions?.en;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={handleBackToMenu} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToMenu}
          </Button>

          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
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
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setCurrentGame(gameId as GameType)}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
                      onClick={() => setCurrentGame(`how-to-${game.id}` as GameType)}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 md:p-4">
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
          className="rounded-xl overflow-hidden shadow-2xl border-4 border-white mx-auto"
          style={{ maxWidth: '100%', touchAction: 'none' }}
        />

        <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
          <p className="hidden md:block">Use mouse to drag and click • Use keyboard when needed</p>
          <p className="md:hidden">Tap and drag to interact • Use touch buttons when available</p>
        </div>
      </div>
    </div>
  );
}

// Global input state for mobile touch controls
let globalMobileInput = {
  left: false,
  right: false,
  down: false
};

/* ===================================================================
   Inline Phaser Scenes for Engineering
   =================================================================== */

/* ---------------- BuildRobotScene ---------------- */
class BuildRobotScene extends Phaser.Scene {
  private parts: { name: string; container: Phaser.GameObjects.Container; placed: boolean }[] = [];
  private sequence: string[] = [];
  private currentIndex = 0;
  private statusText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private slots: { x: number; y: number }[] = [];
  private timeLeft = 60;
  private timerEvent?: Phaser.Time.TimerEvent;

  constructor(private difficulty: number = 1) {
    super({ key: "BuildRobotScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    
    // Set sequence based on difficulty
    if (this.difficulty === 1) {
      // Level 1: 4 parts
      this.sequence = ['base', 'body', 'arms', 'head'];
      this.timeLeft = 45;
    } else if (this.difficulty === 2) {
      // Level 2: 6 parts
      this.sequence = ['base', 'legs', 'body', 'arms', 'neck', 'head'];
      this.timeLeft = 60;
    } else {
      // Level 3: 8 parts
      this.sequence = ['base', 'legs', 'lower-body', 'upper-body', 'shoulders', 'arms', 'neck', 'head'];
      this.timeLeft = 75;
    }
    
    this.add.text(width / 2, 30, "🤖 Build the Robot!", {
      fontSize: "24px",
      color: "#fff"
    }).setOrigin(0.5);

    this.statusText = this.add.text(width / 2, 70, `Start with the ${this.sequence[0].toUpperCase()}`, {
      fontSize: "18px",
      color: "#ffd"
    }).setOrigin(0.5);

    this.timerText = this.add.text(width / 2, 100, `Time: ${this.timeLeft}s`, {
      fontSize: "20px",
      color: "#ff6b6b"
    }).setOrigin(0.5);

    // Timer countdown
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}s`);
        if (this.timeLeft <= 0) {
          this.gameOver(false);
        }
      },
      loop: true
    });

    // Define robot assembly positions based on number of parts
    const startY = 450 - (this.sequence.length * 30);
    const spacing = 60;
    this.slots = this.sequence.map((_, i) => ({
      x: width / 2,
      y: startY + i * spacing
    }));

    // Create parts at bottom (shuffled)
    const partNames = Phaser.Utils.Array.Shuffle([...this.sequence]);
    const totalParts = partNames.length;
    const partSpacing = Math.min(120, 600 / totalParts);
    const startX = (width - (totalParts - 1) * partSpacing) / 2;
    
    partNames.forEach((name, i) => {
      const x = startX + i * partSpacing;
      const container = this.createRobotPart(name, x, 540);
      this.parts.push({ name, container, placed: false });
    });
  }

  private createRobotPart(name: string, x: number, y: number) {
    const colors: any = {
      base: 0x555555,
      legs: 0x666666,
      'lower-body': 0x4a90e2,
      body: 0x4a90e2,
      'upper-body': 0x5ba3f5,
      shoulders: 0x50c878,
      arms: 0x50c878,
      neck: 0xffa500,
      head: 0xffa500
    };

    const shapes: any = {
      base: () => this.add.rectangle(0, 0, 80, 25, colors.base),
      legs: () => this.add.rectangle(0, 0, 70, 35, colors.legs),
      'lower-body': () => this.add.rectangle(0, 0, 60, 40, colors['lower-body']),
      body: () => this.add.rectangle(0, 0, 60, 50, colors.body),
      'upper-body': () => this.add.rectangle(0, 0, 65, 40, colors['upper-body']),
      shoulders: () => {
        const g = this.add.graphics();
        g.fillStyle(colors.shoulders);
        g.fillRect(-45, -8, 90, 16);
        return g;
      },
      arms: () => {
        const g = this.add.graphics();
        g.fillStyle(colors.arms);
        g.fillRect(-40, -10, 80, 20);
        return g;
      },
      neck: () => this.add.rectangle(0, 0, 30, 20, colors.neck),
      head: () => this.add.circle(0, 0, 22, colors.head)
    };

    const shape = shapes[name]();
    const label = this.add.text(0, 35, name.toUpperCase().replace('-', ' '), {
      fontSize: "10px",
      color: "#fff"
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [shape, label]);
    container.setSize(100, 80);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-50, -40, 100, 80),
      Phaser.Geom.Rectangle.Contains
    );

    container.on('pointerdown', () => this.tryPlacePart(name, container));

    return container;
  }

  private tryPlacePart(name: string, container: Phaser.GameObjects.Container) {
    const expectedPart = this.sequence[this.currentIndex];
    
    if (name === expectedPart) {
      // Correct part!
      const slot = this.slots[this.currentIndex];
      this.tweens.add({
        targets: container,
        x: slot.x,
        y: slot.y,
        duration: 300,
        ease: 'Back.easeOut',
        onComplete: () => {
          container.disableInteractive();
          const part = this.parts.find(p => p.name === name);
          if (part) part.placed = true;
          
          this.currentIndex++;
          
          if (this.currentIndex >= this.sequence.length) {
            this.gameOver(true);
          } else {
            const nextPart = this.sequence[this.currentIndex].toUpperCase().replace('-', ' ');
            this.statusText.setText(`Place the ${nextPart}`);
          }
        }
      });
    } else {
      // Wrong part
      this.cameras.main.shake(200, 0.01);
      this.statusText.setText(`❌ Wrong! Need ${expectedPart.toUpperCase().replace('-', ' ')} first`);
      
      this.time.delayedCall(1500, () => {
        const nextPart = this.sequence[this.currentIndex].toUpperCase().replace('-', ' ');
        this.statusText.setText(`Place the ${nextPart}`);
      });
    }
  }

  private gameOver(won: boolean) {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
    
    if (won) {
      this.statusText.setText("🎉 Robot Complete!");
      this.timerText.setColor("#76ff03");
    } else {
      this.statusText.setText("⏰ Time's Up!");
      this.timerText.setColor("#ff3333");
    }
    
    this.showRetryButton();
  }

  private showRetryButton() {
    this.add.text(this.scale.width / 2, 560, "🔄 RETRY", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#10b981",
      padding: { x: 20, y: 12 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      this.scene.restart();
    });
  }
}

/* ---------------- BridgeBuilderScene ---------------- */
class BridgeBuilderScene extends Phaser.Scene {
  private placedBeams: Phaser.GameObjects.Rectangle[] = [];
  private beamPalette: Phaser.GameObjects.Rectangle[] = [];
  private vehicle?: Phaser.GameObjects.Rectangle;
  private testBtn!: Phaser.GameObjects.Rectangle;
  private testBtnText!: Phaser.GameObjects.Text;
  private clearBtn!: Phaser.GameObjects.Rectangle;
  private isTestMode = false;
  private statusText!: Phaser.GameObjects.Text;
  private gapWidth = 300;
  private leftPlatX = 0;
  private rightPlatX = 0;
  private moveEvent?: Phaser.Time.TimerEvent;
  private hasFailed = false;

  constructor(private difficulty: number = 1) {
    super({ key: "BridgeBuilderScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;
    this.isTestMode = false;
    this.hasFailed = false;
    this.placedBeams = [];

    const { width } = this.scale;

    // Adjust gap based on difficulty
    this.gapWidth = this.difficulty === 1 ? 200 : this.difficulty === 2 ? 300 : 400;

    // Title
    this.add.text(width / 2, 30, "🌉 Build the Bridge!", {
      fontSize: "24px",
      color: "#fff"
    }).setOrigin(0.5);

    // Difficulty indicator
    const difficultyText = this.difficulty === 1 ? "Easy Gap" : this.difficulty === 2 ? "Medium Gap" : "Long Gap";
    const difficultyColor = this.difficulty === 1 ? "#76ff03" : this.difficulty === 2 ? "#ffd700" : "#ff6b6b";
    this.add.text(20, 30, `📊 ${difficultyText}`, {
      fontSize: "16px",
      color: difficultyColor
    });

    this.statusText = this.add.text(width / 2, 60, "Drag beams to build your bridge", {
      fontSize: "16px",
      color: "#ffd"
    }).setOrigin(0.5);

    // Ground
    const groundY = 450;
    const ground = this.add.rectangle(width / 2, groundY + 30, width, 60, 0x654321);
    this.matter.add.gameObject(ground, { isStatic: true });

    // Left platform
    this.leftPlatX = (width - this.gapWidth) / 2 - 50;
    const leftPlat = this.add.rectangle(this.leftPlatX, groundY - 50, 100, 100, 0x8b7355);
    this.matter.add.gameObject(leftPlat, { isStatic: true });

    // Right platform (finish line)
    this.rightPlatX = (width + this.gapWidth) / 2 + 50;
    const rightPlat = this.add.rectangle(this.rightPlatX, groundY - 50, 100, 100, 0x8b7355);
    this.matter.add.gameObject(rightPlat, { isStatic: true });

    // Draw finish flag on right platform
    this.add.text(this.rightPlatX, groundY - 100, "🏁", {
      fontSize: "32px"
    }).setOrigin(0.5);

    // Draw gap indicator
    const gapCenterY = groundY - 20;
    this.add.line(0, 0, this.leftPlatX + 50, gapCenterY, this.rightPlatX - 50, gapCenterY, 0xff0000, 0.3)
      .setLineWidth(3);
    this.add.text(width / 2, gapCenterY - 20, `Gap: ${this.gapWidth}px`, {
      fontSize: "14px",
      color: "#ff6b6b"
    }).setOrigin(0.5);

    // Create beam palette at bottom
    this.createBeamPalette();

    // Create control buttons
    this.createControlButtons();

    // Enable drag and drop
    this.input.on('dragstart', (pointer: any, gameObject: any) => {
      if (!this.isTestMode && this.beamPalette.includes(gameObject)) {
        gameObject.setAlpha(0.7);
      }
    });

    this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
      if (!this.isTestMode && this.beamPalette.includes(gameObject) && dragY < 520) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Rectangle) => {
      if (!this.isTestMode && this.beamPalette.includes(gameObject)) {
        gameObject.setAlpha(1);
        
        // Check if beam is in valid placement area (above ground)
        if (gameObject.y < 420) {
          // Create a permanent physics beam at this position
          const beamData = gameObject.getData('beamData');
          this.placeBeam(gameObject.x, gameObject.y, beamData.width, beamData.height, beamData.color);
        }
        
        // Reset beam to palette
        this.resetBeamToPalette(gameObject);
      }
    });
  }

  private createBeamPalette() {
    const paletteY = 550;
    const spacing = 120;
    const startX = 150;

    // Background panel for palette
    this.add.rectangle(this.scale.width / 2, paletteY, this.scale.width, 80, 0x222222, 0.8)
      .setDepth(50);

    // Adjust beams based on difficulty
    let beamTypes;
    if (this.difficulty === 1) {
      // Easy: 4 beams including extra short ones
      beamTypes = [
        { width: 60, height: 12, color: 0x8b4513, label: "Tiny" },
        { width: 100, height: 12, color: 0x654321, label: "Short" },
        { width: 140, height: 12, color: 0xa0522d, label: "Medium" },
        { width: 180, height: 12, color: 0xd2691e, label: "Long" },
      ];
    } else if (this.difficulty === 2) {
      // Medium: 3 beams
      beamTypes = [
        { width: 80, height: 12, color: 0x8b4513, label: "Short" },
        { width: 120, height: 12, color: 0x654321, label: "Medium" },
        { width: 160, height: 12, color: 0xa0522d, label: "Long" },
      ];
    } else {
      // Hard: 3 beams
      beamTypes = [
        { width: 80, height: 12, color: 0x8b4513, label: "Short" },
        { width: 130, height: 12, color: 0x654321, label: "Medium" },
        { width: 180, height: 12, color: 0xa0522d, label: "Long" },
      ];
    }

    const actualSpacing = this.difficulty === 1 ? 100 : 130;
    const actualStartX = this.difficulty === 1 ? 120 : 150;

    beamTypes.forEach((type, i) => {
      const beam = this.add.rectangle(actualStartX + i * actualSpacing, paletteY, type.width, type.height, type.color)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ draggable: true, useHandCursor: true })
        .setDepth(51);
      
      beam.setData('beamData', type);
      beam.setData('originalX', beam.x);
      beam.setData('originalY', beam.y);
      
      this.add.text(actualStartX + i * actualSpacing, paletteY + 25, type.label, {
        fontSize: "12px",
        color: "#fff"
      }).setOrigin(0.5).setDepth(51);
      
      this.beamPalette.push(beam);
    });
  }

  private resetBeamToPalette(beam: Phaser.GameObjects.Rectangle) {
    beam.x = beam.getData('originalX');
    beam.y = beam.getData('originalY');
    beam.setAlpha(1);
  }

  private placeBeam(x: number, y: number, width: number, height: number, color: number) {
    const beam = this.add.rectangle(x, y, width, height, color)
      .setStrokeStyle(2, 0x000000)
      .setDepth(10);
    
    // Create beam with physics - initially static, will become dynamic during test
    this.matter.add.gameObject(beam, {
      isStatic: true,
      friction: 1.0,
      restitution: 0,
      density: 0.001, // Very low density = very strong beams
      slop: 0.05,
      angle: 0
    });

    this.placedBeams.push(beam);
  }

  private createControlButtons() {
    const btnY = 100;
    const btnWidth = 100;
    const btnHeight = 40;

    // TEST button
    this.testBtn = this.add.rectangle(this.scale.width - 120, btnY, btnWidth, btnHeight, 0x10b981, 0.9)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);
    
    this.testBtnText = this.add.text(this.scale.width - 120, btnY, "TEST", {
      fontSize: "18px",
      color: "#fff"
    }).setOrigin(0.5).setDepth(101);

    this.testBtn.on('pointerdown', () => {
      if (!this.isTestMode) {
        this.testBridge();
      }
    });

    // CLEAR button
    this.clearBtn = this.add.rectangle(this.scale.width - 240, btnY, btnWidth, btnHeight, 0xef4444, 0.9)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);
    
    this.add.text(this.scale.width - 240, btnY, "CLEAR", {
      fontSize: "18px",
      color: "#fff"
    }).setOrigin(0.5).setDepth(101);

    this.clearBtn.on('pointerdown', () => {
      if (!this.isTestMode) {
        this.clearBridge();
      }
    });
  }

  private clearBridge() {
    // Remove all placed beams
    this.placedBeams.forEach(beam => {
      if (beam && beam.active) {
        beam.destroy();
      }
    });
    this.placedBeams = [];
    this.statusText.setText("✅ Bridge cleared! Build a new one");
    this.statusText.setColor("#ffd");
  }

  private testBridge() {
    if (this.placedBeams.length === 0) {
      this.statusText.setText("❌ Build a bridge first!");
      this.statusText.setColor("#ff6b6b");
      this.cameras.main.shake(200, 0.01);
      return;
    }

    this.isTestMode = true;
    this.hasFailed = false;
    this.statusText.setText("🚗 Testing bridge...");
    this.statusText.setColor("#ffd");
    
    // KEEP ALL BEAMS STATIC - they won't collapse, they're solid structures
    // This makes the game about building the right shape, not about structural integrity
    
    // Spawn vehicle based on difficulty
    const vehicleSize = this.difficulty === 1 ? 18 : this.difficulty === 2 ? 20 : 22;
    const vehicleDensity = this.difficulty === 1 ? 0.04 : this.difficulty === 2 ? 0.06 : 0.08;
    
    // Spawn at the edge of left platform
    this.vehicle = this.add.rectangle(this.leftPlatX + 55, 350, vehicleSize, vehicleSize, 0xff6b6b)
      .setStrokeStyle(2, 0x000000)
      .setDepth(20);
    
    // Very light vehicle with low friction for smooth movement
    this.matter.add.gameObject(this.vehicle, {
      friction: 0.1,
      frictionAir: 0.001,
      frictionStatic: 0.1,
      density: vehicleDensity,
      restitution: 0,
      chamfer: { radius: 4 }
    });

    // Give strong initial velocity
    const body = this.vehicle.body as MatterJS.BodyType;
    this.matter.body.setVelocity(body, { x: 3, y: 0 });

    // Apply STRONG continuous force to push vehicle forward
    const forceStrength = this.difficulty === 1 ? 0.01 : this.difficulty === 2 ? 0.009 : 0.008;
    
    this.moveEvent = this.time.addEvent({
      delay: 16, // Every frame (60fps)
      repeat: 250,
      callback: () => {
        if (this.vehicle && this.vehicle.active && this.vehicle.body && this.isTestMode && !this.hasFailed) {
          const body = this.vehicle.body as MatterJS.BodyType;
          
          // Strong horizontal force
          this.matter.body.applyForce(body, 
            { x: body.position.x, y: body.position.y },
            { x: forceStrength, y: 0 }
          );
        }
      }
    });
  }

  private checkBridgeResult() {
    // This is called every frame during test mode
    if (!this.isTestMode || this.hasFailed) return;
    
    if (!this.vehicle || !this.vehicle.active) {
      this.bridgeFailed();
      return;
    }

    const vehicleX = this.vehicle.x;
    const vehicleY = this.vehicle.y;
    const body = this.vehicle.body as MatterJS.BodyType;
    
    // FAILURE CONDITIONS - CHECK THESE FIRST!
    // 1. Vehicle fell too far down
    if (vehicleY > 450) {
      this.bridgeFailed();
      return;
    }
    
    // 2. Vehicle is falling rapidly (downward velocity indicates falling)
    if (body && body.velocity.y > 2) {
      this.bridgeFailed();
      return;
    }
    
    // SUCCESS: Vehicle reached the right platform safely
    // Must be at target X AND at reasonable height AND not falling
    if (vehicleX >= this.rightPlatX - 70 && vehicleY < 420 && (!body || body.velocity.y <= 1)) {
      this.bridgeSuccess();
      return;
    }
  }

  private bridgeSuccess() {
    if (!this.isTestMode || this.hasFailed) {
      return; // Prevent multiple calls
    }
    
    // FIRST: Set flags to prevent further calls
    this.isTestMode = false;
    
    // Stop the move event immediately
    if (this.moveEvent) {
      this.moveEvent.remove(false);
      this.moveEvent = undefined;
    }
    
    // Stop vehicle movement
    if (this.vehicle && this.vehicle.active && this.vehicle.body) {
      const body = this.vehicle.body as MatterJS.BodyType;
      this.matter.body.setVelocity(body, { x: 0, y: 0 });
    }
    
    // Stop all timers
    this.time.removeAllEvents();
    
    // Update status
    this.statusText.setText("✅ Mission Complete!");
    this.statusText.setColor("#76ff03");
    
    // Show big success message
    this.add.text(this.scale.width / 2, 250, "🎉 Mission Complete!", {
      fontSize: "32px",
      color: "#76ff03",
      stroke: "#000",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(200);

    this.showRetryButton();
  }

  private bridgeFailed() {
    if (!this.isTestMode || this.hasFailed) {
      return; // Prevent multiple calls
    }
    
    // FIRST: Set flags immediately to prevent further calls
    this.isTestMode = false;
    this.hasFailed = true;
    
    // Stop the move event IMMEDIATELY
    if (this.moveEvent) {
      this.moveEvent.remove(false);
      this.moveEvent = undefined;
    }
    
    // Stop all timers
    this.time.removeAllEvents();
    
    // Stop vehicle movement
    if (this.vehicle && this.vehicle.active && this.vehicle.body) {
      const body = this.vehicle.body as MatterJS.BodyType;
      this.matter.body.setVelocity(body, { x: 0, y: 0 });
    }
    
    // Update status
    this.statusText.setText("💥 Vehicle Fell! Try Again!");
    this.statusText.setColor("#ff6b6b");
    
    // Show big failure message
    this.add.text(this.scale.width / 2, 250, "💥 Mission Failed!", {
      fontSize: "32px",
      color: "#ff6b6b",
      stroke: "#000",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(200);

    this.showRetryButton();
  }

  private showRetryButton() {
    this.add.text(this.scale.width / 2, 320, "🔄 RETRY", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#10b981",
      padding: { x: 20, y: 12 }
    })
    .setOrigin(0.5)
    .setDepth(201)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      this.scene.restart();
    });
  }

  update() {
    // Check bridge result every frame during test mode
    if (this.isTestMode) {
      this.checkBridgeResult();
    }
  }
}

/* ---------------- SimpleMachineScene ---------------- */
class SimpleMachineScene extends Phaser.Scene {
  private pairs: { machine: string; example: string }[] = [];
  private leftTexts: Phaser.GameObjects.Text[] = [];
  private rightChoices: Phaser.GameObjects.Text[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private awaiting?: {
    machine: string;
    textObj: Phaser.GameObjects.Text;
  };

  constructor(private difficulty: number = 1) {
    super({ key: "SimpleMachineScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;

    const { width } = this.scale;
    
    // Add background
    this.add
      .rectangle(width / 2, 36, 760, 64, 0x071025)
      .setOrigin(0.5);
    
    // Add instructions
    this.add.text(
      20,
      18,
      "Click a machine on the left and then click its correct use on the right",
      { 
        color: "#fff", 
        fontSize: "14px",
        fontFamily: "Arial, sans-serif"
      },
    );

    // Set pairs based on difficulty
    if (this.difficulty === 1) {
      // Level 1: 4 pairs (easier machines)
      this.pairs = [
        { machine: "Lever", example: "Scissors" },
        { machine: "Pulley", example: "Flag Rope" },
        { machine: "Wedge", example: "Knife" },
        { machine: "Wheel & Axle", example: "Bicycle" },
      ];
    } else if (this.difficulty === 2) {
      // Level 2: 6 pairs (medium difficulty)
      this.pairs = [
        { machine: "Lever", example: "Scissors" },
        { machine: "Pulley", example: "Flag Rope" },
        { machine: "Wedge", example: "Knife" },
        { machine: "Wheel & Axle", example: "Bicycle" },
        { machine: "Inclined Plane", example: "Ramp" },
        { machine: "Screw", example: "Bolt" },
      ];
    } else {
      // Level 3: 8 pairs (harder machines)
      this.pairs = [
        { machine: "Lever", example: "Scissors" },
        { machine: "Pulley", example: "Flag Rope" },
        { machine: "Wedge", example: "Knife" },
        { machine: "Wheel & Axle", example: "Bicycle" },
        { machine: "Inclined Plane", example: "Ramp" },
        { machine: "Screw", example: "Bolt" },
        { machine: "Gear", example: "Clock" },
        { machine: "Spring", example: "Trampoline" },
      ];
    }

    const examples = Phaser.Utils.Array.Shuffle(
      this.pairs.map((p) => p.example),
    );

    // Small delay to ensure canvas is ready
    this.time.delayedCall(100, () => {
      // Adjust spacing based on number of pairs
      const spacing = this.pairs.length <= 4 ? 80 : this.pairs.length <= 6 ? 60 : 50;
      const startY = this.pairs.length <= 4 ? 120 : this.pairs.length <= 6 ? 100 : 90;
      const fontSize = this.pairs.length <= 4 ? "16px" : this.pairs.length <= 6 ? "14px" : "13px";
      
      this.pairs.forEach((p, i) => {
        const t = this.add
          .text(120, startY + i * spacing, p.machine, {
            fontSize: fontSize,
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#fff",
            color: "#000",
            padding: { x: 8, y: 6 },
          })
          .setInteractive({ useHandCursor: true });
        t.on("pointerdown", () => this.onSelectMachine(p, t));
        this.leftTexts.push(t);
      });

      examples.forEach((ex, i) => {
        const t = this.add
          .text(this.scale.width - 220, startY + i * spacing, ex, {
            fontSize: fontSize,
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#fff",
            color: "#000",
            padding: { x: 8, y: 6 },
          })
          .setInteractive({ useHandCursor: true });
        t.on("pointerdown", () => this.onSelectChoice(ex, t));
        this.rightChoices.push(t);
      });
    });

    this.scoreText = this.add
      .text(width / 2, 520, "Score: 0", {
        color: "#ffd",
        fontSize: "18px",
        fontFamily: "Arial, sans-serif"
      })
      .setOrigin(0.5);
  }

  private onSelectMachine(
    pair: { machine: string; example: string },
    textObj: Phaser.GameObjects.Text,
  ) {
    try {
      // Reset all left text backgrounds with safety check
      this.leftTexts.forEach((t) => {
        if (t && t.active && t.canvas) {
          try {
            t.setStyle({ backgroundColor: "#fff" });
          } catch (e) {
            console.warn("Failed to reset text style:", e);
          }
        }
      });
      
      // Highlight selected machine
      if (textObj && textObj.active && textObj.canvas) {
        try {
          textObj.setStyle({ backgroundColor: "#f3f4f6" });
        } catch (e) {
          console.warn("Failed to highlight text:", e);
        }
      }
      
      this.awaiting = { machine: pair.machine, textObj };
    } catch (error) {
      console.error("Error in onSelectMachine:", error);
    }
  }

  private onSelectChoice(
    choice: string,
    textObj: Phaser.GameObjects.Text,
  ) {
    if (!this.awaiting) {
      this.cameras.main.shake(80, 0.01);
      return;
    }
    const machineName = this.awaiting.machine;
    const correct =
      this.pairs.find((p) => p.machine === machineName)
        ?.example === choice;
    if (correct) {
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.awaiting.textObj.destroy();
      textObj.destroy();
      this.awaiting = undefined;
      if (this.score >= this.pairs.length * 10) {
        this.add
          .text(
            this.scale.width / 2,
            80,
            "All matched! Well done!",
            { color: "#76ff03", fontSize: "20px" },
          )
          .setOrigin(0.5);
        this.showRetryButton();
      }
    } else {
      this.cameras.main.shake(200, 0.01);
      
      // Reset style with safety check
      if (this.awaiting.textObj && this.awaiting.textObj.active && this.awaiting.textObj.canvas) {
        try {
          this.awaiting.textObj.setStyle({
            backgroundColor: "#fff",
          });
        } catch (e) {
          console.warn("Failed to reset text style after wrong answer:", e);
        }
      }
      
      this.awaiting = undefined;
    }
  }

  private showRetryButton() {
    this.add
      .text(this.scale.width / 2, 560, "🔄 RETRY", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.restart();
      });
  }
}

/* ---------------- MarbleRunScene ---------------- */
class MarbleRunScene extends Phaser.Scene {
  private pieces: Phaser.GameObjects.Rectangle[] = [];
  private marble!: Phaser.Physics.Arcade.Image;
  private placed: Phaser.GameObjects.Rectangle[] = [];
  private startX = 120;
  private startY = 120;
  private goalX = 680;
  private goalY = 520;
  private launched = false;
  private goalMarker!: Phaser.GameObjects.Graphics;
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private numRamps = 5;
  private statusText!: Phaser.GameObjects.Text;

  constructor(private difficulty: number = 1) {
    super({ key: "MarbleRunScene" });
  }

  create() {
    globalGameControl.currentScene = this;
    globalGameControl.shouldRestart = false;
    this.launched = false;
    this.placed = [];
    this.obstacles = [];

    const { width, height } = this.scale;
    
    // Configure difficulty settings
    if (this.difficulty === 1) {
      // Level 1: Easy - Close goal, more ramps, no obstacles
      this.goalX = 550;
      this.goalY = 450;
      this.numRamps = 6;
    } else if (this.difficulty === 2) {
      // Level 2: Medium - Medium distance, some obstacles
      this.goalX = 650;
      this.goalY = 500;
      this.numRamps = 5;
    } else {
      // Level 3: Hard - Far goal, fewer ramps, more obstacles
      this.goalX = 720;
      this.goalY = 540;
      this.numRamps = 4;
    }
    
    this.add
      .rectangle(width / 2, height / 2, 760, 560, 0x071025)
      .setOrigin(0.5);
    
    this.statusText = this.add.text(
      20,
      18,
      "Drag ramps into the scene, then press GO to launch marble",
      { color: "#fff", fontSize: "14px" },
    );

    // Add difficulty indicator
    const difficultyText = this.difficulty === 1 ? "Easy" : this.difficulty === 2 ? "Medium" : "Hard";
    this.add.text(
      width / 2,
      18,
      `Difficulty: ${difficultyText}`,
      { color: "#ffd700", fontSize: "16px", fontStyle: "bold" },
    ).setOrigin(0.5);

    // Goal marker
    this.goalMarker = this.add.graphics();
    this.goalMarker.fillStyle(0x00ff00, 0.5);
    this.goalMarker.fillCircle(this.goalX, this.goalY, 30);
    this.add.text(this.goalX, this.goalY, "🎯", { fontSize: "24px" }).setOrigin(0.5);

    // Add obstacles for higher difficulties
    if (this.difficulty >= 2) {
      // Add 1 obstacle for medium
      this.createObstacle(350, 300, 80, 15);
    }
    if (this.difficulty === 3) {
      // Add 2 more obstacles for hard
      this.createObstacle(500, 380, 80, 15);
      this.createObstacle(250, 420, 60, 15);
    }

    // Create draggable ramps with better mobile support
    const rampWidth = 140;
    const spacing = Math.min(rampWidth, (width - 100) / this.numRamps);
    const startX = (width - (this.numRamps - 1) * spacing) / 2;
    
    for (let i = 0; i < this.numRamps; i++) {
      const x = startX + i * spacing;
      const r = this.add
        .rectangle(x, 550, 120, 20, 0x9ca3af)
        .setStrokeStyle(3, 0x6b7280);
      
      // Make interactive with larger hit area for mobile
      r.setInteractive(
        new Phaser.Geom.Rectangle(-70, -15, 140, 30),
        Phaser.Geom.Rectangle.Contains,
      );
      this.input.setDraggable(r);
      (r as any).startX = x;
      (r as any).startY = 550;
      (r as any).isDragging = false;
      
      // Visual feedback for touch/hover
      r.on("pointerover", () => {
        if (!(r as any).isPlaced) {
          r.setStrokeStyle(3, 0xfbbf24);
        }
      });
      r.on("pointerout", () => {
        if (!(r as any).isDragging && !(r as any).isPlaced) {
          r.setStrokeStyle(3, 0x6b7280);
        }
      });
      
      r.on("dragstart", () => {
        (r as any).isDragging = true;
        r.setStrokeStyle(3, 0x10b981);
        r.setDepth(100);
      });
      
      r.on("drag", (_p: any, dx: number, dy: number) => {
        r.x = dx;
        r.y = dy;
      });
      
      r.on("dragend", () => {
        (r as any).isDragging = false;
        // If placed in play area (above y=500)
        if (r.y < 500 && r.y > 100) {
          r.setFillStyle(0x64748b);
          r.setStrokeStyle(3, 0x22c55e);
          (r as any).isPlaced = true;
          this.placed.push(r);
          r.disableInteractive?.();
          r.setDepth(10);
          
          // Add a visual confirmation
          this.tweens.add({
            targets: r,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true,
          });
        } else {
          // Return to original position
          r.setStrokeStyle(3, 0x6b7280);
          this.tweens.add({
            targets: r,
            x: (r as any).startX,
            y: (r as any).startY,
            duration: 200,
            ease: 'Back.out',
          });
        }
      });
      
      this.pieces.push(r);
    }

    // Start platform - must be created BEFORE marble
    const startPlatform = this.add.rectangle(
      this.startX,
      this.startY + 25,
      80,
      15,
      0x666666,
    );
    this.physics.add.existing(startPlatform, true);

    // Ground static
    const ground = this.add.rectangle(
      400,
      590,
      800,
      60,
      0x111827,
    );
    this.physics.add.existing(ground, true);

    // Marble - larger for visibility, positioned ON the platform
    this.marble = this.physics.add
      .image(this.startX, this.startY + 10, "")
      .setDisplaySize(20, 20)
      .setBounce(0.3)
      .setTint(0xffcc00);
    this.marble.setCircle(10);
    
    // Initially disable marble physics until GO is pressed
    const marbleBody = this.marble.body as Phaser.Physics.Arcade.Body;
    marbleBody.setVelocity(0, 0);
    marbleBody.setAllowGravity(false);
    
    // Add collider between marble and start platform
    this.physics.add.collider(this.marble, startPlatform as unknown as Phaser.GameObjects.GameObject);
    this.physics.add.collider(this.marble, ground as unknown as Phaser.GameObjects.GameObject);

    // GO button - larger and more visible for mobile
    const goBtn = this.add
      .text(this.scale.width - 100, 50, "▶ GO", {
        backgroundColor: "#0f766e",
        color: "#fff",
        padding: { x: 16, y: 10 },
        fontSize: "22px",
        fontStyle: "bold"
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(200);
    
    // Visual feedback for GO button
    goBtn.on("pointerover", () => {
      goBtn.setStyle({ backgroundColor: "#14b8a6" });
    });
    goBtn.on("pointerout", () => {
      goBtn.setStyle({ backgroundColor: "#0f766e" });
    });
    goBtn.on("pointerdown", () => {
      goBtn.setStyle({ backgroundColor: "#0d9488" });
      this.launchMarble();
    });
  }

  private createObstacle(x: number, y: number, width: number, height: number) {
    const obstacle = this.add
      .rectangle(x, y, width, height, 0xff6b6b)
      .setStrokeStyle(2, 0xdc2626);
    this.obstacles.push(obstacle);
  }

  private launchMarble() {
    if (this.launched) return;
    this.launched = true;
    
    this.statusText.setText("Marble launched! Watch it go! 🔵");
    
    // Enable physics for placed ramps
    this.placed.forEach((r) => {
      this.physics.add.existing(r, true);
      this.physics.add.collider(
        this.marble,
        r as unknown as Phaser.GameObjects.GameObject,
      );
    });

    // Enable physics for obstacles
    this.obstacles.forEach((obs) => {
      this.physics.add.existing(obs, true);
      this.physics.add.collider(
        this.marble,
        obs as unknown as Phaser.GameObjects.GameObject,
      );
    });

    // Now enable gravity on the marble
    const marbleBody = this.marble.body as Phaser.Physics.Arcade.Body;
    marbleBody.setAllowGravity(true);
    
    // Adjust initial velocity based on difficulty
    let velocityX = 150;
    let velocityY = -80;
    
    if (this.difficulty === 1) {
      velocityX = 120;  // Slower for easier control
      velocityY = -60;
    } else if (this.difficulty === 2) {
      velocityX = 150;
      velocityY = -80;
    } else {
      velocityX = 180;  // Faster for harder challenge
      velocityY = -100;
    }
    
    marbleBody.setVelocity(velocityX, velocityY);

    // Check for goal reaching
    const checkEvent = this.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => {
        // Check if marble is still active
        if (!this.marble || !this.marble.active) {
          checkEvent.remove(false);
          return;
        }
        
        if (
          this.marble.x > this.goalX - 40 &&
          this.marble.x < this.goalX + 40 &&
          this.marble.y > this.goalY - 40 &&
          this.marble.y < this.goalY + 40
        ) {
          this.statusText.setText("🎉 Goal Reached! Well Done!");
          this.statusText.setColor("#76ff03");
          this.add
            .text(
              this.scale.width / 2,
              250,
              "🎉 Goal Reached!",
              { 
                color: "#76ff03", 
                fontSize: "32px",
                stroke: "#000",
                strokeThickness: 4
              },
            )
            .setOrigin(0.5)
            .setDepth(300);
          checkEvent.remove(false);
          this.showRetryButton();
          
          // Stop marble
          if (this.marble.body) {
            (this.marble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
            (this.marble.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
          }
        } else if (this.marble.y > 580) {
          // Marble fell off (increased threshold to 580 to catch it before it disappears)
          this.statusText.setText("💥 Marble fell! Try again!");
          this.statusText.setColor("#ff6b6b");
          this.add
            .text(
              this.scale.width / 2,
              250,
              "💥 Marble Fell!",
              { 
                color: "#ff6b6b", 
                fontSize: "32px",
                stroke: "#000",
                strokeThickness: 4
              },
            )
            .setOrigin(0.5)
            .setDepth(300);
          checkEvent.remove(false);
          this.showRetryButton();
        }
      },
    });
  }

  private showRetryButton() {
    this.add
      .text(this.scale.width / 2, 320, "🔄 RETRY", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#10b981",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5)
      .setDepth(300)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.restart();
      });
  }
}

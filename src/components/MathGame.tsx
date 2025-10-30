import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Gamepad2, Rocket, Apple, Calculator, Zap, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Phaser from "phaser";
import type { UserData } from "../App";
import { PhaserManager } from "../lib/phaser-manager";

interface MathGameProps {
  language: string;
  onBack: () => void;
  userData?: UserData;
}

const translations = {
  en: {
    title: "Math Games",
    selectGame: "Select a Game",
    backToDashboard: "Back to Dashboard",
    numberRocket: "Number Rocket",
    numberRocketDesc: "Catch the correct answers while flying through space!",
    fruitMath: "Fruit Math",
    fruitMathDesc: "Collect fruits to solve math problems!",
    mathRunner: "Math Runner",
    mathRunnerDesc: "Jump over obstacles by solving equations!",
    balloonPop: "Balloon Pop",
    balloonPopDesc: "Pop balloons with the right answers!",
    playNow: "Play Now",
    score: "Score",
    lives: "Lives",
    gameOver: "Game Over!",
    finalScore: "Final Score",
    playAgain: "Play Again",
    retry: "Retry",
    backToGames: "Back to Games",
    mobileControls: "Tap buttons to move • Tap JUMP to jump",
    restart: "Restart",
    howToPlay: "How to Play",
    instructions: "Instructions",
    backToMenu: "Back to Menu",
    timeLeft: "Time Left",
    wrongAnswers: "Wrong Answers",
  },
  hi: {
    title: "गणित के खेल",
    selectGame: "एक खेल चुनें",
    backToDashboard: "डैशबोर्ड पर वापस",
    numberRocket: "नंबर रॉकेट",
    numberRocketDesc: "अंतरिक्ष में उड़ते हुए सही जवाब पकड़ें!",
    fruitMath: "फल गणित",
    fruitMathDesc: "गणित की समस्याओं को हल करने के लिए फल इकट्ठा करें!",
    mathRunner: "गणित धावक",
    mathRunnerDesc: "समीकरणों को हल करके बाधाओं पर कूदें!",
    balloonPop: "गुब्बारा फोड़ें",
    balloonPopDesc: "सही उत्तरों के साथ गुब्बारे फोड़ें!",
    playNow: "अभी खेलें",
    score: "स्कोर",
    lives: "जीवन",
    gameOver: "खेल समाप्त!",
    finalScore: "अंतिम स्कोर",
    playAgain: "फिर खेलें",
    retry: "पुनः प्रयास करें",
    backToGames: "खेलों पर वापस",
    mobileControls: "स्थानांतरित करने के लिए बटन टैप करें • कूदने के लिए JUMP टैप करें",
    restart: "पुनः आरंभ करें",
    howToPlay: "कैसे खेलें",
    instructions: "निर्देश",
    backToMenu: "मेनू पर वापस",
    timeLeft: "समय शेष",
    wrongAnswers: "गलत उत्तर",
  },
  od: {
    title: "ଗଣିତ ଖେଳ",
    selectGame: "ଏକ ଖେଳ ବାଛନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    numberRocket: "ନମ୍ବର ରକେଟ",
    numberRocketDesc: "ମହାକାଶରେ ଉଡ଼ିବା ସମୟରେ ସଠିକ୍ ଉତ୍ତର ଧରନ୍ତୁ!",
    fruitMath: "ଫଳ ଗଣିତ",
    fruitMathDesc: "ଗଣିତ ସମସ୍ୟା ସମାଧାନ କରିବାକୁ ଫଳ ସଂଗ୍ରହ କରନ୍ତୁ!",
    mathRunner: "ଗଣିତ ଧାବକ",
    mathRunnerDesc: "ସମୀକରଣ ସମାଧାନ କରି ବାଧା ଉପରେ ଡେଇଁପଡନ୍ତୁ!",
    balloonPop: "��େଲୁନ୍ ଫଟାନ୍ତୁ",
    balloonPopDesc: "ସଠିକ୍ ଉତ୍ତର ସହିତ ବେଲୁନ୍ ଫଟାନ୍ତୁ!",
    playNow: "ବର୍ତ୍ତମାନ ଖେଳନ୍ତୁ",
    score: "ସ୍କୋର",
    lives: "ଜୀବନ",
    gameOver: "ଖେଳ ସମାପ୍ତ!",
    finalScore: "ଅନ୍ତିମ ସ୍କୋର",
    playAgain: "ପୁଣି ଖେଳନ୍ତୁ",
    retry: "ପୁନଃ ପ୍ରୟାସ କରନ୍ତୁ",
    backToGames: "ଖେଳକୁ ଫେରନ୍ତୁ",
    mobileControls: "ଚଳାଇବାକୁ ବଟନ୍ ଟ୍ୟାପ୍ କରନ୍ତୁ • ଡେଇଁବାକୁ JUMP ଟ୍ୟାପ୍ କରନ୍ତୁ",
    restart: "ପୁନଃ ଆରମ୍ଭ କରନ୍ତୁ",
    howToPlay: "କିପରି ଖେଳିବେ",
    instructions: "ନିର୍ଦ୍ଦେଶାବଳୀ",
    backToMenu: "ମେନୁକୁ ଫେରନ୍ତୁ",
    timeLeft: "ସମୟ ବାକି",
    wrongAnswers: "ଭୁଲ ଉତ୍ତର",
  }
};

type GameType = 'menu' | 'number-rocket' | 'fruit-math' | 'math-runner' | 'balloon-pop' | 
                'how-to-rocket' | 'how-to-fruit' | 'how-to-runner' | 'how-to-balloon';

// Get difficulty based on grade
function getDifficultyFromGrade(grade?: string): number {
  if (!grade) return 1;
  const gradeNum = parseInt(grade);
  if (gradeNum <= 6) return 1; // Easy
  if (gradeNum <= 8) return 2; // Medium
  return 3; // Hard
}

export function MathGame({ language, onBack, userData }: MathGameProps) {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const validLanguage = (language && ['en', 'hi', 'od'].includes(language)) ? language : 'en';
  const t = translations[validLanguage as keyof typeof translations] || translations.en;
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
    if (currentGame !== 'menu' && !currentGame.startsWith('how-to-') && gameContainerRef.current) {
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

  const getGameConfig = (gameType: GameType): Phaser.Types.Core.GameConfig => {
    const baseConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      parent: gameContainerRef.current!,
      backgroundColor: '#87CEEB',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
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
      case 'number-rocket':
        return { 
          ...baseConfig, 
          scene: class extends NumberRocketScene {
            constructor() {
              super(difficulty);
            }
          }
        };
      case 'fruit-math':
        return { 
          ...baseConfig, 
          scene: class extends FruitMathScene {
            constructor() {
              super(difficulty);
            }
          }
        };
      case 'math-runner':
        return { 
          ...baseConfig, 
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 800 },
              debug: false
            }
          },
          scene: class extends MathRunnerScene {
            constructor() {
              super(difficulty);
            }
          }
        };
      case 'balloon-pop':
        return { 
          ...baseConfig, 
          scene: class extends BalloonPopScene {
            constructor() {
              super(difficulty);
            }
          }
        };
      default:
        return baseConfig;
    }
  };

  const handleBackToMenu = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
    setCurrentGame('menu');
  };

  const getGameInstructions = (gameId: string) => {
    const instructions = {
      'number-rocket': {
        en: {
          title: 'Number Rocket - How to Play',
          steps: [
            '🎯 A math problem will appear at the top of the screen',
            '🚀 Move your rocket left and right using arrow keys or touch buttons',
            '⭐ Catch the falling numbers that match the correct answer',
            '❌ Avoid wrong answers or you\'ll lose a life',
            '💚 You have 3 lives - don\'t let correct answers fall!',
            '🏆 Score points for each correct answer you catch'
          ]
        },
        hi: {
          title: 'नंबर रॉकेट - कैसे खेलें',
          steps: [
            '🎯 स्क्रीन के शीर्ष पर एक गणित की समस्या दिखाई देगी',
            '🚀 एरो कीज़ या टच बटन का उपयोग करके अपने रॉकेट को बाएं और दाएं ले जाएं',
            '⭐ गिरते हुए नंबरों को पकड़ें जो सही उत्तर से मेल खाते हैं',
            '❌ गलत उत्तरों से बचें या आप एक जीवन खो देंगे',
            '💚 आपके पास 3 जीवन हैं - सही उत्तर न गिरने दें!',
            '🏆 प्रत्येक स���ी उत्तर के लिए अंक स्कोर करें'
          ]
        },
        od: {
          title: 'ନମ୍ବର ରକେଟ - କିପରି ଖେଳିବେ',
          steps: [
            '🎯 ସ୍କ୍ରିନର ଉପରେ ଏକ ଗଣିତ ସମସ୍ୟା ଦେଖାଯିବ',
            '🚀 ଆରୋ କୀ କିମ୍ବା ଟଚ୍ ବଟନ୍ ବ୍ୟବହାର କରି ଆପଣଙ୍କ ରକେଟକୁ ବାମ ଏବଂ ଡାହାଣକୁ ନିଅନ୍ତୁ',
            '⭐ ସଠିକ୍ ଉତ୍ତର ସହିତ ମେଳ ଖାଉଥିବା ପଡୁଥିବା ସଂଖ୍ୟାଗୁଡିକୁ ଧରନ୍ତୁ',
            '❌ ଭୁଲ ଉତ୍ତରକୁ ଏଡାନ୍ତୁ ନଚେତ୍ ଆପଣ ଗୋଟିଏ ଜୀବନ ହରାଇବେ',
            '💚 ଆପଣଙ୍କର 3ଟି ଜୀବନ ଅଛି - ସଠିକ୍ ଉତ୍ତର ପଡିବାକୁ ଦିଅନ୍ତୁ ନାହିଁ!',
            '🏆 ପ୍ରତ୍ୟେକ ସଠିକ୍ ଉତ୍ତର ପାଇଁ ପଏଣ୍ଟ ସ୍କୋର କରନ୍ତୁ'
          ]
        }
      },
      'fruit-math': {
        en: {
          title: 'Fruit Math - How to Play',
          steps: [
            '🎯 A target sum will be shown at the top',
            '🍎 Move your basket left and right to catch falling fruits',
            '🔢 Each fruit has a number value',
            '➕ Collect fruits to match the exact target sum',
            '⚠️ If you go over the target, your sum resets to zero',
            '⭐ Complete the target to advance to the next level'
          ]
        },
        hi: {
          title: 'फल गणित - कैसे खेलें',
          steps: [
            '🎯 शीर्ष पर एक लक्ष्य योग दिखाया जाएगा',
            '🍎 गिरते हुए फलों को पकड़ने के लिए अपनी टोकरी को बाएं और दाएं ले जाएं',
            '🔢 प्रत्येक फल का एक संख्या मान होता है',
            '➕ सटीक लक्ष्य योग से मेल खाने के लिए फल इकट्ठा करें',
            '⚠️ यदि आप लक्ष्य से अधिक जाते हैं, तो आपका योग शून्य पर रीसेट हो जाता है',
            '⭐ अगले स्तर पर जाने के लिए लक्ष्य पूरा करें'
          ]
        },
        od: {
          title: 'ଫଳ ଗଣିତ - କିପରି ଖେଳିବେ',
          steps: [
            '🎯 ଉପରେ ଏକ ଲକ୍ଷ୍ୟ ରାଶି ଦେଖାଯିବ',
            '🍎 ପଡୁଥିବା ଫଳଗୁଡିକୁ ଧରିବା ପାଇଁ ଆପଣଙ୍କ ଝୁଡିକୁ ବାମ ଏବଂ ଡାହାଣକୁ ନିଅନ୍ତୁ',
            '🔢 ପ୍ରତ୍ୟେକ ଫଳର ଏକ ସଂଖ୍ୟା ମୂଲ୍ୟ ଅଛି',
            '➕ ସଠିକ୍ ଲକ୍ଷ୍ୟ ରାଶି ସହିତ ମେଳ ଖାଇବା ପାଇଁ ଫଳ ସଂଗ୍ରହ କରନ୍ତୁ',
            '⚠️ ଯଦି ଆପଣ ଲକ୍ଷ୍ୟ ଅତିକ୍ରମ କରନ୍ତି, ତେବେ ଆପଣଙ୍କର ରାଶି ଶୂନ୍ୟକୁ ରିସେଟ୍ ହୁଏ',
            '⭐ ପରବର୍ତ୍ତୀ ସ୍ତରକୁ ଯିବା ପାଇଁ ଲକ୍ଷ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
          ]
        }
      },
      'math-runner': {
        en: {
          title: 'Math Runner - How to Play',
          steps: [
            '🎯 A math problem appears at the top',
            '🏃 Your character runs automatically',
            '⬆️ Press SPACE or tap JUMP to jump over obstacles',
            '✅ Jump over boxes with the CORRECT answer',
            '❌ Avoid touching boxes with wrong answers',
            '🚀 Speed increases as you progress - stay focused!'
          ]
        },
        hi: {
          title: 'गणित धावक - कैसे खेलें',
          steps: [
            '🎯 शीर्ष पर एक गणित की समस्या दिखाई देती है',
            '🏃 आपका चरित्र स्वचालित रूप से चलता है',
            '⬆️ बाधाओं पर कूदने के लिए SPACE दबाएं या JUMP टैप करें',
            '✅ सही उत्तर वाले बक्सों पर कूदें',
            '��� गलत उत्तरों ���ाले बक्सों को छूने से बचें',
            '🚀 जैसे-जैसे आप आगे बढ़ते हैं गति बढ़ती है - ध्यान केंद्रित रहें!'
          ]
        },
        od: {
          title: 'ଗଣିତ ଧାବକ - କିପରି ଖେଳିବେ',
          steps: [
            '🎯 ଉପରେ ଏକ ଗଣିତ ସମସ୍ୟା ଦେଖାଯାଏ',
            '🏃 ଆପଣଙ୍କର ଚରିତ୍ର ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଚାଲେ',
            '⬆️ ବାଧା ଉପରେ ଡେଇଁବା ପାଇଁ SPACE ଦବାନ୍ତୁ କିମ୍ବା JUMP ଟ୍ୟାପ୍ କରନ୍ତୁ',
            '✅ ସଠିକ୍ ଉତ୍ତର ଥିବା ବାକ୍ସ ଉପରେ ଡେଇଁପଡନ୍ତୁ',
            '❌ ଭୁଲ ଉତ୍ତର ଥିବା ବାକ୍ସକୁ ଛୁଇଁବାରୁ ଏଡାନ୍ତୁ',
            '🚀 ଆପଣ ଆଗକୁ ବଢିବା ସହିତ ଗତି ବଢେ - ଧ୍ୟାନ ଦିଅନ୍ତୁ!'
          ]
        }
      },
      'balloon-pop': {
        en: {
          title: 'Balloon Pop - How to Play',
          steps: [
            '🎯 A math problem appears at the top',
            '🎈 Six balloons float with different numbers',
            '⏱️ You have 15 seconds to answer each question',
            '✅ Tap/click the balloon with the CORRECT answer',
            '❌ You can make only 2 mistakes - 3rd wrong answer ends the game!',
            '📈 Difficulty increases with each level'
          ]
        },
        hi: {
          title: 'गुब्बारा फोड़ें - कैसे खेलें',
          steps: [
            '🎯 शीर्ष पर एक गणित की समस्या दिखाई देती है',
            '🎈 छह गुब्बारे विभिन्न संख्याओं के साथ तैरते हैं',
            '⏱️ प्रत्येक प्रश्न का उत्तर देने के लिए आपके पास 15 सेकंड हैं',
            '✅ सही उत्तर वाले गुब्बारे को टैप/क्लिक करें',
            '❌ आप केवल 2 गलतियाँ कर सकते हैं - तीसरा गलत उत्तर खेल समाप्त कर देता है!',
            '📈 प्रत्येक स्तर के साथ कठिनाई बढ़ती है'
          ]
        },
        od: {
          title: 'ବେଲୁନ୍ ଫଟାନ୍ତୁ - କିପରି ଖେଳିବେ',
          steps: [
            '🎯 ଉପରେ ଏକ ଗଣିତ ସମସ୍ୟା ଦେଖାଯାଏ',
            '🎈 ଛଅଟି ବେଲୁନ୍ ବିଭିନ୍ନ ସଂଖ୍ୟା ସହିତ ଭାସୁଛି',
            '⏱️ ପ୍ରତ୍ୟେକ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେବାକୁ ଆପଣଙ୍କର 15 ସେକେଣ୍ଡ ଅଛି',
            '✅ ସଠିକ୍ ଉତ୍ତର ଥିବା ବେଲୁନ୍କୁ ଟ୍ୟାପ୍/କ୍ଲିକ୍ କରନ୍ତୁ',
            '❌ ଆପଣ କେବଳ 2ଟି ଭୁଲ କରିପାରିବେ - ତୃତୀୟ ଭୁଲ ଉତ୍ତର ଖେଳ ସମାପ୍ତ କରେ!',
            '📈ପ୍ରତ୍ୟେକ ସ୍ତର ସହିତ କଷ୍ଟ ବଢେ'
          ]
        }
      }
    };

    return instructions[gameId as keyof typeof instructions];
  };

  const games = [
    {
      id: 'number-rocket',
      name: t.numberRocket,
      description: t.numberRocketDesc,
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'fruit-math',
      name: t.fruitMath,
      description: t.fruitMathDesc,
      icon: Apple,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
    },
    {
      id: 'math-runner',
      name: t.mathRunner,
      description: t.mathRunnerDesc,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
    },
    {
      id: 'balloon-pop',
      name: t.balloonPop,
      description: t.balloonPopDesc,
      icon: Gamepad2,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
    },
  ];

  // Check if we're showing "How to Play" instructions
  if (currentGame.startsWith('how-to-')) {
    const gameId = currentGame.replace('how-to-', '');
    const instructions = getGameInstructions(gameId);
    const gameInfo = games.find(g => g.id === gameId);
    
    if (!instructions || !gameInfo) return null;
    
    const currentInstructions = instructions[validLanguage as keyof typeof instructions];
    const Icon = gameInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={() => setCurrentGame('menu')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToMenu}
          </Button>

          <Card className={`bg-gradient-to-br ${gameInfo.bgColor} border-2 shadow-xl`}>
            <CardHeader>
              <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${gameInfo.color} rounded-3xl flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-center text-2xl md:text-3xl">
                {currentInstructions.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                {currentInstructions.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mt-1">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setCurrentGame(gameId as GameType)}
                  className={`flex-1 bg-gradient-to-r ${gameInfo.color} hover:shadow-lg text-white text-lg py-6`}
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  {t.playNow}
                </Button>
                <Button 
                  onClick={() => setCurrentGame('menu')}
                  variant="outline"
                  className="px-6 py-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentGame === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="outline" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.selectGame}</p>
            {userData?.grade && (
              <Badge variant="secondary" className="mt-2">
                Grade {userData.grade} - Difficulty Level {difficulty}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card 
                  key={game.id}
                  className={`hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${game.bgColor} border-2 cursor-pointer transform hover:scale-105`}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
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
                      onClick={() => setCurrentGame(game.id as GameType)}
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

  const handleRestart = () => {
    globalGameControl.shouldRestart = true;
    if (globalGameControl.currentScene) {
      globalGameControl.currentScene.scene.restart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={handleBackToMenu}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToGames}
          </Button>
          <Button variant="default" onClick={handleRestart} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
            <Calculator className="w-4 h-4 mr-2" />
            {t.restart}
          </Button>
        </div>
        
        <div 
          ref={gameContainerRef} 
          className="rounded-xl overflow-hidden shadow-2xl border-4 border-white mx-auto"
          style={{ maxWidth: '100%', touchAction: 'none' }}
        />
        
        <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
          <p className="hidden md:block">Use arrow keys ← → or SPACE to play!</p>
          <p className="md:hidden">{t.mobileControls}</p>
        </div>
      </div>
    </div>
  );
}

// Global input state for mobile controls
let globalInputState = {
  left: false,
  right: false,
  jump: false
};

// Global game control state
let globalGameControl = {
  shouldRestart: false,
  currentScene: null as Phaser.Scene | null
};

// ============================================================
// NUMBER ROCKET GAME - Catch falling numbers that are answers
// ============================================================
class NumberRocketScene extends Phaser.Scene {
  private score: number = 0;
  private lives: number = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentProblem: { question: string; answer: number } = { question: '', answer: 0 };
  private questionText!: Phaser.GameObjects.Text;
  private fallingNumbers!: Phaser.GameObjects.Group;
  private spawnTimer: number = 0;
  private gameOver: boolean = false;
  private difficulty: number;
  private leftBtn!: Phaser.GameObjects.Container;
  private rightBtn!: Phaser.GameObjects.Container;

  constructor(difficulty: number = 1) {
    super({ key: 'NumberRocketScene' });
    this.difficulty = difficulty;
  }

  create() {
    // Store scene reference for restart
    globalGameControl.currentScene = this;
    
    // Initialize game state
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.spawnTimer = 0;
    
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
    
    // Add stars
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const star = this.add.circle(x, y, 2, 0xffffff);
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1
      });
    }

    // Create player (rocket)
    const rocket = this.add.triangle(0, 0, -15, 20, 15, 20, 0, -20, 0xff6b6b);
    const flame = this.add.circle(0, 15, 8, 0xffa500);
    this.player = this.add.container(400, 500, [rocket, flame]);
    this.player.setSize(30, 40);

    // Controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Mobile controls
    this.createMobileControls();

    // Falling numbers group
    this.fallingNumbers = this.add.group();

    // UI
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold'
    }).setScrollFactor(0);

    this.livesText = this.add.text(16, 45, 'Lives: ❤️❤️���️', {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold'
    }).setScrollFactor(0);

    this.questionText = this.add.text(400, 50, '', {
      fontSize: '28px',
      color: '#fff',
      fontStyle: 'bold',
      backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0);

    // Generate first problem
    this.generateProblem();
  }

  createMobileControls() {
    // Left button
    const leftBg = this.add.circle(0, 0, 35, 0x4a5568, 0.7);
    const leftIcon = this.add.text(0, 0, '←', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    this.leftBtn = this.add.container(60, 540, [leftBg, leftIcon]);
    this.leftBtn.setSize(70, 70);
    this.leftBtn.setInteractive();
    this.leftBtn.setScrollFactor(0);
    
    this.leftBtn.on('pointerdown', () => { globalInputState.left = true; });
    this.leftBtn.on('pointerup', () => { globalInputState.left = false; });
    this.leftBtn.on('pointerout', () => { globalInputState.left = false; });

    // Right button
    const rightBg = this.add.circle(0, 0, 35, 0x4a5568, 0.7);
    const rightIcon = this.add.text(0, 0, '→', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    this.rightBtn = this.add.container(740, 540, [rightBg, rightIcon]);
    this.rightBtn.setSize(70, 70);
    this.rightBtn.setInteractive();
    this.rightBtn.setScrollFactor(0);
    
    this.rightBtn.on('pointerdown', () => { globalInputState.right = true; });
    this.rightBtn.on('pointerup', () => { globalInputState.right = false; });
    this.rightBtn.on('pointerout', () => { globalInputState.right = false; });
  }

  update(time: number, delta: number) {
    if (this.gameOver) return;

    // Move player
    if (this.cursors.left.isDown || globalInputState.left) {
      this.player.x -= 5;
    } else if (this.cursors.right.isDown || globalInputState.right) {
      this.player.x += 5;
    }

    // Keep player in bounds
    this.player.x = Phaser.Math.Clamp(this.player.x, 50, 750);

    // Spawn falling numbers
    this.spawnTimer += delta;
    if (this.spawnTimer > 1500) {
      this.spawnFallingNumber();
      this.spawnTimer = 0;
    }

    // Check collisions and remove numbers that fall off screen
    const children = this.fallingNumbers.getChildren() as Phaser.GameObjects.Container[];
    children.forEach((child) => {
      child.y += 2;
      
      // Check collision with player
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        child.x, child.y
      );
      
      if (distance < 40) {
        this.collectNumber(child);
      }
      
      // Remove if off screen
      if (child.y > 650) {
        const numberData = child.getData('number');
        if (numberData === this.currentProblem.answer) {
          this.loseLife();
        }
        child.destroy();
      }
    });
  }

  generateProblem() {
    const maxNum = this.difficulty === 1 ? 10 : this.difficulty === 2 ? 20 : 50;
    const num1 = Phaser.Math.Between(1, maxNum);
    const num2 = Phaser.Math.Between(1, maxNum);
    const operations = this.difficulty === 1 ? ['+', '-'] : ['+', '-', '×'];
    const op = Phaser.Math.RND.pick(operations);
    
    let answer = 0;
    let question = '';

    switch (op) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)} = ?`;
        break;
      case '×':
        const m1 = Math.min(num1, 12);
        const m2 = Math.min(num2, 12);
        answer = m1 * m2;
        question = `${m1} × ${m2} = ?`;
        break;
    }

    this.currentProblem = { question, answer };
    this.questionText.setText(question);
  }

  spawnFallingNumber() {
    const x = Phaser.Math.Between(50, 750);
    
    // Sometimes spawn the correct answer, sometimes wrong answers
    const isCorrect = Phaser.Math.Between(0, 2) === 0;
    const number = isCorrect 
      ? this.currentProblem.answer 
      : this.currentProblem.answer + Phaser.Math.Between(-10, 10);

    // Create visual for number
    const bg = this.add.circle(0, 0, 25, isCorrect ? 0x4ecdc4 : 0xff6b6b);
    const text = this.add.text(0, 0, number.toString(), {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const container = this.add.container(x, -50, [bg, text]);
    container.setData('number', number);
    container.setData('isCorrect', isCorrect);
    
    this.fallingNumbers.add(container);
  }

  collectNumber(numberContainer: Phaser.GameObjects.Container) {
    const number = numberContainer.getData('number');
    
    if (number === this.currentProblem.answer) {
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.generateProblem();
      
      // Visual feedback
      this.tweens.add({
        targets: numberContainer,
        scale: 2,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          numberContainer.destroy();
        }
      });
    } else {
      this.loseLife();
      numberContainer.destroy();
    }
  }

  loseLife() {
    this.lives--;
    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText(`Lives: ${hearts}`);
    
    if (this.lives <= 0) {
      this.endGame();
    }
  }

  endGame() {
    this.gameOver = true;
    
    const overlay = this.add.rectangle(400, 300, 500, 300, 0x000000, 0.9).setScrollFactor(0);
    
    this.add.text(400, 220, 'Game Over!', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);
    
    this.add.text(400, 290, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#4ecdc4'
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Retry button
    const retryBg = this.add.rectangle(400, 370, 180, 50, 0x10b981).setScrollFactor(0);
    retryBg.setInteractive();
    const retryText = this.add.text(400, 370, '🔄 Play Again', {
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);
    
    retryBg.on('pointerover', () => retryBg.setFillStyle(0x059669));
    retryBg.on('pointerout', () => retryBg.setFillStyle(0x10b981));
    retryBg.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}

// ============================================================
// FRUIT MATH GAME - Collect fruits to match the target sum
// ============================================================
class FruitMathScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private targetSum: number = 0;
  private currentSum: number = 0;
  private targetText!: Phaser.GameObjects.Text;
  private currentText!: Phaser.GameObjects.Text;
  private fruits!: Phaser.GameObjects.Group;
  private basket!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private level: number = 1;
  private difficulty: number;
  private leftBtn!: Phaser.GameObjects.Container;
  private rightBtn!: Phaser.GameObjects.Container;

  constructor(difficulty: number = 1) {
    super({ key: 'FruitMathScene' });
    this.difficulty = difficulty;
  }

  create() {
    // Store scene reference for restart
    globalGameControl.currentScene = this;
    
    // Initialize game state
    this.score = 0;
    this.level = 1;
    this.targetSum = 0;
    this.currentSum = 0;
    
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
    
    // Ground
    this.add.rectangle(400, 580, 800, 40, 0x8B4513);

    // Basket (player)
    const basketBottom = this.add.rectangle(0, 20, 80, 10, 0x8B4513);
    const basketLeft = this.add.rectangle(-35, 0, 10, 40, 0x8B4513);
    const basketRight = this.add.rectangle(35, 0, 10, 40, 0x8B4513);
    this.basket = this.add.container(400, 530, [basketBottom, basketLeft, basketRight]);

    // Controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Mobile controls
    this.createMobileControls();

    // Fruits group
    this.fruits = this.add.group();

    // UI
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 10, y: 5 }
    });

    this.targetText = this.add.text(400, 30, '', {
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold',
      backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.currentText = this.add.text(400, 480, '', {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold',
      backgroundColor: '#000000aa',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    // Start level
    this.startLevel();

    // Spawn fruits periodically
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnFruit,
      callbackScope: this,
      loop: true
    });
  }

  createMobileControls() {
    // Left button
    const leftBg = this.add.circle(0, 0, 35, 0x4a5568, 0.7);
    const leftIcon = this.add.text(0, 0, '←', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    this.leftBtn = this.add.container(60, 540, [leftBg, leftIcon]);
    this.leftBtn.setSize(70, 70);
    this.leftBtn.setInteractive();
    
    this.leftBtn.on('pointerdown', () => { globalInputState.left = true; });
    this.leftBtn.on('pointerup', () => { globalInputState.left = false; });
    this.leftBtn.on('pointerout', () => { globalInputState.left = false; });

    // Right button
    const rightBg = this.add.circle(0, 0, 35, 0x4a5568, 0.7);
    const rightIcon = this.add.text(0, 0, '→', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    this.rightBtn = this.add.container(740, 540, [rightBg, rightIcon]);
    this.rightBtn.setSize(70, 70);
    this.rightBtn.setInteractive();
    
    this.rightBtn.on('pointerdown', () => { globalInputState.right = true; });
    this.rightBtn.on('pointerup', () => { globalInputState.right = false; });
    this.rightBtn.on('pointerout', () => { globalInputState.right = false; });
  }

  update() {
    // Move basket
    if (this.cursors.left.isDown || globalInputState.left) {
      this.basket.x -= 5;
    } else if (this.cursors.right.isDown || globalInputState.right) {
      this.basket.x += 5;
    }

    // Keep basket in bounds
    this.basket.x = Phaser.Math.Clamp(this.basket.x, 50, 750);

    // Check fruit collisions
    const children = this.fruits.getChildren() as Phaser.GameObjects.Container[];
    children.forEach((fruit) => {
      fruit.y += 2;
      
      if (fruit.y > 500 && fruit.y < 550) {
        if (Math.abs(fruit.x - this.basket.x) < 50) {
          this.collectFruit(fruit);
        }
      }
      
      if (fruit.y > 650) {
        fruit.destroy();
      }
    });
  }

  startLevel() {
    const multiplier = this.difficulty === 1 ? 5 : this.difficulty === 2 ? 10 : 15;
    this.targetSum = Phaser.Math.Between(multiplier * this.level, multiplier * this.level + 10);
    this.currentSum = 0;
    this.targetText.setText(`Target Sum: ${this.targetSum}`);
    this.updateCurrentSum();
  }

  spawnFruit() {
    const x = Phaser.Math.Between(50, 750);
    const maxValue = this.difficulty === 1 ? 5 : this.difficulty === 2 ? 10 : 15;
    const value = Phaser.Math.Between(1, maxValue);
    
    // Create visual
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181];
    const color = Phaser.Math.RND.pick(colors);
    const circle = this.add.circle(0, 0, 20, color);
    const text = this.add.text(0, 0, value.toString(), {
      fontSize: '18px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const container = this.add.container(x, -30, [circle, text]);
    container.setData('value', value);
    
    this.fruits.add(container);
  }

  collectFruit(fruit: Phaser.GameObjects.Container) {
    const value = fruit.getData('value');
    
    this.currentSum += value;
    this.updateCurrentSum();
    
    // Visual feedback
    this.tweens.add({
      targets: fruit,
      y: this.basket.y - 50,
      scale: 0.5,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        fruit.destroy();
      }
    });

    // Check if target reached
    if (this.currentSum === this.targetSum) {
      this.score += 50 * this.level;
      this.level++;
      this.scoreText.setText(`Score: ${this.score}`);
      this.showLevelComplete();
    } else if (this.currentSum > this.targetSum) {
      this.currentSum = 0;
      this.updateCurrentSum();
      this.cameras.main.shake(200, 0.01);
    }
  }

  updateCurrentSum() {
    this.currentText.setText(`Current: ${this.currentSum}`);
    
    const color = this.currentSum === this.targetSum ? '#00ff00' : 
                  this.currentSum > this.targetSum ? '#ff0000' : '#ffffff';
    this.currentText.setStyle({ backgroundColor: color + 'aa' });
  }

  showLevelComplete() {
    const text = this.add.text(400, 300, `Level ${this.level - 1} Complete! +${50 * (this.level - 1)}`, {
      fontSize: '28px',
      color: '#fff',
      fontStyle: 'bold',
      backgroundColor: '#00aa00aa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      text.destroy();
      this.startLevel();
    });
  }
}

// ============================================================
// MATH RUNNER GAME - Jump over obstacles by solving problems
// ============================================================
class MathRunnerScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerContainer!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private currentProblem: { question: string; answer: number } = { question: '', answer: 0 };
  private questionText!: Phaser.GameObjects.Text;
  private spawnTimer: number = 0;
  private gameSpeed: number = 200;
  private gameOver: boolean = false;
  private difficulty: number;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private jumpBtn!: Phaser.GameObjects.Container;

  constructor(difficulty: number = 1) {
    super({ key: 'MathRunnerScene' });
    this.difficulty = difficulty;
  }

  create() {
    // Store scene reference for restart
    globalGameControl.currentScene = this;
    
    // Reset input state
    globalInputState.jump = false;
    
    // Initialize game state
    this.score = 0;
    this.gameSpeed = 200;
    this.spawnTimer = 0;
    this.gameOver = false;

    // Background
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
    
    // Ground
    this.ground = this.physics.add.staticGroup();
    const groundRect = this.add.rectangle(400, 580, 800, 40, 0x8B4513);
    this.ground.add(groundRect);

    // Player (invisible physics sprite)
    this.player = this.physics.add.sprite(150, 500, '');
    this.player.setVisible(false);
    this.player.body!.setSize(30, 50);
    
    // Visual player container
    const playerBodyRect = this.add.rectangle(0, 0, 30, 50, 0xff6b6b);
    const playerHead = this.add.circle(0, -30, 15, 0xffd93d);
    this.playerContainer = this.add.container(150, 500, [playerBodyRect, playerHead]);

    // Collide with ground
    this.physics.add.collider(this.player, this.ground);

    // Controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Mobile jump button
    this.createMobileControls();

    // Obstacles
    this.obstacles = this.physics.add.group();

    // Collisions
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle as any, undefined, this);

    // UI
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 10, y: 5 }
    });

    this.questionText = this.add.text(400, 50, '', {
      fontSize: '24px',
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // Generate problem
    this.generateProblem();
  }

  createMobileControls() {
    // Jump button
    const jumpBg = this.add.circle(0, 0, 45, 0xf59e0b, 0.8);
    const jumpText = this.add.text(0, 0, 'JUMP', { fontSize: '18px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    this.jumpBtn = this.add.container(400, 540, [jumpBg, jumpText]);
    this.jumpBtn.setSize(90, 90);
    this.jumpBtn.setInteractive();
    
    this.jumpBtn.on('pointerdown', () => {
      if (this.player.body!.touching.down) {
        this.player.setVelocityY(-600);
      }
    });
  }

  update(time: number, delta: number) {
    if (this.gameOver) return;

    // Update player container position to match physics body
    this.playerContainer.x = this.player.x;
    this.playerContainer.y = this.player.y;

    // Jump
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (this.player.body!.touching.down) {
        this.player.setVelocityY(-600);
      }
    }

    // Spawn obstacles
    this.spawnTimer += delta;
    if (this.spawnTimer > 2000) {
      this.spawnObstacle();
      this.spawnTimer = 0;
    }

    // Move obstacles
    this.obstacles.children.entries.forEach((obstacle: any) => {
      obstacle.x -= this.gameSpeed * delta / 1000;
      const container = obstacle.getData('container');
      if (container) {
        container.x = obstacle.x;
      }
      
      if (obstacle.x < -50) {
        const number = obstacle.getData('number');
        if (number === this.currentProblem.answer) {
          this.score += 10;
          this.scoreText.setText(`Score: ${this.score}`);
          this.generateProblem();
          this.gameSpeed += 5;
        }
        if (container) container.destroy();
        obstacle.destroy();
      }
    });
  }

  generateProblem() {
    const maxNum = this.difficulty === 1 ? 10 : this.difficulty === 2 ? 15 : 20;
    const num1 = Phaser.Math.Between(1, maxNum);
    const num2 = Phaser.Math.Between(1, maxNum);
    const operations = ['+', '-'];
    const op = Phaser.Math.RND.pick(operations);
    
    let answer = 0;
    let question = '';

    if (op === '+') {
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else {
      answer = Math.max(num1, num2) - Math.min(num1, num2);
      question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)} = ?`;
    }

    this.currentProblem = { question, answer };
    this.questionText.setText(question);
  }

  spawnObstacle() {
    const isCorrect = Phaser.Math.Between(0, 1) === 0;
    const number = isCorrect 
      ? this.currentProblem.answer 
      : this.currentProblem.answer + Phaser.Math.Between(-5, 5);

    // Create physics sprite
    const obstacle = this.obstacles.create(850, 530, '');
    obstacle.setVisible(false);
    obstacle.body.setSize(40, 40);
    obstacle.body.setAllowGravity(false);
    obstacle.body.setImmovable(true);

    // Create visual
    const box = this.add.rectangle(0, 0, 40, 40, isCorrect ? 0x00aa00 : 0xaa0000);
    const text = this.add.text(0, 0, number.toString(), {
      fontSize: '18px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const container = this.add.container(850, 530, [box, text]);
    
    obstacle.setData('container', container);
    obstacle.setData('number', number);
    obstacle.setData('isCorrect', isCorrect);
  }

  hitObstacle(player: any, obstacle: any) {
    const number = obstacle.getData('number');
    const container = obstacle.getData('container');
    
    if (number === this.currentProblem.answer) {
      // Jumped over correct answer
      this.score += 20;
      this.scoreText.setText(`Score: ${this.score}`);
      this.generateProblem();
      this.gameSpeed += 5;
      
      if (container) container.destroy();
      obstacle.destroy();
    } else {
      // Hit wrong answer
      if (!this.gameOver) {
        this.endGame();
      }
    }
  }

  endGame() {
    this.gameOver = true;
    this.physics.pause();
    
    this.add.rectangle(400, 300, 500, 300, 0x000000, 0.9);
    
    this.add.text(400, 220, 'Game Over!', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 290, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#4ecdc4'
    }).setOrigin(0.5);
    
    // Retry button
    const retryBg = this.add.rectangle(400, 370, 180, 50, 0x10b981);
    retryBg.setInteractive();
    const retryText = this.add.text(400, 370, '🔄 Play Again', {
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    retryBg.on('pointerover', () => retryBg.setFillStyle(0x059669));
    retryBg.on('pointerout', () => retryBg.setFillStyle(0x10b981));
    retryBg.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}

// ============================================================
// BALLOON POP GAME - Pop balloons with correct answers
// ============================================================
class BalloonPopScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private balloons!: Phaser.GameObjects.Group;
  private currentProblem: { question: string; answer: number } = { question: '', answer: 0 };
  private questionText!: Phaser.GameObjects.Text;
  private level: number = 1;
  private difficulty: number;
  private wrongAnswers: number = 0;
  private wrongAnswersText!: Phaser.GameObjects.Text;
  private timeLeft: number = 15;
  private timerText!: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;
  private gameOver: boolean = false;

  constructor(difficulty: number = 1) {
    super({ key: 'BalloonPopScene' });
    this.difficulty = difficulty;
  }

  create() {
    // Store scene reference for restart
    globalGameControl.currentScene = this;
    
    // Initialize game state
    this.score = 0;
    this.level = 1;
    this.wrongAnswers = 0;
    this.timeLeft = 15;
    this.gameOver = false;
    
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
    
    // Add clouds
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(50, 200);
      this.add.ellipse(x, y, 80, 40, 0xffffff, 0.7);
    }

    // UI
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 10, y: 5 }
    });

    this.wrongAnswersText = this.add.text(16, 45, 'Wrong: 0/3 ❌', {
      fontSize: '18px',
      color: '#dc2626',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 10, y: 5 }
    });

    this.timerText = this.add.text(784, 16, 'Time: 15s ⏱️', {
      fontSize: '20px',
      color: '#059669',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0);

    this.questionText = this.add.text(400, 100, '', {
      fontSize: '28px',
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#ffffffaa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // Balloons group
    this.balloons = this.add.group();

    // Generate first problem
    this.generateProblem();
    this.spawnBalloons();
    this.startTimer();
  }

  startTimer() {
    this.timeLeft = 15;
    this.updateTimerDisplay();
    
    // Stop existing timer if any
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }
    
    // Create countdown timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.gameOver) {
          this.timeLeft--;
          this.updateTimerDisplay();
          
          if (this.timeLeft <= 0) {
            // Time's up - count as wrong answer
            this.handleWrongAnswer();
          }
        }
      },
      loop: true
    });
  }

  updateTimerDisplay() {
    const color = this.timeLeft <= 5 ? '#dc2626' : '#059669';
    this.timerText.setText(`Time: ${this.timeLeft}s ⏱️`);
    this.timerText.setStyle({ color });
    
    // Pulse animation when time is low
    if (this.timeLeft <= 5) {
      this.tweens.add({
        targets: this.timerText,
        scale: 1.2,
        duration: 200,
        yoyo: true,
        ease: 'Power2'
      });
    }
  }

  generateProblem() {
    const maxNum = this.difficulty === 1 ? 10 : this.difficulty === 2 ? 15 : 25;
    const num1 = Phaser.Math.Between(1, maxNum + this.level * 2);
    const num2 = Phaser.Math.Between(1, maxNum + this.level * 2);
    const operations = this.difficulty === 1 ? ['+', '-'] : ['+', '-', '×'];
    const op = Phaser.Math.RND.pick(operations);
    
    let answer = 0;
    let question = '';

    switch (op) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)} = ?`;
        break;
      case '×':
        const m1 = Math.min(num1, 12);
        const m2 = Math.min(num2, 12);
        answer = m1 * m2;
        question = `${m1} × ${m2} = ?`;
        break;
    }

    this.currentProblem = { question, answer };
    this.questionText.setText(question);
    
    // Restart timer for new question
    this.startTimer();
  }

  spawnBalloons() {
    this.balloons.clear(true, true);

    const answers = [this.currentProblem.answer];
    for (let i = 0; i < 5; i++) {
      let wrongAnswer = this.currentProblem.answer + Phaser.Math.Between(-10, 10);
      while (answers.includes(wrongAnswer) || wrongAnswer < 0) {
        wrongAnswer = this.currentProblem.answer + Phaser.Math.Between(-10, 10);
      }
      answers.push(wrongAnswer);
    }

    Phaser.Utils.Array.Shuffle(answers);

    answers.forEach((answer, index) => {
      const x = 150 + (index % 3) * 250;
      const y = 280 + Math.floor(index / 3) * 200;
      
      const isCorrect = answer === this.currentProblem.answer;
      const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xa8e6cf];
      const color = Phaser.Math.RND.pick(colors);
      
      const balloon = this.add.ellipse(x, y, 60, 80, color);
      balloon.setInteractive();
      
      const string = this.add.line(x, y + 40, 0, 0, 0, 100, 0x000000, 0.3);
      string.setLineWidth(2);
      
      const text = this.add.text(x, y, answer.toString(), {
        fontSize: '20px',
        color: '#fff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const container = this.add.container(0, 0, [balloon, string, text]);
      container.setData('answer', answer);
      container.setData('isCorrect', isCorrect);
      container.setData('balloonX', x);
      container.setData('balloonY', y);
      
      // Float animation
      this.tweens.add({
        targets: container,
        y: -5,
        duration: 1000 + Phaser.Math.Between(0, 500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      balloon.on('pointerdown', () => {
        if (!this.gameOver) {
          this.popBalloon(container);
        }
      });

      this.balloons.add(container);
    });
  }

  handleWrongAnswer() {
    if (this.gameOver) return;
    
    this.wrongAnswers++;
    this.wrongAnswersText.setText(`Wrong: ${this.wrongAnswers}/3 ❌`);
    
    // Flash screen red
    this.cameras.main.flash(300, 255, 0, 0, false);
    this.cameras.main.shake(300, 0.01);
    
    if (this.wrongAnswers >= 3) {
      // Game Over!
      this.endGame();
    } else {
      // Continue with new question
      this.time.delayedCall(500, () => {
        this.generateProblem();
        this.spawnBalloons();
      });
    }
  }

  popBalloon(container: Phaser.GameObjects.Container) {
    if (this.gameOver) return;
    
    const isCorrect = container.getData('isCorrect');
    const x = container.getData('balloonX');
    const y = container.getData('balloonY');
    
    // Create pop effect
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 5, isCorrect ? 0x00ff00 : 0xff0000);
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      });
    }

    container.destroy();

    if (isCorrect) {
      // Stop timer
      if (this.timerEvent) {
        this.timerEvent.destroy();
      }
      
      this.score += 10 * this.level;
      this.scoreText.setText(`Score: ${this.score}`);
      this.level++;
      
      // Show success message
      const successText = this.add.text(400, 300, `Correct! +${10 * (this.level - 1)}`, {
        fontSize: '32px',
        color: '#00aa00',
        fontStyle: 'bold',
        backgroundColor: '#ffffffaa',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5);

      this.time.delayedCall(1000, () => {
        successText.destroy();
        this.generateProblem();
        this.spawnBalloons();
      });
    } else {
      // Wrong answer!
      this.handleWrongAnswer();
    }
  }

  endGame() {
    this.gameOver = true;
    
    // Stop timer
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }
    
    // Destroy all balloons
    this.balloons.clear(true, true);
    
    this.add.rectangle(400, 300, 500, 300, 0x000000, 0.9);
    
    this.add.text(400, 220, 'Game Over!', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 290, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#4ecdc4'
    }).setOrigin(0.5);
    
    // Retry button
    const retryBg = this.add.rectangle(400, 370, 180, 50, 0x10b981);
    retryBg.setInteractive();
    const retryText = this.add.text(400, 370, '🔄 Play Again', {
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    retryBg.on('pointerover', () => retryBg.setFillStyle(0x059669));
    retryBg.on('pointerout', () => retryBg.setFillStyle(0x10b981));
    retryBg.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}

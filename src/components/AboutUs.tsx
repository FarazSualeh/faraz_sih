import { useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  Users,
  Lightbulb,
  Award,
  Heart,
  Sparkles,
  Quote,
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

interface AboutUsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onBack: () => void;
}

const translations = {
  en: {
    title: "About Us",
    teamName: "Team INSPIRA",
    intro:
      "A group of six passionate innovators — Ayesha, Rasikh, Faraz, Tahani, Burhan, and Shahbaz — united by a shared vision to make learning more engaging and accessible.",
    projectTitle: "Our Mission",
    projectDesc:
      'Our project, "Gamified STEM Learning Platform for Rural Schools of Odisha," focusing on class 6-12 was initially chosen as our problem statement for the 2025 Smart India Hackathon (SIH). What began as a challenge soon became a mission! To bridge the educational gap in rural areas by transforming traditional STEM education into an interactive, game-based learning experience.',
    visionTitle: "Our Vision",
    visionDesc:
      "Through this platform, we aim to make Science, Technology, Engineering, and Mathematics not only understandable but fun and exciting for students. By integrating gamification, visual learning, and progress tracking, we strive to empower both students and teachers to connect, learn, and grow in a more engaging digital environment.",
    closingTitle: "Our Commitment",
    closingDesc:
      "Together, Team INSPIRA is dedicated to inspiring the next generation of learners and educators through the power of innovation and technology.",
    quote:
      "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, and knowledge makes you great.",
    quoteAuthor: "~ Dr. A.P.J. Abdul Kalam",
    backButton: "Back",
  },
  hi: {
    title: "हमारे बारे में",
    teamName: "टीम इंस्पिरा",
    intro:
      "छह जोशीले नवप्रवर्तकों का एक समूह — आयशा, रासिख, फराज, तहानी, बुरहान और शहबाज — जो सीखने को अधिक आकर्षक और सुलभ बनाने के साझा दृष्टिकोण से एकजुट हैं।",
    projectTitle: "हमारा मिशन",
    projectDesc:
      'हमारी परियोजना, "ओडिशा के ग्रामीण स्कूलों के लिए गेमिफाइड STEM लर्निंग प्लेटफॉर्म जो कक्षा ६ से १२ के छात्रों पर केंद्रित है," शुरू में २०२५ स्मार्ट इंडिया हैकाथॉन (SIH) के लिए हमारे समस्या कथन के रूप में चुना गया था। जो एक चुनौती के रूप में शुरू हुआ, वह जल्द ही एक मिशन बन गया — पारंपरिक STEM शिक्षा को एक इंटरैक्टिव, गेम-आधारित सीखने के अनुभव में बदलकर ग्रामीण क्षेत्रों में शैक्षिक अंतर को पाटना।',
    visionTitle: "हमारा दृष्टिकोण",
    visionDesc:
      "इस प्लेटफॉर्म के माध्यम से, हम विज्ञान, प्रौद्योगिकी, इंजीनियरिंग और गणित को न केवल समझने योग्य बल्कि छात्रों के लिए मजेदार और रोमांचक बनाने का लक्ष्य रखते हैं। गेमिफिकेशन, दृश्य शिक्षा और प्रगति ट्रैकिंग को एकीकृत करके, हम छात्रों और शिक्षकों दोनों को अधिक आकर्षक डिजिटल वातावरण में जुड़ने, सीखने और बढ़ने के लिए सशक्त बनाने का प्रयास करते हैं।",
    closingTitle: "हमारी प्रतिबद्धता",
    closingDesc:
      "साथ में, टीम इंस्पिरा नवाचार और प्रौद्योगिकी की शक्ति के माध्यम से शिक्षार्थियों और शिक्षकों की अगली पीढ़ी को प्रेरित करने के लिए समर्पित है।",
    quote:
      "शिक्षा रचनात्मकता देती है, रचनात्मकता सोच की ओर ले जाती है, सोच ज्ञान प्रदान करती है, और ज्ञान आपको महान बनाता है।",
    quoteAuthor: "~ डॉ. ए.पी.जे. अब्दुल कलाम",
    backButton: "वापस",
  },
  od: {
    title: "ଆମ ବିଷୟରେ",
    teamName: "ଟିମ୍ ଇନ୍ସପିରା",
    intro:
      "ଛଅ ଜଣ ଉତ୍ସାହୀ ନବୋଦ୍ୟୋଗୀଙ୍କ ଗୋଷ୍ଠୀ — ଆୟେଶା, ରାସିଖ, ଫାରାଜ, ତହାନୀ, ବୁରହାନ୍ ଏବଂ ଶାହବାଜ — ଶିକ୍ଷାକୁ ଅଧିକ ଆକର୍ଷଣୀୟ ଏବଂ ସୁଗମ କରିବାର ସାଧାରଣ ଦୃଷ୍ଟିକୋଣରେ ଏକତ୍ର ହୋଇଛନ୍ତି।",
    projectTitle: "ଆମର ମିଶନ୍",
    projectDesc:
      'ଆମର ପ୍ରକଳ୍ପ, "ଓଡିଶାର ଗ୍ରାମାଞ୍ଚଳ ବିଦ୍ୟାଳୟ ପାଇଁ ଗେମିଫାଏଡ୍ STEM ଲର୍ଣ୍ଣିଂ ପ୍ଲାଟଫର୍ମ," ପ୍ରାରମ୍ଭରେ ୨୦୨୫ ସ୍ମାର୍ଟ ଇଣ୍ଡିଆ ହ୍ୟାକାଥନ୍ (SIH) ପାଇଁ ଆମର ସମସ୍ୟା ବିବରଣୀ ଭାବେ ମନୋନୀତ ହୋଇଥିଲା। ଯାହା ଏକ ଚ୍ୟାଲେଞ୍ଜ ଭାବରେ ଆରମ୍ଭ ହୋଇଥିଲା ତାହା ଶୀଘ୍ର ଏକ ମିଶନ୍ରେ ପରିଣତ ହେଲା — ପାରମ୍ପରିକ STEM ଶିକ୍ଷାକୁ ଏକ ଇଣ୍ଟରାକ୍ଟିଭ୍, ଗେମ୍-ଆଧାରିତ ଶିକ୍ଷଣ ଅନୁଭବରେ ପରିଣତ କରି ଗ୍ରାମାଞ୍ଚଳ କ୍ଷେତ୍ରରେ ଶିକ୍ଷାଗତ ବିଭେଦକୁ ଦୂର କରିବା।',
    visionTitle: "ଆମର ଦୃଷ୍ଟିକୋଣ",
    visionDesc:
      "ଏହି ପ୍ଲାଟଫର୍ମ ମାଧ୍ୟମରେ, ଆମେ ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତିବିଦ୍ୟା, ଇଞ୍ଜିନିୟରିଂ ଏବଂ ଗଣିତକୁ କେବଳ ବୁଝିବା ଯୋଗ୍ୟ ନୁହେଁ ବରଂ ଛାତ୍ରମାନଙ୍କ ପାଇଁ ମଜାଦାର ଏବଂ ରୋମାଞ୍ଚକର କରିବାକୁ ଲକ୍ଷ୍ୟ ରଖୁଛୁ। ଗେମିଫିକେସନ, ଭିଜୁଆଲ ଲର୍ଣ୍ଣିଂ ଏବଂ ପ୍ରଗତି ଟ୍ରାକିଂକୁ ସମନ୍ୱିତ କରି, ଆମେ ଛାତ୍ର ଏବଂ ଶିକ୍ଷକମାନଙ୍କୁ ଅଧିକ ଆକର୍ଷଣୀୟ ଡିଜିଟାଲ ପରିବେଶରେ ସଂଯୋଗ, ଶିଖିବା ଏବଂ ବୃଦ୍ଧି କରିବାକୁ ସଶକ୍ତ କରିବାକୁ ପ୍ରୟାସ କରୁଛୁ।",
    closingTitle: "ଆମର ପ୍ରତିବଦ୍ଧତା",
    closingDesc:
      "ଏକାଠି, ଟିମ୍ ଇନ୍ସପିରା ନବୋଦ୍ୟୋଗ ଏବଂ ପ୍ରଯୁକ୍ତିର ଶକ୍ତି ମାଧ୍ୟମରେ ଶିକ୍ଷାର୍ଥୀ ଏବଂ ଶିକ୍ଷକମାନଙ୍କର ପରବର୍ତ୍ତୀ ପି generation କୁ ପ୍ରେରଣା ଦେବା ପାଇଁ ସମର୍ପିତ।",
    quote:
      "ଶିକ୍ଷା ସୃଜନଶୀଳତା ଦେଇଥାଏ, ସୃଜନଶୀଳତା ଚିନ୍ତାଧାରାକୁ ନେଇଥାଏ, ଚିନ୍ତାଧାରା ଜ୍ଞାନ ପ୍ରଦାନ କରେ ଏବଂ ଜ୍ଞାନ ଆପଣଙ୍କୁ ମହାନ କରିଥାଏ।",
    quoteAuthor: "~ ଡକ୍ଟର ଏ.ପି.ଜେ. ଅବ୍ଦୁଲ କଲାମ",
    backButton: "ପଛକୁ",
  },
};

const teamMembers = [
  { name: "Ayesha", color: "from-purple-400 to-violet-500" },
  { name: "Rasikh", color: "from-orange-400 to-amber-500" },
  { name: "Faraz", color: "from-cyan-400 to-teal-500" },
  { name: "Tahani", color: "from-red-400 to-pink-500" },
  { name: "Burhan", color: "from-green-400 to--500" },
  { name: "Shahbaz", color: "from-blue-400 to-indigo-500" },
];

export function AboutUs({
  language,
  onLanguageChange,
  onBack,
}: AboutUsProps) {
  const validLanguage =
    language && ["en", "hi", "od"].includes(language)
      ? language
      : "en";
  const t =
    translations[validLanguage as keyof typeof translations] ||
    translations.en;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          className="absolute top-20 left-10 text-purple-500"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-20 text-pink-500"
          animate={{ y: [0, -15, 0], rotate: [0, -360] }}
          transition={{
            duration: 7,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/4 text-violet-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Lightbulb className="w-20 h-20" />
        </motion.div>
      </div>

      {/* Header */}
      <header className="bg-white/95 shadow-lg border-b border-violet-200 p-4 md:p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="border-2 border-violet-200 hover:border-violet-300 hover:bg-violet-50"
              >
                <ArrowLeft className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">
                  {t.backButton}
                </span>
              </Button>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 relative z-10">
        {/* Team Name Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 rounded-full shadow-2xl">
              <Award className="w-8 h-8 text-white" />
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {t.teamName}
              </h2>
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div
                  className={`mx-auto w-20 h-20 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center shadow-lg mb-2`}
                >
                  <span className="text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold text-gray-800">
                  {member.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-purple-200"
        >
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
            {t.intro}
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-blue-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-blue-900">
              {t.projectTitle}
            </h3>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {t.projectDesc}
          </p>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-purple-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-purple-900">
              {t.visionTitle}
            </h3>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {t.visionDesc}
          </p>
        </motion.div>

        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-green-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-green-900">
              {t.closingTitle}
            </h3>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {t.closingDesc}
          </p>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-4 left-4 opacity-20">
            <Quote className="w-16 h-16 text-white" />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20 rotate-180">
            <Quote className="w-16 h-16 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-lg md:text-2xl text-white font-medium leading-relaxed mb-4 italic">
              "{t.quote}"
            </p>
            <p className="text-base md:text-lg text-white/90 font-semibold">
              {t.quoteAuthor}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
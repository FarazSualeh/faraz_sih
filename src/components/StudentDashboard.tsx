import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { LanguageSelector } from "./LanguageSelector";
import { Footer } from "./Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BookOpen,
  Calculator,
  Atom,
  Cpu,
  Trophy,
  Star,
  Target,
  LogOut,
  PlayCircle,
  Award,
  Sparkles,
  Zap,
  Crown,
  Flame,
  Heart,
  Bell,
  FileText,
  Paperclip,
  Inbox,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { SubjectQuiz } from "./SubjectQuiz";
import { MathGame } from "./MathGame";
import { ScienceGame } from "./ScienceGame";
import { TechnologyGame } from "./TechnologyGame";
import { EngineeringGame } from "./EngineeringGame";
import { Leaderboard } from "./Leaderboard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { UserData } from "../App";
import { assignmentHelpers } from "../lib/api";

interface StudentDashboardProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onLogout: () => void;
  userData: UserData;
  onAboutClick?: () => void;
  onLoginClick?: () => void;
  onFunFactClick?: () => void;
  onHowItWorksClick?: () => void;
}

interface Assignment {
  id: string;
  title: string;
  type: "assignment" | "notice";
  subject: string;
  targetGrade: string;
  content: string;
  createdAt: string;
  teacherName: string;
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
}

const translations = {
  en: {
    dashboard: "Student Dashboard",
    welcome: "Welcome back, Explorer!",
    subjects: "Subjects",
    progress: "My Progress",
    achievements: "Achievements",
    leaderboard: "Leaderboard",
    math: "Mathematics",
    mathematics: "Mathematics",
    science: "Science",
    technology: "Technology",
    engineering: "Engineering",
    startQuiz: "Start Quiz",
    playGame: "Play Game",
    level: "Level",
    points: "Points",
    streak: "Day Streak",
    completed: "Completed",
    mathDesc: "Numbers, calculations, and problem solving",
    scienceDesc: "Explore the natural world and its phenomena",
    techDesc: "Learn about computers and digital technology",
    technologyDesc:
      "Learn about computers and digital technology",
    engineeringDesc: "Design and build solutions to problems",
    recentQuiz: "Completed Math Quiz",
    recentGame: "Played Science Game",
    recentAchievement: "Earned Problem Solver badge",
    achievementProblem: "Problem Solver",
    achievementQuiz: "Quiz Master",
    achievementStreak: "Learning Streak",
    logout: "Logout",
    overallProgress: "Overall Progress",
    learningStats: "Learning Stats",
    quizzesCompleted: "Quizzes Completed",
    gamesPlayed: "Games Played",
    averageScore: "Average Score",
    assignmentsNotices: "Assignments & Notices",
    assignment: "Assignment",
    notice: "Notice",
    postedOn: "Posted on",
    viewAttachment: "View Attachment",
    noAssignments: "No assignments or notices yet",
    from: "from",
    forStudents: "For Students",
    aboutUs: "About Us",
    forTeachers: "For Teachers",
  },
  hi: {
    dashboard: "छात्र डैशबोर्ड",
    welcome: "वापसी पर स्वागत, खोजकर्ता!",
    subjects: "विषय",
    progress: "मेरी प्रगति",
    achievements: "उपलब्धियां",
    leaderboard: "लीडरबोर्ड",
    math: "गणित",
    mathematics: "गणित",
    science: "विज्ञान",
    technology: "प्रौद्योगिकी",
    engineering: "इंजीनियरिंग",
    startQuiz: "क्विज शुरू करें",
    playGame: "गेम खेलें",
    level: "स्तर",
    points: "अंक",
    streak: "दिन की लकीर",
    completed: "पूर्ण",
    mathDesc: "संख्याएं, गणना और समस्या समाधान",
    scienceDesc: "प्राकृतिक दुनिया और इसकी घटनाओं को खोजें",
    techDesc: "कंप्यूटर और डिजिटल तकनीक के बारे में जानें",
    technologyDesc:
      "कंप्यूटर और डिजिटल तकनीक के बारे में जानें",
    engineeringDesc:
      "समस्याओं के समाधान डिजाइन और निर्माण करें",
    recentQuiz: "गणित क्विज पूर्ण",
    recentGame: "विज्ञान गेम खेला",
    recentAchievement: "समस्या समाधानकर्ता बैज अर्जित",
    achievementProblem: "समस्या समाधानकर्ता",
    achievementQuiz: "क्विज मास्टर",
    achievementStreak: "शिक्षा की लकीर",
    logout: "लॉगआउट",
    overallProgress: "समग्र प्रगति",
    learningStats: "सीखने के आंकड़े",
    quizzesCompleted: "क्विज़ पूर्ण",
    gamesPlayed: "खेले गए गेम्स",
    averageScore: "औसत स्कोर",
    assignmentsNotices: "अदायन और सूचनाएं",
    assignment: "अदायन",
    notice: "सूचना",
    postedOn: "पोस्ट किया गया",
    viewAttachment: "अनुलग्न देखें",
    noAssignments: "अभी तक कोई अदायन या सूचना नहीं",
    from: "से",
    forStudents: "छात्रों के लिए",
    aboutUs: "हमारे बारे में",
    forTeachers: "शिक्षकों के लिए",
  },
  od: {
    dashboard: "ଛାତ୍ର ଡ୍ୟାସବୋର୍ଡ",
    welcome: "ସ୍ୱାଗତ, ଅନ୍ବେଷଣକାରୀ!",
    subjects: "ବିଷୟଗୁଡ଼ିକ",
    progress: "ମୋର ପ୍ରଗତି",
    achievements: "ସଫଳତା",
    leaderboard: "ଲିଡରବୋର୍ଡ",
    math: "ଗଣିତ",
    mathematics: "ଗଣିତ",
    science: "ବିଜ୍ଞାନ",
    technology: "ପ୍ରଯୁକ୍ତିବିଦ୍ୟା",
    engineering: "ଇଞ୍ଜିନିୟରିଂ",
    startQuiz: "କୁଇଜ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    playGame: "ଗେମ୍ ଖେଳନ୍ତୁ",
    level: "ସ୍ତର",
    points: "ପଏଣ୍ଟ",
    streak: "ଦିନ ଧାଡ଼ି",
    completed: "ସମ୍ପୂର୍ଣ୍ଣ",
    mathDesc: "ସଂଖ୍ୟା, ଗଣନା ଏବଂ ସମସ୍ୟା ସମାଧାନ",
    scienceDesc:
      "ପ୍ରାକୃତିକ ଜଗତ ଏବଂ ଏହାର ଘଟଣାଗୁଡ଼ିକୁ ଅନ୍ବେଷଣ କରନ୍ତୁ",
    techDesc:
      "କମ୍ପ୍ୟୁଟର ଏବଂ ଡିଜିଟାଲ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ବିଷୟରେ ଶିଖନ୍ତୁ",
    technologyDesc:
      "କମ୍ପ୍ୟୁଟର ଏବଂ ଡିଜିଟାଲ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ବିଷୟରେ ଶିଖନ୍ତୁ",
    engineeringDesc:
      "ସମସ୍ୟାର ସମାଧାନ ଡିଜାଇନ୍ ଏବଂ ନିର୍ମାଣ କରନ୍ତୁ",
    recentQuiz: "ଗଣିତ କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ",
    recentGame: "ବିଜ୍ଞାନ ଖେଳ ଖେଳିଲେ",
    recentAchievement: "ସମସ୍ୟା ସମାଧାନକାରୀ ବ୍ୟଜ୍ ଅର୍ଜନ",
    achievementProblem: "ସମସ୍ୟା ସମାଧାନକାରୀ",
    achievementQuiz: "କୁଇଜ୍ ମାଷ୍ଟର",
    achievementStreak: "ଶିଖିବାର ଧାଡ଼ି",
    logout: "ଲଗ୍ଆଉଟ୍",
    overallProgress: "ସାମଗ୍ରିକ ପ୍ରଗତି",
    learningStats: "ଶିଖିବା ପରିସଂଖ୍ୟାନ",
    quizzesCompleted: "କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ",
    gamesPlayed: "ଖେଳାଯାଇଥିବା ଖେଳ",
    averageScore: "ହାରାହାରି ସ୍କୋର",
    assignmentsNotices: "ଅଦାଯନ ଏବଂ ସୂଚନା",
    assignment: "ଅଦାଯନ",
    notice: "ସୂଚନା",
    postedOn: "ପୋସ୍ଟ କରିଥିଲା",
    viewAttachment: "ଅନୁଲଗ୍ନ ଦେଖନ୍ତୁ",
    noAssignments: "ଅଭ୍ୟାସ ବାହିରେ କୋଇପି ନାହିଁ ଏହାନୁପସ୍ତାହୀତ",
    from: "ଥରେବ୍ୟ",
    forStudents: "ଛାତ୍ରମାନଙ୍କ ପାଇଁ",
    aboutUs: "ଆମ ବିଷୟରେ",
    forTeachers: "ଶିକ୍ଷକମାନଙ୍କ ପାଇଁ",
  },
};

const subjects = [
  {
    id: "math",
    icon: Calculator,
    color: "from-blue-400 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    progress: 75,
    level: 8,
    borderColor: "border-blue-200",
  },
  {
    id: "science",
    icon: Atom,
    color: "from-green-400 to-green-600",
    bgColor: "from-green-50 to-green-100",
    progress: 60,
    level: 6,
    borderColor: "border-green-200",
  },
  {
    id: "technology",
    icon: Cpu,
    color: "from-purple-400 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    progress: 45,
    level: 4,
    borderColor: "border-purple-200",
  },
  {
    id: "engineering",
    icon: BookOpen,
    color: "from-orange-400 to-orange-600",
    bgColor: "from-orange-50 to-orange-100",
    progress: 30,
    level: 3,
    borderColor: "border-orange-200",
  },
];

export function StudentDashboard({
  language,
  onLanguageChange,
  onLogout,
  userData,
  onAboutClick,
  onLoginClick,
  onFunFactClick,
  onHowItWorksClick,
}: StudentDashboardProps) {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(
    null,
  );
  const [activeGame, setActiveGame] = useState<string | null>(
    null,
  );
  const [assignments, setAssignments] = useState<Assignment[]>(
    [],
  );
  const [showInbox, setShowInbox] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    const stored = localStorage.getItem(`readNotifications_${userData.id}`);
    return stored ? JSON.parse(stored) : [];
  });
  
  // Backend-ready state for user progress (starts from 0, populated by API)
  const [userProgress, setUserProgress] = useState({
    level: 0,
    points: 0,
    streak: 0,
    subjects: {
      mathematics: { level: 0, progress: 0 },
      science: { level: 0, progress: 0 },
      technology: { level: 0, progress: 0 },
      engineering: { level: 0, progress: 0 },
    }
  });

  // Initialize AOS animations and scroll to top
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "instant" });

    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 20, // Reduced offset to prevent auto-scroll
      disable: false,
    });

    // Refresh AOS on language change
    AOS.refresh();
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`userProgress_${userData.id}`, JSON.stringify(userProgress));
    
    // TODO: When backend is connected, also save to API:
    // await studentHelpers.updateUserProgress(userData.id, userProgress);
  }, [userProgress, userData.id]);

  // Fetch user progress from API when component mounts
  useEffect(() => {
    const fetchUserProgress = async () => {
      // TODO: Replace with actual API call when backend is ready
      // const { progress, error } = await studentHelpers.getUserProgress(userData.id);
      
      // For now, check localStorage for saved progress or start from 0
      const savedProgress = localStorage.getItem(`userProgress_${userData.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
      // When backend is connected, the above will be replaced with:
      // if (progress) setUserProgress(progress);
    };

    fetchUserProgress();
  }, [userData.id]);

  // Fetch assignments and class notifications from API when component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      const { assignments: fetchedAssignments, error } =
        await assignmentHelpers.getAssignmentsForGrade(
          (userData.grade ?? "6").toString(),
        );

      if (error) {
        console.error("Error fetching assignments:", error);
        return;
      }

      // Normalize assignment data to match our interface
      const normalized = fetchedAssignments.map((a: any) => ({
        id: a.id || a._id,
        title: a.title,
        type: a.type,
        subject: a.subject,
        targetGrade: a.target_grade || a.targetGrade,
        content: a.content,
        createdAt:
          a.createdAt ||
          a.created_at ||
          new Date().toISOString(),
        teacherName:
          a.teacherName || a.teacher_name || "Teacher",
        attachment: a.attachment,
      }));

      // Fetch class notifications for this grade
      const classNotifications = JSON.parse(
        localStorage.getItem("classNotifications") || "[]",
      );
      const gradeNotifications = classNotifications.filter(
        (n: any) => n.targetGrade === (userData.grade ?? "6").toString(),
      );

      // Combine assignments and class notifications
      const allNotifications = [...normalized, ...gradeNotifications];
      
      // Sort by date (newest first)
      allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAssignments(allNotifications);

      // TODO: When backend is connected, class notifications will come from API:
      // const { notifications } = await notificationHelpers.getForGrade(userData.grade);
    };

    fetchAssignments();

    // Set up polling to check for new assignments every 30 seconds
    const intervalId = setInterval(fetchAssignments, 30000);

    return () => clearInterval(intervalId);
  }, [userData.grade]);

  // Mark notification as read
  const handleMarkAsRead = (notificationId: string) => {
    if (!readNotifications.includes(notificationId)) {
      const updated = [...readNotifications, notificationId];
      setReadNotifications(updated);
      localStorage.setItem(
        `readNotifications_${userData.id}`,
        JSON.stringify(updated),
      );

      // TODO: When backend is connected, replace with API call:
      // await notificationHelpers.markAsRead(notificationId);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const allIds = assignments.map((a) => a.id);
    setReadNotifications(allIds);
    localStorage.setItem(
      `readNotifications_${userData.id}`,
      JSON.stringify(allIds),
    );

    // TODO: When backend is connected, replace with API call:
    // await notificationHelpers.markAllAsRead(userData.id);
  };

  // Get unread count
  const unreadCount = assignments.filter(
    (a) => !readNotifications.includes(a.id),
  ).length;

  // Ensure language is valid, default to 'en'
  const validLanguage =
    language && ["en", "hi", "od"].includes(language)
      ? language
      : "en";
  const t =
    translations[validLanguage as keyof typeof translations] ||
    translations.en;

  if (activeQuiz) {
    return (
      <SubjectQuiz
        subject={activeQuiz}
        language={language}
        onBack={() => setActiveQuiz(null)}
      />
    );
  }

  if (activeGame) {
    if (activeGame === "math") {
      return (
        <MathGame
          language={language}
          onBack={() => setActiveGame(null)}
          userData={userData}
        />
      );
    }
    if (activeGame === "science") {
      return (
        <ScienceGame
          language={language}
          onBack={() => setActiveGame(null)}
        />
      );
    }
    if (activeGame === "technology") {
      return (
        <TechnologyGame
          language={language}
          onBack={() => setActiveGame(null)}
        />
      );
    }
    if (activeGame === "engineering") {
      return (
        <EngineeringGame
          language={language}
          onBack={() => setActiveGame(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-cyan-50 relative overflow-hidden">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div
          className="absolute top-20 left-10 text-pink-500"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-yellow-500"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Star className="w-6 h-6" />
        </motion.div>
      </div>

      <header className="bg-white/95 shadow-lg border-b border-violet-200 p-4 md:p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {t.dashboard}
                </h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                  Ready to learn something amazing today? 🚀
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
              />

              {/* Glowing Inbox Icon with Tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInbox(true)}
                        className="relative border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 group"
                      >
                        <Inbox className="w-4 h-4 md:w-5 md:h-5 text-pink-600 group-hover:text-pink-700" />
                        {unreadCount > 0 && (
                          <>
                            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white rounded-full text-[10px] md:text-xs flex items-center justify-center font-bold animate-pulse">
                              {unreadCount}
                            </span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-400 rounded-full animate-ping"></span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.assignmentsNotices}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-2 border-red-200 hover:border-red-300 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">
                  {t.logout}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 relative z-10">
        <div
          className="mb-8 p-4 md:p-6 bg-white/90 rounded-2xl shadow-lg border border-gray-200"
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl md:text-2xl">👋</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {t.welcome.replace("Explorer", userData.name)}
              </h2>
              <p className="text-sm md:text-lg text-gray-600 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Grade {userData.grade} Student
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-800">
                  {t.level} {userProgress.level}
                </p>
                <p className="text-xs text-blue-600">
                  {userProgress.level === 0 ? "Start climbing! 📈" : "Keep climbing! 📈"}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-orange-800">
                  {userProgress.points.toLocaleString()} {t.points}
                </p>
                <p className="text-xs text-orange-600">
                  {userProgress.points === 0 ? "Start earning! ⭐" : "Amazing score! ⭐"}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800">
                  {userProgress.streak} {t.streak}
                </p>
                <p className="text-xs text-green-600">
                  {userProgress.streak === 0 ? "Start your streak! 🔥" : "On fire! 🔥"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-white/90 border border-gray-200 shadow-md rounded-xl p-2">
            <TabsTrigger
              value="subjects"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg text-sm md:text-base"
            >
              {t.subjects}
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg text-sm md:text-base"
            >
              {t.progress}
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg text-sm md:text-base"
            >
              {t.achievements}
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg text-sm md:text-base"
            >
              {t.leaderboard}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject, index) => {
                const Icon = subject.icon;
                const subjectKey =
                  subject.id as keyof typeof translations.en;
                const descKey =
                  `${subject.id}Desc` as keyof typeof translations.en;

                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card
                      className={`h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${subject.bgColor} border ${subject.borderColor} shadow-md overflow-hidden relative cursor-pointer`}
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-[2rem]" />

                      <CardHeader className="text-center relative pb-4">
                        <div
                          className={`mx-auto w-20 h-20 bg-gradient-to-br ${subject.color} rounded-3xl flex items-center justify-center mb-4 shadow-lg relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                          <Icon className="w-10 h-10 text-white relative z-10" />
                        </div>

                        <CardTitle className="text-xl font-bold mb-2">
                          {t[subjectKey]}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {t[descKey]}
                        </CardDescription>

                        <div className="flex items-center justify-between text-sm mt-4 px-2">
                          <span className="flex items-center gap-1 font-semibold">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            {t.level} {userProgress.subjects[subject.id as keyof typeof userProgress.subjects]?.level || 0}
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            <Trophy className="w-4 h-4 text-blue-600" />
                            {userProgress.subjects[subject.id as keyof typeof userProgress.subjects]?.progress || 0}% {t.completed}
                          </span>
                        </div>

                        <div className="mt-3">
                          <Progress
                            value={userProgress.subjects[subject.id as keyof typeof userProgress.subjects]?.progress || 0}
                            className="h-3"
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pb-6">
                        <Button
                          className={`w-full bg-gradient-to-r ${subject.color} hover:shadow-lg text-white shadow-md`}
                          onClick={() =>
                            setActiveQuiz(subject.id)
                          }
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {t.startQuiz}
                        </Button>

                        <Button
                          variant="outline"
                          className={`w-full border-2 ${subject.borderColor} hover:bg-white/70`}
                          onClick={() =>
                            setActiveGame(subject.id)
                          }
                        >
                          <Target className="w-4 h-4 mr-2" />
                          {t.playGame}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card
                className="bg-white/90 border-2 border-blue-200 shadow-lg"
                data-aos="fade-right"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    {t.overallProgress}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.map((subject) => {
                      const subjectKey =
                        subject.id as keyof typeof translations.en;
                      return (
                        <div
                          key={subject.id}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold flex items-center gap-2">
                              <subject.icon className="w-5 h-5" />
                              {t[subjectKey]}
                            </span>
                            <span className="font-bold text-lg">
                              {subject.progress}%
                            </span>
                          </div>
                          <Progress
                            value={subject.progress}
                            className="h-3"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-white/90 border-2 border-purple-200 shadow-lg"
                data-aos="fade-left"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    {t.learningStats}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvZ3Jlc3MlMjBjaGFydHxlbnwxfHx8fDE3NTgyMTYyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Progress Chart"
                      className="w-full h-40 object-cover rounded-xl shadow-md"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                        <div className="text-2xl font-bold text-blue-700">
                          24
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          {t.quizzesCompleted}
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                        <div className="text-2xl font-bold text-green-700">
                          18
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {t.gamesPlayed}
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                        <div className="text-2xl font-bold text-purple-700">
                          96%
                        </div>
                        <div className="text-sm text-purple-600 font-medium">
                          {t.averageScore}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-8">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-aos="fade-up"
            >
              {[
                {
                  icon: Award,
                  title: t.achievementProblem,
                  desc: "Solved 50+ math problems",
                  color: "from-yellow-400 to-orange-500",
                  bgColor: "from-yellow-50 to-orange-100",
                  borderColor: "border-yellow-200",
                },
                {
                  icon: Trophy,
                  title: t.achievementQuiz,
                  desc: "Completed 10 quizzes in a row",
                  color: "from-blue-400 to-indigo-500",
                  bgColor: "from-blue-50 to-indigo-100",
                  borderColor: "border-blue-200",
                },
                {
                  icon: Star,
                  title: t.achievementStreak,
                  desc: "15 days of continuous learning",
                  color: "from-purple-400 to-pink-500",
                  bgColor: "from-purple-50 to-pink-100",
                  borderColor: "border-purple-200",
                },
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    className={`bg-gradient-to-br ${achievement.bgColor} border-2 ${achievement.borderColor} shadow-lg overflow-hidden relative`}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-full" />

                    <CardHeader className="text-center relative">
                      <div
                        className={`mx-auto w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
                      >
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="font-bold">
                        {achievement.title}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {achievement.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-8">
            <Leaderboard language={language} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Inbox Dialog */}
      <Dialog open={showInbox} onOpenChange={setShowInbox}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                {t.assignmentsNotices}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </DialogTitle>
              {assignments.length > 0 && unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <DialogDescription className="sr-only">
              View all assignments and notices from your
              teachers
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-pink-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  {t.noAssignments}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-xl border-2 shadow-md relative ${
                      readNotifications.includes(assignment.id)
                        ? "opacity-60"
                        : ""
                    } ${
                      (assignment as any).isClassNotification
                        ? "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200"
                        : assignment.type === "assignment"
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                        : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                    }`}
                  >
                    {!readNotifications.includes(assignment.id) && (
                      <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            (assignment as any).isClassNotification
                              ? "bg-gradient-to-br from-purple-500 to-violet-500"
                              : assignment.type === "assignment"
                              ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                              : "bg-gradient-to-br from-yellow-500 to-orange-500"
                          }`}
                        >
                          {(assignment as any).isClassNotification ? (
                            <BookOpen className="w-5 h-5 text-white" />
                          ) : (
                            <FileText className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t.from} {assignment.teacherName} •{" "}
                            {assignment.subject}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          (assignment as any).isClassNotification
                            ? "default"
                            : assignment.type === "assignment"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          (assignment as any).isClassNotification
                            ? "bg-purple-500 hover:bg-purple-600"
                            : ""
                        }
                      >
                        {(assignment as any).isClassNotification
                          ? "New Class"
                          : assignment.type === "assignment"
                          ? t.assignment
                          : t.notice}
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {assignment.content}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {t.postedOn}:{" "}
                        {new Date(
                          assignment.createdAt,
                        ).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        {assignment.attachment && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              if (assignment.attachment) {
                                const link =
                                  document.createElement("a");
                                link.href =
                                  assignment.attachment.data;
                                link.download =
                                  assignment.attachment.name;
                                link.click();
                              }
                            }}
                          >
                            <Paperclip className="w-4 h-4" />
                            {t.viewAttachment}
                          </Button>
                        )}
                        {!readNotifications.includes(assignment.id) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-green-200 hover:bg-green-50"
                            onClick={() => handleMarkAsRead(assignment.id)}
                          >
                            <Check className="w-4 h-4" />
                            Mark as read
                          </Button>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Read
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation Links Section */}
      <div className="bg-white/90 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onLoginClick}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                {t.forStudents}
              </button>
              {onFunFactClick && (
                <button
                  onClick={onFunFactClick}
                  className="text-sm text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                >
                  Fun Facts
                </button>
              )}
            </div>
            
            <button
              onClick={onAboutClick}
              className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
            >
              {t.aboutUs}
            </button>
            
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onLoginClick}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                {t.forTeachers}
              </button>
              {onHowItWorksClick && (
                <button
                  onClick={onHowItWorksClick}
                  className="text-sm text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                >
                  How it works
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer 
        language={language} 
        onAboutClick={onAboutClick}
        onFunFactClick={onFunFactClick}
        onHowItWorksClick={onHowItWorksClick}
      />
    </div>
  );
}
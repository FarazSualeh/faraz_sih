import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import AOS from "aos";
import "aos/dist/aos.css";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LanguageSelector } from "./LanguageSelector";
import { Footer } from "./Footer";
import {
  Users,
  BookOpen,
  Plus,
  LogOut,
  GraduationCap,
  Trophy,
  TrendingUp,
  Target,
  Eye,
  Filter,
  Sparkles,
  Bell,
  Trash2,
  FileText,
  Paperclip,
  Clock,
  Award,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StudentAnalytics } from "./StudentAnalytics";
import type { UserData } from "../App";
import { teacherHelpers } from "../lib/api";

interface TeacherDashboardProps {
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
    data: string; // base64 encoded file data
  };
}

const translations = {
  en: {
    dashboard: "Teacher Dashboard",
    welcome: "Welcome back, Teacher!",
    classes: "My Classes",
    activities: "Activities",
    analytics: "Analytics",
    students: "Students",
    assignmentsNotices: "Assignments & Notices",
    createClass: "Create New Class",
    createActivity: "Create Activity",
    createAssignment: "Create Assignment/Notice",
    className: "Class Name",
    subject: "Subject",
    grade: "Grade",
    description: "Description",
    activityTitle: "Activity Title",
    activityType: "Activity Type",
    quiz: "Quiz",
    game: "Game",
    assignment: "Assignment",
    notice: "Notice",
    targetGrade: "Target Grade",
    title: "Title",
    content: "Content",
    type: "Type",
    create: "Create",
    cancel: "Cancel",
    totalStudents: "Total Students",
    activeClasses: "Active Classes",
    averageScore: "Average Score",
    completionRate: "Completion Rate",
    recentActivities: "Recent Activities",
    classPerformance: "Class Performance",
    topPerformers: "Top Performers",
    mathematics: "Mathematics",
    science: "Science",
    technology: "Technology",
    engineering: "Engineering",
    logout: "Logout",
    grade6: "Grade 6",
    grade7: "Grade 7",
    grade8: "Grade 8",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    grade12: "Grade 12",
    points: "Points",
    completed: "Completed",
    pending: "Pending",
    inProgress: "In Progress",
    viewDetails: "View Details",
    clickToExplore: "Click to explore detailed analytics",
    detailedAnalytics: "Detailed Analytics",
    viewReport: "View Report",
    downloadReport: "Download Report",
    filterData: "Filter Data",
    studentProgress: "Student Progress",
    subjectDistribution: "Subject Distribution",
    performanceMetrics: "Performance Metrics",
    weeklyProgress: "Weekly Progress",
    monthlyTrends: "Monthly Trends",
    allGrades: "All Grades",
    postedOn: "Posted on",
    delete: "Delete",
    attachFile: "Attach File (Image/PDF)",
    attached: "Attached",
    viewAttachment: "View Attachment",
    forStudents: "For Students",
    aboutUs: "About Us",
    forTeachers: "For Teachers",
  },
  hi: {
    dashboard: "शिक्षक डैशबोर्ड",
    welcome: "वापसी पर स्वागत, शिक्षक जी!",
    classes: "मेरी कक्षाएं",
    activities: "गतिविधियां",
    analytics: "विश्लेषण",
    students: "छात्र",
    assignmentsNotices: "असाइनमेंट और सूचनाएं",
    createClass: "नई कक्षा बनाएं",
    createActivity: "गतिविधि बनाएं",
    createAssignment: "असाइनमेंट/सूचना बनाएं",
    className: "कक्षा का नाम",
    subject: "विषय",
    grade: "कक्षा",
    description: "विवरण",
    activityTitle: "गतिविधि शीर्षक",
    activityType: "गतिविधि प्रकार",
    quiz: "प्रश्नोत्तरी",
    game: "खेल",
    assignment: "असाइनमेंट",
    notice: "सूचना",
    targetGrade: "लक्षित कक्षा",
    title: "शीर्षक",
    content: "सामग्री",
    type: "प्रकार",
    create: "बनाएं",
    cancel: "रद्द करें",
    totalStudents: "कुल छात्र",
    activeClasses: "सक्रिय कक्षाएं",
    averageScore: "औसत स्कोर",
    completionRate: "पूर्णता दर",
    recentActivities: "हाल की गतिविधियां",
    classPerformance: "कक्षा प्रदर्शन",
    topPerformers: "शीर्ष प्रदर्शनकर्ता",
    mathematics: "गणित",
    science: "विज्ञान",
    technology: "प्रौद्योगिकी",
    engineering: "इंजीनियरिंग",
    logout: "लॉगआउट",
    grade6: "कक्षा 6",
    grade7: "कक्षा 7",
    grade8: "कक्षा 8",
    grade9: "कक्षा 9",
    grade10: "कक्षा 10",
    grade11: "कक्षा 11",
    grade12: "कक्षा 12",
    points: "अंक",
    completed: "पूर्ण",
    pending: "लंबित",
    inProgress: "चल रहा",
    viewDetails: "विवरण देखें",
    clickToExplore: "विस्तृत विश्लेषण देखने के लिए क्लिक करें",
    detailedAnalytics: "विस्तृत विश्लेषण",
    viewReport: "रिपोर्ट देखें",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    filterData: "डेटा फिल्टर करें",
    studentProgress: "छात्र प्रगति",
    subjectDistribution: "विषय वितरण",
    performanceMetrics: "प्रदर्शन मेट्रिक्स",
    weeklyProgress: "साप्ताहिक प्रगति",
    monthlyTrends: "मासिक रुझान",
    allGrades: "सभी कक्षाएं",
    postedOn: "पोस्ट किया गया",
    delete: "हटाएं",
    attachFile: "फाइल जोड़ें (छवि/PDF)",
    attached: "जोड़ा गया",
    viewAttachment: "जोड़ा गया फाइल देखें",
    forStudents: "छात्रों के लिए",
    aboutUs: "हमारे बारे में",
    forTeachers: "शिक्षकों के लिए",
  },
  od: {
    dashboard: "ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ",
    welcome: "ସ୍ୱାଗତ, ଶିକ୍ଷକ!",
    classes: "ମୋର କ୍ଲାସ୍",
    activities: "କାର୍ଯ୍ୟକଳାପ",
    analytics: "ବିଶ୍ଲେଷଣ",
    students: "ଛାତ୍ରମାନେ",
    assignmentsNotices: "ଅସାଇନମେଣ୍ଟ ଏବଂ ସୂଚନା",
    createClass: "ନୂତନ କ୍ଲାସ୍ ସୃଷ୍ଟି କରନ୍ତୁ",
    createActivity: "କାର୍ଯ୍ୟକଳାପ ସୃଷ୍ଟି କରନ୍ତୁ",
    createAssignment: "ଅସାଇନମେଣ୍ଟ/ସୂଚନା ସୃଷ୍ଟି କରନ୍ତୁ",
    className: "କ୍ଲାସ୍ ନାମ",
    subject: "ବିଷୟ",
    grade: "ଶ୍ରେଣୀ",
    description: "ବର୍ଣ୍ଣନା",
    activityTitle: "କାର୍ଯ୍ୟକଳାପ ଶୀର୍ଷକ",
    activityType: "କାର୍ଯ୍ୟକଳାପ ପ୍ରକାର",
    quiz: "କୁଇଜ୍",
    game: "ଖେଳ",
    assignment: "ଆସାଇନମେଣ୍ଟ",
    notice: "ସୂଚନା",
    targetGrade: "ଲକ୍ଷିତ ଶ୍ରେଣୀ",
    title: "ଶୀର୍ଷକ",
    content: "ସାମଗ୍ରି",
    type: "ପ୍ରକାର",
    create: "ସୃ୍ଟି କରନ୍ତୁ",
    cancel: "ବାତିଲ୍",
    totalStudents: "ମୋଟ ଛାତ୍ର",
    activeClasses: "ସକ୍ରିୟ କ୍ଲାସ୍",
    averageScore: "ହାରାହାରି ସ୍କୋର",
    completionRate: "ସମାପ୍ତି ହାର",
    recentActivities: "ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ",
    classPerformance: "କ୍ଲାସ୍ ପ୍ରଦର୍ଶନ",
    topPerformers: "ଶୀର୍ଷ ପ୍ରଦର୍ଶନକାରୀ",
    mathematics: "ଗଣିତ",
    science: "ବିଜ୍ଞାନ",
    technology: "ପ୍ରଯୁକ୍ତିବିଦ୍ୟା",
    engineering: "ଇଞ୍ଜିନିୟରିଂ",
    logout: "ଲଗଆଉଟ୍",
    grade6: "ଶ୍ରେଣୀ 6",
    grade7: "ଶ୍ରେଣୀ 7",
    grade8: "ଶ୍ରେଣୀ 8",
    grade9: "ଶ୍ରେଣୀ 9",
    grade10: "ଶ୍ରେଣୀ 10",
    grade11: "ଶ୍ରେଣୀ 11",
    grade12: "ଶ୍ରେଣୀ 12",
    points: "ପଏଣ୍ଟ",
    completed: "ସମ୍ପୂର୍ଣ୍ଣ",
    pending: "ବିଚାରାଧୀନ",
    inProgress: "ଚାଲିଛି",
    viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
    clickToExplore: "ବିସ୍ତୃତ ବିଶ୍ଲେଷଣ ଦେଖିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ",
    detailedAnalytics: "ବିସ୍ତୃତ ବିଶ୍ଲେଷଣ",
    viewReport: "ରିପୋର୍ଟ ଦେଖନ୍ତୁ",
    downloadReport: "ରିପୋର୍ଟ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
    filterData: "ଡାଟା ଫିଲ୍ଟର କରନ୍ତୁ",
    studentProgress: "ଛାତ୍ର ପ୍ରଗତି",
    subjectDistribution: "ବିଷୟ ବଣ୍ଟନ",
    performanceMetrics: "ପ୍ରଦର୍ଶନ ମେଟ୍ରିକ୍ସ",
    weeklyProgress: "ସାପ୍ତାହିକ ପ୍ରଗତି",
    monthlyTrends: "ମାସିକ ଧାରା",
    allGrades: "ସାରେ ଶ୍ରେଣୀ",
    postedOn: "ପୋସ୍ଟ କରିଥିବା",
    delete: "ମିଟାନ୍ତୁ",
    attachFile: "ଫାଇଲ ଜୋଡ଼ନ୍ତୁ (ଛବି/PDF)",
    attached: "ଜୋଡ଼ିତ",
    viewAttachment: "ଜୋଡ଼ିତ ଫାଇଲ ଦେଖନ୍ତୁ",
    forStudents: "ଛାତ୍ରମାନଙ୍କ ପାଇଁ",
    aboutUs: "ଆମ ବିଷୟରେ",
    forTeachers: "ଶିକ୍ଷକମାନଙ୍କ ପାଇଁ",
  },
};

const classData = [
  {
    id: 1,
    name: "Advanced Mathematics",
    subject: "Mathematics",
    grade: "Grade 10",
    students: 28,
    avgScore: 87,
  },
  {
    id: 2,
    name: "Basic Science",
    subject: "Science",
    grade: "Grade 8",
    students: 32,
    avgScore: 91,
  },
  {
    id: 3,
    name: "Computer Fundamentals",
    subject: "Technology",
    grade: "Grade 9",
    students: 25,
    avgScore: 83,
  },
  {
    id: 4,
    name: "Engineering Basics",
    subject: "Engineering",
    grade: "Grade 11",
    students: 22,
    avgScore: 89,
  },
];

const studentData = [
  {
    name: "Khan Huda",
    class: "Grade 12",
    subject: "Science",
    score: 98,
    status: "Completed",
  },
  {
    name: "Faraz Sualeh",
    class: "Grade 12",
    subject: "Technology",
    score: 92,
    status: "Completed",
  },
  {
    name: "Dutee Chand",
    class: "Grade 11",
    subject: "Technology",
    score: 73,
    status: "In Progress",
  },
  {
    name: "Burhan Parkar",
    class: "Grade 10",
    subject: "Engineering",
    score: 87,
    status: "Completed",
  },
  {
    name: "Anjum Ansari",
    class: "Grade 9",
    subject: "Mathematics",
    score: 65,
    status: "Pending",
  },
];

export function TeacherDashboard({
  language,
  onLanguageChange,
  onLogout,
  userData,
  onAboutClick,
  onLoginClick,
  onFunFactClick,
  onHowItWorksClick,
}: TeacherDashboardProps) {
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateActivity, setShowCreateActivity] =
    useState(false);
  const [showCreateAssignment, setShowCreateAssignment] =
    useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(
    () => {
      const stored = localStorage.getItem("teacherAssignments");
      return stored ? JSON.parse(stored) : [];
    },
  );
  const [classes, setClasses] = useState<any[]>(() => {
    const stored = localStorage.getItem("teacherClasses");
    return stored ? JSON.parse(stored) : classData;
  });
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    grade: "",
    description: "",
  });
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [showClassDetails, setShowClassDetails] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    type: "",
    subject: "",
    description: "",
  });
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    type: "assignment" as "assignment" | "notice",
    subject: "",
    targetGrade: "",
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );

  // Ensure language is valid, default to 'en'
  const validLanguage =
    language && ["en", "hi", "od"].includes(language)
      ? language
      : "en";
  const t =
    translations[validLanguage as keyof typeof translations] ||
    translations.en;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is image or PDF
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "application/pdf",
      ];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert(
          "Please select an image (JPEG, PNG, GIF) or PDF file",
        );
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreateClass = () => {
    // Validation
    if (!newClass.name || !newClass.subject || !newClass.grade) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new class object
    const classToAdd = {
      id: Date.now(),
      name: newClass.name,
      subject: newClass.subject,
      grade: newClass.grade,
      students: 0,
      avgScore: 0,
      description: newClass.description,
    };

    // Update state and localStorage
    const updatedClasses = [...classes, classToAdd];
    setClasses(updatedClasses);
    localStorage.setItem("teacherClasses", JSON.stringify(updatedClasses));

    // Create notification for students in this grade
    const notification = {
      id: `class_${Date.now()}`,
      title: `New ${newClass.subject} Class Available!`,
      type: "notice" as const,
      subject: newClass.subject,
      targetGrade: newClass.grade,
      content: `${userData.name} has created a new class: "${newClass.name}" for Grade ${newClass.grade}. ${newClass.description || "Join this class to start learning!"}`,
      createdAt: new Date().toISOString(),
      teacherName: userData.name,
      isClassNotification: true,
      classId: classToAdd.id,
    };

    // Save notification to localStorage for students
    const existingNotifications = JSON.parse(
      localStorage.getItem("classNotifications") || "[]",
    );
    existingNotifications.push(notification);
    localStorage.setItem(
      "classNotifications",
      JSON.stringify(existingNotifications),
    );

    // TODO: When backend is connected, replace localStorage with API call:
    // await teacherHelpers.createClass(classToAdd);
    // await notificationHelpers.sendToGrade(notification, newClass.grade);

    // Reset form and close dialog
    setShowCreateClass(false);
    setNewClass({
      name: "",
      subject: "",
      grade: "",
      description: "",
    });
  };

  const handleDeleteClass = (classId: number) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      const updatedClasses = classes.filter((c) => c.id !== classId);
      setClasses(updatedClasses);
      localStorage.setItem("teacherClasses", JSON.stringify(updatedClasses));

      // TODO: When backend is connected, replace with API call:
      // await teacherHelpers.deleteClass(classId);
    }
  };

  const handleViewClassDetails = (cls: any) => {
    setSelectedClass(cls);
    setShowClassDetails(true);
  };

  const handleCreateActivity = () => {
    console.log("Creating activity:", newActivity);
    setShowCreateActivity(false);
    setNewActivity({
      title: "",
      type: "",
      subject: "",
      description: "",
    });
  };

  const handleCreateAssignment = async () => {
    if (
      !newAssignment.title ||
      !newAssignment.content ||
      !newAssignment.targetGrade
    ) {
      return;
    }

    const assignmentData = {
      teacher_id: userData.id,
      title: newAssignment.title,
      type: newAssignment.type,
      subject: newAssignment.subject,
      target_grade: newAssignment.targetGrade,
      content: newAssignment.content,
      attachment: undefined as
        | { name: string; type: string; data: string }
        | undefined,
    };

    if (selectedFile) {
      try {
        const base64 = await fileToBase64(selectedFile);
        assignmentData.attachment = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: base64,
        };
      } catch (error) {
        console.error(
          "Error converting file to base64:",
          error,
        );
        return;
      }
    }

    // Create assignment using API helper
    const { assignment, error } =
      await teacherHelpers.createAssignment(assignmentData);

    if (error) {
      console.error("Error creating assignment:", error);
      return;
    }

    if (assignment) {
      // Update local state
      setAssignments([
        ...assignments,
        {
          id: assignment.id || assignment._id,
          title: assignment.title,
          type: assignment.type,
          subject: assignment.subject,
          targetGrade:
            assignment.target_grade || assignment.targetGrade,
          content: assignment.content,
          createdAt:
            assignment.createdAt ||
            assignment.created_at ||
            new Date().toISOString(),
          teacherName:
            assignment.teacherName ||
            assignment.teacher_name ||
            userData.name,
          attachment: assignment.attachment,
        },
      ]);

      setShowCreateAssignment(false);
      setNewAssignment({
        title: "",
        type: "assignment" as "assignment" | "notice",
        subject: "",
        targetGrade: "",
        content: "",
      });
      setSelectedFile(null);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    // Delete using API helper
    const { error } = await teacherHelpers.deleteAssignment(
      id,
      userData.id,
    );

    if (error) {
      console.error("Error deleting assignment:", error);
      return;
    }

    // Update local state
    const updatedAssignments = assignments.filter(
      (a) => a.id !== id,
    );
    setAssignments(updatedAssignments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div
          className="absolute top-20 left-10 text-purple-400"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <header className="bg-white/95 shadow-lg border-b border-purple-200 p-4 md:p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.dashboard}
                </h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                  Empowering young minds through STEM education
                  🚀
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
              />

              {/* Plus Icon for Assignments & Notices */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowCreateAssignment(true)
                      }
                      className="border-2 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 group"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 group-hover:text-yellow-700" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.assignmentsNotices}</p>
                </TooltipContent>
              </Tooltip>

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
        <div className="mb-8 p-4 md:p-6 bg-white/90 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl md:text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t.welcome.replace("Teacher", userData.name)}
              </h2>
              <p className="text-sm md:text-lg text-gray-600 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Educator Dashboard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              {
                icon: Users,
                value: "142",
                label: t.totalStudents,
                color: "from-blue-400 to-blue-600",
                bgColor: "from-blue-100 to-blue-200",
              },
              {
                icon: BookOpen,
                value: "8",
                label: t.activeClasses,
                color: "from-green-400 to-green-600",
                bgColor: "from-green-100 to-green-200",
              },
              {
                icon: Trophy,
                value: "87%",
                label: t.averageScore,
                color: "from-yellow-400 to-orange-500",
                bgColor: "from-yellow-100 to-orange-200",
              },
              {
                icon: TrendingUp,
                value: "94%",
                label: t.completionRate,
                color: "from-purple-400 to-purple-600",
                bgColor: "from-purple-100 to-purple-200",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`p-3 md:p-4 bg-gradient-to-br ${stat.bgColor} rounded-2xl border border-gray-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-white/90 border border-gray-200 shadow-md rounded-xl p-2">
            <TabsTrigger
              value="classes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg text-xs md:text-sm"
            >
              {t.classes}
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg text-xs md:text-sm"
            >
              {t.activities}
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg text-xs md:text-sm"
            >
              {t.students}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg text-xs md:text-sm"
            >
              {t.analytics}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="classes"
            className="mt-4 md:mt-8 space-y-4 md:space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-xl md:text-2xl font-bold">
                {t.classes}
              </h3>
              <Button
                onClick={() => setShowCreateClass(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg text-sm w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.createClass}
              </Button>
            </div>

            {showCreateClass && (
              <Card className="bg-white/95 border-2 border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-600" />
                    {t.createClass}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="className">
                        {t.className}
                      </Label>
                      <Input
                        id="className"
                        value={newClass.name}
                        onChange={(e) =>
                          setNewClass({
                            ...newClass,
                            name: e.target.value,
                          })
                        }
                        className="bg-white border-purple-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">
                        {t.subject}
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Enter subject name (e.g., Mathematics, History, Art)"
                        value={newClass.subject}
                        onChange={(e) =>
                          setNewClass({
                            ...newClass,
                            subject: e.target.value,
                          })
                        }
                        className="bg-white border-purple-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can add any subject - not limited to STEM!
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="grade">{t.grade}</Label>
                    <Select
                      value={newClass.grade}
                      onValueChange={(value: string) =>
                        setNewClass({
                          ...newClass,
                          grade: value,
                        })
                      }
                    >
                      <SelectTrigger className="bg-white border-purple-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">
                          {t.grade6}
                        </SelectItem>
                        <SelectItem value="7">
                          {t.grade7}
                        </SelectItem>
                        <SelectItem value="8">
                          {t.grade8}
                        </SelectItem>
                        <SelectItem value="9">
                          {t.grade9}
                        </SelectItem>
                        <SelectItem value="10">
                          {t.grade10}
                        </SelectItem>
                        <SelectItem value="11">
                          {t.grade11}
                        </SelectItem>
                        <SelectItem value="12">
                          {t.grade12}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">
                      {t.description}
                    </Label>
                    <Textarea
                      id="description"
                      value={newClass.description}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          description: e.target.value,
                        })
                      }
                      className="bg-white border-purple-200"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleCreateClass}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500"
                    >
                      {t.create}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateClass(false)}
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className="hover:shadow-lg transition-shadow bg-white/95 border border-gray-200 shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                          {cls.name}
                        </CardTitle>
                        <CardDescription className="font-medium">
                          {cls.subject} • Grade {cls.grade}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {cls.students} Students
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-green-100 to-green-200"
                        >
                          {cls.avgScore}% avg
                        </Badge>
                      </div>
                      <Progress
                        value={cls.avgScore}
                        className="h-3"
                      />
                      {cls.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {cls.description}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full border-2 hover:bg-purple-50"
                        onClick={() => handleViewClassDetails(cls)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t.viewDetails}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="activities"
            className="mt-4 md:mt-8 space-y-4 md:space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-xl md:text-2xl font-bold">
                {t.activities}
              </h3>
              <Button
                onClick={() => setShowCreateActivity(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg text-sm w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.createActivity}
              </Button>
            </div>

            {showCreateActivity && (
              <Card className="bg-white/95 border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    {t.createActivity}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="activityTitle">
                        {t.activityTitle}
                      </Label>
                      <Input
                        id="activityTitle"
                        value={newActivity.title}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            title: e.target.value,
                          })
                        }
                        className="bg-white border-green-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="activityType">
                        {t.activityType}
                      </Label>
                      <Select
                        value={newActivity.type}
                        onValueChange={(value: string) =>
                          setNewActivity({
                            ...newActivity,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger className="bg-white border-green-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quiz">
                            {t.quiz}
                          </SelectItem>
                          <SelectItem value="game">
                            {t.game}
                          </SelectItem>
                          <SelectItem value="assignment">
                            {t.assignment}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="activitySubject">
                      {t.subject}
                    </Label>
                    <Select
                      value={newActivity.subject}
                      onValueChange={(value: string) =>
                        setNewActivity({
                          ...newActivity,
                          subject: value,
                        })
                      }
                    >
                      <SelectTrigger className="bg-white border-green-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">
                          {t.mathematics}
                        </SelectItem>
                        <SelectItem value="science">
                          {t.science}
                        </SelectItem>
                        <SelectItem value="technology">
                          {t.technology}
                        </SelectItem>
                        <SelectItem value="engineering">
                          {t.engineering}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="activityDescription">
                      {t.description}
                    </Label>
                    <Textarea
                      id="activityDescription"
                      value={newActivity.description}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          description: e.target.value,
                        })
                      }
                      className="bg-white border-green-200"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleCreateActivity}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      {t.create}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowCreateActivity(false)
                      }
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/95 border-2 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  {t.recentActivities}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: Target,
                      title: "Math Quiz - Algebra Basics",
                      time: "Created 2 hours ago",
                      type: t.quiz,
                      color: "from-blue-400 to-blue-600",
                    },
                    {
                      icon: Award,
                      title: "Science Game - Solar System",
                      time: "Created 1 day ago",
                      type: t.game,
                      color: "from-green-400 to-green-600",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center`}
                        >
                          <activity.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="students"
            className="mt-4 md:mt-8 space-y-4 md:space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-xl md:text-2xl font-bold">
                {t.topPerformers}
              </h3>
              <Button
                variant="outline"
                className="border-2 border-blue-200 hover:bg-blue-50 text-sm w-full sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                {t.filterData}
              </Button>
            </div>

            <Card className="bg-white/95 border-2 border-blue-200 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentData.map((student, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-blue-50/50"
                        >
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            {student.subject}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {student.score}%
                              </span>
                              <Progress
                                value={student.score}
                                className="w-20 h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "Completed"
                                  ? "default"
                                  : student.status ===
                                      "In Progress"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {student.status === "Completed"
                                ? t.completed
                                : student.status ===
                                    "In Progress"
                                  ? t.inProgress
                                  : t.pending}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="analytics"
            className="mt-4 md:mt-8"
          >
            <StudentAnalytics
              language={language}
              translations={{
                analytics: t.analytics,
                downloadReport: t.downloadReport,
                viewReport: t.viewReport,
                clickToExplore: t.clickToExplore,
                classPerformance: t.classPerformance,
                subjectDistribution: t.subjectDistribution,
                detailedAnalytics: t.detailedAnalytics,
                studentProgress: t.studentProgress,
                weeklyProgress: t.weeklyProgress,
                mathematics: t.mathematics,
                science: t.science,
                technology: t.technology,
                engineering: t.engineering,
              }}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog for Creating Assignments/Notices */}
      <Dialog
        open={showCreateAssignment}
        onOpenChange={setShowCreateAssignment}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-600" />
              {t.createAssignment}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new
              assignment or notice for your students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignmentTitle">
                  {t.title}
                </Label>
                <Input
                  id="assignmentTitle"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  className="bg-white border-yellow-200"
                />
              </div>
              <div>
                <Label htmlFor="assignmentType">{t.type}</Label>
                <Select
                  value={newAssignment.type}
                  onValueChange={(
                    value: "assignment" | "notice",
                  ) =>
                    setNewAssignment({
                      ...newAssignment,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-white border-yellow-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">
                      {t.assignment}
                    </SelectItem>
                    <SelectItem value="notice">
                      {t.notice}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="assignmentSubject">
                {t.subject}
              </Label>
              <Select
                value={newAssignment.subject}
                onValueChange={(value: string) =>
                  setNewAssignment({
                    ...newAssignment,
                    subject: value,
                  })
                }
              >
                <SelectTrigger className="bg-white border-yellow-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">
                    {t.mathematics}
                  </SelectItem>
                  <SelectItem value="science">
                    {t.science}
                  </SelectItem>
                  <SelectItem value="technology">
                    {t.technology}
                  </SelectItem>
                  <SelectItem value="engineering">
                    {t.engineering}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignmentTargetGrade">
                {t.targetGrade}
              </Label>
              <Select
                value={newAssignment.targetGrade}
                onValueChange={(value: string) =>
                  setNewAssignment({
                    ...newAssignment,
                    targetGrade: value,
                  })
                }
              >
                <SelectTrigger className="bg-white border-yellow-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">{t.grade6}</SelectItem>
                  <SelectItem value="7">{t.grade7}</SelectItem>
                  <SelectItem value="8">{t.grade8}</SelectItem>
                  <SelectItem value="9">{t.grade9}</SelectItem>
                  <SelectItem value="10">
                    {t.grade10}
                  </SelectItem>
                  <SelectItem value="11">
                    {t.grade11}
                  </SelectItem>
                  <SelectItem value="12">
                    {t.grade12}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignmentContent">
                {t.content}
              </Label>
              <Textarea
                id="assignmentContent"
                value={newAssignment.content}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    content: e.target.value,
                  })
                }
                className="bg-white border-yellow-200"
                rows={4}
              />
            </div>
            <div>
              <Label
                htmlFor="assignmentFile"
                className="flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                {t.attachFile}
              </Label>
              <Input
                id="assignmentFile"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="bg-white border-yellow-200 cursor-pointer"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Paperclip className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm flex-1">
                    {selectedFile.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="h-6 px-2 hover:bg-red-100"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleCreateAssignment}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
              >
                {t.create}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateAssignment(false)}
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Class Details Dialog */}
      <Dialog open={showClassDetails} onOpenChange={setShowClassDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-6 h-6 text-purple-600" />
              {selectedClass?.name}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {selectedClass?.subject} • Grade {selectedClass?.grade}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClass && (
            <div className="space-y-6">
              {/* Class Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-900">
                          {selectedClass.students}
                        </p>
                        <p className="text-sm text-blue-700">
                          {t.totalStudents}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-900">
                          {selectedClass.avgScore}%
                        </p>
                        <p className="text-sm text-green-700">
                          {t.averageScore}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-900">
                          Active
                        </p>
                        <p className="text-sm text-purple-700">
                          Class Status
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Class Description */}
              {selectedClass.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedClass.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Class Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t.classPerformance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                          Overall Progress
                        </span>
                        <span className="font-semibold">
                          {selectedClass.avgScore}%
                        </span>
                      </div>
                      <Progress
                        value={selectedClass.avgScore}
                        className="h-3"
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-900 mb-2">
                        💡 Backend Integration Note:
                      </p>
                      <p>
                        When connected to the backend, this section will display detailed student performance metrics, assignment completion rates, and individual student progress.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowClassDetails(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteClass(selectedClass.id);
                    setShowClassDetails(false);
                  }}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Class
                </Button>
              </div>
            </div>
          )}
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
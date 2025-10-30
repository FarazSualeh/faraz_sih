import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { motion } from "motion/react";

interface LeaderboardProps {
  language: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  grade: string;
  score: number;
  badges: number;
}

const translations = {
  en: {
    title: "Top Performers",
    rank: "Rank",
    student: "Student",
    score: "Score",
    badges: "Badges",
    you: "You",
    points: "pts",
  },
  hi: {
    title: "शीर्ष प्रदर्शनकर्ता",
    rank: "रैंक",
    student: "छात्र",
    score: "स्कोर",
    badges: "बैज",
    you: "आप",
    points: "अंक",
  },
  od: {
    title: "ଶୀର୍ଷ ପ୍ରଦର୍ଶନକାରୀ",
    rank: "ରାଙ୍କ",
    student: "ଛାତ୍ର",
    score: "ସ୍କୋର",
    badges: "ବ୍ୟାଜ",
    you: "ଆପଣ",
    points: "ପଏଣ୍ଟ",
  },
};

// Static mock data - will be replaced with real API data later
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Aarav Kumar", grade: "Grade 6", score: 9850, badges: 24 },
  { rank: 2, name: "Priya Singh", grade: "Grade 7", score: 9620, badges: 22 },
  { rank: 3, name: "Rohan Patel", grade: "Grade 6", score: 9480, badges: 21 },
  { rank: 4, name: "Ananya Das", grade: "Grade 8", score: 9325, badges: 20 },
  { rank: 5, name: "Arjun Sharma", grade: "Grade 7", score: 9150, badges: 19 },
  { rank: 6, name: "Meera Reddy", grade: "Grade 6", score: 8980, badges: 18 },
  { rank: 7, name: "Vikram Gupta", grade: "Grade 8", score: 8765, badges: 17 },
  { rank: 8, name: "Ishita Joshi", grade: "Grade 7", score: 8540, badges: 16 },
  { rank: 9, name: "Karan Mehta", grade: "Grade 6", score: 8320, badges: 15 },
  { rank: 10, name: "Sneha Verma", grade: "Grade 7", score: 8125, badges: 14 },
];

export function Leaderboard({ language }: LeaderboardProps) {
  const validLanguage =
    language && ["en", "hi", "od"].includes(language) ? language : "en";
  const t =
    translations[validLanguage as keyof typeof translations] ||
    translations.en;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-50 to-amber-100 border-yellow-300";
      case 2:
        return "from-gray-50 to-slate-100 border-gray-300";
      case 3:
        return "from-orange-50 to-amber-100 border-orange-300";
      default:
        return "from-white to-gray-50 border-gray-200";
    }
  };

  const getRankTextColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-700 font-bold";
      case 2:
        return "text-gray-700 font-bold";
      case 3:
        return "text-amber-700 font-bold";
      default:
        return "text-gray-600 font-semibold";
    }
  };

  return (
    <Card
      className="bg-white/90 border-2 border-purple-200 shadow-lg"
      data-aos="fade-up"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Header Row - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 pb-2 border-b-2 border-purple-200 text-sm font-semibold text-gray-600">
            <div className="col-span-2 text-center">{t.rank}</div>
            <div className="col-span-5">{t.student}</div>
            <div className="col-span-3 text-center">{t.score}</div>
            <div className="col-span-2 text-center">{t.badges}</div>
          </div>

          {/* Leaderboard Entries */}
          {mockLeaderboardData.map((entry, index) => {
            const rankIcon = getRankIcon(entry.rank);
            const bgColor = getRankBgColor(entry.rank);
            const textColor = getRankTextColor(entry.rank);

            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r ${bgColor} rounded-xl border shadow-sm hover:shadow-md transition-all`}
              >
                {/* Rank Column */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    {rankIcon && <span>{rankIcon}</span>}
                    <span className={`text-base sm:text-lg ${textColor}`}>
                      {entry.rank}
                    </span>
                  </div>
                </div>

                {/* Student Info Column */}
                <div className="col-span-6 sm:col-span-5 flex flex-col justify-center">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {entry.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {entry.grade}
                  </p>
                </div>

                {/* Score Column */}
                <div className="col-span-2 sm:col-span-3 flex items-center justify-center">
                  <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                    <span className="font-bold text-sm sm:text-base text-purple-700">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {t.points}
                    </span>
                  </div>
                </div>

                {/* Badges Column */}
                <div className="col-span-2 flex items-center justify-center">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs sm:text-sm font-semibold gap-1"
                  >
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{entry.badges}</span>
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note for future backend integration */}
        <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-center text-gray-600">
            {validLanguage === "en" &&
              "Rankings update daily based on quiz scores and achievements"}
            {validLanguage === "hi" &&
              "रैंकिंग क्विज स्कोर और उपलब्धियों के आधार पर प्रतिदिन अपडेट होती है"}
            {validLanguage === "od" &&
              "କୁଇଜ ସ୍କୋର ଏବଂ ସଫଳତା ଉପରେ ଆଧାର କରି ରାଙ୍କିଂ ପ୍ରତିଦିନ ଅପଡେଟ ହୁଏ"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* 
  BACKEND INTEGRATION NOTES:
  
  When backend is ready, replace mockLeaderboardData with API call:
  
  1. Import the API helper:
     import { leaderboardHelpers } from '../lib/api';
  
  2. Add state for leaderboard data:
     const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
     const [loading, setLoading] = useState(true);
  
  3. Fetch data on component mount:
     useEffect(() => {
       const fetchLeaderboard = async () => {
         try {
           setLoading(true);
           const data = await leaderboardHelpers.getTopStudents(10);
           setLeaderboardData(data);
         } catch (error) {
           console.error('Failed to fetch leaderboard:', error);
           // Fallback to mock data or show error
         } finally {
           setLoading(false);
         }
       };
       fetchLeaderboard();
     }, []);
  
  4. Use leaderboardData instead of mockLeaderboardData in the map function
  
  5. Add loading state UI if needed
  
  Expected API response format:
  [
    {
      rank: number,
      name: string,
      grade: string,
      score: number,
      badges: number
    }
  ]
*/

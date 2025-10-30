import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { 
  BarChart3, 
  Trophy,
  Download,
  MousePointer
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StudentAnalyticsProps {
  language: string;
  translations: {
    analytics: string;
    downloadReport: string;
    viewReport: string;
    clickToExplore: string;
    classPerformance: string;
    subjectDistribution: string;
    detailedAnalytics: string;
    studentProgress: string;
    weeklyProgress: string;
    mathematics: string;
    science: string;
    technology: string;
    engineering: string;
  };
}

export function StudentAnalytics({ language, translations: t }: StudentAnalyticsProps) {
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  const [selectedAnalyticType, setSelectedAnalyticType] = useState<string | null>(null);

  const handleAnalyticsClick = (type: string) => {
    setSelectedAnalyticType(type);
    setShowDetailedAnalytics(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{t.analytics}</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-2 border-orange-200 hover:bg-orange-50"
            onClick={() => handleAnalyticsClick('download')}
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadReport}
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            onClick={() => handleAnalyticsClick('detailed')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {t.viewReport}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card 
          className="bg-white/95 border-2 border-orange-200 shadow-lg cursor-pointer hover:shadow-xl transition-shadow group"
          onClick={() => handleAnalyticsClick('performance')}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                {t.classPerformance}
              </div>
              <MousePointer className="w-4 h-4 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
            <CardDescription className="text-orange-700">
              {t.clickToExplore}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <ImageWithFallback 
                src="/images/StudentAnalytics.jpg"
                alt="Analytics Chart"
                className="w-full rounded-xl shadow-md object-contain"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">89%</div>
                  <div className="text-sm text-blue-600 font-medium">Average Performance</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <div className="text-2xl font-bold text-green-700">142</div>
                  <div className="text-sm text-green-600 font-medium">Active Students</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-white/95 border-2 border-pink-200 shadow-lg cursor-pointer hover:shadow-xl transition-shadow group"
          onClick={() => handleAnalyticsClick('subjects')}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-pink-600" />
                {t.subjectDistribution}
              </div>
              <MousePointer className="w-4 h-4 text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
            <CardDescription className="text-pink-700">
              {t.clickToExplore}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { subject: t.mathematics, percentage: 35, color: "from-blue-400 to-blue-600" },
              { subject: t.science, percentage: 28, color: "from-green-400 to-green-600" },
              { subject: t.technology, percentage: 22, color: "from-purple-400 to-purple-600" },
              { subject: t.engineering, percentage: 15, color: "from-orange-400 to-orange-600" }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{item.subject}</span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Modal */}
      {showDetailedAnalytics && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailedAnalytics(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.detailedAnalytics}
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailedAnalytics(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">{t.studentProgress}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">87.5%</div>
                      <p className="text-blue-700">Overall Progress Rate</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">{t.weeklyProgress}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">+12%</div>
                      <p className="text-green-700">Improvement This Week</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => console.log('Download report')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.downloadReport}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

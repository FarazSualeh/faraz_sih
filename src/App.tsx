import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AboutUs } from "./components/AboutUs";
import { FunFacts } from "./components/FunFacts";
import { HowItWorks } from "./components/HowItWorks";
import { authHelpers, isSupabaseConfigured } from "./lib/api";
import { Button } from "./components/ui/button";
import { Info, X } from "lucide-react";

export type UserRole = 'student' | 'teacher' | null;
export type Language = 'en' | 'hi' | 'od';
export type Grade = '6' | '7' | '8' | '9' | '10' | '11' | '12';

export interface UserData {
  role: UserRole;
  name: string;
  email: string;
  grade?: Grade;
  id: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'about' | 'funfacts' | 'howitworks'>('login');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [showDemoBanner, setShowDemoBanner] = useState(!isSupabaseConfigured);

  // Register Service Worker for PWA offline support
  // Note: Service Workers only work in production builds served over HTTPS or localhost
  useEffect(() => {
    // Only register service worker in production or localhost
    const isProduction = window.location.protocol === 'https:' && !window.location.hostname.includes('figma');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if ('serviceWorker' in navigator && (isProduction || isLocalhost)) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          // Fail silently in preview environments
          console.log('[PWA] Service Worker registration skipped (preview environment)');
        });

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New service worker activated, reloading page...');
        window.location.reload();
      });
    } else if ('serviceWorker' in navigator) {
      console.log('[PWA] Service Worker registration skipped (not production/localhost)');
    }
  }, []);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session } = await authHelpers.getSession();
        
        if (session?.user) {
          // Get user profile
          const { profile } = await authHelpers.getUserProfile(session.user.id);
          
          if (profile) {
            const userData: UserData = {
              role: profile.role as UserRole,
              name: profile.name,
              email: profile.email,
              grade: profile.grade as Grade | undefined,
              id: profile.id
            };
            setUserData(userData);
            setCurrentView('dashboard');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await authHelpers.signOut();
    setUserData(null);
    setCurrentView('login');
  };

  const handleAboutClick = () => {
    setCurrentView('about');
  };

  const handleFunFactClick = () => {
    setCurrentView('funfacts');
  };

  const handleHowItWorksClick = () => {
    setCurrentView('howitworks');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Demo Mode Banner Component
  const DemoBanner = () => {
    if (!showDemoBanner || isSupabaseConfigured) return null;
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-blue-600 text-white px-3 md:px-4 py-2 md:py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Info className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"/>
            <p className="text-xs md:text-sm">
              <span className="font-semibold">🎓Demo Mode:</span> <span className="hidden sm:inline">Welcome to the future of STEM learning! Try out quizzes and games... your progress is local for now, but Permanent Progress and leaderboards are coming soon!</span><span className="sm:hidden">Progress is local only. Full features coming soon!</span>
            </p>
          </div>
          <button
            onClick={() => setShowDemoBanner(false)}
            className="p-1 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
            aria-label="Close banner"
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <>
        <DemoBanner />
        <LoginPage 
          language={language}
          onLanguageChange={(lang) => setLanguage(lang as Language)}
          onLogin={handleLogin}
          onAboutClick={handleAboutClick}
          onFunFactClick={handleFunFactClick}
          onHowItWorksClick={handleHowItWorksClick}
        />
      </>
    );
  }

  if (currentView === 'about') {
    return (
      <>
        <DemoBanner />
        <AboutUs 
          language={language}
          onLanguageChange={(lang) => setLanguage(lang as Language)}
          onBack={userData ? handleBackToDashboard : handleBackToLogin}
        />
      </>
    );
  }

  if (currentView === 'funfacts') {
    return (
      <>
        <DemoBanner />
        <FunFacts 
          language={language}
          onLanguageChange={(lang) => setLanguage(lang as Language)}
          onBack={userData ? handleBackToDashboard : handleBackToLogin}
        />
      </>
    );
  }

  if (currentView === 'howitworks') {
    return (
      <>
        <DemoBanner />
        <HowItWorks 
          language={language}
          onLanguageChange={(lang) => setLanguage(lang as Language)}
          onBack={userData ? handleBackToDashboard : handleBackToLogin}
        />
      </>
    );
  }

  return (
    <>
      <DemoBanner />
      <div className="size-full relative">
        {userData?.role === 'student' && (
          <StudentDashboard 
            language={language}
            onLanguageChange={(lang) => setLanguage(lang as Language)}
            onLogout={handleLogout}
            userData={userData}
            onAboutClick={handleAboutClick}
            onLoginClick={handleBackToLogin}
            onFunFactClick={handleFunFactClick}
            onHowItWorksClick={handleHowItWorksClick}
          />
        )}
        {userData?.role === 'teacher' && (
          <TeacherDashboard 
            language={language}
            onLanguageChange={(lang) => setLanguage(lang as Language)}
            onLogout={handleLogout}
            userData={userData}
            onAboutClick={handleAboutClick}
            onLoginClick={handleBackToLogin}
            onFunFactClick={handleFunFactClick}
            onHowItWorksClick={handleHowItWorksClick}
          />
        )}
      </div>
    </>
  );
}
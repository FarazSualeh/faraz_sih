import { Mail, Linkedin, Instagram } from "lucide-react";

interface FooterProps {
  language: string;
  onAboutClick?: () => void;
  onFunFactClick?: () => void;
  onHowItWorksClick?: () => void;
}

const translations = {
  en: {
    copyright:
      "© 2025 STEM Learning Platform. All rights reserved by INSPIRA.",
    contact: "Contact Us",
    aboutUs: "About Us",
    forStudents: "For Students",
    forTeachers: "For Teachers",
    funFact: "Fun Fact",
    howItWorks: "How it works",
  },
  hi: {
    copyright:
      "© 2025 STEM शिक्षा मंच। INSPIRA द्वारा सर्वाधिकार सुरक्षित।",
    contact: "हमसे संपर्क करें",
    aboutUs: "हमारे बारे में",
    forStudents: "छात्रों के लिए",
    forTeachers: "शिक्षकों के लिए",
    funFact: "मजेदार तथ्य",
    howItWorks: "यह कैसे काम करता है",
  },
  od: {
    copyright:
      "© 2025 STEM ଶିକ୍ଷା ପ୍ଲାଟଫର୍ମ। INSPIRA ଦ୍ୱାରା ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।",
    contact: "ଆମକୁ ଯୋଗାଯୋଗ କରନ୍ତୁ",
    aboutUs: "ଆମ ବିଷୟରେ",
    forStudents: "ଛାତ୍ରମାନଙ୍କ ପାଇଁ",
    forTeachers: "ଶିକ୍ଷାବିତ୍‍ମାନଙ୍କ ପାଇଁ",
    funFact: "ମଜାଦାର ତଥ୍ୟ",
    howItWorks: "ଏହା କିପରି କାମ କରେ",
  },
};

export function Footer({
  language,
  onAboutClick,
  onFunFactClick,
  onHowItWorksClick,
}: FooterProps) {
  const t =
    translations[language as keyof typeof translations] ||
    translations.en;

  return (
    <footer className="bg-white/90 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              {t.copyright}
            </p>
          </div>

          {/* Contact Us */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {t.contact}:
            </span>
            <div className="flex gap-3">
              <a
                href="mailto:mohammedraasikhkazi@gmail.com?subject=Hello%20from%20STEM%20Platform&body=Hi%20Rasikh%2C%0AI'm%20interested%20in%20your%20project!"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-violet-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/faraz-sualeh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-violet-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-violet-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
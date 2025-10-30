import { useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Send, 
  BarChart3, 
  Bell,
  Lightbulb,
  CheckCircle,
  Sparkles,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  BookOpen,
  Plus
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

interface HowItWorksProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onBack: () => void;
}

const translations = {
  en: {
    title: "How It Works",
    subtitle: "A complete guide for teachers to use the STEM Learning Platform effectively",
    backButton: "Back",
    
    step1Title: "Step 1: Login to Teacher Dashboard",
    step1Desc: "Start by logging in with your teacher credentials. Select 'Teacher' from the role selection screen and enter your email and password. Once logged in, you'll have access to all teacher features.",
    
    step2Title: "Step 2: Explore the Dashboard",
    step2Desc: "The teacher dashboard gives you an overview of your classes, students, and recent activities. You can see statistics about student engagement, assignment completion rates, and more.",
    
    step3Title: "Step 3: Create Classes",
    step3Desc: "Set up your classes by clicking 'Create New Class'. Enter the class name, select subject (any subject!), choose grade level, and add a description. When you create a class, all students in that grade receive an automatic notification in their inbox!",
    
    step4Title: "Step 4: Create Assignments & Notices",
    step4Desc: "Click on 'Create Assignment' or 'Send Notice' to share work with students. Select the subject, target grade, write your content, and optionally attach files. Assignments and notices are instantly sent to students in the selected grade.",
    
    step5Title: "Step 5: Monitor Student Progress",
    step5Desc: "Use the Analytics section to view detailed insights about each student's performance. Track quiz scores, game completions, learning streaks, and overall progress across all STEM subjects.",
    
    step6Title: "Step 6: Send Targeted Notifications",
    step6Desc: "Keep students engaged by sending targeted notices about upcoming quizzes, important announcements, or motivational messages. Students receive these in their inbox immediately.",
    
    step7Title: "Step 7: Review Analytics",
    step7Desc: "Access comprehensive analytics to understand student performance trends. Identify students who need extra help and those who are excelling. Use data to improve your teaching strategies.",
    
    featuresTitle: "Key Features for Teachers",
    
    feature1Title: "Assignment Management",
    feature1Desc: "Create, edit, and track assignments across all subjects and grades",
    
    feature2Title: "Notice Board",
    feature2Desc: "Send important announcements and reminders to students instantly",
    
    feature3Title: "Student Analytics",
    feature3Desc: "View detailed performance reports and progress tracking for each student",
    
    feature4Title: "Multi-Subject Support",
    feature4Desc: "Manage content for Math, Science, Technology, and Engineering",
    
    feature5Title: "Grade Targeting",
    feature5Desc: "Send assignments and notices to specific grade levels (6-12)",
    
    feature6Title: "File Attachments",
    feature6Desc: "Attach study materials, PDFs, and resources to assignments",
    
    tipsTitle: "Pro Tips for Success",
    
    tip1: "📚 Create assignments regularly to keep students engaged and practicing",
    tip2: "🎯 Use analytics to identify students who need additional support",
    tip3: "📢 Send encouraging notices to motivate students and celebrate their achievements",
    tip4: "📊 Review weekly progress reports to track overall class performance",
    tip5: "💡 Attach helpful resources and study materials to your assignments",
    tip6: "🌟 Encourage students to maintain their learning streaks for consistent progress",
    
    quickStart: "Quick Start Guide",
    quickStartDesc: "Follow these simple steps to get started immediately:"
  },
  hi: {
    title: "यह कैसे काम करता है",
    subtitle: "शिक्षकों के लिए STEM लर्निंग प्लेटफॉर्म का प्रभावी ढंग से उपयोग करने की पूर्ण मार्गदर्शिका",
    backButton: "वापस",
    
    step1Title: "चरण 1: शिक्षक डैशबोर्ड में लॉगिन करें",
    step1Desc: "अपने शिक्षक क्रेडेंशियल्स के साथ लॉगिन करके शुरू करें। भूमिका चयन स्क्रीन से 'शिक्षक' चुनें और अपना ईमेल और पासवर्ड दर्ज करें। लॉगिन करने के बाद, आपके पास सभी शिक्षक सुविधाओं तक पहुंच होगी।",
    
    step2Title: "चरण 2: डैशबोर्ड का अन्वेषण करें",
    step2Desc: "शिक्षक डैशबोर्ड आपको अपनी कक्षाओं, छात्रों और हाल की गतिविधियों का अवलोकन देता है। आप छात्र जुड़ाव, असाइनमेंट पूर्णता दर और अधिक के बारे में आंकड़े देख सकते हैं।",
    
    step3Title: "चरण 3: कक्षाएं बनाएं",
    step3Desc: "'नई कक्षा बनाएं' पर क्लिक करके अपनी कक्षाएं सेट करें। कक्षा का नाम दर्ज करें, विषय चुनें (कोई भी विषय!), कक्षा स्तर चुनें, और विवरण जोड़ें। जब आप कक्षा बनाते हैं, तो उस कक्षा के सभी छात्रों को उनके इनबॉक्स में स्वचालित सूचना प्राप्त होती है!",
    
    step4Title: "चरण 4: असाइनमेंट और नोटिस बनाएं",
    step4Desc: "छात्रों के साथ काम साझा करने के लिए 'असाइनमेंट बनाएं' या 'नोटिस भेजें' पर क्लिक करें। विषय चुनें, लक्षित कक्षा चुनें, अपनी सामग्री लिखें, और वैकल्पिक रूप से फ़ाइलें संलग्न करें। असाइनमेंट और नोटिस तुरंत चयनित कक्षा में छात्रों को भेजे जाते हैं।",
    
    step5Title: "चरण 5: छात्र प्रगति की निगरानी करें",
    step5Desc: "प्रत्येक छात्र के प्रदर्शन के बारे में विस्तृत जानकारी देखने के लिए एनालिटिक्स अनुभाग का उपयोग करें। क्विज स्कोर, गेम पूर्णता, सीखने की लय और सभी STEM विषयों में समग्र प्रगति को ट्रैक करें।",
    
    step6Title: "चरण 6: लक्षित सूचनाएं भेजें",
    step6Desc: "आगामी क्विज़, महत्वपूर्ण घोषणाओं या प्रेरक संदेशों के बारे में लक्षित नोटिस भेजकर छात्रों को व्यस्त रखें। छात्रों को ये तुरंत उनके इनबॉक्स में प्राप्त होते हैं।",
    
    step7Title: "चरण 7: एनालिटिक्स की समीक्षा करें",
    step7Desc: "छात्र प्रदर्शन रुझानों को समझने के लिए व्यापक एनालिटिक्स तक पहुंचें। उन छात्रों की पहचान करें जिन्हें अतिरिक्त सहायता की आवश्यकता है और जो उत्कृष्ट प्रदर्शन कर रहे हैं। अपनी शिक्षण रणनीतियों को बेहतर बनाने के लिए डेटा का उपयोग करें।",
    
    featuresTitle: "शिक्षकों के लिए मुख्य विशेषताएं",
    
    feature1Title: "असाइनमेंट प्रबंधन",
    feature1Desc: "सभी विषयों और कक्षाओं में असाइनमेंट बनाएं, संपादित करें और ट्रैक करें",
    
    feature2Title: "नोटिस बोर्ड",
    feature2Desc: "छात्रों को तुरंत महत्वपूर्ण घोषणाएं और अनुस्मारक भेजें",
    
    feature3Title: "छात्र एनालिटिक्स",
    feature3Desc: "प्रत्येक छात्र के लिए विस्तृत प्रदर्शन रिपोर्ट और प्रगति ट्रैकिंग देखें",
    
    feature4Title: "बहु-विषय समर्थन",
    feature4Desc: "गणित, विज्ञान, प्रौद्योगिकी और इंजीनियरिंग के लिए सामग्री प्रबंधित करें",
    
    feature5Title: "कक्षा लक्ष्यीकरण",
    feature5Desc: "विशिष्ट कक्षा स्तरों (6-12) को असाइनमेंट और नोटिस भेजें",
    
    feature6Title: "फ़ाइल अनुलग्नक",
    feature6Desc: "असाइनमेंट में अध्ययन सामग्री, PDF और संसाधन संलग्न करें",
    
    tipsTitle: "सफलता के लिए प्रो टिप्स",
    
    tip1: "📚 छात्रों को व्यस्त और अभ्यास करते रहने के लिए नियमित रूप से असाइनमेंट बनाएं",
    tip2: "🎯 एनालिटिक्स का उपयोग करके उन छात्रों की पहचान करें जिन्हें अतिरिक्त सहायता की आवश्यकता है",
    tip3: "📢 छात्रों को प्रेरित करने और उनकी उपलब्धियों का जश्न मनाने के लिए प्रोत्साहक नोटिस भेजें",
    tip4: "📊 समग्र कक्षा प्रदर्शन को ट्रैक करने के लिए साप्ताहिक प्रगति रिपोर्ट की समीक्षा करें",
    tip5: "💡 अपने असाइनमेंट में सहायक संसाधन और अध्ययन सामग्री संलग्न करें",
    tip6: "🌟 निरंतर प्रगति के लिए छात्रों को अपनी सीखने की लय बनाए रखने के लिए प्रोत्साहित करें",
    
    quickStart: "त्वरित प्रारंभ गाइड",
    quickStartDesc: "तुरंत शुरू करने के लिए इन सरल चरणों का पालन करें:"
  },
  od: {
    title: "ଏହା କିପରି କାମ କରେ",
    subtitle: "ଶିକ୍ଷକମାନଙ୍କ ପାଇଁ STEM ଲର୍ଣ୍ଣିଂ ପ୍ଲାଟଫର୍ମକୁ ପ୍ରଭାବଶାଳୀ ଭାବରେ ବ୍ୟବହାର କରିବା ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ମାର୍ଗଦର୍ଶିକା",
    backButton: "ପଛକୁ",
    
    step1Title: "ପଦକ୍ଷେପ 1: ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡରେ ଲଗଇନ୍ କରନ୍ତୁ",
    step1Desc: "ଆପଣଙ୍କର ଶିକ୍ଷକ ପ୍ରମାଣପତ୍ର ସହିତ ଲଗଇନ୍ କରି ଆରମ୍ଭ କରନ୍ତୁ। ଭୂମିକା ଚୟନ ସ୍କ୍ରିନରୁ 'ଶିକ୍ଷକ' ବାଛନ୍ତୁ ଏବଂ ଆପଣଙ୍କର ଇମେଲ ଏବଂ ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ। ଲଗଇନ୍ କରିବା ପରେ, ଆପଣଙ୍କୁ ସମସ୍ତ ଶିକ୍ଷକ ସୁବିଧା ଉପଲବ୍ଧ ହେବ।",
    
    step2Title: "ପଦକ୍ଷେପ 2: ଡ୍ୟାସବୋର୍ଡ ଅନ୍ୱେଷଣ କରନ୍ତୁ",
    step2Desc: "ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ ଆପଣଙ୍କୁ ଆପଣଙ୍କର କ୍ଲାସ୍, ଛାତ୍ର ଏବଂ ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପର ଏକ ସାରାଂଶ ଦେଇଥାଏ। ଆପଣ ଛାତ୍ର ଯୋଗଦାନ, ଆସାଇନମେଣ୍ଟ ସମାପ୍ତି ହାର ଏବଂ ଅଧିକ ବିଷୟରେ ପରିସଂଖ୍ୟାନ ଦେଖିପାରିବେ।",
    
    step3Title: "ପଦକ୍ଷେପ 3: କ୍ଲାସ୍ ସୃଷ୍ଟି କରନ୍ତୁ",
    step3Desc: "'ନୂଆ କ୍ଲାସ୍ ସୃଷ୍ଟି କରନ୍ତୁ' ଉପରେ କ୍ଲିକ୍ କରି ଆପଣଙ୍କର କ୍ଲାସ୍ ସେଟ୍ କରନ୍ତୁ। କ୍ଲାସ୍ ନାମ ପ୍ରବେଶ କରନ୍ତୁ, ବିଷୟ ବାଛନ୍ତୁ (ଯେକୌଣସି ବିଷୟ!), ଶ୍ରେଣୀ ସ୍ତର ବାଛନ୍ତୁ, ଏବଂ ବିବରଣୀ ଯୋଡନ୍ତୁ। ଯେତେବେଳେ ଆପଣ ଏକ କ୍ଲାସ୍ ସୃଷ୍ଟି କରନ୍ତି, ସେହି ଶ୍ରେଣୀର ସମସ୍ତ ଛାତ୍ରମାନେ ସେମାନଙ୍କ ଇନବକ୍ସରେ ସ୍ୱୟଂଚାଳିତ ବିଜ୍ଞପ୍ତି ପାଆନ୍ତି!",
    
    step4Title: "ପଦକ୍ଷେପ 4: ଆସାଇନମେଣ୍ଟ ଏବଂ ନୋଟିସ ସୃଷ୍ଟି କରନ୍ତୁ",
    step4Desc: "ଛାତ୍ରମାନଙ୍କ ସହିତ କାମ ସେୟାର କରିବା ପାଇଁ 'ଆସାଇନମେଣ୍ଟ ସୃଷ୍ଟି କରନ୍ତୁ' କିମ୍ବା 'ନୋଟିସ ପଠାନ୍ତୁ' ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ। ବିଷୟ ବାଛନ୍ତୁ, ଲକ୍ଷ୍ୟ ଶ୍ରେଣୀ ବାଛନ୍ତୁ, ଆପଣଙ୍କର ବିଷୟବସ୍ତୁ ଲେଖନ୍ତୁ, ଏବଂ ବୈକଳ୍ପିକ ଭାବରେ ଫାଇଲ ସଂଲଗ୍ନ କରନ୍ତୁ। ଆସାଇନମେଣ୍ଟ ଏବଂ ନୋଟିସ ତୁରନ୍ତ ଚୟନିତ ଶ୍ରେଣୀର ଛାତ୍ରମାନଙ୍କୁ ପଠାଯାଏ।",
    
    step5Title: "ପଦକ୍ଷେପ 5: ଛାତ୍ର ପ୍ରଗତି ନିରୀକ୍ଷଣ କରନ୍ତୁ",
    step5Desc: "ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କ ପ୍ରଦର୍ଶନ ବିଷୟରେ ବିସ୍ତୃତ ଜାଣିବା ପାଇଁ ଆନାଲିଟିକ୍ସ ବିଭାଗ ବ୍ୟବହାର କରନ୍ତୁ। କୁଇଜ୍ ସ୍କୋର, ଖେଳ ସମାପ୍ତି, ଶିଖିବା ଧାରା ଏବଂ ସମସ୍ତ STEM ବିଷୟରେ ସାମଗ୍ରିକ ପ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ।",
    
    step6Title: "ପଦକ୍ଷେପ 6: ଲକ୍ଷ୍ୟିତ ବିଜ୍ଞପ୍ତି ପଠାନ୍ତୁ",
    step6Desc: "ଆସୁଥିବା କୁଇଜ୍, ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଘୋଷଣା କିମ୍ବା ପ୍ରେରଣାଦାୟକ ସନ୍ଦେଶ ବିଷୟରେ ଲକ୍ଷ୍ୟିତ ନୋଟିସ ପଠାଇ ଛାତ୍ରମାନଙ୍କୁ ବ୍ୟସ୍ତ ରଖନ୍ତୁ। ଛାତ୍ରମାନେ ତୁରନ୍ତ ସେମାନଙ୍କ ଇନବକ୍ସରେ ଏହା ପାଆନ୍ତି।",
    
    step7Title: "ପଦକ୍ଷେପ 7: ଆନାଲିଟିକ୍ସର ସମୀକ୍ଷା କରନ୍ତୁ",
    step7Desc: "ଛାତ୍ର ପ୍ରଦର୍ଶନ ଧାରା ବୁଝିବା ପାଇଁ ବ୍ୟାପକ ଆନାଲିଟିକ୍ସ ଉପଲବ୍ଧ କରନ୍ତୁ। ଯେଉଁ ଛାତ୍ରମାନଙ୍କୁ ଅତିରିକ୍ତ ସାହାଯ୍ୟ ଆବଶ୍ୟକ ଏବଂ ଯେଉଁମାନେ ଉତ୍କୃଷ୍ଟ ପ୍ରଦର୍ଶନ କରୁଛନ୍ତି ସେମାନଙ୍କୁ ଚିହ୍ନଟ କରନ୍ତୁ। ଆପଣଙ୍କର ଶିକ୍ଷଣ ରଣନୀତି ଉନ୍ନତ କରିବା ପାଇଁ ତଥ୍ୟ ବ୍ୟବହାର କରନ୍ତୁ।",
    
    featuresTitle: "ଶିକ୍ଷକମାନଙ୍କ ପାଇଁ ମୁଖ୍ୟ ବୈଶିଷ୍ଟ୍ୟ",
    
    feature1Title: "ଆସାଇନମେଣ୍ଟ ପରିଚାଳନା",
    feature1Desc: "ସମସ୍ତ ବିଷୟ ଏବଂ ଶ୍ରେଣୀରେ ଆସାଇନମେଣ୍ଟ ସୃଷ୍ଟି, ସଂପାଦନ ଏବଂ ଟ୍ରାକ୍ କରନ୍ତୁ",
    
    feature2Title: "ନୋଟିସ ବୋର୍ଡ",
    feature2Desc: "ଛାତ୍ରମାନଙ୍କୁ ତୁରନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଘୋଷଣା ଏବଂ ସ୍ମାରକ ପଠାନ୍ତୁ",
    
    feature3Title: "ଛାତ୍ର ଆନାଲିଟିକ୍ସ",
    feature3Desc: "ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କ ପାଇଁ ବିସ୍ତୃତ ପ୍ରଦର୍ଶନ ରିପୋର୍ଟ ଏବଂ ପ୍ରଗତି ଟ୍ରାକିଂ ଦେଖନ୍ତୁ",
    
    feature4Title: "ବହୁ-ବିଷୟ ସମର୍ଥନ",
    feature4Desc: "ଗଣିତ, ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ଏବଂ ଇଞ୍ଜିନିୟରିଂ ପାଇଁ ବିଷୟବସ୍ତୁ ପରିଚାଳନା କରନ୍ତୁ",
    
    feature5Title: "ଶ୍ରେଣୀ ଲକ୍ଷ୍ୟୀକରଣ",
    feature5Desc: "ନିର୍ଦ୍ଦିଷ୍ଟ ଶ୍ରେଣୀ ସ୍ତର (6-12) କୁ ଆସାଇନମେଣ୍ଟ ଏବଂ ନୋଟିସ ପଠାନ୍ତୁ",
    
    feature6Title: "ଫାଇଲ ସଂଲଗ୍ନକ",
    feature6Desc: "ଆସାଇନମେଣ୍ଟରେ ଅଧ୍ୟୟନ ସାମଗ୍ରୀ, PDF ଏବଂ ସମ୍ବଳ ସଂଲଗ୍ନ କରନ୍ତୁ",
    
    tipsTitle: "ସଫଳତା ପାଇଁ ପ୍ରୋ ଟିପ୍ସ",
    
    tip1: "📚 ଛାତ୍ରମାନଙ୍କୁ ବ୍ୟସ୍ତ ଏବଂ ଅଭ୍ୟାସ କରିବାକୁ ନିୟମିତ ଭାବରେ ଆସାଇନମେଣ୍ଟ ସୃଷ୍ଟି କରନ୍ତୁ",
    tip2: "🎯 ଯେଉଁ ଛାତ୍ରମାନଙ୍କୁ ଅତିରିକ୍ତ ସହାୟତା ଆବଶ୍ୟକ ସେମାନଙ୍କୁ ଚିହ୍ନଟ କରିବା ପାଇଁ ଆନାଲିଟିକ୍ସ ବ୍ୟବହାର କରନ୍ତୁ",
    tip3: "📢 ଛାତ୍ରମାନଙ୍କୁ ପ୍ରେରଣା ଦେବା ଏବଂ ସେମାନଙ୍କର ସଫଳତା ଉତ୍ସବ ପାଳନ କରିବା ପାଇଁ ଉତ୍ସାହଜନକ ନୋଟିସ ପଠାନ୍ତୁ",
    tip4: "📊 ସାମଗ୍ରିକ କ୍ଲାସ୍ ପ୍ରଦର୍ଶନ ଟ୍ରାକ୍ କରିବା ପାଇଁ ସାପ୍ତାହିକ ପ୍ରଗତି ରିପୋର୍ଟର ସମୀକ୍ଷା କରନ୍ତୁ",
    tip5: "💡 ଆପଣଙ୍କର ଆସାଇନମେଣ୍ଟରେ ସହାୟକ ସମ୍ବଳ ଏବଂ ଅଧ୍ୟୟନ ସାମଗ୍ରୀ ସଂଲଗ୍ନ କରନ୍ତୁ",
    tip6: "🌟 ନିରନ୍ତର ପ୍ରଗତି ପାଇଁ ଛାତ୍ରମାନଙ୍କୁ ସେମାନଙ୍କର ଶିଖିବା ଧାରା ବଜାୟ ରଖିବାକୁ ଉତ୍ସାହିତ କରନ୍ତୁ",
    
    quickStart: "ତୁରନ୍ତ ଆରମ୍ଭ ମାର୍ଗଦର୍ଶିକା",
    quickStartDesc: "ତୁରନ୍ତ ଆରମ୍ଭ କରିବା ପାଇଁ ଏହି ସରଳ ପଦକ୍ଷେପଗୁଡିକ ଅନୁସରଣ କରନ୍ତୁ:"
  }
};

const steps = [
  { icon: Users, color: "from-blue-500 to-cyan-500" },
  { icon: BarChart3, color: "from-purple-500 to-pink-500" },
  { icon: BookOpen, color: "from-violet-500 to-purple-500" },
  { icon: FileText, color: "from-green-500 to-emerald-500" },
  { icon: TrendingUp, color: "from-orange-500 to-amber-500" },
  { icon: Bell, color: "from-red-500 to-rose-500" },
  { icon: ClipboardList, color: "from-indigo-500 to-violet-500" }
];

const features = [
  { icon: FileText, color: "text-blue-600" },
  { icon: Bell, color: "text-purple-600" },
  { icon: BarChart3, color: "text-green-600" },
  { icon: GraduationCap, color: "text-orange-600" },
  { icon: Send, color: "text-pink-600" },
  { icon: ClipboardList, color: "text-indigo-600" }
];

export function HowItWorks({ language, onLanguageChange, onBack }: HowItWorksProps) {
  const validLanguage = (language && ['en', 'hi', 'od'].includes(language)) ? language : 'en';
  const t = translations[validLanguage as keyof typeof translations] || translations.en;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div 
          className="absolute top-20 left-10 text-purple-500"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 right-20 text-violet-500"
          animate={{ y: [0, -15, 0], rotate: [0, -360] }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lightbulb className="w-16 h-16" />
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
                <span className="hidden md:inline">{t.backButton}</span>
              </Button>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>
            <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-lg md:text-xl text-gray-600 mb-12"
        >
          {t.subtitle}
        </motion.p>

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-violet-500 to-purple-500 border-0 shadow-2xl text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl text-white flex items-center justify-center gap-2">
                <Sparkles className="w-8 h-8" />
                {t.quickStart}
              </CardTitle>
              <p className="text-white/90 mt-2">{t.quickStartDesc}</p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <StepIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl text-gray-800 mb-2">
                          {t[`step${index + 1}Title` as keyof typeof t]}
                        </CardTitle>
                        <p className="text-gray-600 leading-relaxed">
                          {t[`step${index + 1}Desc` as keyof typeof t]}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all h-full">
                    <CardContent className="p-6 text-center">
                      <FeatureIcon className={`w-12 h-12 ${feature.color} mx-auto mb-3`} />
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {t[`feature${index + 1}Title` as keyof typeof t]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t[`feature${index + 1}Desc` as keyof typeof t]}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t.tipsTitle}
          </h2>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + num * 0.1 }}
                    className="flex items-start gap-3 bg-white/70 p-4 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-gray-700">
                      {t[`tip${num}` as keyof typeof t]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

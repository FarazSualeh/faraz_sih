import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, Lightbulb, RefreshCw, Sparkles, Atom, Calculator, Cpu, Cog } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

interface FunFactsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onBack: () => void;
}

const translations = {
  en: {
    title: "Fun STEM Facts",
    subtitle: "Discover amazing facts about Science, Math, and Technology!",
    backButton: "Back",
    nextFact: "Next Fact",
    science: "Science",
    technology: "Technology",
    engineering: "Engineering",
    math: "Mathematics",
    scienceFacts: [
      "A single bolt of lightning contains enough energy to toast 100,000 slices of bread!",
      "Honey never spoils! Archaeologists have found 3000-year-old honey in Egyptian tombs that's still edible.",
      "Water can boil and freeze at the same time! This is called the 'triple point' and occurs at a specific temperature and pressure.",
      "Your body has enough iron to make a 3-inch nail!",
      "A day on Venus is longer than a year on Venus! It takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
      "Bananas are radioactive! They contain potassium-40, a radioactive isotope of potassium.",
      "The human brain uses 20% of the body's energy but only makes up 2% of its mass.",
      "Glass is actually a liquid, it just moves very, very slowly!",
      "Sound travels 4 times faster in water than in air.",
      "A single teaspoon of honey represents the life work of 12 bees."
    ],
    mathFacts: [
      "The number Pi (π) has been calculated to over 31 trillion decimal places!",
      "Zero is the only number that cannot be represented in Roman numerals.",
      "The word 'hundred' comes from the old Norse word 'hundrath', which actually means 120, not 100.",
      "In a room of just 23 people, there's a 50% chance that two people share the same birthday!",
      "The symbol for division (÷) is called an obelus.",
      "1 + 2 + 3 + 4 + ... + infinity = -1/12 (according to Ramanujan summation!)",
      "A 'jiffy' is an actual unit of time: 1/100th of a second!",
      "The opposite sides of a dice always add up to 7.",
      "If you shuffle a deck of cards properly, you've likely arranged them in an order that has never existed before!",
      "Multiplying 111,111,111 × 111,111,111 gives you 12,345,678,987,654,321 - a perfect palindrome!"
    ],
    techFacts: [
      "The first computer bug was an actual bug! A moth got stuck in a Harvard Mark II computer in 1947.",
      "The first 1GB hard disk drive weighed over 550 pounds and cost $40,000!",
      "The average person unlocks their phone 110 times per day.",
      "The first computer mouse was made of wood! It was invented by Doug Engelbart in 1964.",
      "CAPTCHA stands for 'Completely Automated Public Turing test to tell Computers and Humans Apart'.",
      "The first email was sent in 1971 by Ray Tomlinson to himself!",
      "The first camera took 8 hours to capture a single photograph!",
      "The average person will spend about 6 months of their lifetime waiting for red lights to turn green.",
      "The '@' symbol was chosen for email addresses because it was the least used key on the keyboard!",
      "The first Apple computer, the Apple I, was sold for $666.66 in 1976."
    ],
    engineeringFacts: [
      "The Eiffel Tower can be 15 cm taller during summer! The iron expands due to heat.",
      "The Great Wall of China is not visible from space with the naked eye, despite popular belief!",
      "The Panama Canal uses locks to lift ships 85 feet above sea level!",
      "The Golden Gate Bridge's cables contain enough wire to circle the Earth three times!",
      "Engineers designed the Burj Khalifa to withstand earthquakes up to magnitude 7.0!",
      "The Channel Tunnel between England and France is 31 miles long - the longest undersea tunnel!",
      "3D printing can now create houses in less than 24 hours!",
      "The Hoover Dam contains enough concrete to build a highway from San Francisco to New York!",
      "Engineers use a technique called 'biomimicry' - copying nature's designs to solve problems!",
      "The world's longest bridge is the Danyang-Kunshan Grand Bridge in China at 102.4 miles!"
    ]
  },
  hi: {
    title: "मजेदार STEM तथ्य",
    subtitle: "विज्ञान, गणित और प्रौद्योगिकी के बारे में अद्भुत तथ्यों की खोज करें!",
    backButton: "वापस",
    nextFact: "अगला तथ्य",
    science: "विज्ञान",
    technology: "प्रौद्योगिकी",
    engineering: "इंजीनियरिंग",
    math: "गणित",
    scienceFacts: [
      "एक बिजली की चमक में 100,000 ब्रेड स्लाइस टोस्ट करने के लिए पर्याप्त ऊर्जा होती है!",
      "शहद कभी खराब नहीं होता! पुरातत्वविदों ने मिस्र की कब्रों में 3000 साल पुराना शहद पाया जो अभी भी खाने योग्य है।",
      "पानी एक ही समय में उबल और जम सकता है! इसे 'ट्रिपल पॉइंट' कहा जाता है।",
      "आपके शरीर में 3 इंच की कील बनाने के लिए पर्याप्त लोहा है!",
      "शुक्र ग्रह पर एक दिन एक साल से लंबा है!",
      "केले रेडियोधर्मी होते हैं! उनमें पोटेशियम-40 होता है।",
      "मानव मस्तिष्क शरीर की 20% ऊर्जा का उपयोग करता है लेकिन इसका द्रव्यमान केवल 2% है।",
      "कांच वास्तव में एक तरल है, यह बहुत धीरे-धीरे चलता है!",
      "ध्वनि हवा की तुलना में पानी में 4 गुना तेज यात्रा करती है।",
      "एक चम्मच शहद 12 मधुमक्खियों के जीवन भर के काम का प्रतिनिधित्व करता है।"
    ],
    mathFacts: [
      "पाई (π) की गणना 31 ट्रिलियन से अधिक दशमलव स्थानों तक की गई है!",
      "शून्य एकमात्र संख्या है जिसे रोमन अंकों में प्रस्तुत नहीं किया जा सकता।",
      "'सौ' शब्द पुराने नॉर्स शब्द 'hundrath' से आया है, जिसका वास्तव में अर्थ 120 है, 100 नहीं।",
      "केवल 23 लोगों के एक कमरे में, 50% संभावना है कि दो लोग एक ही जन्मदिन साझा करते हैं!",
      "विभाजन के प्रतीक (÷) को ओबेलस कहा जाता है।",
      "1 + 2 + 3 + 4 + ... + अनंत = -1/12 (रामानुजन summation के अनुसार!)",
      "एक 'jiffy' समय की एक वास्तविक इकाई है: एक सेकंड का 1/100वां हिस्सा!",
      "पासे की विपरीत भुजाएं हमेशा 7 में जुड़ती हैं।",
      "यदि आप ताश के पत्तों को ठीक से फेंटते हैं, तो आपने उन्हें एक ऐसे क्रम में व्यवस्थित किया है जो पहले कभी अस्तित्व में नहीं था!",
      "111,111,111 × 111,111,111 को गुणा करने पर 12,345,678,987,654,321 मिलता है - एक perfect palindrome!"
    ],
    techFacts: [
      "पहला कंप्यूटर बग एक वास्तविक कीड़ा था! 1947 में एक पतंगा Harvard Mark II कंप्यूटर में फंस गया था।",
      "पहली 1GB हार्ड डिस्क ड्राइव का वजन 550 पाउंड से अधिक था और इसकी कीमत $40,000 थी!",
      "औसत व्यक्ति अपने फोन को प्रति दिन 110 बार अनलॉक करता है।",
      "पहला कंप्यूटर माउस लकड़ी का बन�� था! इसे 1964 में Doug Engelbart ने आविष्कार किया था।",
      "CAPTCHA का मतलब है 'Completely Automated Public Turing test to tell Computers and Humans Apart'।",
      "पहला ईमेल 1971 में Ray Tomlinson द्वारा खुद को भेजा गया था!",
      "पहले कैमरे को एक तस्वीर लेने में 8 घंटे लगे!",
      "औसत व्यक्ति अपने जीवनकाल का लगभग 6 महीने लाल बत्ती के हरा होने की प्रतीक्षा में बिताता है।",
      "ईमेल पते के लिए '@' प्रतीक चुना गया था क्योंकि यह कीबोर्ड पर सबसे कम उपयोग की जाने वाली कुंजी थी!",
      "पहला Apple कंप्यूटर, Apple I, 1976 में $666.66 में बेचा गया था।"
    ],
    engineeringFacts: [
      "एफिल टॉवर गर्मियों में 15 सेमी लंबा हो सकता है! लोहा गर्मी के कारण फैलता है।",
      "चीन की महान दीवार आंखों से अंतरिक्ष से दिखाई नहीं देती, लोकप्रिय धारणा के बावजूद!",
      "पनामा नहर जहाजों को समुद्र तल से 85 फीट ऊपर उठाने के लिए ताले का उपयोग करती है!",
      "गोल्डन गेट ब्रिज की केबलों में पृथ्वी को तीन बार घेरने के लिए पर्याप्त तार है!",
      "इंजीनियरों ने बुर्ज खलीफा को 7.0 तक के भूकंपों का सामना करने के लिए डिज़ाइन किया!",
      "इंग्लैंड और फ्रांस के बीच चैनल टनल 31 मील लंबी है - सबसे लंबी समुद्र के नीचे की सुरंग!",
      "3D प्रिंटिंग अब 24 घंटे से कम समय में घर बना सकती है!",
      "हूवर बांध में सैन फ्रांसिस्को से न्यूयॉर्क तक एक राजमार्ग बनाने के लिए पर्याप्त कंक्रीट है!",
      "इंजीनियर 'बायोमिमिक्री' नामक तकनीक का उपयोग करते हैं - समस्याओं को हल करने के लिए प्रकृति के डिजाइनों की नकल करना!",
      "दुनिया का सबसे लंबा पुल चीन में डानयांग-कुनशान ग्रांड ब्रिज है जो 102.4 मील लंबा है!"
    ]
  },
  od: {
    title: "ମଜାଦାର STEM ତଥ୍ୟ",
    subtitle: "ବିଜ୍ଞାନ, ଗଣିତ ଏବଂ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ବିଷୟରେ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ତଥ୍ୟ ଆବିଷ୍କାର କରନ୍ତୁ!",
    backButton: "ପଛକୁ",
    nextFact: "ପରବର୍ତ୍ତୀ ତଥ୍ୟ",
    science: "ବିଜ୍ଞାନ",
    technology: "ପ୍ରଯୁକ୍ତିବିଦ୍ୟା",
    engineering: "ଇଞ୍ଜିନିୟରିଂ",
    math: "ଗଣିତ",
    scienceFacts: [
      "ଗୋଟିଏ ବିଜୁଳି ଚମକରେ 100,000 ବ୍ରେଡ୍ ସ୍ଲାଇସ୍ ଟୋଷ୍ଟ କରିବା ପାଇଁ ଯଥେଷ୍ଟ ଶକ୍ତି ରହିଛି!",
      "ମହୁ କଦାପି ଖରାପ ହୁଏ ନାହିଁ! ପୁରାତତ୍ତ୍ୱବିତ୍‍ମାନେ ମିଶରୀୟ ସମାଧିରେ 3000 ବର୍ଷ ପୁରୁଣା ମହୁ ପାଇଛନ୍ତି ଯାହା ଏବେ ବି ଖାଇବା ଯୋଗ୍ୟ।",
      "ପାଣି ଏକ ସମୟରେ ଫୁଟି ଏବଂ ଜମିପାରେ! ଏହାକୁ 'ଟ୍ରିପଲ ପଏଣ୍ଟ' କୁହାଯାଏ।",
      "ଆପଣଙ୍କ ଶରୀରରେ 3 ଇଞ୍ଚ କଣା ତିଆରି କରିବା ପାଇଁ ଯଥେଷ୍ଟ ଲୁହା ଅଛି!",
      "ଶୁକ୍ର ଗ୍ରହରେ ଗୋଟିଏ ଦିନ ଏକ ବର୍ଷଠାରୁ ଲମ୍ବା!",
      "କଦଳୀ ରେଡିଓଧର୍ମୀ! ସେଗୁଡ଼ିକରେ ପୋଟାସିୟମ-40 ଥାଏ।",
      "ମାନବ ମସ୍ତିଷ୍କ ଶରୀରର 20% ଶକ୍ତି ବ୍ୟବହାର କରେ କିନ୍ତୁ ଏହାର ଓଜନ କେବଳ 2%।",
      "କାଚ ପ୍ରକୃତରେ ଏକ ତରଳ ପଦାର୍ଥ, ଏହା ବହୁତ ଧୀରେ ଧୀରେ ଗତି କରେ!",
      "ଶବ୍ଦ ବାୟୁ ଅପେକ୍ଷା ପାଣିରେ 4 ଗୁଣ ଦ୍ରୁତ ଗତି କରେ।",
      "ଗୋଟିଏ ଚାମଚ ମହୁ 12 ମହୁମାଛିଙ୍କ ଜୀବନର କାର୍ଯ୍ୟର ପ୍ରତିନିଧିତ୍ୱ କରେ।"
    ],
    mathFacts: [
      "ପାଇ (π) ସଂଖ୍ୟାକୁ 31 ଟ୍ରିଲିୟନ ଦଶମିକ ସ୍ଥାନ ପର୍ଯ୍ୟନ୍ତ ଗଣନା କରାଯାଇଛି!",
      "ଶୂନ୍ୟ ହେଉଛି ଏକମାତ୍ର ସଂଖ୍ୟା ଯାହାକୁ ରୋମାନ୍ ସଂଖ୍ୟାରେ ପ୍ରତିନିଧିତ୍ୱ କରାଯାଇପାରିବ ନାହିଁ।",
      "'ଶହେ' ଶବ୍ଦ ପୁରୁଣା ନର୍ସ ଶବ୍ଦ 'hundrath' ରୁ ଆସିଛି, ଯାହାର ଅର୍ଥ ପ୍ରକୃତରେ 120, 100 ନୁହେଁ।",
      "କେବଳ 23 ଜଣଙ୍କ ଗୋଟିଏ କୋଠରୀରେ, 50% ସମ୍ଭାବନା ଅଛି ଯେ ଦୁଇ ଜଣ ସମାନ ଜନ୍ମଦିନ ଅଂଶୀଦାର କରନ୍ତି!",
      "ବିଭାଗର ପ୍ରତୀକ (÷) କୁ ଓବେଲସ୍ କୁହାଯାଏ।",
      "1 + 2 + 3 + 4 + ... + ଅସୀମ = -1/12 (ରାମାନୁଜନ summation ଅନୁସାରେ!)",
      "ଏକ 'jiffy' ସମୟର ଏକ ପ୍ରକୃତ ଏକକ: ଏକ ସେକେଣ୍ଡର 1/100 ଭାଗ!",
      "ପାସାର ବିପରୀତ ପାର୍ଶ୍ୱ ସବୁବେଳେ 7 ରେ ଯୋଗ ହୁଏ।",
      "ଯଦି ଆପଣ ତାସ କାର୍ଡଗୁଡ଼ିକୁ ଠିକ୍ ଭାବରେ ମିଶାନ୍ତି, ତେବେ ଆପଣ ସେଗୁଡ଼ିକୁ ଏକ କ୍ରମରେ ସଜାଇଛନ୍ତି ଯାହା ପୂର୍ବରୁ କେବେ ହୋଇନାହିଁ!",
      "111,111,111 × 111,111,111 କୁ ଗୁଣନ କଲେ 12,345,678,987,654,321 ମିଳେ - ଏକ ସଂପୂର୍ଣ୍ଣ palindrome!"
    ],
    techFacts: [
      "ପ୍ରଥମ କମ୍ପ୍ୟୁଟର ବଗ୍ ଏକ ପ୍ରକୃତ କୀଟ ଥିଲା! 1947 ରେ ଏକ ପତଙ୍ଗ Harvard Mark II କମ୍ପ୍ୟୁଟରରେ ଅଟକି ଯାଇଥିଲା।",
      "ପ୍ରଥମ 1GB ହାର୍ଡ ଡିସ୍କ ଡ୍ରାଇଭର ଓଜନ 550 ପାଉଣ୍ଡରୁ ଅଧିକ ଥିଲା ଏବଂ ଏହାର ମୂଲ୍ୟ $40,000 ଥିଲା!",
      "ଜଣେ ସାଧାରଣ ବ୍ୟକ୍ତି ପ୍ରତିଦିନ ନିଜର ଫୋନ୍ 110 ଥର ଅନଲକ୍ କରନ୍ତି।",
      "ପ୍ରଥମ କମ୍ପ୍ୟୁଟର ମାଉସ୍ କାଠରେ ତିଆରି ହୋଇଥିଲା! ଏହା 1964 ରେ Doug Engelbart ଦ୍ୱାରା ଆବିଷ୍କୃତ ହୋଇଥିଲା।",
      "CAPTCHA ର ଅର୍ଥ ହେଉଛି 'Completely Automated Public Turing test to tell Computers and Humans Apart'।",
      "ପ୍ରଥମ ଇମେଲ 1971 ରେ Ray Tomlinson ଦ୍ୱାରା ନିଜକୁ ପଠାଯାଇଥିଲା!",
      "ପ୍ରଥମ କ୍ୟାମେରା ଗୋଟିଏ ଫଟୋ ନେବାକୁ 8 ଘଣ୍ଟା ନେଇଥିଲା!",
      "ଜଣେ ସାଧାରଣ ବ୍ୟକ୍ତି ନିଜ ଜୀବନର ପ୍ରାୟ 6 ମାସ ଲାଲ ବତ୍ତି ସବୁଜ ହେବା ପାଇଁ ଅପେକ୍ଷା କରିବାରେ ବିତାଇଥାନ୍ତି।",
      "ଇମେଲ ଠିକଣା ପାଇଁ '@' ପ୍ରତୀକ ବାଛାଗଲା କାରଣ ଏହା କୀବୋର୍ଡରେ ସବୁଠୁ କମ୍ ବ୍ୟବହୃତ କି ଥିଲା!",
      "ପ୍ରଥମ Apple କମ୍ପ୍ୟୁଟର, Apple I, 1976 ରେ $666.66 ରେ ବିକ୍ରି ହୋଇଥିଲା।"
    ],
    engineeringFacts: [
      "ଇଫେଲ ଟାୱାର ଗ୍ରୀଷ୍ମରେ 15 ସେମି ଲମ୍ବା ହୋଇପାରେ! ଲୁହା ଗରମ ହେତୁ ବିସ୍ତାର ହୁଏ।",
      "ଚାଇନାର ମହାନ ପ୍ରାଚୀର ଖାଲି ଆଖିରେ ମହାକାଶରୁ ଦୃଶ୍ୟମାନ ନୁହେଁ, ଲୋକପ୍ରିୟ ବିଶ୍ୱାସ ସତ୍ତ୍ୱେ!",
      "ପାନାମା କେନାଲ ଜାହାଜଗୁଡ଼ିକୁ ସମୁଦ୍ର ସ୍ତରରୁ 85 ଫୁଟ ଉପରେ ଉଠାଇବା ପାଇଁ ଲକ୍ ବ୍ୟବହାର କରେ!",
      "ଗୋଲ୍ଡେନ ଗେଟ ବ୍ରିଜର କେବୁଲରେ ପୃଥିବୀକୁ ତିନିଥର ଘେରିବା ପାଇଁ ଯଥେଷ୍ଟ ତାର ଅଛି!",
      "ଇଞ୍ଜିନିୟରମାନେ ବୁର୍ଜ ଖଲିଫାକୁ 7.0 ମ୍ୟାଗ୍ନିଚ୍ୟୁଡ ପର୍ଯ୍ୟନ୍ତ ଭୂକମ୍ପ ସହ୍ୟ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରିଛନ୍ତି!",
      "ଇଂଲଣ୍ଡ ଏବଂ ଫ୍ରାନ୍ସ ମଧ୍ୟରେ ଥିବା ଚ୍ୟାନେଲ ଟନେଲ 31 ମାଇଲ ଲମ୍ବା - ସବୁଠାରୁ ଲମ୍ବା ସମୁଦ୍ର ତଳ ଟନେଲ!",
      "3D ପ୍ରିଣ୍ଟିଂ ବର୍ତ୍ତମାନ 24 ଘଣ୍ଟାରୁ କମ୍ ସମୟରେ ଘର ସୃଷ୍ଟି କରିପାରେ!",
      "ହୁଭର ଡ୍ୟାମରେ ସାନ ଫ୍ରାନ୍ସିସ୍କୋରୁ ନ୍ୟୁୟର୍କ ପର୍ଯ୍ୟନ୍ତ ଏକ ରାଜପଥ ନିର୍ମାଣ କରିବା ପାଇଁ ଯଥେଷ୍ଟ କଂକ୍ରିଟ ଅଛି!",
      "ଇଞ୍ଜିନିୟରମାନେ 'ବାୟୋମିମିକ୍ରି' ନାମକ ଏକ ପ୍ରଯୁକ୍ତି ବ୍ୟବହାର କରନ୍ତି - ସମସ୍ୟାର ସମାଧାନ ପାଇଁ ପ୍ରକୃତିର ଡିଜାଇନ୍ ନକଲ କରିବା!",
      "ବିଶ୍ୱର ସବୁଠାରୁ ଲମ୍ବା ସେତୁ ହେଉଛି ଚାଇନାର ଡାନୟାଙ୍ଗ-କୁନ୍ଶାନ ଗ୍ରାଣ୍ଡ ବ୍ରିଜ ଯାହା 102.4 ମାଇଲ!"
    ]
  }
};

const categoryIcons = {
  science: Atom,
  technology: Cpu,
  engineering: Cog,
  math: Calculator
};

const categoryColors = {
  science: "from-blue-500 to-cyan-500",
  technology: "from-green-500 to-emerald-500",
  engineering: "from-orange-500 to-red-500",
  math: "from-purple-500 to-pink-500"
};

export function FunFacts({ language, onLanguageChange, onBack }: FunFactsProps) {
  const validLanguage = (language && ['en', 'hi', 'od'].includes(language)) ? language : 'en';
  const t = translations[validLanguage as keyof typeof translations] || translations.en;
  
  const [currentCategory, setCurrentCategory] = useState<'science' | 'technology' | 'engineering' | 'math'>('science');
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getCurrentFacts = () => {
    switch (currentCategory) {
      case 'science':
        return t.scienceFacts;
      case 'technology':
        return t.techFacts;
      case 'engineering':
        return t.engineeringFacts;
      case 'math':
        return t.mathFacts;
      default:
        return t.scienceFacts;
    }
  };

  const handleNextFact = () => {
    const facts = getCurrentFacts();
    setCurrentFactIndex((prev) => (prev + 1) % facts.length);
  };

  const handleCategoryChange = (category: 'science' | 'technology' | 'engineering' | 'math') => {
    setCurrentCategory(category);
    setCurrentFactIndex(0);
  };

  const currentFacts = getCurrentFacts();
  const Icon = categoryIcons[currentCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div 
          className="absolute top-20 left-10 text-violet-500"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 right-20 text-blue-500"
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
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>
            <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 relative z-10">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-lg md:text-xl text-gray-600 mb-8"
        >
          {t.subtitle}
        </motion.p>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {(['science', 'technology', 'engineering', 'math'] as const).map((category) => {
            const Icon = categoryIcons[category];
            const isActive = currentCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-br ${categoryColors[category]} text-white shadow-2xl`
                    : 'bg-white/90 text-gray-700 hover:bg-white shadow-lg'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <p className="text-sm md:text-base font-semibold">
                  {t[category]}
                </p>
              </button>
            );
          })}
        </motion.div>

        {/* Fact Card */}
        <motion.div
          key={`${currentCategory}-${currentFactIndex}`}
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`bg-gradient-to-br ${categoryColors[currentCategory]} border-0 shadow-2xl text-white`}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-white">
                {t[currentCategory]} - Fact #{currentFactIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-lg md:text-2xl leading-relaxed mb-6 min-h-[120px] flex items-center justify-center"
              >
                {currentFacts[currentFactIndex]}
              </motion.p>
              
              <Button
                onClick={handleNextFact}
                size="lg"
                className="bg-white text-gray-800 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t.nextFact}
              </Button>

              <p className="text-sm text-white/80 mt-4">
                {currentFactIndex + 1} / {currentFacts.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fun Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            ✨ Keep exploring and learning! ✨
          </p>
        </motion.div>
      </main>
    </div>
  );
}

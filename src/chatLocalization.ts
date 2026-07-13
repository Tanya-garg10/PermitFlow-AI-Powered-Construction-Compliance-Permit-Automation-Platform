export type ChatUiCopy = {
  initialMessage: string;
  suggestions: string[];
  clearMessage: string;
  errorMessage: string;
  loadingText: string;
  inputPlaceholder: string;
  speakLabel: string;
  speakingLabel: string;
  assistantTitle: string;
  assistantSubtitle: string;
};

function normalizeLanguageKey(language: string): string {
  const raw = (language || 'English').trim();
  const aliases: Record<string, string> = {
    en: 'English',
    english: 'English',
    hi: 'Hindi',
    hindi: 'Hindi',
    ta: 'Tamil',
    tamil: 'Tamil',
    gu: 'Gujarati',
    gujarati: 'Gujarati',
    mr: 'Marathi',
    marathi: 'Marathi',
    pa: 'Punjabi',
    punjabi: 'Punjabi',
    kn: 'Kannada',
    kannada: 'Kannada',
    ml: 'Malayalam',
    malayalam: 'Malayalam',
    te: 'Telugu',
    telugu: 'Telugu',
    bn: 'Bengali',
    bengali: 'Bengali',
    or: 'Odia',
    odia: 'Odia',
    as: 'Assamese',
    assamese: 'Assamese'
  };

  return aliases[raw.toLowerCase()] || raw;
}

const chatUiCopyByLanguage: Record<string, ChatUiCopy> = {
  English: {
    initialMessage: 'Hello! I am your Sarvam AI Compliance Assistant. Ask me anything about municipal zoning codes, FAR restrictions, setbacks, fire NOCs, or the regulatory scorecard of your active project.',
    suggestions: ['Do I need Fire NOC?', 'Explain setback rule.', 'Can I build 6 floors?', 'Why is my project rejected?'],
    clearMessage: 'Chat cleared. Ask me another question about municipal building codes or active zoning projects.',
    errorMessage: 'I encountered an error connecting to Sarvam Document Intelligence. Please verify your municipal database links.',
    loadingText: 'AI Compliance Autopilot is processing...',
    inputPlaceholder: 'Ask AI: e.g., setback rules, or Fire NOC clearances...',
    speakLabel: 'SPEAK',
    speakingLabel: 'SPEAKING...',
    assistantTitle: 'Sarvam AI Assistant',
    assistantSubtitle: 'Zoning & Compliance Consultation'
  },
  Hindi: {
    initialMessage: 'नमस्ते! मैं आपका सरवम AI अनुपालन सहायक हूँ। अपने सक्रिय प्रोजेक्ट के नगरपालिका ज़ोनिंग कोड, FAR प्रतिबंधों, बैकसीट नियमों, Fire NOC या नियामक स्कोरकार्ड के बारे में कोई भी सवाल पूछें।',
    suggestions: ['क्या मुझे Fire NOC चाहिए?', 'बैकसीट नियम समझाइए।', 'क्या मैं 6 मंजिलें बना सकता हूँ?', 'मेरी परियोजना क्यों अस्वीकृत हुई?'],
    clearMessage: 'चैट साफ़ कर दी गई है। नगरपालिका भवन कोड या सक्रिय ज़ोनिंग परियोजनाओं के बारे में कोई दूसरा सवाल पूछें।',
    errorMessage: 'सरवम डॉक्यूमेंट इंटेलिजेंस से कनेक्ट करते समय त्रुटि हुई। कृपया अपने नगरपालिका डेटाबेस लिंक सत्यापित करें।',
    loadingText: 'एआई अनुपालन सहायक प्रसंस्करण कर रहा है...',
    inputPlaceholder: 'एआई से पूछें: उदाहरण के लिए, बैकसीट नियम या Fire NOC स्वीकृतियाँ...',
    speakLabel: 'बोलें',
    speakingLabel: 'बोल रहा है...',
    assistantTitle: 'सरवम AI सहायक',
    assistantSubtitle: 'ज़ोनिंग और अनुपालन परामर्श'
  },
  Tamil: {
    initialMessage: 'வணக்கம்! நான் உங்கள் சர்வம் AI இணக்க உதவியாளர். நகராட்சி மண்டல விதிகள், FAR கட்டுப்பாடுகள், பின்வாங்கல் விதிகள், Fire NOC அல்லது உங்கள் செயலில் உள்ள திட்டத்தின் ஒழுங்குமுறை மதிப்பெண் பற்றி ஏதேனும் கேளுங்கள்.',
    suggestions: ['எனக்கு Fire NOC தேவையா?', 'பின்வாங்கல் விதியை விளக்கவும்.', 'நான் 6 மாடிகள் உருவாக்க முடியுமா?', 'என் திட்டம் ஏன் நிராகரிக்கப்பட்டது?'],
    clearMessage: 'சாட் அழிக்கப்பட்டது. நகராட்சி கட்டிட குறியீடுகள் அல்லது செயலில் உள்ள மண்டல திட்டங்கள் பற்றிய மற்றொரு கேள்வியை கேளுங்கள்.',
    errorMessage: 'சர்வம் ஆவண அறிவுத்திறனுடன் இணைக்கும்போது பிழை ஏற்பட்டது. உங்கள் நகராட்சி தரவுத்தள இணைப்புகளைச் சரிபார்க்கவும்.',
    loadingText: 'AI இணக்க உதவியாளர் செயலாக்கத்தில் உள்ளது...',
    inputPlaceholder: 'AI-யிடம் கேளுங்கள்: உதாரணத்திற்கு, பின்வாங்கல் விதிகள் அல்லது Fire NOC அனுமதிகள்...',
    speakLabel: 'பேசவும்',
    speakingLabel: 'பேசுகிறது...',
    assistantTitle: 'சர்வம் AI உதவியாளர்',
    assistantSubtitle: 'மண்டல மற்றும் இணக்க ஆலோசனை'
  },
  Gujarati: {
    initialMessage: 'નમસ્તે! હું તમારો Sarvam AI કન્ફોર્મન્સ સહાયક છું. नगरपालिका ઝોનિંગ કોડ્સ, FAR પાબંદીઓ, સેટબૅક નિયમો, Fire NOC અથવા તમારા સક્રિય પ્રોજેક્ટના નિયમન પેપરના સંબંધમાં કોઈપણ પ્રશ્ન પૂછો.',
    suggestions: ['શું મને Fire NOC જોઈએ?', 'સેટબૅક નિયમ સમજાવો.', 'શું હું 6 માળો બનાવી શકું?', 'મારી પ્રોજેક્ટ શા માટે નામંજૂર કરવામાં આવી?'],
    clearMessage: 'ચેટ સાફ કરી દેવામાં આવી છે. नगरपालिका બિલ્ડિંગ કોડ્સ અથવા સક્રિય ઝોનિંગ પ્રોજેક્ટ્સ વિશે બીજો પ્રશ્ન પૂછો.',
    errorMessage: 'Sarvam ડોક્યુમેન્ટ ઇન્ટેલિજન્સથી કનેક્ટ કરતી વખતે ભૂલ આવી. કૃપયા તમારા નગરપાલિકાના ડેટાબેઝ લિંક્સ ચકાસો.',
    loadingText: 'AI કન્ફોર્મન્સ સહાયક પ્રક્રિયા કરી રહ્યો છે...',
    inputPlaceholder: 'AIને પૂછો: ઉદાહરણ તરીકે, સેટબૅક નિયમો અથવા Fire NOC clearances...',
    speakLabel: 'બોલો',
    speakingLabel: 'બોલી રહ્યો છે...',
    assistantTitle: 'Sarvam AI સહાયક',
    assistantSubtitle: 'ઝોનિંગ અને કન્ફોર્મન્સ સલાહ'
  },
  Marathi: {
    initialMessage: 'नमस्कार! मी तुमचा Sarvam AI कॉम्प्लायन्स असिस्टंट आहे. नगरपालिका झोनिंग कोड्स, FAR मर्यादा, setback नियम, Fire NOC किंवा तुमच्या सक्रिय प्रोजेक्टवरील नियामक स्कोअरबोर्डबद्दल कोणताही प्रश्न विचारा.',
    suggestions: ['मला Fire NOC potrzeb?', 'setback नियम स्पष्ट करा.', 'मी 6 मजले बांधू शकतो?', 'माझा प्रोजेक्ट का नाकारला गेला?'],
    clearMessage: 'चॅट साफ करण्यात आली आहे. नगरपालिका इमारत कोड्स किंवा सक्रिय झोनिंग प्रोजेक्ट्सबद्दल आणखी एक प्रश्न विचारा.',
    errorMessage: 'Sarvam दस्तऐवज बुद्धिमत्तेशी कनेक्ट करताना त्रुटी आली. कृपया तुमचे नगरपालिका डेटाबेस लिंक तपासा.',
    loadingText: 'AI कॉम्प्लायन्स असिस्टंट प्रक्रिया करत आहे...',
    inputPlaceholder: 'AI ला विचारा: उदाहरणार्थ, setback नियम किंवा Fire NOC clearances...',
    speakLabel: 'बोला',
    speakingLabel: 'बोलत आहे...',
    assistantTitle: 'Sarvam AI असिस्टंट',
    assistantSubtitle: 'झोनिंग आणि कॉम्प्लायन्स सल्ला'
  },
  Punjabi: {
    initialMessage: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ Sarvam AI ਕਾਂਫਾਰਮੈਂਸ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਆਪਣੇ ਸਰਗਰਮ ਪ੍ਰੋਜੈਕਟ ਦੇ ਮਿਊਨਿਸਿਪਲ ਝੋਨਿੰਗ ਕੋਡਸ, FAR ਪਾਬੰਦੀਆਂ, setback ਨਿਯਮ, Fire NOC ਜਾਂ ਰੀਗੁਲੇਟਰੀ ਸਕੋਰਬੋਰਡ ਬਾਰੇ ਕੋਈ ਸਵਾਲ ਪੁੱਛੋ।',
    suggestions: ['ਕੀ ਮੈਨੂੰ Fire NOC ਚਾਹੀਦਾ ਹੈ?', 'setback ਨਿਯਮ ਸਮਝਾਓ।', 'ਕੀ ਮੈਂ 6 ਮੰਜ਼ਿਲਾਂ ਬਣਾ ਸਕਦਾ ਹਾਂ?', 'ਮੇਰਾ ਪ੍ਰੋਜੈਕਟ ਕਿਉਂ ਰੱਦ ਹੋ ਗਿਆ?'],
    clearMessage: 'ਚੈਟ ਸਾਫ਼ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ। ਮਿਊਨਿਸਿਪਲ ਬਿਲਡਿੰਗ ਕੋਡਸ ਜਾਂ ਸਰਗਰਮ ਝੋਨਿੰਗ ਪ੍ਰੋਜੈਕਟਸ ਬਾਰੇ ਇੱਕ ਹੋਰ ਸਵਾਲ ਪੁੱਛੋ।',
    errorMessage: 'Sarvam ਡੌਕਿਊਮੈਂਟ ਇੰਟੈਲਿਜੈਂਸ ਨਾਲ ਕਨੈਕਟ ਕਰਨ ਵੇਲੇ ਗਲਤੀ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਮਿਊਨਿਸਿਪਲ ਡੇਟਾਬੇਸ ਲਿੰਕਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।',
    loadingText: 'AI ਕਾਂਫਾਰਮੈਂਸ ਅਸਿਸਟੈਂਟ ਪ੍ਰੋਸੈਸ ਕਰ ਰਿਹਾ ਹੈ...',
    inputPlaceholder: 'AI ਤੋਂ ਪੁੱਛੋ: ਉਦਾਹਰਨ ਲਈ, setback ਨਿਯਮ ਜਾਂ Fire NOC clearances...',
    speakLabel: 'ਬੋਲੋ',
    speakingLabel: 'ਬੋਲ ਰਿਹਾ ਹੈ...',
    assistantTitle: 'Sarvam AI ਅਸਿਸਟੈਂਟ',
    assistantSubtitle: 'ਝੋਨਿੰਗ ਅਤੇ ਕਾਂਫਾਰਮੈਂਸ ਸਲਾਹ'
  },
  Bengali: {
    initialMessage: 'নমস্কার! আমি আপনার Sarvam AI কমপ্লায়েন্স অ্যাসিস্ট্যান্ট। পৌরসভা জোনিং কোড, FAR সীমা, সেটব্যাক নিয়ম, Fire NOC বা আপনার সক্রিয় প্রকল্পের নিয়ন্ত্রক স্কোরকার্ড সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন।',
    suggestions: ['আমার Fire NOC দরকার?', 'সেটব্যাক নিয়ম ব্যাখ্যা করুন।', 'আমি 6 তলা তৈরি করতে পারি?', 'আমার প্রকল্প কেন বাতিল করা হয়েছে?'],
    clearMessage: 'চ্যাট পরিষ্কার করা হয়েছে। পৌরসভা বিল্ডিং কোড বা সক্রিয় জোনিং প্রকল্প সম্পর্কে আরেকটি প্রশ্ন জিজ্ঞাসা করুন।',
    errorMessage: 'Sarvam ডকুমেন্ট ইন্টেলিজেন্সের সাথে সংযোগে ত্রুটি হয়েছে। অনুগ্রহ করে আপনার পৌরসভার ডাটাবেস লিঙ্ক যাচাই করুন।',
    loadingText: 'AI কমপ্লায়েন্স অ্যাসিস্ট্যান্ট প্রক্রিয়াকরণ করছে...',
    inputPlaceholder: 'AI-কে জিজ্ঞাসা করুন: উদাহরণস্বরূপ, সেটব্যাক নিয়ম বা Fire NOC clearances...',
    speakLabel: 'বলুন',
    speakingLabel: 'বলছে...',
    assistantTitle: 'Sarvam AI অ্যাসিস্ট্যান্ট',
    assistantSubtitle: 'জোনিং এবং কমপ্লায়েন্স পরামর্শ'
  },
  Odia: {
    initialMessage: 'ନମସ୍କାର! ମୁଁ ତୁମର Sarvam AI କମ୍ପ୍ଲାୟାନ୍ସ ଏସିଷ୍ଟାଣ୍ଟ। ପୁରସକାର ଜୋନିଙ୍ଗ କୋଡ୍, FAR ସୀମା, ସେଟବ୍ୟାକ୍ ନିୟମ, Fire NOC କିମ୍ବା ତୁମର ସକ୍ରିୟ ପ୍ରକଳ୍ପର ନିୟମନ ସ୍କୋରକାର୍ଡ ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।',
    suggestions: ['ମୋତେ Fire NOC ଆବଶ୍ୟକ କି?', 'ସେଟବ୍ୟାକ୍ ନିୟମ ବ୍ୟାଖ୍ୟା କରନ୍ତୁ।', 'ମୁଁ 6 ଟି ମଜଲା ନିର୍ମାଣ କରିପାରେ?', 'ମୋ ପ୍ରକଳ୍ପ କାହିଁକି ଅସ୍ୱୀକୃତ ହେଲା?'],
    clearMessage: 'ଚାଟ୍ ସଫ୍ କରାଗଲା। ପୁରସକାର ବିଲ୍ଡିଙ୍ଗ କୋଡ୍ କିମ୍ବା ସକ୍ରିୟ ଜୋନିଙ୍ଗ ପ୍ରକଳ୍ପ ବିଷୟରେ ଅନ୍ୟ ଏକ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।',
    errorMessage: 'Sarvam ଡକ୍ୟୁମେଣ୍ଟ୍ ଇଣ୍ଟେଲିଜେନ୍ସ ସହିତ ସଂଯୋଗ କରିବାରେ ତ୍ରୁଟି ହୋଇଛି। ଦୟାକରି ତୁମର ପୁରସକାର ଡାଟାବେସ୍ ଲିଙ୍କ୍ ସତ୍ୟାପିତ କରନ୍ତୁ।',
    loadingText: 'AI କମ୍ପ୍ଲାୟାନ୍ସ ଏସିଷ୍ଟାଣ୍ଟ ପ୍ରକ୍ରିୟା କରୁଛି...',
    inputPlaceholder: 'AI କୁ ପଚାରନ୍ତୁ: ଉଦାହରଣସ୍ୱରୂପ, ସେଟବ୍ୟାକ୍ ନିୟମ କିମ୍ବା Fire NOC clearances...',
    speakLabel: 'କହନ୍ତୁ',
    speakingLabel: 'କହୁଛି...',
    assistantTitle: 'Sarvam AI ଏସିଷ୍ଟାଣ୍ଟ',
    assistantSubtitle: 'ଜୋନିଙ୍ଗ ଏବଂ କମ୍ପ୍ଲାୟାନ୍ସ ପରାମର୍ଶ'
  },
  Assamese: {
    initialMessage: 'নমস্কাৰ! মই আপোনাৰ Sarvam AI কমপ্লায়েন্স এচিস্টেন্ট। পৌৰসভা জোনিং কোড, FAR সীমা, সেটব্যাক নিয়ম, Fire NOC বা আপোনাৰ সক্ৰিয় প্ৰকল্পৰ নিয়মিত স্কোৰকাৰ্ডৰ বিষয়ে প্রশ্ন সুধিব।',
    suggestions: ['আমাৰ Fire NOC লাগিবনে?', 'সেটব্যাক নিয়ম ব্যাখ্যা কৰক।', 'মই 6 তলা নির্মাণ কৰিব পাৰোঁ?', 'মোৰ প্ৰকল্প কেন বাতিল কৰা হ’ল?'],
    clearMessage: 'চেট পৰিষ্কাৰ কৰা হ’ল। পৌৰসভা বিল্ডিং কোড বা সক্ৰিয় জোনিং প্ৰকল্পৰ বিষয়ে আরেকটো প্ৰশ্ন সুধিব।',
    errorMessage: 'Sarvam ডকুমেন্ট ইণ্টেলিজেন্সৰ সৈতে সংযোগত ত্ৰুটি হৈছে। অনুগ্ৰহ কৰি আপোনাৰ পৌৰসভা ডাটাবেইচ লিংক পৰীক্ষা কৰক।',
    loadingText: 'AI কমপ্লায়েন্স এচিস্টেন্ট প্ৰক্ৰিয়াকৰণ কৰি আছে...',
    inputPlaceholder: 'AI-লৈ সুধিব: উদাহৰণস্বৰূপে, সেটব্যাক নিয়ম বা Fire NOC clearances...',
    speakLabel: 'বোলক',
    speakingLabel: 'বুলি আছে...',
    assistantTitle: 'Sarvam AI এচিস্টেন্ট',
    assistantSubtitle: 'জোনিং আৰু কমপ্লায়েন্স উপদেশ'
  }
};

export function getChatUiCopy(language: string): ChatUiCopy {
  const normalized = normalizeLanguageKey(language);
  return chatUiCopyByLanguage[normalized] || chatUiCopyByLanguage.English;
}

export function getChatLanguageHint(language: string): string {
  const normalized = normalizeLanguageKey(language);
  if (normalized === 'Hindi') return 'जवाब स्पष्ट, पेशेवर और हिंदी में दें.';
  if (normalized === 'Tamil') return 'பதில் தெளிவாகவும், தொழில்முறை ரீதியாகவும் தமிழில் வழங்கவும்.';
  if (normalized === 'Gujarati') return 'જવાબ મૂળભૂત અને વ્યવસાયિક ગુજરાતી ભાષામાં આપો.';
  if (normalized === 'Marathi') return 'उत्तर स्पष्ट, व्यावसायिक आणि मराठीमध्ये द्या.';
  if (normalized === 'Punjabi') return 'ਜਵਾਬ ਸਾਫ਼ ਅਤੇ ਪੇਸ਼ੇਵਰ ਤੌਰ ਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਦਿਓ.';
  if (normalized === 'Bengali') return 'উত্তর স্পষ্ট, পেশাদার এবং বাংলা ভাষায় দিন.';
  if (normalized === 'Odia') return 'ଉତ୍ତର ସ୍ପଷ୍ଟ ଏବଂ ପେଶାଦାରୀ ଭାଷାରେ ଓଡ଼ିଆ ଭାଷାରେ ଦିଅନ୍ତୁ।';
  if (normalized === 'Assamese') return 'উত্তৰ স্পষ্ট আৰু পেশাগতভাৱে অসমীয়া ভাষাত দিয়া।';
  return 'Answer clearly and professionally in English.';
}

export function getSpeechLanguageCode(language: string): string {
  const normalized = normalizeLanguageKey(language);
  const mapping: Record<string, string> = {
    Hindi: 'hi-IN',
    Tamil: 'ta-IN',
    Gujarati: 'gu-IN',
    Marathi: 'mr-IN',
    Punjabi: 'pa-IN',
    Kannada: 'kn-IN',
    Malayalam: 'ml-IN',
    Telugu: 'te-IN',
    Bengali: 'bn-IN',
    Odia: 'or-IN',
    Assamese: 'as-IN',
    English: 'en-US'
  };
  return mapping[normalized] || 'en-US';
}

export type AlertSeverity = 'YELLOW' | 'ORANGE' | 'RED';

export type AlertLanguage =
  | 'English'
  | 'Hindi'
  | 'Odia'
  | 'Bengali'
  | 'Telugu';

export type HazardType =
  | 'Flood'
  | 'Cyclone'
  | 'Heatwave'
  | 'Thunderstorm';

export interface OfficialEmergencyAlert {
  id: string;
  hazard: HazardType;
  severity: AlertSeverity;
  headline: string;
  body: string;
  affectedArea: string;
  issuedAt: string;
  validUntil: string;
  recommendedAction: string;
  source: string;
  sourceReference: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  geometryType?: 'circle' | 'polygon';
  polygonCoordinates?: [number, number][];
  isSynthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlertTranslation {
  language: AlertLanguage;
  headline: string;
  body: string;
  action: string;
  area: string;
}

export const SAMPLE_ALERTS: OfficialEmergencyAlert[] = [
  {
    id: 'SYN-FLD-OD-001',
    hazard: 'Flood',
    severity: 'ORANGE',
    headline:
      'Orange Alert: Heavy to Very Heavy Rainfall with Localised Flood Risk',
    body:
      'Heavy to very heavy rainfall is likely at isolated places during the next 24 hours. Low-lying areas and roads near rivers may experience waterlogging and rapid rise of water levels.',
    affectedArea:
      'Bhubaneswar, Khordha district and adjoining low-lying areas',
    issuedAt: '26 Sep 2026, 17:30 IST',
    validUntil: '27 Sep 2026, 17:30 IST',
    recommendedAction:
      'Avoid flooded roads, move away from river banks, follow local authority instructions and keep emergency supplies ready.',
    source: 'Sample emergency bulletin',
    sourceReference: 'SAMPLE-CAP-2026-09-26-1730',
    coordinates: {
      lat: 20.2961,
      lon: 85.8245,
    },
    isSynthetic: true,
    createdAt: '2026-09-26T17:30:00+05:30',
    updatedAt: '2026-09-26T17:30:00+05:30',
  },
  {
    id: 'SYN-CYC-IN-002',
    hazard: 'Cyclone',
    severity: 'RED',
    headline:
      'Red Alert: Cyclonic Winds and Very Heavy Rainfall Expected',
    body:
      'A severe weather system may produce damaging winds, very heavy rainfall and coastal inundation. Outdoor movement should be avoided in the affected zone.',
    affectedArea:
      'Coastal districts and exposed settlements within the marked warning area',
    issuedAt: '26 Sep 2026, 16:00 IST',
    validUntil: '27 Sep 2026, 22:00 IST',
    recommendedAction:
      'Stay indoors in a safe structure, secure loose objects, avoid the coast and follow evacuation or shelter instructions from local authorities.',
    source: 'Synthetic cyclone warning for demonstration',
    sourceReference: 'SYN-CAP-2026-09-26-1600',
    coordinates: {
      lat: 19.8135,
      lon: 85.8312,
    },
    isSynthetic: true,
    createdAt: '2026-09-26T16:00:00+05:30',
    updatedAt: '2026-09-26T16:00:00+05:30',
  },
  {
    id: 'SYN-HWV-NW-003',
    hazard: 'Heatwave',
    severity: 'YELLOW',
    headline:
      'Yellow Advisory: Severe Heatwave Conditions with Elevated Surface Temperatures',
    body:
      'Maximum temperatures are likely to remain 4.5°C to 6.4°C above normal. Prolonged heat exposure increases the risk of dehydration and heat-related stress.',
    affectedArea:
      'Northern plains, urban core districts and industrial corridors',
    issuedAt: '26 Sep 2026, 08:30 IST',
    validUntil: '27 Sep 2026, 19:00 IST',
    recommendedAction:
      'Drink plenty of fluids, avoid direct midday sun, check on elderly neighbors and keep drinking water available for animals.',
    source: 'Synthetic agromet-meteorological bulletin',
    sourceReference: 'SYN-CAP-2026-09-26-0830',
    coordinates: {
      lat: 28.6139,
      lon: 77.209,
    },
    isSynthetic: true,
    createdAt: '2026-09-26T08:30:00+05:30',
    updatedAt: '2026-09-26T08:30:00+05:30',
  },
  {
    id: 'SYN-THU-NE-004',
    hazard: 'Thunderstorm',
    severity: 'ORANGE',
    headline:
      'Orange Alert: Severe Thunderstorm with Lightning Gusts and Hail Potential',
    body:
      'Thunderstorm accompanied by frequent cloud-to-ground lightning and surface wind gusts reaching 50-60 km/h likely at scattered locations.',
    affectedArea:
      'Foothill valleys, sub-Himalayan belt and open rural agricultural tracts',
    issuedAt: '26 Sep 2026, 14:15 IST',
    validUntil: '27 Sep 2026, 02:00 IST',
    recommendedAction:
      'Unplug sensitive electronics, do not take shelter under solitary trees, avoid open water bodies and seek sturdy masonry shelter.',
    source: 'Synthetic nowcast radar advisory',
    sourceReference: 'SYN-CAP-2026-09-26-1415',
    coordinates: {
      lat: 26.1445,
      lon: 91.7362,
    },
    isSynthetic: true,
    createdAt: '2026-09-26T14:15:00+05:30',
    updatedAt: '2026-09-26T14:15:00+05:30',
  },
];

export const LANGUAGE_OPTIONS = [
  {
    id: 'English' as AlertLanguage,
    native: 'English',
    short: 'EN',
  },
  {
    id: 'Hindi' as AlertLanguage,
    native: 'हिन्दी',
    short: 'HI',
  },
  {
    id: 'Odia' as AlertLanguage,
    native: 'ଓଡ଼ିଆ',
    short: 'OD',
  },
  {
    id: 'Bengali' as AlertLanguage,
    native: 'বাংলা',
    short: 'BN',
  },
  {
    id: 'Telugu' as AlertLanguage,
    native: 'తెలుగు',
    short: 'TE',
  },
];

export const VISUAL_ACTIONS = [
  {
    icon: '🏠',
    label: 'Stay safe indoors',
    labelHi: 'सुरक्षित घर के अंदर रहें',
  },
  {
    icon: '🌊',
    label: 'Avoid flood water',
    labelHi: 'बाढ़ के पानी से दूर रहें',
  },
  {
    icon: '🚫',
    label: 'Do not cross rivers',
    labelHi: 'नदियों और नालों को पार न करें',
  },
  {
    icon: '📻',
    label: 'Follow local updates',
    labelHi: 'स्थानीय रेडियो/अपडेट सुनते रहें',
  },
  {
    icon: '🎒',
    label: 'Keep essentials ready',
    labelHi: 'दवा व जरूरी सामान तैयार रखें',
  },
  {
    icon: '👨‍👩‍👧',
    label: 'Help vulnerable people',
    labelHi: 'बुजुर्गों और बच्चों की मदद करें',
  },
];

export const TRANSLATIONS: Record<
  string,
  Partial<Record<AlertLanguage, AlertTranslation>>
> = {
  'SYN-FLD-OD-001': {
    English: {
      language: 'English',
      headline: 'Orange Alert: Heavy Rain and Flood Risk',
      body:
        'Very heavy rain may cause waterlogging and quickly rising water in low-lying areas and roads near rivers during the next 24 hours.',
      action:
        'Avoid flooded roads and river banks. Follow local instructions and keep emergency supplies ready.',
      area: 'Bhubaneswar, Khordha and nearby low-lying areas',
    },
    Hindi: {
      language: 'Hindi',
      headline: 'ऑरेंज अलर्ट: भारी बारिश और बाढ़ का खतरा',
      body:
        'अगले 24 घंटों में बहुत भारी बारिश से निचले इलाकों और नदियों के पास की सड़कों पर पानी भर सकता है और जलस्तर तेजी से बढ़ सकता है।',
      action:
        'डूबी हुई सड़कों और नदी किनारे से दूर रहें। स्थानीय निर्देशों का पालन करें और जरूरी सामान तैयार रखें।',
      area: 'भुवनेश्वर, खुर्दा और आसपास के निचले इलाके',
    },
    Odia: {
      language: 'Odia',
      headline: 'କମଳା ସତର୍କତା: ପ୍ରବଳ ବର୍ଷା ଓ ବନ୍ୟା ଆଶଙ୍କା',
      body:
        'ଆଗାମୀ 24 ଘଣ୍ଟାରେ ଅତି ପ୍ରବଳ ବର୍ଷା ହୋଇ ନିମ୍ନାଞ୍ଚଳ ଓ ନଦୀ ନିକଟ ସଡ଼କରେ ପାଣି ଜମିବାର ଆଶଙ୍କା ଅଛି।',
      action:
        'ପାଣି ଭରିଥିବା ସଡ଼କ ଓ ନଦୀ କୂଳରୁ ଦୂରେ ରୁହନ୍ତୁ। ସ୍ଥାନୀୟ ନିର୍ଦ୍ଦେଶ ମାନନ୍ତୁ।',
      area: 'ଭୁବନେଶ୍ୱର, ଖୋର୍ଦ୍ଧା ଏବଂ ନିକଟସ୍ଥ ନିମ୍ନାଞ୍ଚଳ',
    },
    Bengali: {
      language: 'Bengali',
      headline: 'কমলা সতর্কতা: ভারী বৃষ্টি ও বন্যার ঝুঁকি',
      body:
        'আগামী ২৪ ঘণ্টায় অতি ভারী বৃষ্টিতে নিচু এলাকা ও নদীর কাছের রাস্তায় জল জমতে পারে।',
      action:
        'জলমগ্ন রাস্তা ও নদীর পাড় এড়িয়ে চলুন এবং স্থানীয় নির্দেশ মেনে চলুন।',
      area: 'ভুবনেশ্বর, খোরদা এবং আশপাশের নিচু এলাকা',
    },
    Telugu: {
      language: 'Telugu',
      headline: 'ఆరెంజ్ అలర్ట్: భారీ వర్షం మరియు వరద ముప్పు',
      body:
        'తదుపరి 24 గంటల్లో భారీ వర్షాల వల్ల లోతట్టు ప్రాంతాలు మరియు నదుల సమీప రహదారుల్లో నీరు నిలవవచ్చు.',
      action:
        'నీటితో నిండిన రహదారులు మరియు నదీ తీరాలకు దూరంగా ఉండండి.',
      area:
        'భువనేశ్వర్, ఖోర్ధా మరియు సమీప లోతట్టు ప్రాంతాలు',
    },
  },
  'SYN-CYC-IN-002': {
    English: {
      language: 'English',
      headline: 'Red Alert: Dangerous Cyclonic Winds and Tidal Surge',
      body:
        'Severe cyclonic storm approaching coastal zones. Extreme winds exceeding 100 km/h, flash flooding and coastal surge expected.',
      action:
        'Stay indoors in sturdy masonry structures. Move away from coastal lines immediately. Keep phone charged and emergency battery ready.',
      area: 'Puri, Jagatsinghpur, Kendrapara coastal settlements',
    },
    Hindi: {
      language: 'Hindi',
      headline: 'रेड अलर्ट: भीषण चक्रवाती तूफान और तूफानी हवाएं',
      body:
        'तटीय क्षेत्रों की ओर गंभीर चक्रवाती तूफान बढ़ रहा है। 100 किमी/घंटा से अधिक की तेज हवाएं, भारी बारिश और तटीय लहरों का गंभीर खतरा है।',
      action:
        'पक्के मकान में सुरक्षित रहें। समुद्र तट से तुरंत दूर हटें। राहत शिविरों के निर्देशों का पालन करें।',
      area: 'पुरी, जगतसिंहपुर, केंद्रपाड़ा और निकटवर्ती तटीय बस्तियां',
    },
    Odia: {
      language: 'Odia',
      headline: 'ଲାଲ୍ ସତର୍କତା: ବିପଜ୍ଜନକ ବାତ୍ୟା ଓ ଉଚ୍ଚ ଜୁଆର',
      body:
        'ଉପକୂଳ ଆଡକୁ ପ୍ରଳୟଙ୍କରୀ ବାତ୍ୟା ଅଗ୍ରସର ହେଉଛି। ଘଣ୍ଟାପ୍ରତି 100 କିଲୋମିଟରରୁ ଅଧିକ ବେଗରେ ପବନ ଓ ପ୍ରବଳ ଜୁଆର ମାଡ଼ିଆସିବ।',
      action:
        'ପକ୍କା ଆଶ୍ରୟସ୍ଥଳୀରେ ରୁହନ୍ତୁ। ତୁରନ୍ତ ସମୁଦ୍ରକୂଳ ଛାଡି ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ।',
      area: 'ପୁରୀ, ଜଗତସିଂହପୁର, କେନ୍ଦ୍ରାପଡ଼ା ଉପକୂଳବର୍ତ୍ତୀ ଅଞ୍ଚଳ',
    },
    Bengali: {
      language: 'Bengali',
      headline: 'লাল সতর্কতা: বিধ্বংসী ঘূর্ণিঝড় ও প্রবল জলোচ্ছ্বাস',
      body:
        'উপকূলের দিকে ধেয়ে আসছে তীব্র ঘূর্ণিঝড়। ১০০ কিমি/ঘন্টার বেশি বেগে ঝড়ো হাওয়া ও ভারী বৃষ্টির চরম সতর্কতা।',
      action:
        'নিরাপদ পাকা আশ্রয়ে থাকুন। উপকূল অঞ্চল অবিলম্বে ত্যাগ করুন এবং স্থানীয় প্রশাসনের পরামর্শ শুনুন।',
      area: 'পুরী, জগতসিংহপুর, কেন্দ্রাপাড়া উপকূলবর্তী অঞ্চল',
    },
    Telugu: {
      language: 'Telugu',
      headline: 'రెడ్ అలర్ట్: తీవ్ర తుఫాను గాలులు మరియు భారీ వర్షాలు',
      body:
        'తీరప్రాంతం వైపు తీవ్ర తుఫాను దూసుకువస్తోంది. గంటకు 100 కి.మీ. వేగంతో గాలులు, వరద ప్రమాదం పొంచి ఉంది.',
      action:
        'పటిష్టమైన భవనాలలో సురక్షితంగా ఉండండి. తీరప్రాంతం విడిచిపెట్టి సహాయ శిబిరాలకు తరలివెళ్లండి.',
      area: 'పూరీ, జగత్సింగ్‌పూర్, కేంద్రపారా తీరప్రాంత గ్రామాలు',
    },
  },
  'SYN-HWV-NW-003': {
    English: {
      language: 'English',
      headline: 'Yellow Advisory: Extreme Daytime Heat Conditions',
      body:
        'Severe heatwave conditions with temperatures exceeding 44°C during peak sunlight hours. High risk of sunstroke and dehydration.',
      action:
        'Avoid outdoor exposure between 11 AM and 4 PM. Consume ORS, lemon water and wear light cotton clothing.',
      area: 'National Capital Region, Haryana and East Rajasthan plains',
    },
    Hindi: {
      language: 'Hindi',
      headline: 'येलो एडवाइजरी: दोपहर में भीषण लू और अत्यधिक गर्मी',
      body:
        'दोपहर के समय तापमान 44 डिग्री सेल्सियस से अधिक होने का अनुमान है। लू लगने और निर्जलीकरण का खतरा अधिक है।',
      action:
        'सुबह 11 बजे से शाम 4 बजे तक धूप में जाने से बचें। ओआरएस और पानी का अधिक सेवन करें।',
      area: 'राष्ट्रीय राजधानी क्षेत्र, हरियाणा और पूर्वी राजस्थान के मैदानी इलाके',
    },
    Odia: {
      language: 'Odia',
      headline: 'ହଳଦିଆ ସତର୍କତା: ଅଂଶୁଘାତ ଓ ତୀବ୍ର ଖରା',
      body:
        'ଦିନବେଳା ତାପମାତ୍ରା ୪୪ ଡିଗ୍ରୀ ଉପରକୁ ଯିବା ସମ୍ଭାବନା ଅଛି। ଅଂଶୁଘାତରୁ ବଞ୍ଚିବା ପାଇଁ ସାବଧାନ ରୁହନ୍ତୁ।',
      action:
        'ଦିନ ୧୧ଟାରୁ ଅପରାହ୍ନ ୪ଟା ଯାଏଁ ଖରାରେ ବାହାରକୁ ଯାଆନ୍ତୁ ନାହିଁ। ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ।',
      area: 'ଉତ୍ତର ସମତଳ ଅଞ୍ଚଳ ଓ ସହରାଞ୍ଚଳ',
    },
    Bengali: {
      language: 'Bengali',
      headline: 'হলুদ সতর্কতা: তীব্র দাবদাহ ও লু-এর সতর্কতা',
      body:
        'দিনের বেলায় তাপমাত্রা ৪৪ ডিগ্রি ছাড়িয়ে যেতে পারে। হিটস্ট্রোক ও ডিহাইড্রেশনের আশঙ্কা রয়েছে।',
      action:
        'বেলা ১১টা থেকে বিকেল ৪টা পর্যন্ত রোদে বের হবেন না। প্রচুর জল ও ওআরএস খান।',
      area: 'উত্তর ভারত সমভূমি ও সংশ্লিষ্ট শহরাঞ্চল',
    },
    Telugu: {
      language: 'Telugu',
      headline: 'ఎల్లో అడ్వైజరీ: తీవ్రమైన ఎండ మరియు వడగాల్పులు',
      body:
        'పగటి ఉష్ణోగ్రతలు 44 డిగ్రీలు దాటే అవకాశం ఉంది. వడదెబ్బ తగిలే ప్రమాదం ఎక్కువ.',
      action:
        'ఉదయం 11 నుండి సాయంత్రం 4 గంటల వరకు ఎండలో తిరగవద్దు. పుష్కలంగా నీరు త్రాగండి.',
      area: 'ఉత్తర మైదాన ప్రాంతాలు మరియు పరిసర జిల్లాలు',
    },
  },
  'SYN-THU-NE-004': {
    English: {
      language: 'English',
      headline: 'Orange Alert: Severe Lightning and Squall Winds',
      body:
        'Intense thunderstorm cells developing with frequent cloud-to-ground lightning strikes and gusty squalls up to 60 km/h.',
      action:
        'Seek indoor shelter immediately. Stay away from tall trees, metal poles, open fields and water bodies.',
      area: 'Brahmaputra valley districts and hill slopes',
    },
    Hindi: {
      language: 'Hindi',
      headline: 'ऑरेंज अलर्ट: तेज आंधी, आकाशीय बिजली और वज्रपात',
      body:
        'तेज हवाओं (60 किमी/घंटा) और भारी बिजली गिरने के साथ आंधी का खतरा। खुले स्थानों में रहना जानलेवा हो सकता है।',
      action:
        'तुरंत पक्के भवनों में शरण लें। ऊंचे पेड़ों और बिजली के खंभों से दूर रहें।',
      area: 'ब्रह्मपुत्र घाटी और आसपास के जिले',
    },
    Odia: {
      language: 'Odia',
      headline: 'କମଳା ସତର୍କତା: ଘଡ଼ଘଡ଼ି, ବିଜୁଳି ଓ କାଳବୈଶାଖୀ',
      body:
        '୬୦ କିମି ବେଗରେ ଝଡ଼ ପବନ ସହିତ ପ୍ରବଳ ବଜ୍ରପାତର ସମ୍ଭାବନା ଅଛି।',
      action:
        'ବିଜୁଳି ଘଡ଼ଘଡ଼ି ବେଳେ ଖୋଲା ପଡ଼ିଆ କିମ୍ବା ଗଛ ତଳେ ଆଶ୍ରୟ ନିଅନ୍ତୁ ନାହିଁ।',
      area: 'ଉପତ୍ୟକା ଓ ଗ୍ରାମାଞ୍ଚଳ',
    },
    Bengali: {
      language: 'Bengali',
      headline: 'কমলা সতর্কতা: বজ্রবিদ্যুৎ সহ কালবৈশাখীর সতর্কতা',
      body:
        'ঘন্টায় ৬০ কিমি বেগে ঝোড়ো হাওয়া ও ঘন ঘন বজ্রপাতের সম্ভাবনা রয়েছে।',
      action:
        'খোলা মাঠে বা গাছের তলায় দাঁড়াবেন না। নিরাপদ আশ্রয়ে থাকুন।',
      area: 'উপত্যকা ও পাহাড়ি অঞ্চল',
    },
    Telugu: {
      language: 'Telugu',
      headline: 'ఆరెంజ్ అలర్ట్: భారీ ఉరుములు, మెరుపులు మరియు ఈదురుగాలులు',
      body:
        'గంటకు 60 కి.మీ వేగంతో బలమైన గాలులు మరియు విస్తారమైన పిడుగులు పడే అవకాశం ఉంది.',
      action:
        'చెట్ల కింద నిలబడవద్దు. సురక్షితమైన భవనాలలో ఉండండి.',
      area: 'మైదాన మరియు కొండ ప్రాంతాలు',
    },
  },
};

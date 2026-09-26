export interface WeatherCity {
  id: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionCode: 'rain' | 'thunderstorm' | 'cloudy' | 'sunny' | 'fog' | 'cyclone';
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  precipitationChance: number;
  soilMoisture: number; // percentage
  tideCondition?: string;
  airQualityIndex: number;
  airQualityStatus: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  hourly: {
    time: string;
    temp: number;
    pop: number; // prob of precip
    icon: string;
  }[];
  forecast: {
    day: string;
    date: string;
    condition: string;
    high: number;
    low: number;
    rainProb: number;
    wind: number;
  }[];
}

export const MAUSAM_CITIES: WeatherCity[] = [
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    region: 'Eastern Coastal Plains',
    lat: 20.2961,
    lon: 85.8245,
    temp: 27,
    feelsLike: 31,
    condition: 'Heavy Monsoon Downpour',
    conditionCode: 'rain',
    high: 29,
    low: 24,
    humidity: 92,
    windSpeed: 28,
    windDirection: 'ESE',
    pressure: 998,
    uvIndex: 2,
    visibility: 4.2,
    dewPoint: 25,
    precipitationChance: 95,
    soilMoisture: 88,
    tideCondition: 'High Tide 3.4m at 18:40 IST',
    airQualityIndex: 38,
    airQualityStatus: 'Good',
    hourly: [
      { time: '17:00', temp: 27, pop: 95, icon: '🌧️' },
      { time: '18:00', temp: 26, pop: 90, icon: '🌧️' },
      { time: '19:00', temp: 26, pop: 85, icon: '⛈️' },
      { time: '20:00', temp: 25, pop: 80, icon: '🌧️' },
      { time: '21:00', temp: 25, pop: 70, icon: '🌧️' },
      { time: '22:00', temp: 25, pop: 60, icon: '☁️' },
      { time: '23:00', temp: 24, pop: 50, icon: '☁️' },
      { time: '00:00', temp: 24, pop: 40, icon: '☁️' },
    ],
    forecast: [
      { day: 'Today', date: '26 Sep', condition: 'Heavy Rain / Flood Advisory', high: 29, low: 24, rainProb: 95, wind: 28 },
      { day: 'Sun', date: '27 Sep', condition: 'Squally Winds & Rain', high: 28, low: 24, rainProb: 90, wind: 34 },
      { day: 'Mon', date: '28 Sep', condition: 'Moderate Showers', high: 30, low: 25, rainProb: 65, wind: 20 },
      { day: 'Tue', date: '29 Sep', condition: 'Scattered Cloud', high: 32, low: 26, rainProb: 35, wind: 14 },
      { day: 'Wed', date: '30 Sep', condition: 'Partly Cloudy', high: 33, low: 26, rainProb: 20, wind: 12 },
      { day: 'Thu', date: '01 Oct', condition: 'Humid & Sunny', high: 34, low: 26, rainProb: 15, wind: 10 },
      { day: 'Fri', date: '02 Oct', condition: 'Isolated Thunderstorm', high: 33, low: 25, rainProb: 45, wind: 16 },
    ],
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'National Capital Territory',
    region: 'Northern Plains',
    lat: 28.6139,
    lon: 77.209,
    temp: 34,
    feelsLike: 39,
    condition: 'Hazy Sunshine & Warm',
    conditionCode: 'sunny',
    high: 36,
    low: 26,
    humidity: 58,
    windSpeed: 12,
    windDirection: 'WNW',
    pressure: 1006,
    uvIndex: 8,
    visibility: 3.5,
    dewPoint: 22,
    precipitationChance: 10,
    soilMoisture: 38,
    airQualityIndex: 215,
    airQualityStatus: 'Poor',
    hourly: [
      { time: '17:00', temp: 34, pop: 10, icon: '☀️' },
      { time: '18:00', temp: 33, pop: 10, icon: '🌤️' },
      { time: '19:00', temp: 31, pop: 5, icon: '🌙' },
      { time: '20:00', temp: 30, pop: 5, icon: '🌙' },
      { time: '21:00', temp: 29, pop: 0, icon: '🌙' },
      { time: '22:00', temp: 28, pop: 0, icon: '🌙' },
      { time: '23:00', temp: 27, pop: 0, icon: '🌙' },
      { time: '00:00', temp: 27, pop: 0, icon: '🌙' },
    ],
    forecast: [
      { day: 'Today', date: '26 Sep', condition: 'Hazy & Warm', high: 36, low: 26, rainProb: 10, wind: 12 },
      { day: 'Sun', date: '27 Sep', condition: 'Sunny & Dry', high: 37, low: 26, rainProb: 5, wind: 14 },
      { day: 'Mon', date: '28 Sep', condition: 'Partly Cloudy', high: 35, low: 25, rainProb: 20, wind: 10 },
      { day: 'Tue', date: '29 Sep', condition: 'Scattered Clouds', high: 34, low: 24, rainProb: 25, wind: 12 },
      { day: 'Wed', date: '30 Sep', condition: 'Clear Sky', high: 35, low: 24, rainProb: 10, wind: 8 },
      { day: 'Thu', date: '01 Oct', condition: 'Dry Heat', high: 36, low: 25, rainProb: 5, wind: 10 },
      { day: 'Fri', date: '02 Oct', condition: 'Hazy Horizon', high: 36, low: 25, rainProb: 10, wind: 9 },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'Konkan Coast',
    lat: 19.076,
    lon: 72.8777,
    temp: 29,
    feelsLike: 35,
    condition: 'Passing Coastal Showers',
    conditionCode: 'rain',
    high: 31,
    low: 26,
    humidity: 84,
    windSpeed: 22,
    windDirection: 'WSW',
    pressure: 1004,
    uvIndex: 6,
    visibility: 6.0,
    dewPoint: 25,
    precipitationChance: 70,
    soilMoisture: 72,
    tideCondition: 'Low Tide 0.8m at 21:15 IST',
    airQualityIndex: 62,
    airQualityStatus: 'Satisfactory',
    hourly: [
      { time: '17:00', temp: 29, pop: 70, icon: '🌦️' },
      { time: '18:00', temp: 28, pop: 65, icon: '🌦️' },
      { time: '19:00', temp: 28, pop: 60, icon: '🌧️' },
      { time: '20:00', temp: 27, pop: 50, icon: '☁️' },
      { time: '21:00', temp: 27, pop: 40, icon: '☁️' },
      { time: '22:00', temp: 27, pop: 35, icon: '☁️' },
      { time: '23:00', temp: 26, pop: 30, icon: '☁️' },
      { time: '00:00', temp: 26, pop: 30, icon: '☁️' },
    ],
    forecast: [
      { day: 'Today', date: '26 Sep', condition: 'Coastal Showers', high: 31, low: 26, rainProb: 70, wind: 22 },
      { day: 'Sun', date: '27 Sep', condition: 'Scattered Rain', high: 30, low: 25, rainProb: 60, wind: 18 },
      { day: 'Mon', date: '28 Sep', condition: 'Passing Clouds', high: 31, low: 26, rainProb: 40, wind: 16 },
      { day: 'Tue', date: '29 Sep', condition: 'Humid & Bright', high: 32, low: 26, rainProb: 25, wind: 14 },
      { day: 'Wed', date: '30 Sep', condition: 'Partly Sunny', high: 32, low: 26, rainProb: 20, wind: 12 },
      { day: 'Thu', date: '01 Oct', condition: 'Pleasant Breeze', high: 33, low: 27, rainProb: 15, wind: 15 },
      { day: 'Fri', date: '02 Oct', condition: 'Light Coastal Mist', high: 32, low: 26, rainProb: 30, wind: 17 },
    ],
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'Gangetic Delta',
    lat: 22.5726,
    lon: 88.3639,
    temp: 28,
    feelsLike: 33,
    condition: 'Thunderstorm Cloud Bands',
    conditionCode: 'thunderstorm',
    high: 31,
    low: 25,
    humidity: 89,
    windSpeed: 24,
    windDirection: 'SE',
    pressure: 1001,
    uvIndex: 4,
    visibility: 5.0,
    dewPoint: 25,
    precipitationChance: 85,
    soilMoisture: 80,
    tideCondition: 'Hooghly Bore Tide 2.9m at 19:30 IST',
    airQualityIndex: 78,
    airQualityStatus: 'Satisfactory',
    hourly: [
      { time: '17:00', temp: 28, pop: 85, icon: '⛈️' },
      { time: '18:00', temp: 27, pop: 80, icon: '⛈️' },
      { time: '19:00', temp: 27, pop: 70, icon: '🌧️' },
      { time: '20:00', temp: 26, pop: 60, icon: '🌧️' },
      { time: '21:00', temp: 26, pop: 50, icon: '☁️' },
      { time: '22:00', temp: 25, pop: 40, icon: '☁️' },
      { time: '23:00', temp: 25, pop: 35, icon: '☁️' },
      { time: '00:00', temp: 25, pop: 30, icon: '☁️' },
    ],
    forecast: [
      { day: 'Today', date: '26 Sep', condition: 'Thunderstorm with Squalls', high: 31, low: 25, rainProb: 85, wind: 24 },
      { day: 'Sun', date: '27 Sep', condition: 'Heavy Showers', high: 29, low: 24, rainProb: 80, wind: 28 },
      { day: 'Mon', date: '28 Sep', condition: 'Scattered Rain', high: 31, low: 25, rainProb: 55, wind: 18 },
      { day: 'Tue', date: '29 Sep', condition: 'Cloudy & Humid', high: 32, low: 26, rainProb: 30, wind: 12 },
      { day: 'Wed', date: '30 Sep', condition: 'Warm Sun', high: 33, low: 26, rainProb: 20, wind: 10 },
      { day: 'Thu', date: '01 Oct', condition: 'Afternoon Rain', high: 33, low: 25, rainProb: 40, wind: 15 },
      { day: 'Fri', date: '02 Oct', condition: 'Partly Cloudy', high: 34, low: 26, rainProb: 25, wind: 11 },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'Coromandel Coast',
    lat: 13.0827,
    lon: 80.2707,
    temp: 32,
    feelsLike: 38,
    condition: 'Partly Cloudy & Humid',
    conditionCode: 'cloudy',
    high: 34,
    low: 27,
    humidity: 78,
    windSpeed: 16,
    windDirection: 'NE',
    pressure: 1008,
    uvIndex: 7,
    visibility: 7.0,
    dewPoint: 25,
    precipitationChance: 35,
    soilMoisture: 52,
    tideCondition: 'High Tide 1.2m at 17:50 IST',
    airQualityIndex: 54,
    airQualityStatus: 'Satisfactory',
    hourly: [
      { time: '17:00', temp: 32, pop: 35, icon: '⛅' },
      { time: '18:00', temp: 31, pop: 30, icon: '⛅' },
      { time: '19:00', temp: 30, pop: 25, icon: '🌙' },
      { time: '20:00', temp: 29, pop: 20, icon: '🌙' },
      { time: '21:00', temp: 29, pop: 15, icon: '🌙' },
      { time: '22:00', temp: 28, pop: 15, icon: '🌙' },
      { time: '23:00', temp: 28, pop: 10, icon: '🌙' },
      { time: '00:00', temp: 27, pop: 10, icon: '🌙' },
    ],
    forecast: [
      { day: 'Today', date: '26 Sep', condition: 'Humid & Overcast', high: 34, low: 27, rainProb: 35, wind: 16 },
      { day: 'Sun', date: '27 Sep', condition: 'Scattered Showers', high: 33, low: 26, rainProb: 50, wind: 18 },
      { day: 'Mon', date: '28 Sep', condition: 'Northeast Monsoon Prep', high: 32, low: 25, rainProb: 60, wind: 22 },
      { day: 'Tue', date: '29 Sep', condition: 'Rain Bands', high: 31, low: 25, rainProb: 75, wind: 25 },
      { day: 'Wed', date: '30 Sep', condition: 'Moderate Rain', high: 31, low: 25, rainProb: 65, wind: 20 },
      { day: 'Thu', date: '01 Oct', condition: 'Breezy & Cloudy', high: 32, low: 26, rainProb: 40, wind: 16 },
      { day: 'Fri', date: '02 Oct', condition: 'Sunny Spells', high: 33, low: 26, rainProb: 30, wind: 14 },
    ],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    region: 'Deccan Plateau',
    lat: 12.9716,
    lon: 77.5946,
    temp: 24,
    feelsLike: 25,
    condition: 'Pleasant & Overcast',
    conditionCode: 'cloudy',
    high: 27,
    low: 19,
    humidity: 75,
    windSpeed: 14,
    windDirection: 'WSW',
    pressure: 1012,
    uvIndex: 5,
    visibility: 8.5,
    dewPoint: 19,
    precipitationChance: 40,
    soilMoisture: 65,
    airQualityIndex: 42,
    airQualityStatus: 'Good',
    hourly: [
      { time: '17:00', temp: 24, pop: 40, icon: '⛅' },
      { time: '18:00', temp: 23, pop: 45, icon: '🌦️' },
      { time: '19:00', temp: 22, pop: 35, icon: '☁️' },
      { time: '20:00', temp: 21, pop: 25, icon: '☁️' },
      { time: '21:00', temp: 21, pop: 20, icon: '🌙' },
      { time: '22:00', temp: 20, pop: 15, icon: '🌙' },
      { time: '23:00', temp: 20, pop: 10, icon: '🌙' },
      { time: '00:00', temp: 19, pop: 10, icon: '🌙' },
    ],
    forecast: [
      { day: 'Today', date: '26 Sep', condition: 'Overcast & Cool', high: 27, low: 19, rainProb: 40, wind: 14 },
      { day: 'Sun', date: '27 Sep', condition: 'Evening Drizzle', high: 26, low: 19, rainProb: 55, wind: 15 },
      { day: 'Mon', date: '28 Sep', condition: 'Gentle Breeze', high: 27, low: 18, rainProb: 30, wind: 12 },
      { day: 'Tue', date: '29 Sep', condition: 'Pleasant Sun', high: 28, low: 18, rainProb: 20, wind: 10 },
      { day: 'Wed', date: '30 Sep', condition: 'Fair Weather', high: 28, low: 19, rainProb: 15, wind: 11 },
      { day: 'Thu', date: '01 Oct', condition: 'Scattered Cloud', high: 29, low: 19, rainProb: 25, wind: 13 },
      { day: 'Fri', date: '02 Oct', condition: 'Light Shower', high: 27, low: 19, rainProb: 45, wind: 14 },
    ],
  },
];

// Active Cyclone Tracking Data (Bay of Bengal / Arabian Sea)
export interface CycloneSystem {
  id: string;
  name: string;
  category: 'Depression' | 'Deep Depression' | 'Cyclonic Storm' | 'Severe Cyclonic Storm' | 'Very Severe Cyclonic Storm';
  basin: 'Bay of Bengal' | 'Arabian Sea';
  lat: number;
  lon: number;
  maxWindSpeedKm: number;
  maxWindSpeedKnots: number;
  centralPressureHpa: number;
  movementSpeedKm: number;
  movementDirection: string;
  projectedLandfall: string;
  intensityStage: 'Stage 4: Cyclone Alert (Yellow)' | 'Stage 5: Cyclone Warning (Orange)' | 'Stage 6: Post-Landfall Outlook (Red)';
  evacuationStatus: 'Shelters Open (Khordha, Jagatsinghpur, Puri, Kendrapara)';
  coordinatesPath: { lat: number; lon: number; time: string; stage: string }[];
}

export const ACTIVE_CYCLONE: CycloneSystem = {
  id: 'BOB-04-2026',
  name: 'Cyclonic Storm "SAGAR-VEER"',
  category: 'Very Severe Cyclonic Storm',
  basin: 'Bay of Bengal',
  lat: 19.45,
  lon: 86.4,
  maxWindSpeedKm: 125,
  maxWindSpeedKnots: 68,
  centralPressureHpa: 984,
  movementSpeedKm: 18,
  movementDirection: 'North-Northwestwards',
  projectedLandfall: 'Between Puri and Dhamra Port, Odisha (Expected within 18 hrs)',
  intensityStage: 'Stage 6: Post-Landfall Outlook (Red)',
  evacuationStatus: 'Shelters Open (Khordha, Jagatsinghpur, Puri, Kendrapara)',
  coordinatesPath: [
    { lat: 15.2, lon: 89.5, time: '24 Sep 08:30', stage: 'Deep Depression' },
    { lat: 16.8, lon: 88.2, time: '25 Sep 05:30', stage: 'Cyclonic Storm' },
    { lat: 18.2, lon: 87.1, time: '25 Sep 17:30', stage: 'Severe Cyclonic Storm' },
    { lat: 19.45, lon: 86.4, time: '26 Sep 17:30 (Current)', stage: 'Very Severe CS' },
    { lat: 20.4, lon: 85.9, time: '27 Sep 05:30 (Forecast)', stage: 'Landfall Zone' },
  ],
};

// Doppler Weather Radar stations
export interface RadarStation {
  id: string;
  name: string;
  state: string;
  frequency: string;
  rangeKm: number;
  currentEchoDbz: number;
  precipitationEcho: string;
}

export const RADAR_STATIONS: RadarStation[] = [
  { id: 'dwr-bbs', name: 'Bhubaneswar DWR', state: 'Odisha', frequency: 'C-Band (5.6 GHz)', rangeKm: 250, currentEchoDbz: 54, precipitationEcho: 'Very Heavy Convective Cores' },
  { id: 'dwr-ccu', name: 'Kolkata (Alipore) DWR', state: 'West Bengal', frequency: 'S-Band (2.8 GHz)', rangeKm: 300, currentEchoDbz: 46, precipitationEcho: 'Squall Line & Rain Bands' },
  { id: 'dwr-del', name: 'Delhi (Palam) DWR', state: 'Delhi NCR', frequency: 'S-Band (2.8 GHz)', rangeKm: 250, currentEchoDbz: 18, precipitationEcho: 'Clear to Light Cirrus' },
  { id: 'dwr-bom', name: 'Mumbai (Colaba) DWR', state: 'Maharashtra', frequency: 'S-Band (2.8 GHz)', rangeKm: 250, currentEchoDbz: 38, precipitationEcho: 'Coastal Influx Cells' },
  { id: 'dwr-maa', name: 'Chennai DWR', state: 'Tamil Nadu', frequency: 'S-Band (2.8 GHz)', rangeKm: 250, currentEchoDbz: 28, precipitationEcho: 'Scattered Maritime Echoes' },
];

// Agromet (Gramin Krishi Mausam Sewa) Advisory
export interface AgrometAdvisory {
  crop: string;
  variety: string;
  stage: string;
  soilMoistureStatus: string;
  irrigationNotice: string;
  pestRisk: string;
  recommendedAction: string;
}

export const AGROMET_ADVISORIES: AgrometAdvisory[] = [
  {
    crop: 'Paddy (Kharif Rice)',
    variety: 'Swarna / Pooja / MTU-1010',
    stage: 'Tillering to Panicle Initiation',
    soilMoistureStatus: 'Excessively Saturated (88%) due to heavy downpours',
    irrigationNotice: 'Suspend all artificial irrigation immediately. Open field drainage channels to prevent water stagnation.',
    pestRisk: 'High risk of Bacterial Leaf Blight & Sheath Rot under persistent humidity.',
    recommendedAction: 'Provide drain outlets at field bunds. Avoid applying nitrogenous fertilizer until floodwater recedes.',
  },
  {
    crop: 'Vegetables (Brinjal, Chilli, Okra)',
    variety: 'Hybrid F1',
    stage: 'Vegetative to Flowering',
    soilMoistureStatus: 'Waterlogged',
    irrigationNotice: 'Ensure urgent furrow drainage. Waterlogging exceeding 12 hours causes root asphyxiation.',
    pestRisk: 'Damping off and wilt diseases.',
    recommendedAction: 'Stake vegetable plants to prevent lodging from wind squalls. Spray Trichoderma viride post-rains.',
  },
  {
    crop: 'Sugarcane',
    variety: 'Co-0238',
    stage: 'Grand Growth Phase',
    soilMoistureStatus: 'High Moisture',
    irrigationNotice: 'No irrigation needed. Ensure perimeter trenching.',
    pestRisk: 'Early shoot borer and red rot in stagnated areas.',
    recommendedAction: 'Wrap and tie sugarcane clumps together to prevent lodging from 60+ km/h gusts.',
  },
  {
    crop: 'Groundnut & Pulses (Blackgram)',
    variety: 'PU-31 / T-9',
    stage: 'Pod Formation',
    soilMoistureStatus: 'Saturated',
    irrigationNotice: 'Drain standing water within 6 hours.',
    pestRisk: 'Cercospora leaf spot and collar rot.',
    recommendedAction: 'Avoid machinery movement on wet fields to preserve soil aeration and crumb structure.',
  },
];

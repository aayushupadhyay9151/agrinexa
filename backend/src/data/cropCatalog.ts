export interface CropStageDefinition {
  name: string;
  stageOrder: number;
  durationPercent: number; // percentage of total duration
  description: string;
  idealTempMin: number;
  idealTempMax: number;
  waterSensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilities: string[];
}

export interface FertilizerStagePlan {
  stage: string;
  nutrient: string;
  description: string;
  recommendedInputs: string[];
  purpose: string;
}

export interface MachineryRequirement {
  cropStage: string;
  equipment: string;
  purpose: string;
  timingWindow: string;
}

export interface CropProfile {
  id: string;
  name: string;
  scientific_name: string;
  category: 'Cereal / Grain' | 'Pulse / Legume' | 'Oilseed' | 'Cash / Fiber' | 'Vegetable / Tuber' | 'Spice / Plantation' | 'Custom Crop';
  duration_min: number;
  duration_max: number;
  temp_min: number;
  temp_max: number;
  temp_ideal_min: number;
  temp_ideal_max: number;
  rainfall_ideal_min: number;
  rainfall_ideal_max: number;
  humidity_ideal_min: number;
  humidity_ideal_max: number;
  soil_types: string[];
  soil_ph_min: number;
  soil_ph_max: number;
  seasons: string[];
  water_need: 'Low' | 'Medium' | 'High' | 'Very High';
  stages: CropStageDefinition[];
  fertilizerPlan: FertilizerStagePlan[];
  machinery: MachineryRequirement[];
}

export const CROP_CATALOG: CropProfile[] = [
  // 1. WHEAT
  {
    id: 'wheat',
    name: 'Wheat',
    scientific_name: 'Triticum aestivum',
    category: 'Cereal / Grain',
    duration_min: 110,
    duration_max: 135,
    temp_min: 8,
    temp_max: 30,
    temp_ideal_min: 15,
    temp_ideal_max: 23,
    rainfall_ideal_min: 350,
    rainfall_ideal_max: 600,
    humidity_ideal_min: 45,
    humidity_ideal_max: 70,
    soil_types: ['Loam', 'Clay Loam', 'Alluvial', 'Silt Loam'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.5,
    seasons: ['Rabi / Winter', 'Spring'],
    water_need: 'Medium',
    stages: [
      { name: 'Germination & Emergence', stageOrder: 1, durationPercent: 8, description: 'Coleoptile emergence and root establishment.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'Medium', vulnerabilities: ['Seed rotting in soggy soil', 'Crusting'] },
      { name: 'Crown Root Initiation (CRI)', stageOrder: 2, durationPercent: 12, description: 'Formation of permanent nodal root system. Most critical watering point.', idealTempMin: 16, idealTempMax: 22, waterSensitivity: 'Critical', vulnerabilities: ['Drought stress delays tillering'] },
      { name: 'Tillering & Vegetative Growth', stageOrder: 3, durationPercent: 20, description: 'Rapid stem elongation and tiller formation.', idealTempMin: 15, idealTempMax: 20, waterSensitivity: 'High', vulnerabilities: ['Nutrient deficiency', 'Weed competition'] },
      { name: 'Jointing & Booting', stageOrder: 4, durationPercent: 18, description: 'Inflorescence development inside flag leaf sheath.', idealTempMin: 15, idealTempMax: 22, waterSensitivity: 'High', vulnerabilities: ['Frost damage to young spikes'] },
      { name: 'Flowering & Anthesis', stageOrder: 5, durationPercent: 12, description: 'Pollen shedding and fertilization.', idealTempMin: 16, idealTempMax: 22, waterSensitivity: 'Critical', vulnerabilities: ['Heat stress (>28°C causes floret sterility)', 'Rain during anthesis'] },
      { name: 'Grain Filling & Milking', stageOrder: 6, durationPercent: 18, description: 'Starch accumulation in developing kernels.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'Medium', vulnerabilities: ['Terminal heat stress', 'Premature dry wind desiccation'] },
      { name: 'Maturity & Ripening', stageOrder: 7, durationPercent: 12, description: 'Grain drying and hardening down to 12-14% moisture.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Unseasonal rains causing lodging or grain sprouting'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal / Sowing', nutrient: 'N: 30%, P: 100%, K: 100%', purpose: 'Root development and early vigor', recommendedInputs: ['DAP / NPK 12:32:16', 'Farmyard Manure / Compost', 'Zinc Sulphate'], description: 'Apply deep into the soil furrow at the time of seed sowing.' },
      { stage: 'First Irrigation (CRI Stage ~Day 21)', nutrient: 'N: 35%', purpose: 'Stimulate strong crown root and tiller density', recommendedInputs: ['Urea top-dressing'], description: 'Broadcast evenly before or immediately after the crown root irrigation.' },
      { stage: 'Jointing Stage (~Day 45-50)', nutrient: 'N: 35%', purpose: 'Boost spike size and flag leaf chlorophyll', recommendedInputs: ['Urea top-dressing', 'Optional micronutrient foliar spray'], description: 'Ensure adequate soil moisture prior to application.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor with Disc Harrow & Cultivator / Rotavator', purpose: 'Pulverize soil to a fine tilth and level seedbed', timingWindow: '10–14 days before planting' },
      { cropStage: 'Sowing', equipment: 'Zero-Till Seed-cum-Fertilizer Drill', purpose: 'Uniform seed depth (4-5 cm) and simultaneous basal fertilizer placement', timingWindow: 'Day 0' },
      { cropStage: 'Crop Maintenance & Spraying', equipment: 'Boom Sprayer / Knapsack Sprayer', purpose: 'Herbicide and weed control at 30-35 days; preventive fungicide if rust is detected', timingWindow: 'Days 25–45' },
      { cropStage: 'Harvesting', equipment: 'Combine Harvester or Reaper-Binder', purpose: 'Quick, shatter-free cutting and threshing when grain reaches 14% moisture', timingWindow: 'Days 115–130' }
    ]
  },

  // 2. RICE / PADDY
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    scientific_name: 'Oryza sativa',
    category: 'Cereal / Grain',
    duration_min: 120,
    duration_max: 150,
    temp_min: 18,
    temp_max: 38,
    temp_ideal_min: 22,
    temp_ideal_max: 32,
    rainfall_ideal_min: 1000,
    rainfall_ideal_max: 1800,
    humidity_ideal_min: 65,
    humidity_ideal_max: 85,
    soil_types: ['Clay', 'Clay Loam', 'Silty Clay', 'Alluvial'],
    soil_ph_min: 5.5,
    soil_ph_max: 7.2,
    seasons: ['Kharif / Monsoon', 'Boro / Summer'],
    water_need: 'Very High',
    stages: [
      { name: 'Nursery & Seedling', stageOrder: 1, durationPercent: 15, description: 'Raising vigorous seedlings in wet nursery bed.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'High', vulnerabilities: ['Damping off', 'Cold injury'] },
      { name: 'Transplanting & Recovery', stageOrder: 2, durationPercent: 8, description: 'Transplanting into puddled field and root anchorage.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Critical', vulnerabilities: ['Prolonged shock if field dries'] },
      { name: 'Active Tillering', stageOrder: 3, durationPercent: 22, description: 'Substantial production of vegetative panicle-bearing tillers.', idealTempMin: 25, idealTempMax: 32, waterSensitivity: 'High', vulnerabilities: ['Blast disease in excessive humidity', 'Stem borer'] },
      { name: 'Panicle Initiation & Booting', stageOrder: 4, durationPercent: 18, description: 'Embryonic panicle formation inside the leaf sheath.', idealTempMin: 25, idealTempMax: 32, waterSensitivity: 'Critical', vulnerabilities: ['Water deficit causes spikelet sterility'] },
      { name: 'Heading & Flowering', stageOrder: 5, durationPercent: 12, description: 'Panicle emergence and cross-pollination.', idealTempMin: 26, idealTempMax: 32, waterSensitivity: 'Critical', vulnerabilities: ['Rain during anthesis washes pollen', 'Temperatures >35°C reduce fertility'] },
      { name: 'Milk & Dough Stage', stageOrder: 6, durationPercent: 15, description: 'Grain carbohydrate synthesis and hardening.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Medium', vulnerabilities: ['Bacterial blight', 'Brown plant hopper'] },
      { name: 'Maturity & Field Drying', stageOrder: 7, durationPercent: 10, description: 'Golden yellow panicles; drainage of standing water.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Lodging from cyclones/excess wind'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal (Puddling)', nutrient: 'N: 25%, P: 100%, K: 50%', purpose: 'Root development and vigorous seedling start', recommendedInputs: ['SSP / DAP', 'MOP (Muriate of Potash)', 'Zinc Sulphate 25 kg/ha'], description: 'Incorporate into puddled mud just prior to final leveling.' },
      { stage: 'Active Tillering (~Day 20-25)', nutrient: 'N: 50%', purpose: 'Maximize productive panicle tillers', recommendedInputs: ['Neem coated urea'], description: 'Apply in drained or shallow water depth.' },
      { stage: 'Panicle Initiation (~Day 45-55)', nutrient: 'N: 25%, K: 50%', purpose: 'Grain count per panicle and test weight', recommendedInputs: ['Urea + Potash top-dressing'], description: 'Maintain 3-5 cm water layer.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor with Cage Wheels / Power Puddler', purpose: 'Puddling to create an impervious subsoil hardpan and retain standing water', timingWindow: '3–5 days before transplanting' },
      { cropStage: 'Transplanting', equipment: 'Mechanical Paddy Transplanter or Manual Line Transplanter', purpose: 'Standard 20x15 cm spacing with 2-3 seedlings per hill', timingWindow: 'Days 20–25 of seedling age' },
      { cropStage: 'Inter-culture', equipment: 'Cono-Weeder / Motorized Paddy Weeder', purpose: 'Uproot aquatic weeds and aerate root zone', timingWindow: 'Days 15 & 30 after transplanting' },
      { cropStage: 'Harvesting', equipment: 'Track-Type Paddy Combine Harvester', purpose: 'Efficient cutting and threshing in wet soil conditions', timingWindow: 'Days 120–145' }
    ]
  },

  // 3. MAIZE
  {
    id: 'maize',
    name: 'Maize (Corn)',
    scientific_name: 'Zea mays',
    category: 'Cereal / Grain',
    duration_min: 95,
    duration_max: 120,
    temp_min: 15,
    temp_max: 35,
    temp_ideal_min: 20,
    temp_ideal_max: 30,
    rainfall_ideal_min: 500,
    rainfall_ideal_max: 850,
    humidity_ideal_min: 50,
    humidity_ideal_max: 75,
    soil_types: ['Loam', 'Sandy Loam', 'Deep Silt Loam'],
    soil_ph_min: 5.8,
    soil_ph_max: 7.2,
    seasons: ['Kharif', 'Rabi', 'Spring'],
    water_need: 'Medium',
    stages: [
      { name: 'Emergence & V2', stageOrder: 1, durationPercent: 10, description: 'Radicle emergence and first collar leaves.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Medium', vulnerabilities: ['Waterlogging causes rapid yellowing'] },
      { name: 'Knee-High / Rapid Vegetative', stageOrder: 2, durationPercent: 25, description: 'Fast internode elongation and leaf expansion.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'High', vulnerabilities: ['Fall Armyworm damage', 'Nitrogen deficiency'] },
      { name: 'Tasseling & Silking', stageOrder: 3, durationPercent: 20, description: 'Male tassel pollen shed and female silk receptivity.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Critical', vulnerabilities: ['Desiccation from hot dry winds (>35°C delays silking)'] },
      { name: 'Blister & Milk Stage', stageOrder: 4, durationPercent: 20, description: 'Kernel starch filling with watery/milky fluid.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'High', vulnerabilities: ['Moisture stress reduces kernel number per ear'] },
      { name: 'Dent & Black Layer (Maturity)', stageOrder: 5, durationPercent: 25, description: 'Kernel denting and black physiological maturity seal.', idealTempMin: 18, idealTempMax: 26, waterSensitivity: 'Low', vulnerabilities: ['Ear rot if humid rains persist'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Application', nutrient: 'N: 25%, P: 100%, K: 100%', purpose: 'Early root expansion', recommendedInputs: ['NPK 12:32:16 or DAP + MOP', 'Zinc Sulphate'], description: 'Apply 5 cm to side and below seed line.' },
      { stage: 'Knee-High Stage (V6)', nutrient: 'N: 50%', purpose: 'Rapid biomass and cob formation', recommendedInputs: ['Urea top-dressing'], description: 'Band placement near root zone followed by light irrigation.' },
      { stage: 'Tasseling Stage', nutrient: 'N: 25%', purpose: 'Sustain grain weight and filling', recommendedInputs: ['Urea'], description: 'Apply before tasseling during soil moisture availability.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor with Subsoiler / Chisel Plow + Disc Harrow', purpose: 'Break hardpan for deep taproots and ensure drainage', timingWindow: '7–10 days before planting' },
      { cropStage: 'Sowing', equipment: 'Pneumatic Precision Planter / Ridge Planter', purpose: 'Accurate spacing (60x20 cm) and ridge sowing for flood protection', timingWindow: 'Day 0' },
      { cropStage: 'Inter-culture', equipment: 'Tractor-drawn Ridge Cultivator / Inter-row Weeder', purpose: 'Earthing-up around plant base to prevent lodging', timingWindow: 'Days 25–30' },
      { cropStage: 'Harvesting', equipment: 'Maize Cob Harvester / Sheller', purpose: 'Strip cobs and de-husk with low grain breakage', timingWindow: 'Days 100–115' }
    ]
  },

  // 4. BARLEY
  {
    id: 'barley',
    name: 'Barley',
    scientific_name: 'Hordeum vulgare',
    category: 'Cereal / Grain',
    duration_min: 90,
    duration_max: 115,
    temp_min: 6,
    temp_max: 28,
    temp_ideal_min: 12,
    temp_ideal_max: 20,
    rainfall_ideal_min: 250,
    rainfall_ideal_max: 500,
    humidity_ideal_min: 40,
    humidity_ideal_max: 65,
    soil_types: ['Loam', 'Sandy Loam', 'Saline / Alkaline Tolerant Soils'],
    soil_ph_min: 6.5,
    soil_ph_max: 8.5,
    seasons: ['Rabi / Winter'],
    water_need: 'Low',
    stages: [
      { name: 'Emergence', stageOrder: 1, durationPercent: 10, description: 'Rapid seedling establishment in cool weather.', idealTempMin: 14, idealTempMax: 20, waterSensitivity: 'Medium', vulnerabilities: ['Damping off'] },
      { name: 'Tillering', stageOrder: 2, durationPercent: 25, description: 'Profuse secondary shoot formation.', idealTempMin: 12, idealTempMax: 18, waterSensitivity: 'High', vulnerabilities: ['Aphids'] },
      { name: 'Heading & Flowering', stageOrder: 3, durationPercent: 25, description: 'Spikelet emergence and pollination.', idealTempMin: 15, idealTempMax: 20, waterSensitivity: 'Critical', vulnerabilities: ['Frost during heading'] },
      { name: 'Grain Filling', stageOrder: 4, durationPercent: 25, description: 'Malt quality starch accumulation.', idealTempMin: 16, idealTempMax: 22, waterSensitivity: 'Medium', vulnerabilities: ['Terminal heat'] },
      { name: 'Maturity', stageOrder: 5, durationPercent: 15, description: 'Grain drying and hardening.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'Low', vulnerabilities: ['Shattering'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal', nutrient: 'N: 50%, P: 100%, K: 100%', purpose: 'Deep rooting', recommendedInputs: ['NPK 12:32:16'], description: 'Apply at sowing' },
      { stage: 'First Irrigation', nutrient: 'N: 50%', purpose: 'Tiller numbers', recommendedInputs: ['Urea'], description: 'Apply around Day 30' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Cultivator + Planker', purpose: 'Level firm seedbed', timingWindow: '5 days before sowing' },
      { cropStage: 'Sowing', equipment: 'Seed Drill', purpose: 'Standard 22.5 cm rows', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Combine Harvester', purpose: 'Direct cutting at 13% grain moisture', timingWindow: 'Days 95–110' }
    ]
  },

  // 5. PEARL MILLET (BAJRA)
  {
    id: 'pearl-millet',
    name: 'Pearl Millet (Bajra)',
    scientific_name: 'Pennisetum glaucum',
    category: 'Cereal / Grain',
    duration_min: 75,
    duration_max: 95,
    temp_min: 20,
    temp_max: 42,
    temp_ideal_min: 28,
    temp_ideal_max: 36,
    rainfall_ideal_min: 300,
    rainfall_ideal_max: 550,
    humidity_ideal_min: 30,
    humidity_ideal_max: 60,
    soil_types: ['Sandy', 'Sandy Loam', 'Light Alluvial'],
    soil_ph_min: 6.5,
    soil_ph_max: 8.5,
    seasons: ['Kharif / Monsoon', 'Summer'],
    water_need: 'Low',
    stages: [
      { name: 'Emergence', stageOrder: 1, durationPercent: 10, description: 'Rapid germination in warm sandy soil.', idealTempMin: 28, idealTempMax: 35, waterSensitivity: 'Low', vulnerabilities: ['Shoot fly'] },
      { name: 'Vegetative Tillering', stageOrder: 2, durationPercent: 30, description: 'Drought-hardy stem and tillers.', idealTempMin: 28, idealTempMax: 36, waterSensitivity: 'Medium', vulnerabilities: ['Downy mildew'] },
      { name: 'Flowering & Booting', stageOrder: 3, durationPercent: 25, description: 'Cylindrical earhead pollination.', idealTempMin: 28, idealTempMax: 35, waterSensitivity: 'Critical', vulnerabilities: ['Ergot during cloudy rains'] },
      { name: 'Grain Development', stageOrder: 4, durationPercent: 20, description: 'Pearl-like grain formation.', idealTempMin: 26, idealTempMax: 34, waterSensitivity: 'Low', vulnerabilities: ['Smut'] },
      { name: 'Harvest Maturity', stageOrder: 5, durationPercent: 15, description: 'Earheads turn grayish brown.', idealTempMin: 26, idealTempMax: 35, waterSensitivity: 'Low', vulnerabilities: ['Bird damage'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal', nutrient: 'N: 50%, P: 100%, K: 100%', purpose: 'Establishment in poor soils', recommendedInputs: ['DAP + MOP', 'Zinc'], description: 'Apply in furrow' },
      { stage: 'Top Dressing (~Day 30)', nutrient: 'N: 50%', purpose: 'Earhead size', recommendedInputs: ['Urea'], description: 'Apply after weeding' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor Cultivator', purpose: 'Conserve sub-surface moisture', timingWindow: '3 days prior' },
      { cropStage: 'Sowing', equipment: 'Seed Drill with fine seed attachment', purpose: 'Shallow 2-3 cm sowing', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Reaper / Manual Earhead Cutting', purpose: 'Cut ripe earheads', timingWindow: 'Days 80–90' }
    ]
  },

  // 6. CHICKPEA (GRAM)
  {
    id: 'chickpea',
    name: 'Chickpea (Gram)',
    scientific_name: 'Cicer arietinum',
    category: 'Pulse / Legume',
    duration_min: 95,
    duration_max: 120,
    temp_min: 10,
    temp_max: 30,
    temp_ideal_min: 18,
    temp_ideal_max: 25,
    rainfall_ideal_min: 300,
    rainfall_ideal_max: 500,
    humidity_ideal_min: 40,
    humidity_ideal_max: 65,
    soil_types: ['Deep Loam', 'Clay Loam', 'Black Soil'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.8,
    seasons: ['Rabi / Winter'],
    water_need: 'Low',
    stages: [
      { name: 'Emergence & Seedling', stageOrder: 1, durationPercent: 12, description: 'Branching and root nodulation.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'Low', vulnerabilities: ['Collar rot'] },
      { name: 'Vegetative Branching', stageOrder: 2, durationPercent: 28, description: 'Dense bush canopy formation.', idealTempMin: 16, idealTempMax: 22, waterSensitivity: 'Medium', vulnerabilities: ['Ascochyta blight'] },
      { name: 'Flowering & Pod Setting', stageOrder: 3, durationPercent: 30, description: 'Self-pollination and pod development.', idealTempMin: 18, idealTempMax: 25, waterSensitivity: 'Critical', vulnerabilities: ['Pod borer (Helicoverpa armigera)', 'Frost'] },
      { name: 'Pod Bulking & Seed Filling', stageOrder: 4, durationPercent: 18, description: '1-2 seeds swell inside each pod.', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Medium', vulnerabilities: ['Wilt under dry heat'] },
      { name: 'Maturity', stageOrder: 5, durationPercent: 12, description: 'Leaves drop; pods turn brownish straw.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Early shattering'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Only', nutrient: 'N: 20 kg, P: 40 kg, K: 20 kg, Sulphur: 20 kg/ha', purpose: 'Starter N before nodules fix atmospheric N', recommendedInputs: ['SSP + DAP', 'Rhizobium seed culture'], description: 'Apply basal into seed furrow.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Disc Harrow + Planker', purpose: 'Rough, cloddy seedbed to prevent crusting', timingWindow: '5 days before sowing' },
      { cropStage: 'Sowing', equipment: 'Zero-Till Seed Drill', purpose: 'Deep placement (7-10 cm) to utilize residual moisture', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Chickpea Combine Harvester / Thresher', purpose: 'Thresh at 10% moisture', timingWindow: 'Days 105–115' }
    ]
  },

  // 7. PIGEON PEA (TUR / ARHAR)
  {
    id: 'pigeon-pea',
    name: 'Pigeon Pea (Arhar / Tur)',
    scientific_name: 'Cajanus cajan',
    category: 'Pulse / Legume',
    duration_min: 140,
    duration_max: 180,
    temp_min: 16,
    temp_max: 38,
    temp_ideal_min: 24,
    temp_ideal_max: 32,
    rainfall_ideal_min: 600,
    rainfall_ideal_max: 950,
    humidity_ideal_min: 45,
    humidity_ideal_max: 75,
    soil_types: ['Deep Loam', 'Black Soil', 'Well-Drained Alluvial'],
    soil_ph_min: 6.5,
    soil_ph_max: 7.8,
    seasons: ['Kharif / Monsoon'],
    water_need: 'Medium',
    stages: [
      { name: 'Seedling & Establishment', stageOrder: 1, durationPercent: 15, description: 'Slow initial shoot growth, deep taproot anchorage.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Low', vulnerabilities: ['Weed suppression'] },
      { name: 'Grand Vegetative Branching', stageOrder: 2, durationPercent: 35, description: 'Extensive woody branching up to 2m height.', idealTempMin: 25, idealTempMax: 34, waterSensitivity: 'Medium', vulnerabilities: ['Sterility mosaic disease'] },
      { name: 'Flowering & Pod Setting', stageOrder: 3, durationPercent: 25, description: 'Bright yellow/red flowers and pod clusters.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Critical', vulnerabilities: ['Pod borer, pod fly'] },
      { name: 'Pod Maturation', stageOrder: 4, durationPercent: 25, description: 'Pods darken; high protein seed formation.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Premature pod drop'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Placement', nutrient: 'N: 25 kg, P: 50 kg, K: 30 kg/ha', purpose: 'Root nodule stimulus', recommendedInputs: ['DAP', 'Sulphur 20 kg', 'Rhizobium inoculation'], description: 'Apply in furrow at sowing.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Deep Chisel Plow + Disc Harrow', purpose: 'Allow 2m taproot penetration', timingWindow: '10 days before sowing' },
      { cropStage: 'Sowing', equipment: 'Precision Planter (Wide row 90x20 cm)', purpose: 'Optimum plant population', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Tractor Reaper / Thresher', purpose: 'Cut woody stalks and separate pods', timingWindow: 'Days 150–170' }
    ]
  },

  // 8. GREEN GRAM (MOONG)
  {
    id: 'green-gram',
    name: 'Green Gram (Moong)',
    scientific_name: 'Vigna radiata',
    category: 'Pulse / Legume',
    duration_min: 60,
    duration_max: 75,
    temp_min: 18,
    temp_max: 40,
    temp_ideal_min: 26,
    temp_ideal_max: 34,
    rainfall_ideal_min: 350,
    rainfall_ideal_max: 600,
    humidity_ideal_min: 50,
    humidity_ideal_max: 75,
    soil_types: ['Loam', 'Sandy Loam', 'Well-Drained Clay Loam'],
    soil_ph_min: 6.2,
    soil_ph_max: 7.5,
    seasons: ['Kharif', 'Zaid / Summer'],
    water_need: 'Low',
    stages: [
      { name: 'Emergence', stageOrder: 1, durationPercent: 12, description: 'Germination within 3-4 days.', idealTempMin: 26, idealTempMax: 32, waterSensitivity: 'Medium', vulnerabilities: ['Damping off'] },
      { name: 'Rapid Vegetative', stageOrder: 2, durationPercent: 28, description: 'Trifoliate leaves and rapid nodulation.', idealTempMin: 26, idealTempMax: 34, waterSensitivity: 'Medium', vulnerabilities: ['Yellow mosaic virus (whitefly vector)'] },
      { name: 'Flowering & Podding', stageOrder: 3, durationPercent: 35, description: 'Synchronized pod clusters.', idealTempMin: 26, idealTempMax: 32, waterSensitivity: 'Critical', vulnerabilities: ['Flower drop in dry spells'] },
      { name: 'Harvest Maturity', stageOrder: 4, durationPercent: 25, description: 'Pods turn black/brown; 65-day short cycle.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Low', vulnerabilities: ['Pod shattering'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Placement', nutrient: 'N: 15 kg, P: 40 kg, K: 20 kg/ha', purpose: 'Fast crop establishment', recommendedInputs: ['DAP + Sulphur', 'Rhizobium seed coat'], description: 'Apply before sowing.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Cultivator + Leveller', purpose: 'Conserve summer moisture', timingWindow: '3 days prior' },
      { cropStage: 'Sowing', equipment: 'Zero-Till Seed Drill', purpose: '30x10 cm close spacing', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Multi-Crop Combine Harvester', purpose: 'Direct one-pass cutting and threshing', timingWindow: 'Days 65–72' }
    ]
  },

  // 9. COTTON
  {
    id: 'cotton',
    name: 'Cotton',
    scientific_name: 'Gossypium hirsutum',
    category: 'Cash / Fiber',
    duration_min: 150,
    duration_max: 180,
    temp_min: 18,
    temp_max: 42,
    temp_ideal_min: 24,
    temp_ideal_max: 34,
    rainfall_ideal_min: 600,
    rainfall_ideal_max: 1000,
    humidity_ideal_min: 40,
    humidity_ideal_max: 70,
    soil_types: ['Black Cotton Soil (Vertisol)', 'Deep Loam', 'Alluvial'],
    soil_ph_min: 6.5,
    soil_ph_max: 8.5,
    seasons: ['Kharif'],
    water_need: 'Medium',
    stages: [
      { name: 'Germination & Seedling', stageOrder: 1, durationPercent: 12, description: 'True leaf development and taproot penetration.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Medium', vulnerabilities: ['Sucking pests (thrips, jassids)'] },
      { name: 'Squaring (Floral Bud)', stageOrder: 2, durationPercent: 20, description: 'Appearance of reproductive squares.', idealTempMin: 25, idealTempMax: 32, waterSensitivity: 'High', vulnerabilities: ['Square dropping due to high night temperatures'] },
      { name: 'Flowering & Boll Setting', stageOrder: 3, durationPercent: 30, description: 'White/pink flower bloom and rapid boll expansion.', idealTempMin: 26, idealTempMax: 34, waterSensitivity: 'Critical', vulnerabilities: ['Moisture stress causes extensive boll shedding'] },
      { name: 'Boll Development & Maturation', stageOrder: 4, durationPercent: 23, description: 'Fiber elongation and secondary wall thickening.', idealTempMin: 24, idealTempMax: 32, waterSensitivity: 'Medium', vulnerabilities: ['Bollworm infestation'] },
      { name: 'Boll Opening & Picking', stageOrder: 5, durationPercent: 15, description: 'Carpels dry and burst open displaying white lint.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Low', vulnerabilities: ['Rain stains lint and ruins fiber quality'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Placement', nutrient: 'N: 20%, P: 100%, K: 50%', purpose: 'Taproot expansion and branch initiation', recommendedInputs: ['DAP', 'MOP', 'Borax 10 kg/ha', 'Magnesium Sulphate'], description: 'Broadcast and plow-in prior to ridging.' },
      { stage: 'Squaring Stage (~Day 40-45)', nutrient: 'N: 40%', purpose: 'Support floral buds and monopodial/sympodial branching', recommendedInputs: ['Urea top-dressing'], description: 'Side dress 10-15 cm from stem.' },
      { stage: 'Peak Boll Formation (~Day 70-80)', nutrient: 'N: 40%, K: 50%', purpose: 'Maximize boll weight and prevent premature defoliation', recommendedInputs: ['Urea + MOP', 'Potassium Nitrate 13:0:45 foliar spray'], description: 'Apply with soil moisture.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Deep Mouldboard Plow + Disc Harrow', purpose: 'Aerate deep black soil and destroy dormant pest pupae', timingWindow: '14 days before planting' },
      { cropStage: 'Sowing', equipment: 'Tractor-drawn Dibbler / Pneumatic Seed Drill', purpose: 'Accurate spacing (90x45 cm or 120x45 cm) for easy mechanization', timingWindow: 'Day 0' },
      { cropStage: 'Protection', equipment: 'High Clearance Tractor Sprayer', purpose: 'Foliar insecticide and micronutrient management over high canopy', timingWindow: 'Days 40–110' },
      { cropStage: 'Harvesting', equipment: 'Mechanical Cotton Picker / Selective Manual Picking', purpose: 'Clean trash-free lint harvest across 2-3 flushes', timingWindow: 'Days 150–180' }
    ]
  },

  // 10. SUGARCANE
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientific_name: 'Saccharum officinarum',
    category: 'Cash / Fiber',
    duration_min: 300,
    duration_max: 365,
    temp_min: 15,
    temp_max: 42,
    temp_ideal_min: 25,
    temp_ideal_max: 35,
    rainfall_ideal_min: 1200,
    rainfall_ideal_max: 2200,
    humidity_ideal_min: 60,
    humidity_ideal_max: 85,
    soil_types: ['Deep Loam', 'Clay Loam', 'Alluvial'],
    soil_ph_min: 6.0,
    soil_ph_max: 8.0,
    seasons: ['Autumn / Spring / Year-Round'],
    water_need: 'Very High',
    stages: [
      { name: 'Germination & Sett Sprouting', stageOrder: 1, durationPercent: 12, description: 'Bud sprout and sett root formation.', idealTempMin: 26, idealTempMax: 32, waterSensitivity: 'Medium', vulnerabilities: ['Sett rot in un-aerated soil'] },
      { name: 'Tillering / Formative Stage', stageOrder: 2, durationPercent: 23, description: 'Prolific shoot emergence and crown establishment.', idealTempMin: 28, idealTempMax: 35, waterSensitivity: 'Critical', vulnerabilities: ['Drought drastically reduces millable cane count'] },
      { name: 'Grand Growth Phase', stageOrder: 3, durationPercent: 40, description: 'Rapid internode elongation and cane biomass building.', idealTempMin: 28, idealTempMax: 35, waterSensitivity: 'Critical', vulnerabilities: ['Top borer, pyrilla', 'Water shortage stunts height'] },
      { name: 'Ripening & Sucrose Accumulation', stageOrder: 4, durationPercent: 25, description: 'Inversion of reducing sugars into crystallized sucrose.', idealTempMin: 14, idealTempMax: 24, waterSensitivity: 'Low', vulnerabilities: ['Excessive moisture reduces brix percentage'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Planting', nutrient: 'N: 20%, P: 100%, K: 30%', purpose: 'Root development from eyes', recommendedInputs: ['DAP / Single Super Phosphate', 'Muriate of Potash', 'Press mud compost'], description: 'Place directly in the planting furrow below setts.' },
      { stage: 'First Tillering (~Day 45)', nutrient: 'N: 40%', purpose: 'Accelerate primary tillering', recommendedInputs: ['Urea top-dressing'], description: 'Apply along cane rows followed by hoeing.' },
      { stage: 'Formative / Grand Growth (~Day 90-100)', nutrient: 'N: 40%, K: 70%', purpose: 'Thick cane girth and stalk length', recommendedInputs: ['Urea + MOP', 'Ferrous & Zinc sulphate'], description: 'Complete final earthing-up after fertilizer application.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor Furrower / Deep Ridger', purpose: 'Create 30 cm deep trenches spaced 1.2 to 1.5 m apart', timingWindow: '7 days before planting' },
      { cropStage: 'Planting', equipment: 'Cane Sett Cutter Planter', purpose: 'Cut, treat with fungicide, place and cover setts in one operation', timingWindow: 'Day 0' },
      { cropStage: 'Earthing Up', equipment: 'Tractor Ridger & Disc Cultivator', purpose: 'Pile soil against stalks to prevent wind lodging during monsoon', timingWindow: 'Days 90–110' },
      { cropStage: 'Harvesting', equipment: 'Whole-Stalk or Chopper Sugarcane Harvester', purpose: 'Ground-level base cutting for maximum sugar recovery and ratoon sprouting', timingWindow: 'Days 300–360' }
    ]
  },

  // 11. MUSTARD
  {
    id: 'mustard',
    name: 'Mustard / Rapeseed',
    scientific_name: 'Brassica juncea',
    category: 'Oilseed',
    duration_min: 100,
    duration_max: 125,
    temp_min: 10,
    temp_max: 28,
    temp_ideal_min: 15,
    temp_ideal_max: 22,
    rainfall_ideal_min: 250,
    rainfall_ideal_max: 450,
    humidity_ideal_min: 40,
    humidity_ideal_max: 65,
    soil_types: ['Loam', 'Sandy Loam', 'Alluvial'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.5,
    seasons: ['Rabi / Winter'],
    water_need: 'Low',
    stages: [
      { name: 'Germination & Emergence', stageOrder: 1, durationPercent: 10, description: 'Radicle and cotyledon leaf expansion.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'Medium', vulnerabilities: ['Flea beetle attack on tender cotyledons'] },
      { name: 'Rosette & Branching', stageOrder: 2, durationPercent: 25, description: 'Development of spreading basal rosette leaves.', idealTempMin: 14, idealTempMax: 20, waterSensitivity: 'High', vulnerabilities: ['Painted bug infestation'] },
      { name: 'Flowering & Siliqua Formation', stageOrder: 3, durationPercent: 30, description: 'Bright yellow bloom and pod setting.', idealTempMin: 15, idealTempMax: 22, waterSensitivity: 'Critical', vulnerabilities: ['Mustard aphid (Lipaphis erysimi) outbreak in cloudy weather', 'Frost'] },
      { name: 'Pod Filling & Seed Development', stageOrder: 4, durationPercent: 20, description: 'Oil synthesis inside developing siliquae.', idealTempMin: 16, idealTempMax: 22, waterSensitivity: 'Medium', vulnerabilities: ['Dry warm winds reduce oil content'] },
      { name: 'Maturity & Desiccation', stageOrder: 5, durationPercent: 15, description: 'Pods turn light golden; seeds darken.', idealTempMin: 18, idealTempMax: 26, waterSensitivity: 'Low', vulnerabilities: ['Pod shattering if harvested late'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Application', nutrient: 'N: 50%, P: 100%, K: 100%, Sulphur: 100%', purpose: 'Oil biosynthesis and strong branching', recommendedInputs: ['SSP (Single Super Phosphate provides P & Sulphur)', 'Urea', 'Elemental Sulphur 20 kg/ha'], description: 'Sulphur is crucial for mustard oil glucosinolate and fatty acid synthesis.' },
      { stage: 'First Irrigation / Branching (~Day 28-35)', nutrient: 'N: 50%', purpose: 'Stimulate lateral branches and pod numbers', recommendedInputs: ['Urea top-dressing'], description: 'Apply before first light irrigation.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Cultivator + Planking (Sohaga)', purpose: 'Ensure fine moisture-conserving seedbed', timingWindow: '3–5 days before sowing' },
      { cropStage: 'Sowing', equipment: 'Mustard Seed Drill / Fluted Roller Drill', purpose: 'Accurate shallow depth (3 cm) and row spacing (30-45 cm)', timingWindow: 'Day 0' },
      { cropStage: 'Plant Protection', equipment: 'Tractor-Mounted Boom Sprayer', purpose: 'Targeted aphid control when threshold reached (>25 aphids/plant)', timingWindow: 'Days 50–70' },
      { cropStage: 'Harvesting', equipment: 'Multi-Crop Thresher / Reaper', purpose: 'Harvest early morning when pods are moist to eliminate seed shattering loss', timingWindow: 'Days 105–125' }
    ]
  },

  // 12. SOYBEAN
  {
    id: 'soybean',
    name: 'Soybean',
    scientific_name: 'Glycine max',
    category: 'Oilseed',
    duration_min: 90,
    duration_max: 115,
    temp_min: 15,
    temp_max: 35,
    temp_ideal_min: 22,
    temp_ideal_max: 30,
    rainfall_ideal_min: 550,
    rainfall_ideal_max: 850,
    humidity_ideal_min: 55,
    humidity_ideal_max: 80,
    soil_types: ['Deep Loam', 'Clay Loam', 'Black Soil'],
    soil_ph_min: 6.2,
    soil_ph_max: 7.5,
    seasons: ['Kharif / Monsoon'],
    water_need: 'Medium',
    stages: [
      { name: 'Emergence & V1-V2', stageOrder: 1, durationPercent: 12, description: 'Hypocotyl arch pulls cotyledons above ground.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Medium', vulnerabilities: ['Seedling rot from waterlogging'] },
      { name: 'Vegetative & Root Nodulation', stageOrder: 2, durationPercent: 25, description: 'Bradyrhizobium nodules begin atmospheric nitrogen fixation.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'High', vulnerabilities: ['Girdle beetle, stem fly'] },
      { name: 'Flowering (R1-R2)', stageOrder: 3, durationPercent: 20, description: 'Purple/white flowers bloom on leaf axils.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Critical', vulnerabilities: ['Moisture deficit causes floral abortion'] },
      { name: 'Pod Bulking & Seed Fill (R3-R6)', stageOrder: 4, durationPercent: 28, description: 'Rapid protein and oil accumulation in pods.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Semilooper defoliation, rust'] },
      { name: 'Maturity & Leaf Drop (R7-R8)', stageOrder: 5, durationPercent: 15, description: 'Leaves turn yellow and drop; pods turn brown.', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Low', vulnerabilities: ['Pod shattering if exposed to alternating rain and sun'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Placement', nutrient: 'N: 20%, P: 100%, K: 100%, Sulphur: 100%', purpose: 'Initial starter N before root nodules activate; P for root branching', recommendedInputs: ['DAP / SSP + MOP', 'Rhizobium & PSB Biofertilizer seed inoculation'], description: 'Inoculate seeds with Rhizobium culture prior to sowing to reduce synthetic N need.' },
      { stage: 'Pre-Flowering Stage (~Day 35)', nutrient: 'Foliar NPK 0:52:34 + Micronutrients', purpose: 'Boost pod setting and seed size', recommendedInputs: ['Water soluble foliar spray'], description: 'Apply early morning when stomata are open.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Broad Bed and Furrow (BBF) Former', purpose: 'Form raised beds with drainage furrows to avoid monsoon water stagnation', timingWindow: '3 days before planting' },
      { cropStage: 'Sowing', equipment: 'Inclined Plate Precision Seed Drill', purpose: 'Prevent seed coat damage and ensure 45x5 cm spacing', timingWindow: 'Day 0' },
      { cropStage: 'Inter-culture', equipment: 'Tractor Wheel Hoe / Rotary Weeder', purpose: 'Weed suppression between rows during first 30 days', timingWindow: 'Days 20–25' },
      { cropStage: 'Harvesting', equipment: 'Multi-Crop Combine Harvester with Flexible Cutterbar', purpose: 'Cut low near ground without missing bottom pods', timingWindow: 'Days 95–110' }
    ]
  },

  // 13. GROUNDNUT
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    scientific_name: 'Arachis hypogaea',
    category: 'Oilseed',
    duration_min: 105,
    duration_max: 130,
    temp_min: 18,
    temp_max: 36,
    temp_ideal_min: 24,
    temp_ideal_max: 30,
    rainfall_ideal_min: 450,
    rainfall_ideal_max: 750,
    humidity_ideal_min: 50,
    humidity_ideal_max: 75,
    soil_types: ['Sandy Loam', 'Light Loam', 'Red Sandy Loam'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.2,
    seasons: ['Kharif', 'Rabi / Summer'],
    water_need: 'Medium',
    stages: [
      { name: 'Emergence & Early Vegetative', stageOrder: 1, durationPercent: 15, description: 'Vigorous primary and secondary branch formation.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Medium', vulnerabilities: ['Collar rot'] },
      { name: 'Flowering & Peg Initiation', stageOrder: 2, durationPercent: 20, description: 'Bright yellow flowers self-pollinate; gynophores (pegs) emerge.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Critical', vulnerabilities: ['Soil dryness halts peg penetration'] },
      { name: 'Peg Penetration & Pod Formation', stageOrder: 3, durationPercent: 25, description: 'Pegs push 3-5 cm into loose soil and swell into pods.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Hard baked soil prevents pegs from entering ground!'] },
      { name: 'Pod Development & Kernel Filling', stageOrder: 4, durationPercent: 25, description: 'Kernel oil synthesis and shell hardening underground.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'High', vulnerabilities: ['Tikka disease (leaf spot)', 'White grub underground'] },
      { name: 'Harvest Maturity', stageOrder: 5, durationPercent: 15, description: 'Inner shell turns dark brown/black; kernels separate easily.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Excess moisture causes pods to sprout in the ground'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Application', nutrient: 'N: 20%, P: 100%, K: 50%', purpose: 'Starter vegetative vigor and root elongation', recommendedInputs: ['SSP', 'MOP', 'Farmyard manure', 'Rhizobium seed coating'], description: 'Apply in furrow before sowing.' },
      { stage: 'Pegging Stage (~Day 40-45)', nutrient: 'Gypsum 400 kg/ha (Calcium + Sulphur)', purpose: 'Essential for pod filling and preventing hollow shells ("pops")', recommendedInputs: ['Agricultural Gypsum broadcast close to plant base'], description: 'Soil incorporation around root/peg zone followed by light irrigation.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor with Disc Harrow & Cultivator', purpose: 'Pulverize top 15 cm into friable, loose crumbly tilth for easy pegging', timingWindow: '7 days before sowing' },
      { cropStage: 'Sowing', equipment: 'Groundnut Seed Planter with Cup Feed Mechanism', purpose: 'Sow at uniform 30x10 cm spacing without cracking kernel seed coat', timingWindow: 'Day 0' },
      { cropStage: 'Inter-culture', equipment: 'Peg-Tooth Weeder', purpose: 'Loosen soil before pegging; STOP inter-cultivation once pegs enter ground', timingWindow: 'Days 20–35' },
      { cropStage: 'Harvesting', equipment: 'Tractor-Drawn Groundnut Digger-Inverter', purpose: 'Undercut root zone and flip vines upside down for sun drying', timingWindow: 'Days 105–125' }
    ]
  },

  // 14. SUNFLOWER
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientific_name: 'Helianthus annuus',
    category: 'Oilseed',
    duration_min: 85,
    duration_max: 105,
    temp_min: 15,
    temp_max: 38,
    temp_ideal_min: 22,
    temp_ideal_max: 28,
    rainfall_ideal_min: 400,
    rainfall_ideal_max: 700,
    humidity_ideal_min: 45,
    humidity_ideal_max: 70,
    soil_types: ['Deep Loam', 'Clay Loam', 'Black Soil'],
    soil_ph_min: 6.5,
    soil_ph_max: 8.0,
    seasons: ['Rabi', 'Kharif', 'Zaid / Summer'],
    water_need: 'Medium',
    stages: [
      { name: 'Emergence', stageOrder: 1, durationPercent: 12, description: 'Quick germination under warm seedbed.', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Medium', vulnerabilities: ['Cutworms'] },
      { name: 'Vegetative & Bud Formation (Star)', stageOrder: 2, durationPercent: 28, description: 'Rapid stem extension and terminal flower bud.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'High', vulnerabilities: ['Rust, Alternaria leaf spot'] },
      { name: 'Ray Floret Opening & Anthesis', stageOrder: 3, durationPercent: 25, description: 'Golden yellow head opening and honeybee pollination.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Rain during flowering washes pollen', 'Parrot / Bird predation'] },
      { name: 'Seed Filling & Head Droop', stageOrder: 4, durationPercent: 23, description: 'Achene filling and high linoleic/oleic oil synthesis.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Head rot under damp weather'] },
      { name: 'Harvest Maturity', stageOrder: 5, durationPercent: 12, description: 'Back of capitulum turns lemon yellow; bracts brown.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Low', vulnerabilities: ['Seed shattering'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Application', nutrient: 'N: 50%, P: 100%, K: 100%, Boron: 100%', purpose: 'Head diameter and seed setting (Boron prevents empty center achenes)', recommendedInputs: ['NPK 12:32:16', 'Borax 10 kg/ha', 'Sulphur'], description: 'Incorporate deep before sowing.' },
      { stage: 'Button / Star Bud Stage (~Day 35)', nutrient: 'N: 50%', purpose: 'Head size and leaf area', recommendedInputs: ['Urea top-dressing'], description: 'Apply before irrigation.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor Cultivator + Harrow', purpose: 'Deep plowing to accommodate extensive taproot', timingWindow: '7 days before sowing' },
      { cropStage: 'Sowing', equipment: 'Pneumatic Precision Planter', purpose: 'Accurate 60x30 cm spacing', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Sunflower Harvester Head Attachment on Combine', purpose: 'Cut only heads with minimal stalk intake', timingWindow: 'Days 90–100' }
    ]
  },

  // 15. POTATO
  {
    id: 'potato',
    name: 'Potato',
    scientific_name: 'Solanum tuberosum',
    category: 'Vegetable / Tuber',
    duration_min: 80,
    duration_max: 110,
    temp_min: 10,
    temp_max: 28,
    temp_ideal_min: 16,
    temp_ideal_max: 22,
    rainfall_ideal_min: 400,
    rainfall_ideal_max: 600,
    humidity_ideal_min: 60,
    humidity_ideal_max: 85,
    soil_types: ['Sandy Loam', 'Loose Silt Loam', 'Alluvial'],
    soil_ph_min: 5.2,
    soil_ph_max: 6.8,
    seasons: ['Rabi / Winter', 'Autumn'],
    water_need: 'Medium',
    stages: [
      { name: 'Sprouting & Emergence', stageOrder: 1, durationPercent: 18, description: 'Eye sprouting and emergence above ridges.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'Medium', vulnerabilities: ['Rhizoctonia stem canker', 'Ridge crusting'] },
      { name: 'Vegetative Canopy Growth', stageOrder: 2, durationPercent: 22, description: 'Rapid branching and leaf canopy development.', idealTempMin: 18, idealTempMax: 22, waterSensitivity: 'High', vulnerabilities: ['Aphid infestation (virus transmission)'] },
      { name: 'Tuber Initiation (Hooking)', stageOrder: 3, durationPercent: 15, description: 'Stolon tips swell to begin tuber formation.', idealTempMin: 15, idealTempMax: 20, waterSensitivity: 'Critical', vulnerabilities: ['Night temperatures >21°C completely halt tuber initiation!'] },
      { name: 'Tuber Bulking', stageOrder: 4, durationPercent: 30, description: 'Rapid accumulation of starch in expanding tubers.', idealTempMin: 16, idealTempMax: 20, waterSensitivity: 'Critical', vulnerabilities: ['Late Blight (Phytophthora) in cool humid foggy conditions'] },
      { name: 'Tuber Maturation & Skin Setting', stageOrder: 5, durationPercent: 15, description: 'Canopy yellowing (dehaulming) and skin hardening.', idealTempMin: 14, idealTempMax: 18, waterSensitivity: 'Low', vulnerabilities: ['Tuber rot if soil is overwatered prior to digging'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Placement', nutrient: 'N: 50%, P: 100%, K: 100%', purpose: 'Ensure rich potassium for tuber expansion', recommendedInputs: ['NPK 12:32:16 or SOP (Sulphate of Potash)', 'Decomposed organic manure'], description: 'Apply in the furrow before making ridges. Avoid chloride-rich MOP if possible.' },
      { stage: 'Earthing Up Stage (~Day 30-35)', nutrient: 'N: 50%', purpose: 'Fuel canopy photosynthesis and stolon growth', recommendedInputs: ['Urea top-dressing', 'Micronutrient mix spray'], description: 'Apply before pulling soil ridges over the tuber zone.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Tractor Rotavator + Ridge Maker', purpose: 'Create deep, loose, clod-free soil bed for unhindered tuber expansion', timingWindow: '3–5 days before planting' },
      { cropStage: 'Planting', equipment: 'Automatic Potato Planter', purpose: 'Accurate spacing (60x20 cm) and uniform tuber seed depth', timingWindow: 'Day 0' },
      { cropStage: 'Earthing Up', equipment: 'Tractor Mounted Ridger', purpose: 'Cover emerging tubers to prevent greening (solanine toxicity) from sunlight', timingWindow: 'Days 30–35' },
      { cropStage: 'Harvesting', equipment: 'Potato Digger / Harvester', purpose: 'Gently lift tubers onto vibrating shaker chains without skin scuffing', timingWindow: 'Days 85–105' }
    ]
  },

  // 16. TOMATO
  {
    id: 'tomato',
    name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    category: 'Vegetable / Tuber',
    duration_min: 90,
    duration_max: 130,
    temp_min: 12,
    temp_max: 35,
    temp_ideal_min: 20,
    temp_ideal_max: 26,
    rainfall_ideal_min: 400,
    rainfall_ideal_max: 700,
    humidity_ideal_min: 50,
    humidity_ideal_max: 75,
    soil_types: ['Sandy Loam', 'Loam', 'Well-Drained Clay Loam'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.0,
    seasons: ['Rabi', 'Kharif', 'Spring/Summer'],
    water_need: 'Medium',
    stages: [
      { name: 'Transplanting & Rooting', stageOrder: 1, durationPercent: 12, description: 'Establishment of 25-day nursery seedlings.', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Medium', vulnerabilities: ['Damping off', 'Transplant shock'] },
      { name: 'Vegetative Branching & Staking', stageOrder: 2, durationPercent: 20, description: 'Formation of multiple indeterminate/determinate branches.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'High', vulnerabilities: ['Early blight, leaf curl virus'] },
      { name: 'Flowering & Fruit Set', stageOrder: 3, durationPercent: 23, description: 'Flower clusters open and self-pollinate.', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Critical', vulnerabilities: ['Night temperatures >25°C or <13°C cause flower drop!'] },
      { name: 'Fruit Development & Sizing', stageOrder: 4, durationPercent: 25, description: 'Rapid berry expansion and lycopene synthesis.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Blossom end rot (calcium deficiency under erratic watering)'] },
      { name: 'Ripening & Harvesting', stageOrder: 5, durationPercent: 20, description: 'Breaker stage to full red ripe harvest.', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Low', vulnerabilities: ['Fruit cracking from sudden heavy rain'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Application', nutrient: 'N: 30%, P: 100%, K: 40%', purpose: 'Root vigor and early vegetative strength', recommendedInputs: ['NPK 19:19:19 or DAP + Potash', 'Calcium Nitrate', 'Boron'], description: 'Incorporate into raised beds before laying mulch.' },
      { stage: 'Vegetative Growth (~Day 25)', nutrient: 'N: 40%, K: 30%', purpose: 'Canopy structure and flower cluster count', recommendedInputs: ['Urea / 19:19:19 fertigation'], description: 'Apply via drip or soil drenching.' },
      { stage: 'Fruit Bulking (~Day 50-70)', nutrient: 'N: 30%, K: 30%', purpose: 'Fruit density, sweetness, and firmness', recommendedInputs: ['Potassium Nitrate (13:0:45) + Chelated Calcium'], description: 'Crucial for preventing blossom end rot.' }
    ],
    machinery: [
      { cropStage: 'Bed Preparation', equipment: 'Bed Former with Plastic Mulch & Drip Layer', purpose: 'Form raised beds (90 cm width) and lay drip tubing simultaneously', timingWindow: '3 days before transplanting' },
      { cropStage: 'Canopy Support', equipment: 'Staking & Trellising System / Wire Tensioners', purpose: 'Keep tomato branches elevated from damp soil to prevent fruit rot', timingWindow: 'Days 20–25' },
      { cropStage: 'Plant Protection', equipment: 'Battery-Operated Mist Blower / Air-Assisted Sprayer', purpose: 'Even coverage under leaves for whitefly and blight control', timingWindow: 'Every 10–14 days' },
      { cropStage: 'Harvesting', equipment: 'Crate Sorting & Field Grading Carts', purpose: 'Selective picking at pink/breaker stage for maximum transit shelf life', timingWindow: 'Days 75–120' }
    ]
  },

  // 17. ONION
  {
    id: 'onion',
    name: 'Onion',
    scientific_name: 'Allium cepa',
    category: 'Vegetable / Tuber',
    duration_min: 120,
    duration_max: 150,
    temp_min: 12,
    temp_max: 32,
    temp_ideal_min: 16,
    temp_ideal_max: 25,
    rainfall_ideal_min: 350,
    rainfall_ideal_max: 550,
    humidity_ideal_min: 55,
    humidity_ideal_max: 75,
    soil_types: ['Sandy Loam', 'Silt Loam', 'Alluvial'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.5,
    seasons: ['Rabi / Winter', 'Kharif', 'Late Kharif'],
    water_need: 'Medium',
    stages: [
      { name: 'Nursery & Transplanting', stageOrder: 1, durationPercent: 20, description: 'Establishment of 45-day slender seedlings in flat or raised beds.', idealTempMin: 18, idealTempMax: 24, waterSensitivity: 'High', vulnerabilities: ['Damping off'] },
      { name: 'Vegetative Foliage Growth', stageOrder: 2, durationPercent: 30, description: 'Production of green tubular leaves and root crown.', idealTempMin: 15, idealTempMax: 22, waterSensitivity: 'High', vulnerabilities: ['Onion thrips (Thrips tabaci)', 'Purple blotch'] },
      { name: 'Bulb Initiation & Swelling', stageOrder: 3, durationPercent: 30, description: 'Photoperiod and temperature trigger basal leaf swelling into concentric bulb scales.', idealTempMin: 18, idealTempMax: 26, waterSensitivity: 'Critical', vulnerabilities: ['Bolting (premature seed stalk) under sudden cold spells'] },
      { name: 'Neck Fall & Bulb Curing', stageOrder: 4, durationPercent: 20, description: '50-70% foliage tops lodge naturally; outer skins dry and pigment.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'Low', vulnerabilities: ['Bulb rot if soil is wet during harvest'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Transplanting', nutrient: 'N: 35%, P: 100%, K: 100%, Sulphur: 40 kg/ha', purpose: 'Pungency (allicin) and solid bulb scales', recommendedInputs: ['Single Super Phosphate + Potash', 'Zinc + Sulphur'], description: 'Apply before making beds.' },
      { stage: 'Top Dressing (~Day 30 & Day 45)', nutrient: 'N: 65%', purpose: 'Leaf canopy growth before bulb swelling', recommendedInputs: ['Urea top-dressing split in two doses'], description: 'Discontinue nitrogen after bulb initiation to prevent thick necks.' }
    ],
    machinery: [
      { cropStage: 'Bed Preparation', equipment: 'Tractor Raised Bed Maker', purpose: '120 cm wide raised beds with drainage channels', timingWindow: '3 days prior' },
      { cropStage: 'Transplanting', equipment: 'Manual Peg Board / Mechanical Vegetable Transplanter', purpose: 'Uniform 15x10 cm density (approx 650,000 plants/ha)', timingWindow: 'Day 0' },
      { cropStage: 'Harvesting', equipment: 'Tractor-Mounted Onion Digger-Windrower', purpose: 'Undercut root zone and deposit bulbs in windrows for sun curing', timingWindow: 'Days 125–145' }
    ]
  },

  // 18. CHILI (PEPPER)
  {
    id: 'chili',
    name: 'Chili (Hot Pepper)',
    scientific_name: 'Capsicum annuum',
    category: 'Spice / Plantation',
    duration_min: 120,
    duration_max: 160,
    temp_min: 15,
    temp_max: 38,
    temp_ideal_min: 22,
    temp_ideal_max: 30,
    rainfall_ideal_min: 600,
    rainfall_ideal_max: 1000,
    humidity_ideal_min: 55,
    humidity_ideal_max: 75,
    soil_types: ['Sandy Loam', 'Clay Loam', 'Black Soil'],
    soil_ph_min: 6.0,
    soil_ph_max: 7.5,
    seasons: ['Kharif', 'Rabi', 'Summer'],
    water_need: 'Medium',
    stages: [
      { name: 'Seedling Establishment', stageOrder: 1, durationPercent: 15, description: 'Transplanting of 35-day nursery seedlings.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Medium', vulnerabilities: ['Transplant wilt'] },
      { name: 'Vegetative Bushing', stageOrder: 2, durationPercent: 25, description: 'Dichotomous branching and rich dark green foliage.', idealTempMin: 22, idealTempMax: 30, waterSensitivity: 'High', vulnerabilities: ['Chili leaf curl (whitefly)', 'Thrips / Mite murda complex'] },
      { name: 'Flowering & Fruit Setting', stageOrder: 3, durationPercent: 25, description: 'Star-shaped white flowers and green pod emergence.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Flower dropping above 35°C'] },
      { name: 'Green & Red Fruit Maturation', stageOrder: 4, durationPercent: 35, description: 'Capsaicin synthesis and flushes of green/red picking.', idealTempMin: 20, idealTempMax: 30, waterSensitivity: 'Medium', vulnerabilities: ['Anthracnose / Fruit rot in heavy rain'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal', nutrient: 'N: 25%, P: 100%, K: 50%', purpose: 'Rooting and early branch framework', recommendedInputs: ['NPK 19:19:19 + Neem Cake + Micronutrients'], description: 'Broadcast in ridges.' },
      { stage: 'Vegetative Flushes', nutrient: 'N: 75%, K: 50%', purpose: 'Continuous fruit flushes across 4-6 pickings', recommendedInputs: ['Urea split every 20 days + Potassium Nitrate spray'], description: 'Apply with irrigation.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Rotavator + Ridger', purpose: 'Form 60 cm ridges', timingWindow: '5 days before transplanting' },
      { cropStage: 'Plant Protection', equipment: 'High Pressure Knapsack Sprayer', purpose: 'Under-leaf coverage for mites and thrips', timingWindow: 'Every 10–12 days' },
      { cropStage: 'Harvesting', equipment: 'Solar Tunnel Dryer / Drying Yard', purpose: 'Dehydrate red chilies down to 10% moisture with vivid color retention', timingWindow: 'Days 90–160' }
    ]
  },

  // 19. GINGER
  {
    id: 'ginger',
    name: 'Ginger',
    scientific_name: 'Zingiber officinale',
    category: 'Spice / Plantation',
    duration_min: 210,
    duration_max: 260,
    temp_min: 18,
    temp_max: 36,
    temp_ideal_min: 24,
    temp_ideal_max: 30,
    rainfall_ideal_min: 1500,
    rainfall_ideal_max: 2500,
    humidity_ideal_min: 70,
    humidity_ideal_max: 90,
    soil_types: ['Sandy Loam', 'Clay Loam', 'Red Loamy Soil Rich in Humus'],
    soil_ph_min: 5.5,
    soil_ph_max: 6.8,
    seasons: ['Kharif / Monsoon / Year-Round'],
    water_need: 'High',
    stages: [
      { name: 'Sprouting & Rhizome Emergence', stageOrder: 1, durationPercent: 15, description: 'Bud sprout from mother rhizome bits under mulch.', idealTempMin: 25, idealTempMax: 30, waterSensitivity: 'High', vulnerabilities: ['Rhizome soft rot (Pythium) under stagnant water'] },
      { name: 'Tillering & Canopy Expansion', stageOrder: 2, durationPercent: 35, description: 'Dense cluster of pseudo-stems and green shoots.', idealTempMin: 25, idealTempMax: 32, waterSensitivity: 'Critical', vulnerabilities: ['Shoot borer', 'Bacterial wilt'] },
      { name: 'Rhizome Bulking', stageOrder: 3, durationPercent: 35, description: 'Underground fingered rhizomes swell with aromatic essential oils.', idealTempMin: 22, idealTempMax: 28, waterSensitivity: 'Critical', vulnerabilities: ['Water stress reduces gingerol pungency'] },
      { name: 'Leaf Withering & Maturity', stageOrder: 4, durationPercent: 15, description: 'Aerial shoots turn yellow and dry; rhizome skins toughen.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Rotting if harvested in rain'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Planting', nutrient: 'N: 30%, P: 100%, K: 50%', purpose: 'Sprouting from seed rhizomes', recommendedInputs: ['Farmyard Manure (heavy 25 t/ha)', 'Neem cake', 'SSP + MOP'], description: 'Heavy organic foundation is essential for ginger.' },
      { stage: 'Tillering Stage (~Day 60 & Day 100)', nutrient: 'N: 70%, K: 50%', purpose: 'Rhizome finger branching', recommendedInputs: ['Urea top-dressing followed by earthing-up and fresh green leaf mulching'], description: 'Apply around pseudo-stems.' }
    ],
    machinery: [
      { cropStage: 'Bed Preparation', equipment: 'Tractor Bed Maker', purpose: 'Form 15 cm high raised beds with 50 cm buffer paths for drainage', timingWindow: '7 days before planting' },
      { cropStage: 'Mulching', equipment: 'Green Leaf / Straw Mulch Spreader', purpose: 'Prevent heavy monsoon soil splash and conserve rhizosphere coolness', timingWindow: 'At planting & Day 45' },
      { cropStage: 'Harvesting', equipment: 'Tractor Rhizome Undercutter Digger', purpose: 'Lift rhizome clumps intact without breaking fingers', timingWindow: 'Days 220–250' }
    ]
  },

  // 20. TURMERIC
  {
    id: 'turmeric',
    name: 'Turmeric',
    scientific_name: 'Curcuma longa',
    category: 'Spice / Plantation',
    duration_min: 240,
    duration_max: 290,
    temp_min: 18,
    temp_max: 38,
    temp_ideal_min: 25,
    temp_ideal_max: 32,
    rainfall_ideal_min: 1200,
    rainfall_ideal_max: 2000,
    humidity_ideal_min: 65,
    humidity_ideal_max: 85,
    soil_types: ['Sandy Loam', 'Clay Loam', 'Alluvial with High Organic Content'],
    soil_ph_min: 5.8,
    soil_ph_max: 7.5,
    seasons: ['Kharif / Monsoon'],
    water_need: 'High',
    stages: [
      { name: 'Sprouting & Emergence', stageOrder: 1, durationPercent: 15, description: 'Sprouting from mother and finger seed rhizomes.', idealTempMin: 26, idealTempMax: 32, waterSensitivity: 'Medium', vulnerabilities: ['Rhizome rot'] },
      { name: 'Vegetative Canopy & Tillering', stageOrder: 2, durationPercent: 35, description: 'Broad glossy green leaves create dense shaded canopy.', idealTempMin: 26, idealTempMax: 34, waterSensitivity: 'High', vulnerabilities: ['Leaf blotch (Taphrina)', 'Shoot borer'] },
      { name: 'Rhizome Development & Curcumin Synthesis', stageOrder: 3, durationPercent: 35, description: 'Underground fingered rhizomes swell with rich golden curcumin pigment.', idealTempMin: 24, idealTempMax: 30, waterSensitivity: 'Critical', vulnerabilities: ['Severe moisture deficit limits curcumin percentage'] },
      { name: 'Senescence & Harvest Maturity', stageOrder: 4, durationPercent: 15, description: 'Leaves dry up and collapse completely.', idealTempMin: 20, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Termite damage to dry rhizomes'] }
    ],
    fertilizerPlan: [
      { stage: 'Basal Application', nutrient: 'N: 25%, P: 100%, K: 40%', purpose: 'Heavy initial organic building', recommendedInputs: ['Compost 30 t/ha', 'Neem cake 2 t/ha', 'SSP', 'MOP', 'Zinc Sulphate'], description: 'Mix thoroughly into raised beds.' },
      { stage: 'First & Second Earthing Up (~Day 60 & 100)', nutrient: 'N: 75%, K: 60%', purpose: 'Rhizome expansion and girth', recommendedInputs: ['Urea + Potash split application'], description: 'Apply before pulling soil over root crowns.' }
    ],
    machinery: [
      { cropStage: 'Land Preparation', equipment: 'Deep Chisel Plow + Raised Bed Maker', purpose: 'Deep friable soil bed for uninhibited rhizome multiplication', timingWindow: '10 days before planting' },
      { cropStage: 'Planting', equipment: 'Tractor-Operated Turmeric Planter', purpose: 'Accurate ridge planting (45x20 cm)', timingWindow: 'Day 0' },
      { cropStage: 'Processing & Boiling', equipment: 'Steam Turmeric Boiler & Polishing Drum', purpose: 'Even boiling to gelatinize starch and mechanical drum polishing for bright yellow finish', timingWindow: 'Post-Harvest' }
    ]
  }
];

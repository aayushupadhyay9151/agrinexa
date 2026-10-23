export interface SoilEstimate {
  soilType: 'Alluvial' | 'Loam' | 'Clay Loam' | 'Black Soil (Vertisol)' | 'Sandy Loam' | 'Red Loam';
  soilPh: number;
  description: string;
  regionalNotes: string;
  confidence: 'High' | 'Medium' | 'Estimated';
}

export class SoilService {
  /**
   * Determine predominant regional soil type and baseline pH based on coordinates and administrative region
   */
  estimateSoil(lat: number, lon: number, state?: string, district?: string, country?: string): SoilEstimate {
    const s = (state || '').toLowerCase();
    const d = (district || '').toLowerCase();

    // 1. Black Soil (Vertisol) - Deccan Trap, Central/Western India
    if (
      s.includes('maharashtra') ||
      (s.includes('gujarat') && (d.includes('surat') || d.includes('rajkot') || d.includes('bhavnagar') || d.includes('amreli') || d.includes('junagadh') || d.includes('bharuch') || d.includes('vadodara') || d.includes('saurashtra') || d.includes('jamnagar'))) ||
      (s.includes('madhya pradesh') && (d.includes('indore') || d.includes('ujjain') || d.includes('dewas') || d.includes('bhopal') || d.includes('khargone') || d.includes('khandwa') || d.includes('dhar') || d.includes('ratlam') || d.includes('malwa') || d.includes('hoshangabad'))) ||
      (s.includes('karnataka') && (d.includes('belagavi') || d.includes('belgaum') || d.includes('dharwad') || d.includes('kalaburagi') || d.includes('gulbarga') || d.includes('vijayapura') || d.includes('bijapur') || d.includes('bagalkot') || d.includes('bidar') || d.includes('raichur') || d.includes('gadag'))) ||
      (s.includes('telangana') && (d.includes('adilabad') || d.includes('nizamabad') || d.includes('karimnagar'))) ||
      d.includes('pune') || d.includes('nagpur') || d.includes('nashik') || d.includes('aurangabad') || d.includes('sambhajinagar') || d.includes('solapur') || d.includes('kolhapur') || d.includes('jalgaon') || d.includes('akola') || d.includes('amravati') || d.includes('nanded') || d.includes('satara') || d.includes('wardha') || d.includes('yavatmal') || d.includes('parbhani')
    ) {
      return {
        soilType: 'Black Soil (Vertisol)',
        soilPh: 7.4,
        description: 'Deep black basaltic clay soil (Regur/Vertisol), rich in calcium, magnesium, and carbonate with high moisture retention.',
        regionalNotes: 'Deccan basaltic trap; ideal for Cotton, Soybean, Wheat, Gram, and Sugarcane.',
        confidence: 'High'
      };
    }

    // 2. Sandy Loam - Arid & Semi-Arid North-West (Thar fringe)
    if (
      s.includes('rajasthan') ||
      d.includes('jodhpur') || d.includes('bikaner') || d.includes('jaisalmer') || d.includes('barmer') || d.includes('churu') || d.includes('nagaur') || d.includes('sikar') || d.includes('jhunjhunu') || d.includes('jaipur') || d.includes('ajmer') || d.includes('pali') ||
      (s.includes('haryana') && (d.includes('sirsa') || d.includes('hisar') || d.includes('bhiwani') || d.includes('fatehabad') || d.includes('mahendragarh') || d.includes('charkhi dadri'))) ||
      (s.includes('gujarat') && (d.includes('kutch') || d.includes('kachchh') || d.includes('banaskantha') || d.includes('patan') || d.includes('mehsana')))
    ) {
      return {
        soilType: 'Sandy Loam',
        soilPh: 7.8,
        description: 'Light-textured sandy loam with rapid drainage, high aeration, quick spring warming, and low water-holding capacity.',
        regionalNotes: 'Semi-arid zone; responsive to drip irrigation and ideal for Mustard, Pearl Millet (Bajra), Pulses, and Groundnut.',
        confidence: 'High'
      };
    }

    // 3. Red Loam - Peninsular & Eastern Plateau Belt
    if (
      s.includes('tamil nadu') ||
      (s.includes('andhra pradesh') && (d.includes('anantapur') || d.includes('chittoor') || d.includes('kadapa') || d.includes('kurnool') || d.includes('rayalaseema') || d.includes('prakasam'))) ||
      (s.includes('karnataka') && (d.includes('bengaluru') || d.includes('bangalore') || d.includes('mysuru') || d.includes('mysore') || d.includes('mandya') || d.includes('tumakuru') || d.includes('tumkur') || d.includes('hassan') || d.includes('kolar') || d.includes('chikkaballapur') || d.includes('chamarajanagar'))) ||
      (s.includes('telangana') && (d.includes('hyderabad') || d.includes('warangal') || d.includes('mahbubnagar') || d.includes('nalgonda') || d.includes('khammam') || d.includes('rangareddy'))) ||
      s.includes('odisha') || s.includes('orissa') ||
      s.includes('jharkhand') ||
      s.includes('chhattisgarh')
    ) {
      return {
        soilType: 'Red Loam',
        soilPh: 6.4,
        description: 'Porous red loam rich in ferric oxide, slightly acidic to neutral, with high responsiveness to organic fertilizers.',
        regionalNotes: 'Peninsular red soil tract; excellent for Groundnut, Maize, Millets, Pulses, and Vegetables with irrigation.',
        confidence: 'High'
      };
    }

    // 4. Clay Loam - Heavy rainfall coastal, Western Ghats, and lateritic zones
    if (
      s.includes('kerala') ||
      s.includes('goa') ||
      (s.includes('karnataka') && (d.includes('dakshina kannada') || d.includes('udupi') || d.includes('uttara kannada') || d.includes('coorg') || d.includes('kodagu') || d.includes('chikkamagaluru') || d.includes('shivamogga'))) ||
      (s.includes('maharashtra') && (d.includes('ratnagiri') || d.includes('sindhudurg') || d.includes('raigad') || d.includes('thane') || d.includes('palghar'))) ||
      s.includes('meghalaya') || s.includes('tripura') || s.includes('mizoram') || s.includes('nagaland') || s.includes('manipur')
    ) {
      return {
        soilType: 'Clay Loam',
        soilPh: 5.8,
        description: 'Heavy clay loam / lateritic soil with high organic matter, dense structure, and high nutrient holding capacity.',
        regionalNotes: 'Coastal/humid tract; ideal for Paddy (Rice), Spices (Ginger, Turmeric), Coconut, and Plantation crops.',
        confidence: 'High'
      };
    }

    // 5. Alluvial - Indo-Gangetic Plains & River Deltas
    if (
      s.includes('punjab') ||
      s.includes('haryana') ||
      s.includes('uttar pradesh') ||
      s.includes('bihar') ||
      s.includes('west bengal') ||
      s.includes('assam') ||
      s.includes('delhi') ||
      d.includes('ludhiana') || d.includes('amritsar') || d.includes('jalandhar') || d.includes('patiala') || d.includes('bathinda') || d.includes('karnal') || d.includes('kurukshetra') || d.includes('ambala') || d.includes('meerut') || d.includes('lucknow') || d.includes('kanpur') || d.includes('varanasi') || d.includes('prayagraj') || d.includes('patna') || d.includes('muzaffarpur')
    ) {
      return {
        soilType: 'Alluvial',
        soilPh: 7.0,
        description: 'Fertile river silt and alluvial loam with balanced texture, excellent moisture retention, and high mineral richness.',
        regionalNotes: 'Indo-Gangetic alluvial plains; premier agricultural belt for Wheat, Rice (Paddy), Sugarcane, and Potato.',
        confidence: 'High'
      };
    }

    // 6. Loam - Mountain valleys, sub-Himalayan, and balanced international temperate zones
    if (
      s.includes('himachal') ||
      s.includes('uttarakhand') ||
      s.includes('jammu') || s.includes('kashmir') ||
      d.includes('shimla') || d.includes('dehradun') || d.includes('srinagar') || d.includes('haridwar')
    ) {
      return {
        soilType: 'Loam',
        soilPh: 6.5,
        description: 'Rich mountain forest loam, high in decomposed humus, balanced drainage and crumb tilth.',
        regionalNotes: 'Sub-Himalayan valley soil; optimal for temperate fruits, Barley, Maize, and seasonal vegetables.',
        confidence: 'High'
      };
    }

    // Coordinate Bounding Box Fallback (if state/district names were unavailable)
    // Northwest Arid
    if (lat >= 24.0 && lat <= 30.0 && lon >= 69.0 && lon <= 76.0) {
      return {
        soilType: 'Sandy Loam',
        soilPh: 7.8,
        description: 'Northwest semi-arid sandy loam with fast drainage and high aeration.',
        regionalNotes: 'Regional Thar fringe; suited for drought-hardy crops and oilseeds.',
        confidence: 'Medium'
      };
    }

    // Indo-Gangetic Alluvial Band
    if (lat >= 24.5 && lat <= 32.5 && lon >= 74.0 && lon <= 88.5) {
      return {
        soilType: 'Alluvial',
        soilPh: 7.0,
        description: 'Indo-Gangetic alluvial loam with optimal fertility and moisture balance.',
        regionalNotes: 'River basin deposit; suitable for intensive multi-crop rotations.',
        confidence: 'Medium'
      };
    }

    // Central Deccan Black Soil Belt
    if (lat >= 15.5 && lat <= 24.0 && lon >= 73.0 && lon <= 80.5) {
      return {
        soilType: 'Black Soil (Vertisol)',
        soilPh: 7.4,
        description: 'Deccan trap black soil with high clay and moisture conservation.',
        regionalNotes: 'Central plateau basalt tract; excellent for cotton, pulses, and soybean.',
        confidence: 'Medium'
      };
    }

    // Southern Peninsular Red Belt
    if (lat >= 8.0 && lat <= 18.0 && lon >= 76.5 && lon <= 84.5) {
      return {
        soilType: 'Red Loam',
        soilPh: 6.4,
        description: 'Southern peninsular red loam with porous texture and iron rich matrix.',
        regionalNotes: 'Responsive to balanced irrigation and organic amendments.',
        confidence: 'Medium'
      };
    }

    // Western Coastal Strip
    if (lat >= 8.5 && lat <= 19.5 && lon >= 72.8 && lon <= 75.5) {
      return {
        soilType: 'Clay Loam',
        soilPh: 5.8,
        description: 'Coastal heavy lateritic clay loam with high rainfall leaching and humus.',
        regionalNotes: 'High-precipitation belt; ideal for paddy, tubers, and spices.',
        confidence: 'Medium'
      };
    }

    // International & default standard
    return {
      soilType: 'Loam',
      soilPh: 6.8,
      description: 'Standard agricultural loam with balanced sand, silt, and clay proportions.',
      regionalNotes: 'Well-drained versatile soil suitable for most commercial field crops.',
      confidence: 'Estimated'
    };
  }
}

export const soilService = new SoilService();

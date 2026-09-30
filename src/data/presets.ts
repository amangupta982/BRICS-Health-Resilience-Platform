import { PresetReport, PresetCivicInspection } from '../types';

export const PRESET_REPORTS: PresetReport[] = [
  {
    id: 'report-waterborne-cluster',
    title: 'Flood Water Inundation & Severe Diarrhea Cluster',
    location: 'Riverside Post, Purus Sub-basin (Amazonas, Brazil)',
    regionCode: 'BRA',
    category: 'Disease Outbreak',
    expectedSeverity: 'CRITICAL',
    rawText: 'PLZ SEND EMERGENCY MEDS river flash flood contaminated well water. 17 small children puking profuse watery rice-water stool. 4 infants completely unresponsive eyes sunken severe dehydration. WE HAVE ZERO RINGER LACTATE ZERO ORS LEFT. generator flooded cold chain lost. only 1 auxiliary nurse on duty doctor trapped other side of flooded bridge. need urgent medivac boat and iv fluids now!!',
    tags: ['Flooding', 'Dehydration', 'IV Fluids', 'Pediatric', 'Emergency'],
  },
  {
    id: 'report-malaria-stockout',
    title: 'Seasonal Malaria Surge & ACT Stockout',
    location: 'Bushbuckridge Primary Clinic (Mpumalanga, South Africa)',
    regionCode: 'ZAF',
    category: 'Stockout & Medicine',
    expectedSeverity: 'CRITICAL',
    rawText: 'urgent report clinic overwhelmed since 3 days heavy rains. 52 patients shivering high temp 39.8C positive on mRDT for falciparum. Artemether-Lumefantrine stock is ZERO. Paracetamol tablets 0 boxes left. Pregnant woman in 3rd trimester convulsing with cerebral malaria symptoms, no injectable artesunate available in district depot. Please reroute supplies from regional hospital immediately.',
    tags: ['Malaria', 'Stockout', 'ACT', 'Cerebral Malaria', 'Fever Surge'],
  },
  {
    id: 'report-respiratory-cluster',
    title: 'Atypical Acute Respiratory Cluster in Mine Workers',
    location: 'Primary Health Centre, Singrauli Coalfield (Madhya Pradesh, India)',
    regionCode: 'IND',
    category: 'Disease Outbreak',
    expectedSeverity: 'HIGH',
    rawText: 'sir reporting 9 male opencast pit workers brought in with sudden severe chest pain, blood in sputum, high grade fever and spO2 below 84%. suspect acute legionella or drug resistant tb cluster or toxic dust inhalation. we have only 2 oxygen concentrators and both running on single backup battery. no n95 masks left only cloth masks. need isolation protocol guideline and oxygen cylinders fast.',
    tags: ['Respiratory', 'Hypoxia', 'Oxygen Deficit', 'Worker Cluster', 'Infection Control'],
  },
  {
    id: 'report-coldchain-blackout',
    title: 'Cold-Chain Failure & Rabies/Antivenom Threat',
    location: 'Aldansky District Health Outpost (Sakha Republic, Russia)',
    regionCode: 'RUS',
    category: 'Facility Crisis',
    expectedSeverity: 'HIGH',
    rawText: 'generator crank cracked during blizzard temp dropped inside pharmacy. main solar battery bank failed. cold chain fridge thermometer showing +19 deg C for at least 14 hours. 42 doses rabies post-exposure vaccine, 18 vials viper antivenom, and all insulin vials possibly compromised. forestry worker bitten by wild fox 2 hrs ago waiting for PEP. need immediate guidance on vial viability and emergency helicopter dispatch.',
    tags: ['Cold Chain', 'Rabies', 'Antivenom', 'Power Failure', 'Biologics'],
  },
  {
    id: 'report-hemorrhagic-rash',
    title: 'Pediatric Petechial Fever Cluster',
    location: 'Rural Township Clinic, Zhoukou District (Henan, China)',
    regionCode: 'CHN',
    category: 'Disease Outbreak',
    expectedSeverity: 'CRITICAL',
    rawText: 'urgent alert. 6 kindergarten toddlers presented within 4 hours with sudden hyperpyrexia 40.5C, neck stiffness, and rapidly spreading purpuric petechial rash on extremities. 2 children slipping into septic shock. IV ceftriaxone stock down to last 3 ampoules. No lumbar puncture kit available. Suspected meningococcal meningitis outbreak. Requesting immediate district CDC lockdown team and pediatric ICU transfer.',
    tags: ['Meningococcemia', 'Purpura', 'Septic Shock', 'Ceftriaxone', 'Pediatric ICU'],
  },
  {
    id: 'report-routine-normal',
    title: 'Weekly Routine Inventory & Normal Status',
    location: 'Dispensary 04, Polokwane Outskirts (Limpopo, South Africa)',
    regionCode: 'ZAF',
    category: 'Routine Normal',
    expectedSeverity: 'LOW',
    rawText: 'weekly status update dispensary 04. patient footfall 44 patients this week, mostly routine diabetes and hypertension checkups. all essential medicines at safe buffer stock levels. cold chain fridge steady at 3.8C. solar system operating normal. requesting 2 extra adult blood pressure cuffs and 1 replacement stethocope on next routine delivery cycle.',
    tags: ['Routine', 'Stable', 'Cold Chain OK', 'Buffer Stock', 'Hypertension'],
  },
  {
    id: 'report-panicked-messy',
    title: 'Panicked Voice-to-Text Fragment from Remote Nurse',
    location: 'Deep Forest CHW Sub-center (Odisha, India)',
    regionCode: 'IND',
    category: 'Panicked Ambiguity',
    expectedSeverity: 'CRITICAL',
    rawText: 'helpp medisin finish docter gone leave 2 days village 8 child 3 dead morning now 5 more vomiting dark blood loose motion yellow eye no vehical road washed away phone battery 4 percent plz send airlifter or boat fast fast village head screaming',
    tags: ['Jaundice', 'Hematemesis', 'Childhood Deaths', 'Cutoff Village', 'Urgent Medivac'],
  },
];

// Helper to generate crisp SVG data URIs for civic inspection sample previews
function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_CIVIC_INSPECTIONS: PresetCivicInspection[] = [
  {
    id: 'civic-pothole',
    title: 'Severe Road Pothole with Exposed Aggregate',
    category: 'Civic Hazard',
    isCivic: true,
    expectedType: 'Pothole',
    expectedSeverity: 'High',
    description: 'Deep asphalt crater measuring approximately 60cm in diameter on a municipal two-lane transit road, filled with muddy standing water and crumbling pavement edges exposing sub-base gravel.',
    imagePrompt: 'A realistic deep municipal asphalt road pothole, jagged edges, puddle of dirty water inside, asphalt cracks around it on a public street.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#334155"/>
        <!-- Road texture -->
        <rect x="0" y="0" width="600" height="400" fill="#1e293b"/>
        <!-- Road lane line -->
        <line x1="0" y1="200" x2="160" y2="200" stroke="#facc15" stroke-width="8" stroke-dasharray="30 20"/>
        <line x1="440" y1="200" x2="600" y2="200" stroke="#facc15" stroke-width="8" stroke-dasharray="30 20"/>
        <!-- Pothole crater -->
        <path d="M 180,180 C 220,130 360,140 420,180 C 450,220 410,280 340,290 C 260,300 170,260 180,180 Z" fill="#0f172a" stroke="#475569" stroke-width="4"/>
        <!-- Cracks -->
        <path d="M 420,180 L 480,160 M 340,290 L 370,350 M 180,180 L 120,150 M 240,295 L 210,360" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Water puddle inside -->
        <ellipse cx="300" cy="220" rx="90" ry="45" fill="#1e3a5f" opacity="0.8"/>
        <!-- Exposed rocks -->
        <circle cx="250" cy="240" r="7" fill="#64748b"/>
        <circle cx="330" cy="210" r="9" fill="#94a3b8"/>
        <circle cx="370" cy="250" r="6" fill="#64748b"/>
        <text x="20" y="40" fill="#94a3b8" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC INFRASTRUCTURE INSPECTION: ASPHALT ROADWAY</text>
      </svg>
    `),
  },
  {
    id: 'civic-water-leak',
    title: 'Municipal Water Main Rupture on Public Sidewalk',
    category: 'Civic Hazard',
    isCivic: true,
    expectedType: 'Water Leakage',
    expectedSeverity: 'Critical',
    description: 'High pressure municipal water pipe rupture gushing water onto public street pavement, causing soil erosion under curbing and flooding the pedestrian walkway.',
    imagePrompt: 'Municipal water main leak spraying pressurized water onto public sidewalk and curb, flooding the street gutter.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#334155"/>
        <!-- Sidewalk & Curb -->
        <rect x="0" y="0" width="600" height="180" fill="#94a3b8"/>
        <rect x="0" y="180" width="600" height="30" fill="#cbd5e1"/>
        <rect x="0" y="210" width="600" height="190" fill="#1e293b"/>
        <!-- Manhole / Valve cover -->
        <circle cx="300" cy="180" r="40" fill="#475569" stroke="#1e293b" stroke-width="4"/>
        <!-- Water burst -->
        <path d="M 280,180 Q 250,70 300,50 Q 350,70 320,180 Z" fill="#38bdf8" opacity="0.85"/>
        <path d="M 270,180 Q 200,90 220,120" stroke="#bae6fd" stroke-width="6" fill="none"/>
        <path d="M 330,180 Q 400,90 380,120" stroke="#bae6fd" stroke-width="6" fill="none"/>
        <!-- Water pooling -->
        <ellipse cx="320" cy="270" rx="200" ry="70" fill="#0284c7" opacity="0.6"/>
        <text x="20" y="30" fill="#0f172a" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC INFRASTRUCTURE: MUNICIPAL WATER UTILITY</text>
      </svg>
    `),
  },
  {
    id: 'civic-garbage',
    title: 'Overflowing Municipal Dumpster Blockage',
    category: 'Civic Hazard',
    isCivic: true,
    expectedType: 'Garbage',
    expectedSeverity: 'Medium',
    description: 'Public municipal green waste container overflowing with domestic refuse bags, cardboard boxes, and scattered debris obstructing the pedestrian access ramp.',
    imagePrompt: 'Overflowing public dumpster with garbage bags spilling over the sidewalk and curb on a city street.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#1e293b"/>
        <rect x="0" y="260" width="600" height="140" fill="#475569"/>
        <!-- Dumpster -->
        <rect x="200" y="160" width="200" height="140" rx="8" fill="#15803d" stroke="#166534" stroke-width="5"/>
        <rect x="190" y="145" width="220" height="20" rx="4" fill="#14532d"/>
        <!-- Spilling bags -->
        <circle cx="240" cy="130" r="28" fill="#0f172a"/>
        <circle cx="310" cy="115" r="32" fill="#334155"/>
        <circle cx="370" cy="130" r="26" fill="#0f172a"/>
        <circle cx="160" cy="275" r="25" fill="#334155"/>
        <circle cx="430" cy="285" r="22" fill="#0f172a"/>
        <rect x="220" y="270" width="60" height="35" fill="#b45309" transform="rotate(15 220 270)"/>
        <text x="20" y="40" fill="#94a3b8" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC INFRASTRUCTURE: MUNICIPAL SOLID WASTE</text>
      </svg>
    `),
  },
  {
    id: 'civic-fake-laptop',
    title: 'NON-CIVIC PROOF: Office Laptop & Coffee Mug',
    category: 'Non-Civic Refusal Proof',
    isCivic: false,
    expectedType: 'Other',
    expectedSeverity: 'Low',
    description: 'Personal silver laptop computer open on a wooden indoor desk beside a ceramic coffee mug and notebook. Indoor personal scene; no civic infrastructure involved.',
    imagePrompt: 'A modern silver laptop on an indoor wooden office desk with a coffee mug and notebook. Indoor scene, no public infrastructure.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <!-- Wooden desk surface -->
        <rect width="600" height="400" fill="#78350f"/>
        <rect x="0" y="0" width="600" height="400" fill="#92400e" opacity="0.6"/>
        <!-- Laptop Base -->
        <rect x="150" y="240" width="300" height="70" rx="10" fill="#cbd5e1"/>
        <rect x="250" y="250" width="100" height="40" rx="4" fill="#94a3b8"/>
        <!-- Laptop Screen -->
        <rect x="160" y="90" width="280" height="155" rx="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="6"/>
        <rect x="175" y="105" width="250" height="125" fill="#1e293b"/>
        <!-- Ceramic Coffee Mug -->
        <circle cx="500" cy="270" r="30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="4"/>
        <circle cx="500" cy="270" r="22" fill="#451a03"/>
        <path d="M 530,260 C 550,260 550,285 530,285" fill="none" stroke="#f8fafc" stroke-width="5"/>
        <!-- Badge -->
        <rect x="20" y="20" width="280" height="30" rx="6" fill="#991b1b"/>
        <text x="30" y="40" fill="#fef2f2" font-family="sans-serif" font-size="12" font-weight="bold">REFUSAL TEST: NON-CIVIC INDOOR OBJECT</text>
      </svg>
    `),
  },
  {
    id: 'civic-fake-snack',
    title: 'NON-CIVIC PROOF: Snack Packet & Soda Can on Table',
    category: 'Non-Civic Refusal Proof',
    isCivic: false,
    expectedType: 'Other',
    expectedSeverity: 'Low',
    description: 'Personal potato chip foil packet and soda can resting on an indoor kitchen table. Pure consumer personal goods, not public infrastructure.',
    imagePrompt: 'A bag of potato chips and a soda can sitting on a kitchen table indoors. Consumer personal items, not civic infrastructure.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#f1f5f9"/>
        <!-- Table edge -->
        <rect x="0" y="150" width="600" height="250" fill="#e2e8f0"/>
        <!-- Chip Bag -->
        <polygon points="180,180 280,160 300,320 160,340" fill="#ef4444" stroke="#b91c1c" stroke-width="4"/>
        <text x="190" y="260" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="22" transform="rotate(-6 190 260)">CRUNCH</text>
        <!-- Soda can -->
        <rect x="360" y="190" width="70" height="130" rx="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>
        <ellipse cx="395" cy="195" rx="30" ry="10" fill="#93c5fd"/>
        <!-- Badge -->
        <rect x="20" y="20" width="280" height="30" rx="6" fill="#991b1b"/>
        <text x="30" y="40" fill="#fef2f2" font-family="sans-serif" font-size="12" font-weight="bold">REFUSAL TEST: PERSONAL CONSUMER ITEM</text>
      </svg>
    `),
  },
];

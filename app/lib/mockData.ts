import type { CaseDetail, CaseSummary, DashboardSummary, GraphData, MapHotspot, TimelineEvent } from '../types';

export const MOCK_CASES: CaseDetail[] = [
  {
    caseId: 'KA-BC-2026-00812',
    firNumber: 'FIR-0812/2026',
    district: 'Bengaluru City',
    station: 'Indiranagar PS',
    incidentDate: '2026-06-10T22:30:00Z',
    registeredDate: '2026-06-11T09:15:00Z',
    category: 'Theft / Burglary',
    status: 'Under Investigation',
    gravity: 'Grave',
    crimeHead: 'House Breaking by Night',
    complainants: ['Dr. Ramesh Rao, 45, Indiranagar'],
    victims: ['Dr. Ramesh Rao'],
    accused: ['Karthik alias "Poochi" Karthik', 'unknown associate'],
    arrests: [
      { date: '2026-06-25T14:00:00Z', person: 'Karthik alias "Poochi" Karthik', location: 'Majestic Bus Stand, Bengaluru' }
    ],
    actsSections: [
      { act: 'IPC 1860', section: 'Section 457 (Lurking house-trespass by night)' },
      { act: 'IPC 1860', section: 'Section 380 (Theft in dwelling house)' }
    ],
    court: '1st ACMM Court, Bengaluru',
    chargesheeted: false,
    summaryText: 'On the night of 10th June 2026, the complainant Dr. Ramesh Rao reported that while his family was away in Mysuru, unknown culprits broke open the rear grill window of his residence in Indiranagar. The culprits entered the house and made away with gold jewelry weighing 150 grams and cash of ₹1,20,000. Forensic team collected finger prints. Case was registered under IPC 457/380. On 25th June, based on informant tip-off, history-sheeter Karthik alias Poochi Karthik was arrested at Majestic Bus Stand and gold ornaments worth ₹4,00,000 were recovered. Investigation is in progress to identify his associates.'
  },
  {
    caseId: 'KA-MY-2026-00124',
    firNumber: 'FIR-0124/2026',
    district: 'Mysuru City',
    station: 'Lashkar PS',
    incidentDate: '2026-05-14T11:00:00Z',
    registeredDate: '2026-05-14T13:45:00Z',
    category: 'Robbery',
    status: 'Chargesheeted',
    gravity: 'Grave',
    crimeHead: 'Highway Robbery',
    complainants: ['Sunitha M., 29, Lashkar Mohalla'],
    victims: ['Sunitha M.'],
    accused: ['Manju alias "Kulla" Manja', 'Srinivas alias "Seena"'],
    arrests: [
      { date: '2026-05-18T10:30:00Z', person: 'Manju alias "Kulla" Manja', location: 'K.R. Hospital Circle, Mysuru' },
      { date: '2026-05-19T18:00:00Z', person: 'Srinivas alias "Seena"', location: 'Nanjangud Road, Mysuru outskirts' }
    ],
    actsSections: [
      { act: 'IPC 1860', section: 'Section 392 (Robbery)' },
      { act: 'IPC 1860', section: 'Section 397 (Robbery with attempt to cause death)' }
    ],
    court: 'JMFC 2nd Court, Mysuru',
    chargesheeted: true,
    chargesheetDate: '2026-07-02T11:00:00Z',
    summaryText: 'Complainant Sunitha M. was walking home from Lashkar Circle when two persons riding a black pulsar motorcycle approached from behind, brandished a long knife, threatened her life, and snatched her gold nuptial chain weighing 40 grams. During the struggle, she sustained a minor laceration on her neck. Officers checked local CCTV footage. Suspects were identified as repeat offenders Kulla Manja and Seena. Both were arrested within 5 days. Snatched gold chain was fully recovered and identified. A formal chargesheet has been filed in JMFC 2nd Court.'
  },
  {
    caseId: 'KA-MN-2026-00431',
    firNumber: 'FIR-0431/2026',
    district: 'Mangaluru City',
    station: 'Kadri PS',
    incidentDate: '2026-06-20T15:30:00Z',
    registeredDate: '2026-06-21T10:00:00Z',
    category: 'Cheating / Fraud',
    status: 'Under Investigation',
    gravity: 'Non-Grave',
    crimeHead: 'Cyber/Online Fraud',
    complainants: ['Deviprasad Shetty, 52, Kadri'],
    victims: ['Deviprasad Shetty'],
    accused: ['Sanjay Kumar (fake identity)', 'unknown cyber criminals'],
    arrests: [],
    actsSections: [
      { act: 'IPC 1860', section: 'Section 420 (Cheating)' },
      { act: 'Information Technology Act 2000', section: 'Section 66D (Cheating by personation using computer resource)' }
    ],
    court: 'Chief Judicial Magistrate Court, Mangaluru',
    chargesheeted: false,
    summaryText: 'Deviprasad Shetty received a call from an unknown individual claiming to be a customer service representative from SBI. The caller stated that the complainant\'s credit card was about to be blocked and requested OTP verification to update the card status. Trusting the caller, the complainant shared the OTP, following which ₹85,000 was debited in three transactions. The funds were traced to e-wallet accounts registered in Noida. Investigation is ongoing, collaborating with Cyber Crime Cell, Mangaluru.'
  },
  {
    caseId: 'KA-KA-2026-00055',
    firNumber: 'FIR-0055/2026',
    district: 'Kalaburagi',
    station: 'Station Bazar PS',
    incidentDate: '2026-04-01T10:00:00Z',
    registeredDate: '2026-04-01T11:30:00Z',
    category: 'Assault',
    status: 'Disposed',
    gravity: 'Non-Grave',
    crimeHead: 'Grievous Hurt',
    complainants: ['Mallappa Gowda, 38, Kalaburagi'],
    victims: ['Mallappa Gowda'],
    accused: ['Basavaraj', 'Girish'],
    arrests: [
      { date: '2026-04-02T08:00:00Z', person: 'Basavaraj', location: 'Station Bazar area, Kalaburagi' },
      { date: '2026-04-02T08:00:00Z', person: 'Girish', location: 'Station Bazar area, Kalaburagi' }
    ],
    actsSections: [
      { act: 'IPC 1860', section: 'Section 324 (Voluntarily causing hurt by dangerous weapons)' },
      { act: 'IPC 1860', section: 'Section 326 (Voluntarily causing grievous hurt by dangerous weapons)' }
    ],
    court: 'Principal District Court, Kalaburagi',
    chargesheeted: true,
    chargesheetDate: '2026-04-20T10:00:00Z',
    summaryText: 'An altercation broke out at a tea stall between the complainant Mallappa and the accused individuals Basavaraj and Girish regarding a property dispute. The accused assaulted Mallappa with iron rods, fracturing his left forearm. Bystanders intervened. Case was registered immediately. Suspects were arrested the following day, and the iron weapons were seized. Chargesheet was submitted on 20th April. On 10th July, the Principal District Court disposed of the case, convicting both accused to 2 years of rigorous imprisonment.'
  },
  {
    caseId: 'KA-BD-2026-00910',
    firNumber: 'FIR-0910/2026',
    district: 'Belagavi',
    station: 'Khade Bazar PS',
    incidentDate: '2026-07-01T02:00:00Z',
    registeredDate: '2026-07-01T14:20:00Z',
    category: 'Theft / Burglary',
    status: 'Under Investigation',
    gravity: 'Grave',
    crimeHead: 'Commercial Burglary',
    complainants: ['Anand Shah, 41, Belagavi Commercial Guild'],
    victims: ['Anand Shah'],
    accused: ['unknown offenders'],
    arrests: [],
    actsSections: [
      { act: 'IPC 1860', section: 'Section 457 (Lurking house-trespass by night)' },
      { act: 'IPC 1860', section: 'Section 380 (Theft in dwelling house)' }
    ],
    court: 'JMFC Court, Belagavi',
    chargesheeted: false,
    summaryText: 'On the early morning of 1st July 2026, unknown thieves broke into a mobile retail store in Khade Bazar. Shutter locks were cut using heavy metal cutters. The thieves stole 45 premium smartphones and ₹35,000 cash from the register, totaling an estimated loss of ₹9,50,000. CCTV cameras were spray-painted by the culprits. Forensic team gathered footprints and traces of metal fragments. Investigation is being led by Inspector Patil.'
  }
];

export const MOCK_DASHBOARD: DashboardSummary = {
  kpis: {
    totalFirs: 5410,
    activeCases: 1982,
    chargesheeted: 2914,
    arrests: 4180
  },
  topDistricts: [
    { district: 'Bengaluru City', count: 1820 },
    { district: 'Mysuru City', count: 742 },
    { district: 'Hubballi-Dharwad City', count: 531 },
    { district: 'Mangaluru City', count: 489 },
    { district: 'Belagavi', count: 410 },
    { district: 'Kalaburagi', count: 320 }
  ],
  topCategories: [
    { category: 'Theft / Burglary', count: 1650 },
    { category: 'Assault', count: 1240 },
    { category: 'Cheating / Fraud', count: 980 },
    { category: 'Robbery', count: 710 },
    { category: 'Cyber Crimes', count: 430 },
    { category: 'Other Crimes', count: 400 }
  ],
  recentFirs: MOCK_CASES.slice(0, 4)
};

export const MOCK_MAP_HOTSPOTS: MapHotspot[] = [
  { latitude: 12.9716, longitude: 77.5946, weight: 8, firNumber: 'FIR-0812/2026', category: 'Theft / Burglary', district: 'Bengaluru City' },
  { latitude: 12.9789, longitude: 77.6432, weight: 6, firNumber: 'FIR-0819/2026', category: 'Theft / Burglary', district: 'Bengaluru City' },
  { latitude: 12.9562, longitude: 77.6123, weight: 9, firNumber: 'FIR-0824/2026', category: 'Cyber Crimes', district: 'Bengaluru City' },
  { latitude: 12.2958, longitude: 76.6394, weight: 7, firNumber: 'FIR-0124/2026', category: 'Robbery', district: 'Mysuru City' },
  { latitude: 12.3112, longitude: 76.6548, weight: 5, firNumber: 'FIR-0130/2026', category: 'Assault', district: 'Mysuru City' },
  { latitude: 12.8702, longitude: 74.8804, weight: 6, firNumber: 'FIR-0431/2026', category: 'Cheating / Fraud', district: 'Mangaluru City' },
  { latitude: 15.8497, longitude: 74.4977, weight: 7, firNumber: 'FIR-0910/2026', category: 'Theft / Burglary', district: 'Belagavi' },
  { latitude: 17.3297, longitude: 76.8343, weight: 4, firNumber: 'FIR-0055/2026', category: 'Assault', district: 'Kalaburagi' }
];

export const MOCK_GRAPHS: Record<string, GraphData> = {
  'KA-BC-2026-00812': {
    nodes: [
      { id: 'KA-BC-2026-00812', label: 'FIR-0812/2026 (House Breaking)', type: 'case' },
      { id: 'Ramesh Rao', label: 'Dr. Ramesh Rao (Complainant)', type: 'victim' },
      { id: 'Poochi Karthik', label: 'Karthik alias "Poochi" Karthik (Accused)', type: 'accused' },
      { id: 'Indiranagar PS', label: 'Indiranagar PS (Station)', type: 'station' },
      { id: 'KA-BC-2025-00412', label: 'FIR-0412/2025 (Theft - History)', type: 'case' },
      { id: 'KA-BC-2024-00109', label: 'FIR-0109/2024 (Burglary - History)', type: 'case' }
    ],
    edges: [
      { source: 'KA-BC-2026-00812', target: 'Ramesh Rao', relationship: 'victim_of' },
      { source: 'KA-BC-2026-00812', target: 'Poochi Karthik', relationship: 'accused_in' },
      { source: 'KA-BC-2026-00812', target: 'Indiranagar PS', relationship: 'registered_at' },
      { source: 'KA-BC-2025-00412', target: 'Poochi Karthik', relationship: 'accused_in' },
      { source: 'KA-BC-2024-00109', target: 'Poochi Karthik', relationship: 'accused_in' }
    ]
  },
  'KA-MY-2026-00124': {
    nodes: [
      { id: 'KA-MY-2026-00124', label: 'FIR-0124/2026 (Highway Robbery)', type: 'case' },
      { id: 'Sunitha M', label: 'Sunitha M. (Complainant)', type: 'victim' },
      { id: 'Kulla Manja', label: 'Manju alias "Kulla" Manja (Accused)', type: 'accused' },
      { id: 'Seena', label: 'Srinivas alias "Seena" (Accused)', type: 'accused' },
      { id: 'Lashkar PS', label: 'Lashkar PS (Station)', type: 'station' },
      { id: 'KA-MY-2025-00714', label: 'FIR-0714/2025 (Snatching - History)', type: 'case' }
    ],
    edges: [
      { source: 'KA-MY-2026-00124', target: 'Sunitha M', relationship: 'victim_of' },
      { source: 'KA-MY-2026-00124', target: 'Kulla Manja', relationship: 'accused_in' },
      { source: 'KA-MY-2026-00124', target: 'Seena', relationship: 'accused_in' },
      { source: 'KA-MY-2026-00124', target: 'Lashkar PS', relationship: 'registered_at' },
      { source: 'KA-MY-2025-00714', target: 'Kulla Manja', relationship: 'accused_in' }
    ]
  }
};
export const DEFAULT_GRAPH: GraphData = {
  nodes: [
    { id: 'KA-BC-2026-00812', label: 'FIR-0812/2026', type: 'case' },
    { id: 'Poochi Karthik', label: 'Karthik alias "Poochi" Karthik', type: 'accused' },
    { id: 'KA-MY-2026-00124', label: 'FIR-0124/2026', type: 'case' },
    { id: 'Kulla Manja', label: 'Manju alias "Kulla" Manja', type: 'accused' }
  ],
  edges: [
    { source: 'KA-BC-2026-00812', target: 'Poochi Karthik', relationship: 'accused_in' },
    { source: 'KA-MY-2026-00124', target: 'Kulla Manja', relationship: 'accused_in' }
  ]
};
export const MOCK_TIMELINES: Record<string, TimelineEvent[]> = {
  'KA-BC-2026-00812': [
    { date: '2026-06-10T22:30:00Z', title: 'Incident Occurred', description: 'Culprits broke open rear window grill of the Indiranagar residence.', type: 'incident' },
    { date: '2026-06-11T09:15:00Z', title: 'FIR Registered', description: 'Complaint filed by Dr. Ramesh Rao. Registered under Indiranagar PS.', type: 'registration', delayDays: 0 },
    { date: '2026-06-14T11:00:00Z', title: 'Forensic Report Received', description: 'Fingerprint results indicate match with known property offenders registry.', type: 'arrest', delayDays: 3 },
    { date: '2026-06-25T14:00:00Z', title: 'Accused Arrested', description: 'History-sheeter Karthik arrested at Majestic Bus Stand with recovered gold.', type: 'arrest', delayDays: 14 }
  ],
  'KA-MY-2026-00124': [
    { date: '2026-05-14T11:00:00Z', title: 'Incident Occurred', description: 'Two suspects snatched gold nuptial chain at knife point near Lashkar circle.', type: 'incident' },
    { date: '2026-05-14T13:45:00Z', title: 'FIR Registered', description: 'Registered at Lashkar PS under Section 392/397 IPC.', type: 'registration', delayDays: 0 },
    { date: '2026-05-18T10:30:00Z', title: 'First Accused Arrested', description: 'Kulla Manja arrested from hospital circle area. Part of stolen chain recovered.', type: 'arrest', delayDays: 4 },
    { date: '2026-05-19T18:00:00Z', title: 'Second Accused Arrested', description: 'Seena arrested near Nanjangud Road outskirts with weapon of offense.', type: 'arrest', delayDays: 5 },
    { date: '2026-07-02T11:00:00Z', title: 'Chargesheet Filed', description: 'Chargesheet submitted to JMFC 2nd Court, Mysuru.', type: 'chargesheet', delayDays: 49 }
  ]
};

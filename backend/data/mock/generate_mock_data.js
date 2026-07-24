/**
 * generate_mock_data.js
 * Programmatically generates realistic crime records for Karnataka State Police (KSP) Crime Intelligence Copilot.
 * Generates master and transaction tables as specified in TRD.md and PRD.md.
 * Output: data/mock/mock_data.json
 */

const fs = require('fs');
const path = require('path');

// Helper to get random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random integer in range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate a random date in range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Format date to ISO string
function formatDate(date) {
  return date.toISOString();
}

// Format date only (YYYY-MM-DD)
function formatDateOnly(date) {
  return date.toISOString().split('T')[0];
}

// Generate random Aadhaar/system accused ID
function generateSystemAccusedId(seed) {
  return 'ACC-' + String(seed).padStart(5, '0');
}

// Generate random phone number
function generatePhone() {
  return '9' + Math.floor(100000000 + Math.random() * 900000000);
}

// Common Karnataka Names
const MALE_NAMES = [
  'Ramesh', 'Suresh', 'Manjunath', 'Venkatesh', 'Anand', 'Basavaraj', 'Shivakumar', 'Krishna',
  'Ningappa', 'Hanumanthappa', 'Mallikarjun', 'Ravi', 'Vijay', 'Kumar', 'Sandeep', 'Raghu',
  'Abhishek', 'Chandra', 'Naveen', 'Sunil', 'Girish', 'Prakash', 'Sharanappa', 'Siddappa',
  'Devendra', 'Kiran', 'Pradeep', 'Yogesh', 'Harish', 'Raghavendra', 'Ranganath', 'Satish'
];

const FEMALE_NAMES = [
  'Lakshmi', 'Shruthi', 'Radha', 'Gowri', 'Savitha', 'Geetha', 'Parvathi', 'Suma', 'Anupama',
  'Roopa', 'Kavitha', 'Asha', 'Vidya', 'Rekha', 'Divya', 'Priyanka', 'Deepa', 'Meena',
  'Netravathi', 'Saritha', 'Mamatha', 'Jyothi', 'Kavya', 'Preethi', 'Pushpa', 'Bhagya'
];

const SURNAMES = [
  'Gowda', 'Patil', 'Kulkarni', 'Hegde', 'Naik', 'Joshi', 'Rao', 'Bhat', 'Shetty', 'Pujar',
  'Nayak', 'Prasad', 'Murthy', 'Swamy', 'Kumar', 'Raj', 'Siddaramaiah', 'Yediyurappa', 'Desai',
  'Angadi', 'Jarkiholi', 'Bommai', 'Katte', 'Kamath', 'Pai', 'Kudla', 'Hubli', 'Dharwad'
];

const VILLAGES_AREAS = [
  'Jayanagar', 'Rajajinagar', 'Malleshwaram', 'Koramangala', 'Indiranagar', 'Yelahanka', 'Hebbal',
  'Devaraja Mohalla', 'Gokulam', 'Vidyaranyapuram', 'Kadri', 'Bejai', 'Urwa', 'Keshwapur',
  'Vidyanagar', 'Tilakwadi', 'Shahapur', 'Chowk Area', 'Roza Area', 'Kyathsandra', 'Sira Gate',
  'Doddapete', 'Kote Road', 'Vidya Nagar'
];

function generateName(gender) {
  const firstName = gender === 'Male' ? randomItem(MALE_NAMES) : randomItem(FEMALE_NAMES);
  const lastName = randomItem(SURNAMES);
  return `${firstName} ${lastName}`;
}

function generateAddress(districtName) {
  const area = randomItem(VILLAGES_AREAS);
  const door = randomRange(10, 999);
  const cross = randomRange(1, 15);
  return `#${door}, ${cross}th Cross, ${area}, ${districtName}, Karnataka`;
}

// Bounding boxes and centroids for 8 Karnataka Districts
const DISTRICTS_CONFIG = [
  { name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946, latDelta: 0.15, lngDelta: 0.15 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394, latDelta: 0.12, lngDelta: 0.12 },
  { name: 'Mangaluru', lat: 12.9141, lng: 74.8560, latDelta: 0.08, lngDelta: 0.08 },
  { name: 'Hubli-Dharwad', lat: 15.3647, lng: 75.1240, latDelta: 0.12, lngDelta: 0.12 },
  { name: 'Belagavi', lat: 15.8497, lng: 74.4977, latDelta: 0.15, lngDelta: 0.15 },
  { name: 'Kalaburagi', lat: 17.3297, lng: 76.8340, latDelta: 0.15, lngDelta: 0.15 },
  { name: 'Tumkur', lat: 13.3379, lng: 77.1173, latDelta: 0.18, lngDelta: 0.18 },
  { name: 'Shimoga', lat: 13.9299, lng: 75.5681, latDelta: 0.15, lngDelta: 0.15 }
];

// Master tables configuration
const state = [{ ROWID: 1, state_name: 'Karnataka' }];

const districts = DISTRICTS_CONFIG.map((d, index) => ({
  ROWID: index + 1,
  district_name: d.name,
  state_id: 1
}));

const unitTypes = [
  { ROWID: 1, unit_type_name: 'Police Station' },
  { ROWID: 2, unit_type_name: 'Circle Office' },
  { ROWID: 3, unit_type_name: 'SDPO Office' },
  { ROWID: 4, unit_type_name: 'District Police Office' }
];

const unitDataRaw = {
  'Bengaluru Urban': ['Jayanagar PS', 'Koramangala PS', 'Indiranagar PS', 'Whitefield PS'],
  'Mysuru': ['Devaraja PS', 'Lashkar PS', 'Vidyaranyapuram PS', 'Kuempunagar PS'],
  'Mangaluru': ['Kadri PS', 'Urwa PS', 'Pandeshwar PS', 'Bunder PS'],
  'Hubli-Dharwad': ['Suburban PS', 'Hubli Town PS', 'Gokul Road PS', 'Vidyagiri PS'],
  'Belagavi': ['Khade Bazar PS', 'Camp PS', 'Market PS', 'Udyambag PS'],
  'Kalaburagi': ['Chowk PS', 'Station Bazar PS', 'University PS', 'Raghavendra Nagar PS'],
  'Tumkur': ['Tumkur Town PS', 'New Extension PS', 'Kyathsandra PS', 'Tilak Park PS'],
  'Shimoga': ['Kote PS', 'Tunga Nagar PS', 'Doddapete PS', 'Jayanagar PS Shimoga']
};

const units = [];
let unitIdCounter = 1;
for (const dist of districts) {
  const stationNames = unitDataRaw[dist.district_name] || [];
  for (const name of stationNames) {
    units.push({
      ROWID: unitIdCounter++,
      unit_name: name,
      unit_type_id: 1, // Police Station
      district_id: dist.ROWID
    });
  }
}

const ranks = [
  { ROWID: 1, rank_name: 'Police Constable (PC)' },
  { ROWID: 2, rank_name: 'Head Constable (HC)' },
  { ROWID: 3, rank_name: 'Assistant Sub-Inspector (ASI)' },
  { ROWID: 4, rank_name: 'Police Sub-Inspector (PSI)' },
  { ROWID: 5, rank_name: 'Police Inspector (PI)' },
  { ROWID: 6, rank_name: 'Deputy Superintendent of Police (DySP)' }
];

const designations = [
  { ROWID: 1, designation_name: 'General Duty Officer' },
  { ROWID: 2, designation_name: 'Station House Officer (SHO)' },
  { ROWID: 3, designation_name: 'Investigating Officer (IO)' },
  { ROWID: 4, designation_name: 'Crime Branch Lead' },
  { ROWID: 5, designation_name: 'Writer' }
];

// Generate Police Employees for each unit
const employees = [];
let employeeIdCounter = 1;
const generatedBadges = new Set();

function generateUniqueBadge(min, max) {
  let badge;
  do {
    badge = `B-${randomRange(min, max)}`;
  } while (generatedBadges.has(badge));
  generatedBadges.add(badge);
  return badge;
}

for (const unit of units) {
  // Let's create 1 Inspector (PI), 2 Sub-Inspectors (PSI), and 3 Constables/Head Constables per station
  const stationInspectors = 1;
  const stationPSIs = 2;
  const stationConstables = 3;

  const districtObj = districts.find(d => d.ROWID === unit.district_id);
  const districtName = districtObj.district_name;

  // Inspector
  employees.push({
    ROWID: employeeIdCounter++,
    employee_name: `PI ${generateName('Male')}`,
    rank_id: 5, // Inspector
    designation_id: 2, // SHO
    unit_id: unit.ROWID,
    badge_number: generateUniqueBadge(10000, 19999)
  });

  // PSIs
  for (let i = 0; i < stationPSIs; i++) {
    employees.push({
      ROWID: employeeIdCounter++,
      employee_name: `PSI ${generateName(Math.random() > 0.15 ? 'Male' : 'Female')}`,
      rank_id: 4, // PSI
      designation_id: 3, // IO
      unit_id: unit.ROWID,
      badge_number: generateUniqueBadge(20000, 29999)
    });
  }

  // Constables
  for (let i = 0; i < stationConstables; i++) {
    const isHC = Math.random() > 0.4;
    employees.push({
      ROWID: employeeIdCounter++,
      employee_name: `${isHC ? 'HC' : 'PC'} ${generateName(Math.random() > 0.2 ? 'Male' : 'Female')}`,
      rank_id: isHC ? 2 : 1,
      designation_id: 1, // GD
      unit_id: unit.ROWID,
      badge_number: generateUniqueBadge(30000, 49999)
    });
  }
}

const courts = districts.map((dist) => ({
  ROWID: dist.ROWID,
  court_name: `JMFC Court, ${dist.district_name}`,
  district_id: dist.ROWID
}));

const caseStatusMaster = [
  { ROWID: 1, status_name: 'Under Investigation' },
  { ROWID: 2, status_name: 'Chargesheeted' },
  { ROWID: 3, status_name: 'Closed - Untraceable (A-Report)' },
  { ROWID: 4, status_name: 'Closed - Mistake of Fact (B-Report)' },
  { ROWID: 5, status_name: 'Closed - Non-Cognizable (C-Report)' },
  { ROWID: 6, status_name: 'Closed - Abated (Accused Deceased)' },
  { ROWID: 7, status_name: 'Trial Stage' }
];

const gravityOffence = [
  { ROWID: 1, gravity_name: 'Heinous' },
  { ROWID: 2, gravity_name: 'Non-Heinous' }
];

const caseCategory = [
  { ROWID: 1, category_name: 'Theft' },
  { ROWID: 2, category_name: 'Murder' },
  { ROWID: 3, category_name: 'Robbery' },
  { ROWID: 4, category_name: 'Cybercrime' },
  { ROWID: 5, category_name: 'Assault' },
  { ROWID: 6, category_name: 'Kidnapping' },
  { ROWID: 7, category_name: 'Rape / Crime Against Women' },
  { ROWID: 8, category_name: 'Cheating / Forgery' },
  { ROWID: 9, category_name: 'Narcotics (NDPS)' }
];

const crimeHead = [
  { ROWID: 1, crime_head_name: 'Property Offence' },
  { ROWID: 2, crime_head_name: 'Offence Against Body' },
  { ROWID: 3, crime_head_name: 'Economic Offence' },
  { ROWID: 4, crime_head_name: 'Cyber Crimes' },
  { ROWID: 5, crime_head_name: 'Narcotic Crimes' },
  { ROWID: 6, crime_head_name: 'Crime Against Women & Children' }
];

const crimeSubHead = [
  // Property (1)
  { ROWID: 1, crime_sub_head_name: 'House Break-in by Day', crime_head_id: 1 },
  { ROWID: 2, crime_sub_head_name: 'House Break-in by Night', crime_head_id: 1 },
  { ROWID: 3, crime_sub_head_name: 'Motor Vehicle Theft', crime_head_id: 1 },
  { ROWID: 4, crime_sub_head_name: 'Chain Snatching', crime_head_id: 1 },
  // Body (2)
  { ROWID: 5, crime_sub_head_name: 'Murder for Gain', crime_head_id: 2 },
  { ROWID: 6, crime_sub_head_name: 'Murder due to Personal Enmity', crime_head_id: 2 },
  { ROWID: 7, crime_sub_head_name: 'Attempt to Murder', crime_head_id: 2 },
  { ROWID: 8, crime_sub_head_name: 'Grievous Hurt', crime_head_id: 2 },
  // Economic (3)
  { ROWID: 9, crime_sub_head_name: 'Cheating by Impersonation', crime_head_id: 3 },
  { ROWID: 10, crime_sub_head_name: 'Job Fraud', crime_head_id: 3 },
  { ROWID: 11, crime_sub_head_name: 'Fake Currency Distribution', crime_head_id: 3 },
  // Cyber (4)
  { ROWID: 12, crime_sub_head_name: 'Phishing Scam', crime_head_id: 4 },
  { ROWID: 13, crime_sub_head_name: 'Identity Theft', crime_head_id: 4 },
  { ROWID: 14, crime_sub_head_name: 'Online Ransomware Demand', crime_head_id: 4 },
  // Narcotics (5)
  { ROWID: 15, crime_sub_head_name: 'Possession of Commercial Quantity Drugs', crime_head_id: 5 },
  { ROWID: 16, crime_sub_head_name: 'Drug Peddling & Distribution', crime_head_id: 5 },
  // Women/Children (6)
  { ROWID: 17, crime_sub_head_name: 'Dowry Murder / Harassment', crime_head_id: 6 },
  { ROWID: 18, crime_sub_head_name: 'Assault to Outrage Modesty', crime_head_id: 6 },
  { ROWID: 19, crime_sub_head_name: 'Kidnapping & Abduction', crime_head_id: 6 }
];

const acts = [
  { ROWID: 1, act_name: 'Indian Penal Code 1860 (IPC)', act_description: 'General criminal code of India' },
  { ROWID: 2, act_name: 'Information Technology Act 2000 (IT Act)', act_description: 'Governs cyber crimes and e-commerce' },
  { ROWID: 3, act_name: 'Narcotic Drugs & Psychotropic Substances Act 1985 (NDPS)', act_description: 'Prohibits drug abuse and trafficking' },
  { ROWID: 4, act_name: 'Protection of Children from Sexual Offences Act 2012 (POCSO)', act_description: 'Protects children from sexual abuse' },
  { ROWID: 5, act_name: 'Karnataka Police Act 1963 (KPA)', act_description: 'Regulates police organization and public order in Karnataka' }
];

const sections = [
  // IPC sections
  { ROWID: 1, section_number: 'Section 379', section_description: 'Theft (maximum 3 years)', act_id: 1 },
  { ROWID: 2, section_number: 'Section 380', section_description: 'Theft in dwelling house (maximum 7 years)', act_id: 1 },
  { ROWID: 3, section_number: 'Section 302', section_description: 'Murder (Death or life imprisonment)', act_id: 1 },
  { ROWID: 4, section_number: 'Section 307', section_description: 'Attempt to murder (maximum 10 years)', act_id: 1 },
  { ROWID: 5, section_number: 'Section 392', section_description: 'Robbery (maximum 10 years)', act_id: 1 },
  { ROWID: 6, section_number: 'Section 395', section_description: 'Dacoity (Imprisonment for life or rigorous up to 10 years)', act_id: 1 },
  { ROWID: 7, section_number: 'Section 420', section_description: 'Cheating and dishonestly inducing delivery of property', act_id: 1 },
  { ROWID: 8, section_number: 'Section 324', section_description: 'Voluntarily causing hurt by dangerous weapons', act_id: 1 },
  { ROWID: 9, section_number: 'Section 326', section_description: 'Voluntarily causing grievous hurt by dangerous weapons', act_id: 1 },
  { ROWID: 10, section_number: 'Section 354', section_description: 'Assault or criminal force to woman with intent to outrage her modesty', act_id: 1 },
  { ROWID: 11, section_number: 'Section 363', section_description: 'Kidnapping', act_id: 1 },
  { ROWID: 12, section_number: 'Section 498A', section_description: 'Cruelty by husband or relatives', act_id: 1 },
  { ROWID: 13, section_number: 'Section 397', section_description: 'Robbery or dacoity, with attempt to cause death or grievous hurt', act_id: 1 },
  { ROWID: 14, section_number: 'Section 120B', section_description: 'Criminal conspiracy', act_id: 1 },
  { ROWID: 15, section_number: 'Section 34', section_description: 'Common intention', act_id: 1 },
  // IT Act sections
  { ROWID: 16, section_number: 'Section 66C', section_description: 'Identity theft', act_id: 2 },
  { ROWID: 17, section_number: 'Section 66D', section_description: 'Cheating by impersonation using computer resources', act_id: 2 },
  // NDPS sections
  { ROWID: 18, section_number: 'Section 20', section_description: 'Contravention in relation to cannabis plant and cannabis', act_id: 3 },
  { ROWID: 19, section_number: 'Section 22', section_description: 'Contravention in relation to psychotropic substances', act_id: 3 },
  // POCSO sections
  { ROWID: 20, section_number: 'Section 4', section_description: 'Penetrative sexual assault on a minor', act_id: 4 },
  { ROWID: 21, section_number: 'Section 8', section_description: 'Sexual assault on a minor', act_id: 4 },
  // KPA sections
  { ROWID: 22, section_number: 'Section 92', section_description: 'Punishment for certain street offences and nuisances', act_id: 5 }
];

const crimeHeadActSection = [
  // Standard mappings for defaults
  { ROWID: 1, crime_head_id: 1, crime_sub_head_id: 1, act_id: 1, section_id: 1 }, // HBT Day -> IPC 379
  { ROWID: 2, crime_head_id: 1, crime_sub_head_id: 2, act_id: 1, section_id: 2 }, // HBT Night -> IPC 380
  { ROWID: 3, crime_head_id: 1, crime_sub_head_id: 3, act_id: 1, section_id: 1 }, // MV Theft -> IPC 379
  { ROWID: 4, crime_head_id: 1, crime_sub_head_id: 4, act_id: 1, section_id: 5 }, // Chain Snatching -> IPC 392
  { ROWID: 5, crime_head_id: 2, crime_sub_head_id: 5, act_id: 1, section_id: 3 }, // Murder for Gain -> IPC 302
  { ROWID: 6, crime_head_id: 2, crime_sub_head_id: 6, act_id: 1, section_id: 3 }, // Murder Enmity -> IPC 302
  { ROWID: 7, crime_head_id: 2, crime_sub_head_id: 7, act_id: 1, section_id: 4 }, // Attempt Murder -> IPC 307
  { ROWID: 8, crime_head_id: 2, crime_sub_head_id: 8, act_id: 1, section_id: 9 }, // Grievous Hurt -> IPC 326
  { ROWID: 9, crime_head_id: 3, crime_sub_head_id: 9, act_id: 1, section_id: 7 }, // Cheating -> IPC 420
  { ROWID: 10, crime_head_id: 3, crime_sub_head_id: 10, act_id: 1, section_id: 7 }, // Job Fraud -> IPC 420
  { ROWID: 11, crime_head_id: 4, crime_sub_head_id: 12, act_id: 2, section_id: 17 }, // Phishing -> IT 66D
  { ROWID: 12, crime_head_id: 4, crime_sub_head_id: 13, act_id: 2, section_id: 16 }, // Identity Theft -> IT 66C
  { ROWID: 13, crime_head_id: 5, crime_sub_head_id: 15, act_id: 3, section_id: 18 }, // Drug Possession -> NDPS 20
  { ROWID: 14, crime_head_id: 5, crime_sub_head_id: 16, act_id: 3, section_id: 19 }, // Drug Peddling -> NDPS 22
  { ROWID: 15, crime_head_id: 6, crime_sub_head_id: 17, act_id: 1, section_id: 12 }, // Dowry -> IPC 498A
  { ROWID: 16, crime_head_id: 6, crime_sub_head_id: 18, act_id: 1, section_id: 10 }, // Outrage Modesty -> IPC 354
  { ROWID: 17, crime_head_id: 6, crime_sub_head_id: 19, act_id: 1, section_id: 11 }  // Kidnapping -> IPC 363
];

const occupations = [
  { ROWID: 1, occupation_name: 'Agriculturist' },
  { ROWID: 2, occupation_name: 'Labourer' },
  { ROWID: 3, occupation_name: 'Software Engineer' },
  { ROWID: 4, occupation_name: 'Businessperson' },
  { ROWID: 5, occupation_name: 'Student' },
  { ROWID: 6, occupation_name: 'Government Servant' },
  { ROWID: 7, occupation_name: 'Unemployed' },
  { ROWID: 8, occupation_name: 'Homemaker' },
  { ROWID: 9, occupation_name: 'Driver' }
];

const religions = [
  { ROWID: 1, religion_name: 'Hindu' },
  { ROWID: 2, religion_name: 'Muslim' },
  { ROWID: 3, religion_name: 'Christian' },
  { ROWID: 4, religion_name: 'Sikh' },
  { ROWID: 5, religion_name: 'Jain' },
  { ROWID: 6, religion_name: 'Buddhist' }
];

const castes = [
  { ROWID: 1, caste_name: 'General Category' },
  { ROWID: 2, caste_name: 'OBC - Vokkaliga' },
  { ROWID: 3, caste_name: 'OBC - Lingayat' },
  { ROWID: 4, caste_name: 'OBC - Kuruba' },
  { ROWID: 5, caste_name: 'Scheduled Caste (SC)' },
  { ROWID: 6, caste_name: 'Scheduled Tribe (ST)' }
];

// --- GENERATE TRANSACTION DATA ---
function generateMockDatabase(casesCount = 300) {
  console.log(`Generating mock database with ${casesCount} cases...`);

  const caseMasterList = [];
  const complainantDetailsList = [];
  const victimList = [];
  const accusedList = [];
  const arrestSurrenderList = [];
  const chargesheetDetailsList = [];
  const actSectionAssociationList = [];

  // Pool of Repeat Offenders
  // We explicitly create a pool of 20 repeat offenders who will appear in 2+ cases.
  // This will create the accused network graph relationships.
  const repeatOffendersPool = [
    { name: 'Kulla Harisha', alias: 'Harish Gowda', system_accused_id: 'ACC-90001', gender: 'Male', age: 34, address: 'Koramangala, Bengaluru', occupation_id: 7, religion_id: 1, caste_id: 2 },
    { name: 'Double Bore Suresh', alias: 'Suresh Patil', system_accused_id: 'ACC-90002', gender: 'Male', age: 41, address: 'Khade Bazar, Belagavi', occupation_id: 2, religion_id: 1, caste_id: 3 },
    { name: 'Phishing Prasanna', alias: 'Prasanna Kumar', system_accused_id: 'ACC-90003', gender: 'Male', age: 29, address: 'Jayanagar, Bengaluru', occupation_id: 3, religion_id: 1, caste_id: 1 },
    { name: 'Chain Snatcher Basya', alias: 'Basavaraj N', system_accused_id: 'ACC-90004', gender: 'Male', age: 25, address: 'Kyathsandra, Tumkur', occupation_id: 7, religion_id: 1, caste_id: 4 },
    { name: 'Peddler Imran', alias: 'Chotta Imran', system_accused_id: 'ACC-90005', gender: 'Male', age: 28, address: 'Bunder, Mangaluru', occupation_id: 7, religion_id: 2, caste_id: 1 },
    { name: 'Meter Ravi', alias: 'Ravi Kumar', system_accused_id: 'ACC-90006', gender: 'Male', age: 48, address: 'Devaraja Mohalla, Mysuru', occupation_id: 4, religion_id: 1, caste_id: 2 },
    { name: 'Silent Sunil', alias: 'Sunil S', system_accused_id: 'ACC-90007', gender: 'Male', age: 33, address: 'Indiranagar, Bengaluru', occupation_id: 7, religion_id: 1, caste_id: 1 },
    { name: 'Ganja Gopi', alias: 'Gopal Hegde', system_accused_id: 'ACC-90008', gender: 'Male', age: 24, address: 'Vidya Nagar, Shimoga', occupation_id: 9, religion_id: 1, caste_id: 3 },
    { name: 'Cyber Sandeep', alias: 'Sandeep Rao', system_accused_id: 'ACC-90009', gender: 'Male', age: 31, address: 'Gokul Road, Hubli', occupation_id: 3, religion_id: 1, caste_id: 1 },
    { name: 'Slicker Shashi', alias: 'Shashidhar K', system_accused_id: 'ACC-90010', gender: 'Male', age: 37, address: 'Vidyanagar, Hubli', occupation_id: 4, religion_id: 1, caste_id: 3 },
    { name: 'Auto Raja', alias: 'Rajappa S', system_accused_id: 'ACC-90011', gender: 'Male', age: 42, address: 'Lashkar, Mysuru', occupation_id: 9, religion_id: 1, caste_id: 4 },
    { name: 'Blade Balu', alias: 'Balasubramanya', system_accused_id: 'ACC-90012', gender: 'Male', age: 30, address: 'Kyathsandra, Tumkur', occupation_id: 2, religion_id: 1, caste_id: 5 },
    { name: 'Mari Muthu', alias: 'Muthuraj', system_accused_id: 'ACC-90013', gender: 'Male', age: 50, address: 'Whitefield, Bengaluru', occupation_id: 2, religion_id: 1, caste_id: 5 },
    { name: 'Fringe Fayaz', alias: 'Fayaz Ahmed', system_accused_id: 'ACC-90014', gender: 'Male', age: 29, address: 'Chowk Area, Kalaburagi', occupation_id: 7, religion_id: 2, caste_id: 1 },
    { name: 'Land Grab Lokesha', alias: 'Lokesh Gowda', system_accused_id: 'ACC-90015', gender: 'Male', age: 52, address: 'Yelahanka, Bengaluru', occupation_id: 4, religion_id: 1, caste_id: 2 }
  ];

  // We will keep track of repeat offenders assigned cases to make sure they appear at least 2-4 times.
  const repeatOffenderAssignments = {};
  repeatOffendersPool.forEach(ro => {
    repeatOffenderAssignments[ro.system_accused_id] = 0;
  });

  // Track sequential FIR numbers per police station per year
  const stationYearCounters = {};

  let complainantIdCounter = 1;
  let victimIdCounter = 1;
  let accusedIdCounter = 1;
  let arrestIdCounter = 1;
  let chargesheetIdCounter = 1;
  let associationIdCounter = 1;

  for (let caseId = 1; caseId <= casesCount; caseId++) {
    // Choose unit (Police Station)
    const unit = randomItem(units);
    const districtObj = districts.find(d => d.ROWID === unit.district_id);
    const districtConfig = DISTRICTS_CONFIG.find(d => d.name === districtObj.district_name);

    // Pick registration year (2024, 2025, or 2026)
    const registrationYear = randomRange(2024, 2026);
    const key = `${unit.ROWID}_${registrationYear}`;
    if (!stationYearCounters[key]) {
      stationYearCounters[key] = 0;
    }
    stationYearCounters[key]++;
    
    // Generate sequential FIR Number: e.g. "JayanagarPS/0045/2025"
    const cleanUnitName = unit.unit_name.replace(/\s+/g, '');
    const firNumber = `${cleanUnitName}/${String(stationYearCounters[key]).padStart(4, '0')}/${registrationYear}`;

    // Dates
    const startYearDate = new Date(`${registrationYear}-01-01T00:00:00Z`);
    // Ensure dates are not in the future (the current mock date is July 2026)
    const endYearDate = registrationYear === 2026 
      ? new Date('2026-07-10T23:59:59Z') 
      : new Date(`${registrationYear}-12-31T23:59:59Z`);
    
    const crimeRegisteredDate = randomDate(startYearDate, endYearDate);

    // Incident dates (incident is usually before registration date)
    const incidentFromDate = new Date(crimeRegisteredDate.getTime() - randomRange(1, 48) * 3600 * 1000); // 1-48 hours before registration
    const hasToDate = Math.random() > 0.4;
    const incidentToDate = hasToDate ? new Date(incidentFromDate.getTime() + randomRange(1, 12) * 3600 * 1000) : null;

    // Information received date (between incident and registration)
    const infoReceivedDate = new Date(incidentFromDate.getTime() + (crimeRegisteredDate.getTime() - incidentFromDate.getTime()) * 0.7);

    // Coordinates (~70% valid inside Karnataka bounds, ~30% null)
    let latitude = null;
    let longitude = null;
    if (Math.random() < 0.70) {
      latitude = Number((districtConfig.lat + (Math.random() - 0.5) * districtConfig.latDelta).toFixed(6));
      longitude = Number((districtConfig.lng + (Math.random() - 0.5) * districtConfig.lngDelta).toFixed(6));
    }

    // Select category, which determines the crime head & sub-head
    const category = randomItem(caseCategory);
    let mapping = crimeHeadActSection.filter(m => {
      if (category.ROWID === 1) return m.crime_head_id === 1; // Theft -> Property
      if (category.ROWID === 2) return m.crime_sub_head_id === 5 || m.crime_sub_head_id === 6; // Murder -> gain or enmity
      if (category.ROWID === 3) return m.crime_sub_head_id === 4; // Robbery -> Chain Snatching / Robbery
      if (category.ROWID === 4) return m.crime_head_id === 4; // Cybercrime
      if (category.ROWID === 5) return m.crime_sub_head_id === 7 || m.crime_sub_head_id === 8; // Assault -> Attempt/Grievous
      if (category.ROWID === 6) return m.crime_sub_head_id === 19; // Kidnapping
      if (category.ROWID === 7) return m.crime_sub_head_id === 17 || m.crime_sub_head_id === 18; // Rape/Women
      if (category.ROWID === 8) return m.crime_head_id === 3; // Cheating
      if (category.ROWID === 9) return m.crime_head_id === 5; // NDPS
      return true;
    });

    if (mapping.length === 0) mapping = [randomItem(crimeHeadActSection)];
    const selectedMapping = randomItem(mapping);

    const chId = selectedMapping.crime_head_id;
    const cshId = selectedMapping.crime_sub_head_id;
    const subHeadObj = crimeSubHead.find(sh => sh.ROWID === cshId);
    const subHeadName = subHeadObj.crime_sub_head_name;

    // Gravity of offence
    // Let's make Murder, Rape, NDPS-Commercial, Dacoity, Kidnapping (some) Heinous (1). The rest Non-Heinous (2).
    let gravityId = 2; // Non-Heinous
    if ([2, 7, 9].includes(category.ROWID) || (category.ROWID === 6 && Math.random() > 0.5)) {
      gravityId = 1; // Heinous
    }

    // Case Status: Case status is randomly assigned, but we weight it based on the date
    // Older cases (2024) are more likely to be chargesheeted or closed. Newer cases (2026) are more likely to be Under Investigation.
    let statusId = 1; // Under Investigation
    const daysSinceReg = (new Date('2026-07-15').getTime() - crimeRegisteredDate.getTime()) / (1000 * 3600 * 24);

    if (daysSinceReg > 180) {
      // High chance of chargesheeted, closed, or trial stage
      const randVal = Math.random();
      if (randVal < 0.45) statusId = 2; // Chargesheeted
      else if (randVal < 0.70) statusId = 7; // Trial Stage
      else if (randVal < 0.85) statusId = 3; // A-Report (Untraceable)
      else statusId = 4; // B-Report
    } else if (daysSinceReg > 60) {
      const randVal = Math.random();
      if (randVal < 0.40) statusId = 1; // Under Investigation
      else if (randVal < 0.75) statusId = 2; // Chargesheeted
      else statusId = 5; // C-Report
    } else {
      statusId = Math.random() > 0.15 ? 1 : 2; // Under Investigation (85%) or Chargesheeted (15%)
    }

    // Court
    const court = courts.find(c => c.district_id === unit.district_id);

    // Registering Officer (choose from employees in this station)
    const stationEmployees = employees.filter(e => e.unit_id === unit.ROWID);
    const officer = randomItem(stationEmployees.filter(e => e.rank_id >= 3)) || randomItem(stationEmployees); // Prefers PSI or PI

    // Summary of Facts Generator based on crime sub head
    let summaryOfFacts = '';
    const placeOfOcc = randomItem(VILLAGES_AREAS) + ', near ' + randomItem(['Bus Stand', 'Temple', 'Railway Station', 'Main Road', 'Post Office', 'School']);
    
    switch (subHeadName) {
      case 'House Break-in by Day':
        summaryOfFacts = `Complainant states that on ${formatDateOnly(incidentFromDate)} between 10:00 AM and 4:00 PM, when they went to work, some unknown culprits entered through the back door by breaking the lock and stolen gold ornaments weighing 45 grams and cash Rs. 25,000 from the wardrobe.`;
        break;
      case 'House Break-in by Night':
        summaryOfFacts = `Complainant reports that during the night of ${formatDateOnly(incidentFromDate)}, when the family was sleeping, thieves entered the house by cutting the window grill of the kitchen. They took away a laptop, two smartphones, and gold jewelry worth approximately Rs. 1,50,000.`;
        break;
      case 'Motor Vehicle Theft':
        summaryOfFacts = `Complainant states that he parked his Hero Splendor motorcycle (bearing registration number KA-${randomRange(10, 55)}-X-${randomRange(1000, 9999)}) in front of his house on the evening of ${formatDateOnly(incidentFromDate)}. The next morning, the vehicle was found missing, suspected stolen by unidentified thieves.`;
        break;
      case 'Chain Snatching':
        summaryOfFacts = `On ${formatDateOnly(incidentFromDate)} at around 7:30 PM, when the victim (complainant's wife) was walking home, two unidentified men riding a black motorcycle without a number plate approached her, snatched her gold mangalsutra weighing 30 grams from her neck, and sped away towards the highway.`;
        break;
      case 'Murder for Gain':
        summaryOfFacts = `It is reported that an elderly woman living alone was found dead in her house with her throat slit. Gold ornaments worn by her were missing and the cupboards were ransacked. Circumstances indicate she was murdered by unidentified culprits for the purpose of looting valuables.`;
        break;
      case 'Murder due to Personal Enmity':
        summaryOfFacts = `A clash occurred between two rival groups near the village square on ${formatDateOnly(incidentFromDate)}. During the altercation, the accused persons assaulted the victim with lethal weapons (machetes and wooden logs) causing severe injuries. The victim succumbed to injuries while being shifted to the hospital. Previous rivalry regarding land dispute is suspected.`;
        break;
      case 'Attempt to Murder':
        summaryOfFacts = `Complainant reports that due to a dispute over water sharing, the accused persons attacked the complainant's brother with iron rods and knives on ${formatDateOnly(incidentFromDate)} with the intention to kill him. The victim sustained deep head injuries and is currently undergoing treatment in the ICU.`;
        break;
      case 'Grievous Hurt':
        summaryOfFacts = `A quarrel broke out between neighbors regarding parking space. The accused assaulted the complainant with a heavy stick, causing a fracture in the complainant's left hand and multiple contusions on the body.`;
        break;
      case 'Cheating by Impersonation':
        summaryOfFacts = `The complainant was contacted by a person posing as a bank manager, who obtained the complainant's debit card details and OTP under the pretext of updating KYC. Subsequently, Rs. 98,000 was fraudulently withdrawn from the account in multiple transactions.`;
        break;
      case 'Job Fraud':
        summaryOfFacts = `The accused promised the complainant a government job in KSRTC and collected Rs. 3,50,000 in cash as advance. After collecting the money, the accused issued a fake appointment letter and switched off his phone, cheating the complainant.`;
        break;
      case 'Phishing Scam':
        summaryOfFacts = `Complainant received a phishing link on SMS claiming electricity bill outstanding. Clicking the link led to a cloned payment page where net banking credentials were stolen, resulting in a fraudulent transfer of Rs. 2,10,000.`;
        break;
      case 'Identity Theft':
        summaryOfFacts = `Unidentified cyber criminals created a fake social media profile using the complainant's photographs and contact details, and sent messages to the complainant's contacts requesting urgent financial help, cheating three people of Rs. 40,000.`;
        break;
      case 'Possession of Commercial Quantity Drugs':
        summaryOfFacts = `Acting on credible information, the police team raided a spot near the local college and apprehended the accused persons in possession of 5.2 kg of Ganja (Cannabis) and 50 grams of MDMA crystals, meant for distribution to students.`;
        break;
      case 'Drug Peddling & Distribution':
        summaryOfFacts = `During regular patrolling, police intercepted a suspicious vehicle. Search of the vehicle revealed 2.1 kg of Ganja hidden in the spare tire compartment. Accused were arrested and the vehicle was seized.`;
        break;
      case 'Dowry Murder / Harassment':
        summaryOfFacts = `The victim's parents alleged that the victim was subjected to physical and mental harassment by her husband and in-laws demanding an additional Rs. 2,00,000 cash and gold as dowry. The victim was found dead under suspicious circumstances in her matrimonial home.`;
        break;
      case 'Assault to Outrage Modesty':
        summaryOfFacts = `The victim reported that while she was returning home from office in the evening, the accused followed her, blocked her path, passed obscene remarks, and pulled her hand, outraging her modesty. She raised an alarm, prompting passersby to rescue her.`;
        break;
      case 'Kidnapping & Abduction':
        summaryOfFacts = `A minor girl aged 16 was reported missing from her home since ${formatDateOnly(incidentFromDate)}. It is suspected that the accused lured and abducted her on the pretext of marriage.`;
        break;
      default:
        summaryOfFacts = `Complainant lodged a complaint stating that on ${formatDateOnly(incidentFromDate)}, the accused committed the offence of ${subHeadName} violating public order and local laws. Detailed investigation is underway.`;
    }

    // Append standard statement about FIR approval
    const firStatus = 'Approved';

    const caseMaster = {
      ROWID: caseId,
      fir_number: firNumber,
      crime_registered_date: formatDate(crimeRegisteredDate),
      incident_from_date: formatDate(incidentFromDate),
      incident_to_date: incidentToDate ? formatDate(incidentToDate) : null,
      info_received_date: formatDate(infoReceivedDate),
      latitude,
      longitude,
      case_category_id: category.ROWID,
      gravity_offence_id: gravityId,
      crime_head_id: chId,
      crime_sub_head_id: cshId,
      case_status_id: statusId,
      court_id: court.ROWID,
      district_id: districtObj.ROWID,
      state_id: 1,
      unit_id: unit.ROWID,
      registering_officer_id: officer.ROWID,
      place_of_occurrence: `${placeOfOcc} (FIR: ${firNumber})`,
      summary_of_facts: summaryOfFacts,
      fir_status: firStatus
    };
    caseMasterList.push(caseMaster);

    // --- Generate Complainant ---
    const compGender = Math.random() > 0.2 ? 'Male' : 'Female';
    const complainant = {
      ROWID: complainantIdCounter++,
      case_id: caseId,
      name: generateName(compGender),
      age: randomRange(22, 68),
      gender: compGender,
      phone: generatePhone(),
      address: generateAddress(districtObj.district_name),
      occupation_id: randomItem(occupations).ROWID,
      religion_id: randomItem(religions).ROWID,
      caste_id: randomItem(castes).ROWID
    };
    complainantDetailsList.push(complainant);

    // --- Generate Victims (0 to 2) ---
    // Victim-less crimes: Narcotics (NDPS) usually has no individual victim.
    const isVictimless = category.ROWID === 9; // NDPS
    const victimCount = isVictimless ? 0 : (category.ROWID === 2 || category.ROWID === 7 ? 1 : randomRange(0, 2));

    for (let v = 0; v < victimCount; v++) {
      let vicGender = 'Male';
      if (category.ROWID === 7) {
        vicGender = 'Female'; // Rape / Women cases
      } else {
        vicGender = Math.random() > 0.4 ? 'Male' : 'Female';
      }

      let injury = 'None';
      if (category.ROWID === 2) injury = 'Fatal'; // Murder
      else if (category.ROWID === 5) injury = Math.random() > 0.5 ? 'Grievous' : 'Simple'; // Assault

      const victim = {
        ROWID: victimIdCounter++,
        case_id: caseId,
        name: v === 0 && Math.random() > 0.6 && category.ROWID !== 7 ? complainant.name : generateName(vicGender), // Complainant can also be victim
        age: randomRange(18, 70),
        gender: vicGender,
        injury_type: injury,
        phone: generatePhone(),
        address: generateAddress(districtObj.district_name),
        occupation_id: randomItem(occupations).ROWID,
        religion_id: randomItem(religions).ROWID,
        caste_id: randomItem(castes).ROWID
      };
      victimList.push(victim);
    }

    // --- Generate Accused (1 to 3) ---
    const accusedCount = randomRange(1, 3);
    const generatedAccusedForCase = [];

    for (let a = 0; a < accusedCount; a++) {
      // Repeat offender logic:
      // With a 20% probability, we pick a repeat offender from our pool, provided they haven't exceeded 4 assignments.
      let isRepeatOffender = false;
      let accusedData = {};

      if (Math.random() < 0.20) {
        // Find a repeat offender who hasn't been over-assigned (keep it natural)
        const candidates = repeatOffendersPool.filter(ro => repeatOffenderAssignments[ro.system_accused_id] < 4);
        if (candidates.length > 0) {
          const selectedRO = randomItem(candidates);
          
          // Ensure we don't add the same repeat offender twice to the same case
          if (!generatedAccusedForCase.some(acc => acc.system_accused_id === selectedRO.system_accused_id)) {
            accusedData = { ...selectedRO };
            isRepeatOffender = true;
            repeatOffenderAssignments[selectedRO.system_accused_id]++;
          }
        }
      }

      if (!isRepeatOffender) {
        // Create a new unique accused
        const accGender = Math.random() > 0.05 ? 'Male' : 'Female';
        const seedId = accusedIdCounter;
        accusedData = {
          name: generateName(accGender),
          alias_name: Math.random() > 0.7 ? `Alias ${randomItem(MALE_NAMES)}` : null,
          system_accused_id: generateSystemAccusedId(seedId),
          gender: accGender,
          age: randomRange(19, 58),
          address: generateAddress(districtObj.district_name),
          occupation_id: randomItem(occupations).ROWID,
          religion_id: randomItem(religions).ROWID,
          caste_id: randomItem(castes).ROWID
        };
      }

      // Case specific accused status
      // Standard flow: Absconding, Arrested, Bailed, Surrendered, Suspect
      let accStatus = 'Suspect';
      if (statusId === 1) { // Under Investigation
        accStatus = randomItem(['Suspect', 'Absconding', 'Arrested']);
      } else if ([2, 7].includes(statusId)) { // Chargesheeted / Trial
        accStatus = randomItem(['Arrested', 'Bailed', 'Surrendered']);
      } else { // Closed cases
        accStatus = 'Bailed';
      }

      const accused = {
        ROWID: accusedIdCounter++,
        case_id: caseId,
        system_accused_id: accusedData.system_accused_id,
        name: accusedData.name,
        alias_name: accusedData.alias_name,
        age: accusedData.age,
        gender: accusedData.gender,
        address: accusedData.address,
        occupation_id: accusedData.occupation_id,
        religion_id: accusedData.religion_id,
        caste_id: accusedData.caste_id,
        status: accStatus
      };

      accusedList.push(accused);
      generatedAccusedForCase.push(accused);

      // --- Generate Arrest/Surrender Events ---
      // If accused status is Arrested, Bailed, or Surrendered, create an event.
      if (['Arrested', 'Bailed', 'Surrendered'].includes(accStatus)) {
        const isArrest = accStatus === 'Arrested' || (accStatus === 'Bailed' && Math.random() > 0.3);
        const eventType = isArrest ? 'Arrest' : 'Surrender';
        
        // Event date is between registration and chargesheet date (or present day)
        const eventDate = new Date(crimeRegisteredDate.getTime() + randomRange(1, 45) * 24 * 3600 * 1000);
        // Ensure it's not after today
        const maxDate = new Date('2026-07-15');
        const finalEventDate = eventDate > maxDate ? maxDate : eventDate;

        const arrestOfficer = randomItem(stationEmployees.filter(e => e.rank_id >= 2)) || officer;

        arrestSurrenderList.push({
          ROWID: arrestIdCounter++,
          case_id: caseId,
          accused_id: accused.ROWID,
          event_type: eventType,
          date_time: formatDate(finalEventDate),
          place: eventType === 'Arrest' ? randomItem(['Bus Stand', 'Highway Toll Booth', 'Railway Station', 'Hideout Residence', 'Airport']) : 'Police Station Premises',
          arresting_officer_id: arrestOfficer.ROWID,
          remarks: eventType === 'Arrest' ? 'Apprehended based on tip-off and local intelligence.' : 'Accused surrendered voluntarily accompanied by counsel.'
        });
      }
    }

    // --- Generate Chargesheet Details ---
    // If case status is Chargesheeted (2) or Trial Stage (7), create a chargesheet record.
    if ([2, 7].includes(statusId)) {
      const daysToFiles = randomRange(60, 120);
      const chargesheetDate = new Date(crimeRegisteredDate.getTime() + daysToFiles * 24 * 3600 * 1000);
      const finalCSDate = chargesheetDate > new Date('2026-07-14') ? new Date('2026-07-14') : chargesheetDate;

      const csNumber = `CS/${String(caseId).padStart(4, '0')}/${registrationYear}`;
      const ioOfficer = randomItem(stationEmployees.filter(e => e.rank_id >= 4)) || officer; // PSI or PI

      chargesheetDetailsList.push({
        ROWID: chargesheetIdCounter++,
        case_id: caseId,
        chargesheet_number: csNumber,
        date_filed: formatDateOnly(finalCSDate),
        submitting_officer_id: ioOfficer.ROWID,
        court_id: court.ROWID,
        summary_of_evidence: `The investigation of the case has been completed. The oral testimonies of witnesses CW-1 to CW-12, the medical/injury certificates, forensic lab reports (where applicable), and recovery mahazars of stolen/used items provide sufficient prima facie evidence against the accused persons. They are chargesheeted under the specified sections to stand trial in court.`,
        final_report_type: 'Chargesheet'
      });
    }

    // --- Generate ActSectionAssociation ---
    // Associate the default act and section from the mapping
    actSectionAssociationList.push({
      ROWID: associationIdCounter++,
      case_id: caseId,
      act_id: selectedMapping.act_id,
      section_id: selectedMapping.section_id
    });

    // Maybe add a secondary section (like Section 34 - common intention, or Section 120B - conspiracy, or IPC 324, etc.)
    if (accusedCount > 1) {
      actSectionAssociationList.push({
        ROWID: associationIdCounter++,
        case_id: caseId,
        act_id: 1, // IPC
        section_id: 15 // Section 34 (Common Intention)
      });
    }

    if (Math.random() > 0.6) {
      // Add criminal conspiracy (Section 120B)
      actSectionAssociationList.push({
        ROWID: associationIdCounter++,
        case_id: caseId,
        act_id: 1, // IPC
        section_id: 14 // Section 120B
      });
    }
  }

  // Double check that we have repeat offenders who actually appear in 2+ cases
  const actualROCounts = {};
  accusedList.forEach(acc => {
    if (acc.system_accused_id.startsWith('ACC-900')) {
      actualROCounts[acc.system_accused_id] = (actualROCounts[acc.system_accused_id] || 0) + 1;
    }
  });

  console.log('Repeat offender occurrences in generated cases:');
  console.log(actualROCounts);

  return {
    State: state,
    District: districts,
    UnitType: unitTypes,
    Unit: units,
    Rank: ranks,
    Designation: designations,
    Employee: employees,
    Court: courts,
    CaseStatusMaster: caseStatusMaster,
    GravityOffence: gravityOffence,
    CaseCategory: caseCategory,
    CrimeHead: crimeHead,
    CrimeSubHead: crimeSubHead,
    Act: acts,
    Section: sections,
    CrimeHeadActSection: crimeHeadActSection,
    OccupationMaster: occupations,
    ReligionMaster: religions,
    CasteMaster: castes,
    CaseMaster: caseMasterList,
    ComplainantDetails: complainantDetailsList,
    Victim: victimList,
    Accused: accusedList,
    ArrestSurrender: arrestSurrenderList,
    ChargesheetDetails: chargesheetDetailsList,
    ActSectionAssociation: actSectionAssociationList
  };
}

// Generate the database
const mockData = generateMockDatabase(300);

// Ensure output folder exists
const outputDir = path.dirname(__filename);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write to JSON file
const outputPath = path.join(outputDir, 'mock_data.json');
fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2), 'utf-8');
console.log(`Successfully wrote mock data containing 300 cases to: ${outputPath}`);

// Export for seeding script
module.exports = {
  generateMockDatabase,
  mockData
};

const KANNADA_DIGITS = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];

const KANNADA_MONTHS: Record<number, string> = {
  0: 'ಜನವರಿ',
  1: 'ಫೆಬ್ರವರಿ',
  2: 'ಮಾರ್ಚ್',
  3: 'ಏಪ್ರಿಲ್',
  4: 'ಮೇ',
  5: 'ಜೂನ್',
  6: 'ಜುಲೈ',
  7: 'ಆಗಸ್ಟ್',
  8: 'ಸೆಪ್ಟೆಂಬರ್',
  9: 'ಅಕ್ಟೋಬರ್',
  10: 'ನವೆಂಬರ್',
  11: 'ಡಿಸೆಂಬರ್'
};

export function convertToKannadaDigits(num: string | number): string {
  return num.toString().replace(/\d/g, (d) => KANNADA_DIGITS[parseInt(d, 10)]);
}

export function formatLocalDate(date: Date | string, lang: 'en' | 'kn'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);

  if (lang === 'kn') {
    const day = convertToKannadaDigits(d.getDate());
    const month = KANNADA_MONTHS[d.getMonth()];
    const year = convertToKannadaDigits(d.getFullYear());
    return `${day} ${month} ${year}`;
  } else {
    // English format: July 16, 2026
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }
}

export function formatLocalNumber(num: number | string, lang: 'en' | 'kn'): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);

  const formatted = new Intl.NumberFormat('en-IN').format(n);
  return lang === 'kn' ? convertToKannadaDigits(formatted) : formatted;
}

export function formatLocalCurrency(num: number | string, lang: 'en' | 'kn'): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);

  // Formatting using Indian standard (₹1,25,000)
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(n);

  return lang === 'kn' ? convertToKannadaDigits(formatted) : formatted;
}

export function formatLocalTime(time: Date | string, lang: 'en' | 'kn'): string {
  const d = typeof time === 'string' ? new Date(time) : time;
  if (isNaN(d.getTime())) {
    // Attempt parsing standard time string e.g. "10:45 AM"
    if (typeof time === 'string') {
      if (lang === 'kn') {
        let tStr = time.replace(/AM/gi, 'ಪೂರ್ವಾಹ್ನ').replace(/PM/gi, 'ಅಪರಾಹ್ನ');
        return convertToKannadaDigits(tStr);
      }
      return time;
    }
    return String(time);
  }

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minStr = minutes < 10 ? '0' + minutes : minutes;

  if (lang === 'kn') {
    const kHours = convertToKannadaDigits(hours);
    const kMins = convertToKannadaDigits(minStr);
    const kAmpm = ampm === 'AM' ? 'ಪೂರ್ವಾಹ್ನ' : 'ಅಪರಾಹ್ನ';
    return `${kHours}:${kMins} ${kAmpm}`;
  } else {
    return `${hours}:${minStr} ${ampm}`;
  }
}

export function getLanguageInstruction(lang: 'en' | 'kn'): string {
  if (lang === 'kn') {
    return 'Respond strictly in Kannada (ಕನ್ನಡ).';
  }
  return 'Respond in English.';
}

// ===========================================================================
// GEOGRAPHIC & CATEGORICAL TRANSLATION RESOURCE BUNDLES (Consolidated)
// ===========================================================================

const DISTRICT_MAP: Record<string, string> = {
  all: 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು',
  'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
  'Mysuru City': 'ಮೈಸೂರು ನಗರ',
  'Hubballi-Dharwad City': 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ನಗರ',
  'Mangaluru City': 'ಮಂಗಳೂರು ನಗರ',
  'Belagavi City': 'ಬೆಳಗಾವಿ ನಗರ',
  'Kalaburagi City': 'ಕಲಬುರಗಿ ನಗರ',
  Belagavi: 'ಬೆಳಗಾವಿ',
  Kalaburagi: 'ಕಲಬುರಗಿ',
  Bengaluru: 'ಬೆಂಗಳೂರು',
  Mysuru: 'ಮೈಸೂರು'
};

const CATEGORY_MAP: Record<string, string> = {
  all: 'ಎಲ್ಲಾ ಅಪರಾಧ ವಿಭಾಗಗಳು',
  'Theft / Burglary': 'ಕಳ್ಳತನ / ಕನ್ನಗಳ್ಳತನ',
  Assault: 'ಹಲ್ಲೆ',
  'Cheating / Fraud': 'ವಂಚನೆ / ಅಪರಾಧ',
  Robbery: 'ದರೋಡೆ',
  'Cyber Crimes': 'ಸೈಬರ್ ಅಪರಾಧಗಳು',
  'Other Crimes': 'ಇತರ ಅಪರಾಧಗಳು'
};

const CRIME_HEAD_MAP: Record<string, string> = {
  'House Breaking by Night': 'ರಾತ್ರಿ ಮನೆ ಕನ್ನಗಳ್ಳತನ',
  'Highway Robbery': 'ಹೆದ್ದಾರಿ ದರೋಡೆ',
  'Corporate Bank Fraud': 'ಕಾರ್ಪೊರೇಟ್ ಬ್ಯಾಂಕ್ ವಂಚನೆ',
  'Domestic Violence': 'ಕೌಟುಂಬಿಕ ಹಿಂಸಾಚಾರ',
  'Commercial Theft': 'ವಾಣಿಜ್ಯ ಕಳ್ಳತನ',
  'Grievous Hurt': 'ತೀವ್ರ ಗಾಯ',
  'Commercial Burglary': 'ವಾಣಿಜ್ಯ ಕನ್ನಗಳ್ಳತನ',
  'Cyber/Online Fraud': 'ಸೈಬರ್/ಆನ್‌ಲೈನ್ ವಂಚನೆ'
};

const STATUS_MAP: Record<string, string> = {
  'Under Investigation': 'ತನಿಖೆಯಲ್ಲಿದೆ',
  Chargesheeted: 'ದೋಷಾರೋಪಣೆ ಸಲ್ಲಿಕೆ',
  Disposed: 'ಪರಿಹರಿಸಲಾಗಿದೆ'
};

const STATIONS_MAP: Record<string, string> = {
  'Indiranagar PS': 'ಇಂದಿರಾನಗರ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Lashkar PS': 'ಲಷ್ಕರ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Kadri PS': 'ಕದ್ರಿ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Station Bazar PS': 'ಸ್ಟೇಷನ್ ಬಜಾರ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Khade Bazar PS': 'ಖಾಡೆ ಬಜಾರ್ ಪೊಲೀಸ್ ಠಾಣೆ'
};

const COURTS_MAP: Record<string, string> = {
  '1st ACMM Court, Bengaluru': '೧ನೇ ಎಸಿಎಂಎಂ ನ್ಯಾಯಾಲಯ, ಬೆಂಗಳೂರು',
  'JMFC 2nd Court, Mysuru': 'ಜೆಎಂಎಫ್‌ಸಿ ೨ನೇ ನ್ಯಾಯಾಲಯ, ಮೈಸೂರು',
  'Chief Judicial Magistrate Court, Mangaluru': 'ಮುಖ್ಯ ನ್ಯಾಯಾಂಗ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ನ್ಯಾಯಾಲಯ, ಮಂಗಳೂರು',
  'Principal District Court, Kalaburagi': 'ಪ್ರಧಾನ ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯ, ಕಲಬುರಗಿ',
  'JMFC Court, Belagavi': 'ಜೆಎಂಎಫ್‌ಸಿ ನ್ಯಾಯಾಲಯ, ಬೆಳಗಾವಿ'
};

const SUMMARIES_MAP: Record<string, string> = {
  'KA-BC-2026-00812': '೧೦ ಜೂನ್ ೨೦೨೬ ರ ರಾತ್ರಿ, ದೂರುದಾರರಾದ ಡಾ. ರಮೇಶ್ ರಾವ್ ಅವರು ತಮ್ಮ ಕುಟುಂಬವು ಮೈಸೂರಿನಲ್ಲಿದ್ದಾಗ ಅಪರಿಚಿತ ದುಷ್ಕರ್ಮಿಗಳು ಇಂದಿರಾನಗರದಲ್ಲಿರುವ ಅವರ ನಿವಾಸದ ಹಿಂಭಾಗದ ಗ್ರಿಲ್ ಕಿಟಕಿಯನ್ನು ಒಡೆದು ಒಳಗೆ ಪ್ರವೇಶಿಸಿ ೧೫೦ ಗ್ರಾಂ ತೂಕದ ಚಿನ್ನದ ಆಭರಣಗಳು ಮತ್ತು ₹೧,೨೦,೦೦೦ ನಗದನ್ನು ಕಳ್ಳತನ ಮಾಡಿದ್ದಾರೆ ಎಂದು ವರದಿ ಮಾಡಿದ್ದಾರೆ. ವಿಧಿವಿಜ್ಞಾನ ತಂಡವು ಬೆರಳಚ್ಚುಗಳನ್ನು ಸಂಗ್ರಹಿಸಿದೆ. ಐಪಿಸಿ ೪೫೭/೩೮೦ ರ ಅಡಿಯಲ್ಲಿ ಪ್ರಕರಣ ದಾಖಲಿಸಲಾಗಿದೆ. ಜೂನ್ ೨೫ ರಂದು ಮಾಹಿತಿ ಆಧಾರದ ಮೇಲೆ ಹಿಸ್ಟರಿ ಶೀಟರ್ ಕಾರ್ತಿಕ್ ಅಲಿಯಾಸ್ ಪೂಚಿ ಕಾರ್ತಿಕ್‌ನನ್ನು ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದಲ್ಲಿ ಬಂಧಿಸಿ ₹೪,೦೦,೦೦೦ ಮೌಲ್ಯದ ಚಿನ್ನದ ಆಭರಣಗಳನ್ನು ವಶಪಡಿಸಿಕೊಳ್ಳಲಾಗಿದೆ. ಸಹಚರರನ್ನು ಪತ್ತೆ ಹಚ್ಚಲು ತನಿಖೆ ಮುಂದುವರಿದಿದೆ.',
  'KA-MY-2026-00124': 'ದೂರುದಾರ ಸುನೀತಾ ಎಂ. ಲಷ್ಕರ್ ಸರ್ಕಲ್‌ನಿಂದ ಮನೆಗೆ ನಡೆದುಕೊಂಡು ಹೋಗುತ್ತಿದ್ದಾಗ ಪಲ್ಸರ್ ಮೋಟಾರ್ ಸೈಕಲ್‌ನಲ್ಲಿ ಬಂದ ಇಬ್ಬರು ವ್ಯಕ್ತಿಗಳು ಚಾಕು ತೋರಿಸಿ ಜೀವ ಬೆದರಿಕೆ ಹಾಕಿ ೪೦ ಗ್ರಾಂ ತೂಕದ ಚಿನ್ನದ ಮಾಂಗಲ್ಯ ಸರವನ್ನು ಕಸಿದುಕೊಂಡು ಹೋಗಿದ್ದಾರೆ. ಘರ್ಷಣೆಯ ವೇಳೆ ಸುನೀತಾ ಅವರ ಕುತ್ತಿಗೆಗೆ ಸಣ್ಣ ಗಾಯಗಳಾಗಿವೆ. ಅಧಿಕಾರಿಗಳು ಸ್ಥಳೀಯ ಸಿಸಿಟಿವಿ ದೃಶ್ಯಾವಳಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಹಳೆ ಅಪರಾಧಿಗಳಾದ ಕುಳ್ಳ ಮಂಜ ಮತ್ತು ಸೀನಾ ಅವರನ್ನು ೫ ದಿನಗಳೊಳಗೆ ಬಂಧಿಸಿದ್ದಾರೆ. ಕಸಿದುಕೊಂಡ ಚಿನ್ನದ ಸರವನ್ನು ವಶಪಡಿಸಿಕೊಳ್ಳಲಾಗಿದೆ. ಜೆಎಂಎಫ್‌ಸಿ ೨ನೇ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ದೋಷಾರೋಪಣೆ ಪಟ್ಟಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ.',
  'KA-MN-2026-00431': 'ದೇವಿಪ್ರಸಾದ್ ಶೆಟ್ಟಿ ಅವರಿಗೆ ಎಸ್‌ಬಿಐ ಗ್ರಾಹಕ ಸೇವಾ ಪ್ರತಿನಿಧಿ ಎಂದು ಹೇಳಿಕೊಂಡು ಅಪರಿಚಿತ ವ್ಯಕ್ತಿಯೊಬ್ಬರು ಕರೆ ಮಾಡಿದ್ದರು. ದೂರುದಾರರ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬ್ಲಾಕ್ ಆಗಲಿದೆ ಎಂದು ತಿಳಿಸಿ ಒಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಲು ವಿನಂತಿಸಿದ್ದರು. ಇದನ್ನು ನಂಬಿ ದೂರುದಾರರು ಒಟಿಪಿ ಹಂಚಿಕೊಂಡ ನಂತರ ಅವರ ಖಾತೆಯಿಂದ ₹೮೫,೦೦೦ ಕಡಿತಗೊಳಿಸಲಾಗಿದೆ. ವಂಚನೆ ಹಣ ನೋಯ್ಡಾದಲ್ಲಿ ನೋಂದಾಯಿಸಲಾದ ಇ-ವ್ಯಾಲೆಟ್ ಖಾತೆಗಳಿಗೆ ವರ್ಗಾವಣೆಯಾಗಿದೆ. ಮಂಗಳೂರು ಸೈಬರ್ ಕ್ರೈಮ್ ಸೆಲ್‌ನೊಂದಿಗೆ ತನಿಖೆ ಮುಂದುವರಿದಿದೆ.',
  'KA-KA-2026-00055': 'ಆಸ್ತಿ ವಿವಾದಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ದೂರುದಾರ ಮಲ್ಲಪ್ಪ ಮತ್ತು ಆರೋಪಿಗಳಾದ ಬಸವರಾಜ್ ಮತ್ತು ಗಿರೀಶ್ ನಡುವೆ ಟೀ ಅಂಗಡಿಯಲ್ಲಿ ಜಗಳ ನಡೆದಿತ್ತು. ಆರೋಪಿಗಳು ಕಬ್ಬಿಣದ ಸರಳಿನಿಂದ ಹಲ್ಲೆ ನಡೆಸಿ ಮಲ್ಲಪ್ಪ ಅವರ ಎಡ ಮುಂಗೈ ಮುರಿದಿದ್ದರು. ಹತ್ತಿರದವರು ಮಧ್ಯಪ್ರವೇಶಿಸಿ ಜಗಳ ಬಿಡಿಸಿದ್ದರು. ಆರೋಪಿಗಳನ್ನು ಮರುದಿನವೇ ಬಂಧಿಸಿ ಕಬ್ಬಿಣದ ಸರಳುಗಳನ್ನು ವಶಪಡಿಸಿಕೊಳ್ಳಲಾಗಿತ್ತು. ಏಪ್ರಿಲ್ ೨೦ ರಂದು ದೋಷಾರೋಪಣೆ ಸಲ್ಲಿಸಲಾಗಿತ್ತು. ಜುಲೈ ೧೦ ರಂದು ನ್ಯಾಯಾಲಯವು ಇಬ್ಬರು ಆರೋಪಿಗಳಿಗೆ ೨ ವರ್ಷಗಳ ಕಠಿಣ ಜೈಲು ಶಿಕ್ಷೆ ವಿಧಿಸಿ ತೀರ್ಪು ನೀಡಿದೆ.',
  'KA-BD-2026-00910': 'ಜುಲೈ ೧ ರ ಮುಂಜಾನೆ ಖಾಡೆ ಬಜಾರ್‌ನಲ್ಲಿರುವ ಮೊಬೈಲ್ ರೀಟೇಲ್ ಸ್ಟೋರ್‌ಗೆ ಅಪರಿಚಿತ ಕಳ್ಳರು ನುಗ್ಗಿದ್ದಾರೆ. ಭಾರೀ ಕಟರ್ ಬಳಸಿ ಶಟರ್ ಬೀಗಗಳನ್ನು ಕತ್ತರಿಸಲಾಗಿತ್ತು. ಕಳ್ಳರು ೪೫ ಪ್ರೀಮಿಯಂ ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ಗಳು ಮತ್ತು ₹೩೫,೦೦೧ ನಗದನ್ನು ಕಳ್ಳತನ ಮಾಡಿದ್ದು, ಒಟ್ಟು ₹೯,೫೦,೦೦೦ ನಷ್ಟವಾಗಿದೆ ಎಂದು ಅಂದಾಜಿಸಲಾಗಿದೆ. ಆರೋಪಿಗಳು ಸಿಸಿಟಿವಿ ಕ್ಯಾಮೆರಾಗಳಿಗೆ ಬಣ್ಣ ಬಳಿದಿದ್ದರು. ತನಿಖೆ ಮುಂದುವರಿದಿದೆ.'
};

const SECTIONS_MAP: Record<string, string> = {
  'Section 457 (Lurking house-trespass by night)': 'ಸೆಕ್ಷನ್ ೪೫೭ (ರಾತ್ರಿ ವೇಳೆ ಮನೆ ಕನ್ನ)',
  'Section 380 (Theft in dwelling house)': 'ಸೆಕ್ಷನ್ ೩೮೦ (ವಾಸದ ಮನೆಯಲ್ಲಿ ಕಳ್ಳತನ)',
  'Section 392 (Robbery)': 'ಸೆಕ್ಷನ್ ೩೯೨ (ದರೋಡೆ)',
  'Section 397 (Robbery with attempt to cause death)': 'ಸೆಕ್ಷನ್ ೩೯೭ (ಕೊಲೆ ಯತ್ನದೊಂದಿಗೆ ದರೋಡೆ)',
  'Section 420 (Cheating)': 'ಸೆಕ್ಷನ್ ೪೨೦ (ವಂಚನೆ)',
  'Section 66D (Cheating by personation using computer resource)': 'ಸೆಕ್ಷನ್ ೬೬ಡಿ (ಕಂಪ್ಯೂಟರ್ ಬಳಸಿ ವಂಚನೆ)',
  'Section 324 (Voluntarily causing hurt by dangerous weapons)': 'ಸೆಕ್ಷನ್ ೩೨೪ (ಅಪಾಯಕಾರಿ ಆಯುಧಗಳಿಂದ ಹಲ್ಲೆ)',
  'Section 326 (Voluntarily causing grievous hurt by dangerous weapons)': 'ಸೆಕ್ಷನ್ ೩೨೬ (ಅಪಾಯಕಾರಿ ಆಯುಧಗಳಿಂದ ತೀವ್ರ ಗಾಯಗೊಳಿಸುವುದು)'
};

const ACTS_MAP: Record<string, string> = {
  'IPC 1860': 'ಐಪಿಸಿ ೧೮೬೦',
  'Information Technology Act 2000': 'ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆ ೨೦೦೦'
};

const NAMES_MAP: Record<string, string> = {
  'Dr. Ramesh Rao, 45, Indiranagar': 'ಡಾ. ರಮೇಶ್ ರಾವ್, ೪೫ ವರ್ಷ, ಇಂದಿರಾನಗರ',
  'Dr. Ramesh Rao': 'ಡಾ. ರಮೇಶ್ ರಾವ್',
  'Karthik alias "Poochi" Karthik': 'ಕಾರ್ತಿಕ್ ಅಲಿಯಾಸ್ "ಪೂಚಿ" ಕಾರ್ತಿಕ್',
  'unknown associate': 'ಅಪರಿಚಿತ ಸಹಚರ',
  'Sunitha M., 29, Lashkar Mohalla': 'ಸುನೀತಾ ಎಂ., ೨೯ ವರ್ಷ, ಲಷ್ಕರ್ ಮೊಹಲ್ಲಾ',
  'Sunitha M.': 'ಸುನೀತಾ ಎಂ.',
  'Manju alias "Kulla" Manja': 'ಮಂಜು ಅಲಿಯಾಸ್ "ಕುಳ್ಳ" ಮಂಜ',
  'Srinivas alias "Seena"': 'ಶ್ರೀನಿವಾಸ್ ಅಲಿಯಾಸ್ "ಸೀನಾ"',
  'Deviprasad Shetty, 52, Kadri': 'ದೇವಿಪ್ರಸಾದ್ ಶೆಟ್ಟಿ, ೫೨ ವರ್ಷ, ಕದ್ರಿ',
  'Deviprasad Shetty': 'ದೇವಿಪ್ರಸಾದ್ ಶೆಟ್ಟಿ',
  'Sanjay Kumar (fake identity)': 'ಸಂಜಯ್ ಕುಮಾರ್ (ನಕಲಿ ಗುರುತು)',
  'unknown cyber criminals': 'ಅಪರಿಚಿತ ಸೈಬರ್ ಅಪರಾಧಿಗಳು',
  'Mallappa Gowda, 38, Kalaburagi': 'ಮಲ್ಲಪ್ಪ ಗೌಡ, ೩೮ ವರ್ಷ, ಕಲಬುರಗಿ',
  'Mallappa Gowda': 'ಮಲ್ಲಪ್ಪ ಗೌಡ',
  'Basavaraj': 'ಬಸವರಾಜ್',
  'Girish': 'ಗಿರೀಶ್',
  'Anand Shah, 41, Belagavi Commercial Guild': 'ಆನಂದ್ ಶಾ, ೪೧ ವರ್ಷ, ಬೆಳಗಾವಿ ವಾಣಿಜ್ಯ ಸಂಘ',
  'Anand Shah': 'ಆನಂದ್ ಶಾ',
  'unknown offenders': 'ಅಪರಿಚಿತ ಅಪರಾಧಿಗಳು'
};

const LOCATIONS_MAP: Record<string, string> = {
  'Majestic Bus Stand, Bengaluru': 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣ, ಬೆಂಗಳೂರು',
  'K.R. Hospital Circle, Mysuru': 'ಕೆ.ಆರ್. ಆಸ್ಪತ್ರೆ ಸರ್ಕಲ್, ಮೈಸೂರು',
  'Nanjangud Road, Mysuru outskirts': 'ನಂಜನಗೂಡು ರಸ್ತೆ, ಮೈಸೂರು ಹೊರವಲಯ',
  'Station Bazar area, Kalaburagi': 'ಸ್ಟೇಷನ್ ಬಜಾರ್ ಪ್ರದೇಶ, ಕಲಬುರಗಿ'
};

const GRAVITY_MAP: Record<string, string> = {
  Grave: 'ಗಂಭೀರ',
  'Non-Grave': 'ಸಾಮಾನ್ಯ'
};

// ===========================================================================
// TRANSLATION ADAPTER HELPERS (Consolidated)
// ===========================================================================

export function translateDistrict(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return DISTRICT_MAP[value] ?? value;
}

export function translateCategory(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return CATEGORY_MAP[value] ?? value;
}

export function translateCrimeHead(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return CRIME_HEAD_MAP[value] ?? value;
}

export function translateStatus(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return STATUS_MAP[value] ?? value;
}

export function translateStation(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return STATIONS_MAP[value] ?? value;
}

export function translateCourt(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return COURTS_MAP[value] ?? value;
}

export function translateSummary(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return SUMMARIES_MAP[value] ?? value;
}

export function translateSection(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return SECTIONS_MAP[value] ?? value;
}

export function translateAct(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return ACTS_MAP[value] ?? value;
}

export function translateName(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return NAMES_MAP[value] ?? value;
}

export function translateLocation(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return LOCATIONS_MAP[value] ?? value;
}

export function translateGravity(value: string, lang: 'en' | 'kn'): string {
  if (lang === 'en') return value;
  return GRAVITY_MAP[value] ?? value;
}

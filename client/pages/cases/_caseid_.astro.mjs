import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro } from '../../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_iOUCx9k6.mjs';
import { P as PERMISSIONS } from '../../chunks/auth_Ch8uM9Mt.mjs';
export { renderers } from '../../renderers.mjs';

const MOCK_CASES = [
  {
    caseId: "KA-BC-2026-00812",
    firNumber: "FIR-0812/2026",
    district: "Bengaluru City",
    station: "Indiranagar PS",
    incidentDate: "2026-06-10T22:30:00Z",
    registeredDate: "2026-06-11T09:15:00Z",
    category: "Theft / Burglary",
    status: "Under Investigation",
    gravity: "Grave",
    crimeHead: "House Breaking by Night",
    complainants: ["Dr. Ramesh Rao, 45, Indiranagar"],
    victims: ["Dr. Ramesh Rao"],
    accused: ['Karthik alias "Poochi" Karthik', "unknown associate"],
    arrests: [
      { date: "2026-06-25T14:00:00Z", person: 'Karthik alias "Poochi" Karthik', location: "Majestic Bus Stand, Bengaluru" }
    ],
    actsSections: [
      { act: "IPC 1860", section: "Section 457 (Lurking house-trespass by night)" },
      { act: "IPC 1860", section: "Section 380 (Theft in dwelling house)" }
    ],
    court: "1st ACMM Court, Bengaluru",
    chargesheeted: false,
    summaryText: "On the night of 10th June 2026, the complainant Dr. Ramesh Rao reported that while his family was away in Mysuru, unknown culprits broke open the rear grill window of his residence in Indiranagar. The culprits entered the house and made away with gold jewelry weighing 150 grams and cash of ₹1,20,000. Forensic team collected finger prints. Case was registered under IPC 457/380. On 25th June, based on informant tip-off, history-sheeter Karthik alias Poochi Karthik was arrested at Majestic Bus Stand and gold ornaments worth ₹4,00,000 were recovered. Investigation is in progress to identify his associates."
  },
  {
    caseId: "KA-MY-2026-00124",
    firNumber: "FIR-0124/2026",
    district: "Mysuru City",
    station: "Lashkar PS",
    incidentDate: "2026-05-14T11:00:00Z",
    registeredDate: "2026-05-14T13:45:00Z",
    category: "Robbery",
    status: "Chargesheeted",
    gravity: "Grave",
    crimeHead: "Highway Robbery",
    complainants: ["Sunitha M., 29, Lashkar Mohalla"],
    victims: ["Sunitha M."],
    accused: ['Manju alias "Kulla" Manja', 'Srinivas alias "Seena"'],
    arrests: [
      { date: "2026-05-18T10:30:00Z", person: 'Manju alias "Kulla" Manja', location: "K.R. Hospital Circle, Mysuru" },
      { date: "2026-05-19T18:00:00Z", person: 'Srinivas alias "Seena"', location: "Nanjangud Road, Mysuru outskirts" }
    ],
    actsSections: [
      { act: "IPC 1860", section: "Section 392 (Robbery)" },
      { act: "IPC 1860", section: "Section 397 (Robbery with attempt to cause death)" }
    ],
    court: "JMFC 2nd Court, Mysuru",
    chargesheeted: true,
    chargesheetDate: "2026-07-02T11:00:00Z",
    summaryText: "Complainant Sunitha M. was walking home from Lashkar Circle when two persons riding a black pulsar motorcycle approached from behind, brandished a long knife, threatened her life, and snatched her gold nuptial chain weighing 40 grams. During the struggle, she sustained a minor laceration on her neck. Officers checked local CCTV footage. Suspects were identified as repeat offenders Kulla Manja and Seena. Both were arrested within 5 days. Snatched gold chain was fully recovered and identified. A formal chargesheet has been filed in JMFC 2nd Court."
  },
  {
    caseId: "KA-MN-2026-00431",
    firNumber: "FIR-0431/2026",
    district: "Mangaluru City",
    station: "Kadri PS",
    incidentDate: "2026-06-20T15:30:00Z",
    registeredDate: "2026-06-21T10:00:00Z",
    category: "Cheating / Fraud",
    status: "Under Investigation",
    gravity: "Non-Grave",
    crimeHead: "Cyber/Online Fraud",
    complainants: ["Deviprasad Shetty, 52, Kadri"],
    victims: ["Deviprasad Shetty"],
    accused: ["Sanjay Kumar (fake identity)", "unknown cyber criminals"],
    arrests: [],
    actsSections: [
      { act: "IPC 1860", section: "Section 420 (Cheating)" },
      { act: "Information Technology Act 2000", section: "Section 66D (Cheating by personation using computer resource)" }
    ],
    court: "Chief Judicial Magistrate Court, Mangaluru",
    chargesheeted: false,
    summaryText: "Deviprasad Shetty received a call from an unknown individual claiming to be a customer service representative from SBI. The caller stated that the complainant's credit card was about to be blocked and requested OTP verification to update the card status. Trusting the caller, the complainant shared the OTP, following which ₹85,000 was debited in three transactions. The funds were traced to e-wallet accounts registered in Noida. Investigation is ongoing, collaborating with Cyber Crime Cell, Mangaluru."
  },
  {
    caseId: "KA-KA-2026-00055",
    firNumber: "FIR-0055/2026",
    district: "Kalaburagi",
    station: "Station Bazar PS",
    incidentDate: "2026-04-01T10:00:00Z",
    registeredDate: "2026-04-01T11:30:00Z",
    category: "Assault",
    status: "Disposed",
    gravity: "Non-Grave",
    crimeHead: "Grievous Hurt",
    complainants: ["Mallappa Gowda, 38, Kalaburagi"],
    victims: ["Mallappa Gowda"],
    accused: ["Basavaraj", "Girish"],
    arrests: [
      { date: "2026-04-02T08:00:00Z", person: "Basavaraj", location: "Station Bazar area, Kalaburagi" },
      { date: "2026-04-02T08:00:00Z", person: "Girish", location: "Station Bazar area, Kalaburagi" }
    ],
    actsSections: [
      { act: "IPC 1860", section: "Section 324 (Voluntarily causing hurt by dangerous weapons)" },
      { act: "IPC 1860", section: "Section 326 (Voluntarily causing grievous hurt by dangerous weapons)" }
    ],
    court: "Principal District Court, Kalaburagi",
    chargesheeted: true,
    chargesheetDate: "2026-04-20T10:00:00Z",
    summaryText: "An altercation broke out at a tea stall between the complainant Mallappa and the accused individuals Basavaraj and Girish regarding a property dispute. The accused assaulted Mallappa with iron rods, fracturing his left forearm. Bystanders intervened. Case was registered immediately. Suspects were arrested the following day, and the iron weapons were seized. Chargesheet was submitted on 20th April. On 10th July, the Principal District Court disposed of the case, convicting both accused to 2 years of rigorous imprisonment."
  },
  {
    caseId: "KA-BD-2026-00910",
    firNumber: "FIR-0910/2026",
    district: "Belagavi",
    station: "Khade Bazar PS",
    incidentDate: "2026-07-01T02:00:00Z",
    registeredDate: "2026-07-01T14:20:00Z",
    category: "Theft / Burglary",
    status: "Under Investigation",
    gravity: "Grave",
    crimeHead: "Commercial Burglary",
    complainants: ["Anand Shah, 41, Belagavi Commercial Guild"],
    victims: ["Anand Shah"],
    accused: ["unknown offenders"],
    arrests: [],
    actsSections: [
      { act: "IPC 1860", section: "Section 457 (Lurking house-trespass by night)" },
      { act: "IPC 1860", section: "Section 380 (Theft in dwelling house)" }
    ],
    court: "JMFC Court, Belagavi",
    chargesheeted: false,
    summaryText: "On the early morning of 1st July 2026, unknown thieves broke into a mobile retail store in Khade Bazar. Shutter locks were cut using heavy metal cutters. The thieves stole 45 premium smartphones and ₹35,000 cash from the register, totaling an estimated loss of ₹9,50,000. CCTV cameras were spray-painted by the culprits. Forensic team gathered footprints and traces of metal fragments. Investigation is being led by Inspector Patil."
  }
];

const $$Astro = createAstro();
function getStaticPaths() {
  return MOCK_CASES.map((c) => ({
    params: { caseId: c.caseId }
  }));
}
const $$caseId = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$caseId;
  const { caseId } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Case Details - ${caseId}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PermissionGuard", null, { "permission": PERMISSIONS.VIEW_CASE_DETAIL_FULL, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/PermissionGuard.tsx", "client:component-export": "PermissionGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CaseDetailView", null, { "caseId": caseId || "", "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/cases/CaseDetailView.tsx", "client:component-export": "default" })} ` })} ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/cases/[caseId].astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/cases/[caseId].astro";
const $$url = "/app/cases/[caseId].html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$caseId,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_Ds0Xuhnu.mjs';
import { ArrowLeft, AlertCircle } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Disclaimer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Usage Disclaimer", "hideNav": true, "transitionAnimate": "fade" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-canvas flex flex-col">  <header class="w-full h-16 border-b border-hairline-soft bg-canvas/95 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between"> <a href="/app/index.html" class="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg"> <img src="/app/karnataka_emblem.png" alt="Karnataka State Emblem" class="w-9 h-9 object-contain" width="36" height="36"> <div class="flex flex-col"> <span class="font-display font-bold text-base leading-tight tracking-tight text-ink-deep group-hover:text-primary transition">
KSP-ConAI
</span> <span class="text-[10px] uppercase font-bold tracking-wider text-steel"> <span class="lang-en">Karnataka State Police</span> <span class="lang-kn">ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್</span> </span> </div> </a> <div class="flex items-center gap-3"> <a href="/app/login.html" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline-soft bg-surface-soft hover:bg-hairline text-xs font-bold text-ink transition"> ${renderComponent($$result2, "ArrowLeft", ArrowLeft, { "className": "w-3.5 h-3.5" })} <span class="lang-en">Back to Login</span> <span class="lang-kn">ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ</span> </a> </div> </header>  <main class="flex-1 p-4 sm:p-6 md:p-10 max-w-4xl mx-auto w-full space-y-6">  <div class="flex items-center justify-between border-b border-hairline-soft pb-3"> <a href="/app/index.html" class="text-xs font-bold text-steel hover:text-primary transition flex items-center gap-1">
← <span class="lang-en">Home</span><span class="lang-kn">ಮುಖಪುಟ</span> </a> <span class="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20"> <span class="lang-en">Official Public Document</span> <span class="lang-kn">ಅಧಿಕೃತ ಸಾರ್ವಜನಿಕ ದಾಖಲೆ</span> </span> </div>  <div class="bg-canvas border border-hairline-soft p-6 sm:p-10 rounded-3xl card-product-shadow space-y-6">  <div class="flex items-start sm:items-center justify-between gap-4 pb-6 border-b border-hairline-soft"> <div class="flex items-center gap-3.5"> <img src="/app/karnataka_emblem.png" alt="Government Seal" class="w-12 h-12 object-contain shrink-0" width="48" height="48"> <div> <span class="text-[10px] uppercase tracking-wider text-steel font-bold block"> <span class="lang-en">Karnataka State Police • Intelligence Advisory</span> <span class="lang-kn">ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ • ಗುಪ್ತಚರ ಸಲಹೆ</span> </span> <h1 class="text-xl sm:text-2xl font-bold text-ink-deep mt-0.5"> <span class="lang-en">Usage & Intelligence Disclaimer</span> <span class="lang-kn">ಬಳಕೆ ಮತ್ತು ಗುಪ್ತಚರ ಹಕ್ಕುತ್ಯಾಗ</span> </h1> </div> </div> <div class="hidden sm:flex flex-col items-end text-right"> <span class="text-[10px] text-stone font-mono uppercase tracking-wider">Doc ID: KSP-LEG-DIS-2026</span> <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1"> <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Disclaimer
</span> </div> </div> <div class="text-[11px] text-stone font-medium bg-surface-soft p-3 rounded-xl border border-hairline-soft flex items-center justify-between"> <span> <span class="lang-en">Last Updated: July 2026 | Authority: Karnataka State Police Director General</span> <span class="lang-kn">ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಿದ್ದು: ಜುಲೈ 2026 | ಪ್ರಾಧಿಕಾರ: ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಮಹಾನಿರ್ದೇಶಕರು</span> </span> ${renderComponent($$result2, "AlertCircle", AlertCircle, { "className": "w-4 h-4 text-primary" })} </div> <div class="space-y-6 text-xs text-steel leading-relaxed"> <section class="space-y-2"> <h2 class="text-sm font-bold text-ink-deep"> <span class="lang-en">1. Advisory Nature of AI Tools</span> <span class="lang-kn">1. AI ಪರಿಕರಗಳ ಸಲಹಾತ್ಮಕ ಸ್ವರೂಪ</span> </h2> <p class="lang-en">
The Karnataka State Police Crime Intelligence Copilot (KSP-ConAI) utilizes Large Language Models (LLMs), machine learning algorithms, and natural language processing to assist officers in analyzing Case Narrative Diaries, establishing suspect timelines, and generating suspect relationship graphs.
</p> <p class="lang-kn">
ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಅಪರಾಧ ಗುಪ್ತಚರ ಸಹಾಯಕ (KSP-ConAI) ಪ್ರಕಟಿತ ಕೇಸ್ ಡೈರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು, ಆರೋಪಿಗಳ ಟೈಮ್‌ಲೈನ್‌ಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ಮತ್ತು ಆರೋಪಿಗಳ ಸಂಬಂಧ ನಕ್ಷೆಗಳನ್ನು ರಚಿಸಲು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ನೈಸರ್ಗಿಕ ಭಾಷಾ ಸಂಸ್ಕರಣೆಯನ್ನು ಬಳಸಿಕೊಳ್ಳುತ್ತದೆ.
</p> <div class="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-amber-900 mt-2"> <p class="font-bold lang-en">
All AI-generated summaries, chat responses, and relationship links are advisory in nature. They do NOT constitute official legal testimony, final evidence, or deterministic assertions of guilt.
</p> <p class="font-bold lang-kn">
ಎಲ್ಲಾ AI-ರಚಿತ ಸಾರಾಂಶಗಳು, ಚಾಟ್ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಮತ್ತು ಸಂಬಂಧದ ಕೊಂಡಿಗಳು ಕೇವಲ ಸಲಹಾತ್ಮಕ ಸ್ವರೂಪದ್ದಾಗಿರುತ್ತವೆ. ಅವು ಅಧಿಕೃತ ಕಾನೂನು ಸಾಕ್ಷ್ಯ, ಅಂತಿಮ ಸಾಕ್ಷ್ಯ ಅಥವಾ ಅಪರಾಧದ ನಿರ್ಣಾಯಕ ಪ್ರತಿಪಾದನೆಗಳನ್ನು ರೂಪಿಸುವುದಿಲ್ಲ.
</p> </div> </section> <section class="space-y-2"> <h2 class="text-sm font-bold text-ink-deep"> <span class="lang-en">2. Officer Verification Requirement</span> <span class="lang-kn">2. ಅಧಿಕಾರಿಯ ಪರಿಶೀಲನೆಯ ಅವಶ್ಯಕತೆ</span> </h2> <p class="lang-en">
Investigating Officers (IOs) bear sole legal responsibility for the accuracy and validity of their case files. All intelligence outputs produced by KSP-ConAI must be:
</p> <p class="lang-kn">
ತನಿಖಾಧಿಕಾರಿಗಳು (IOs) ತಮ್ಮ ಪ್ರಕರಣದ ಕಡತಗಳ ನಿಖರತೆ ಮತ್ತು ಸಿಂಧುತ್ವಕ್ಕೆ ಸಂಪೂರ್ಣ ಕಾನೂನು ಜವಾಬ್ದಾರಿಯನ್ನು ಹೊಂದಿರುತ್ತಾರೆ. KSP-ConAI ನಿಂದ ಉತ್ಪಾದಿಸಲ್ಪಟ್ಟ ಎಲ್ಲಾ ಗುಪ್ತಚರ ಮಾಹಿತಿಯನ್ನು ಅಧಿಕಾರಿಗಳು:
</p> <ul class="list-disc pl-5 space-y-1 mt-2"> <li class="lang-en">Cross-checked against the official signed paper Case Diaries and CCTNS records.</li> <li class="lang-kn">ಅಧಿಕೃತ ಸಹಿ ಮಾಡಿದ ಕೇಸ್ ಡೈರಿಗಳು ಮತ್ತು CCTNS ದಾಖಲೆಗಳೊಂದಿಗೆ ಕ್ರಾಸ್-ವೆರಿಫೈ ಮಾಡಬೇಕು.</li> <li class="lang-en">Verified with original witness statements and forensic reports before submission to a court of law.</li> <li class="lang-kn">ನ್ಯಾಯಾಲಯಕ್ಕೆ ಸಲ್ಲಿಸುವ ಮುನ್ನ ಮೂಲ ಸಾಕ್ಷಿ ಹೇಳಿಕೆಗಳು ಮತ್ತು ಫೋರೆನ್ಸಿಕ್ ವರದಿಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.</li> <li class="lang-en">Confirmed for accuracy in names, dates, sections, and recovery amounts.</li> <li class="lang-kn">ಹೆಸರುಗಳು, ದಿನಾಂಕಗಳು, ಸೆಕ್ಷನ್‌ಗಳು ಮತ್ತು ವಶಪಡಿಸಿಕೊಂಡ ಮೊತ್ತಗಳ ನಿಖರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಬೇಕು.</li> </ul> </section> <section class="space-y-2"> <h2 class="text-sm font-bold text-ink-deep"> <span class="lang-en">3. Geolocation and Mapping Limitations</span> <span class="lang-kn">3. ಜಿಯೋಲೋಕಲೈಸೇಶನ್ ಮತ್ತು ಮ್ಯಾಪಿಂಗ್ ಮಿತಿಗಳು</span> </h2> <p class="lang-en">
Hotspots maps, cluster zones, and coordinate pins rendered on this platform are based on available address texts and mobile tower records. They represent statistical approximations rather than exact physical locations. Discrepancies in street maps or boundaries should be resolved using official municipal records.
</p> <p class="lang-kn">
ಈ ವೇದಿಕೆಯಲ್ಲಿ ನಿರೂಪಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳ ನಕ್ಷೆಗಳು, ಕ್ಲಸ್ಟರ್ ವಲಯಗಳು ಮತ್ತು ನಿರ್ದೇಶಾಂಕ ಪಿನ್‌ಗಳು ಲಭ್ಯವಿರುವ ವಿಳಾಸ ಪಠ್ಯಗಳು ಮತ್ತು ಮೊಬೈಲ್ ಟವರ್ ದಾಖಲೆಗಳನ್ನು ಆಧರಿಸಿವೆ. ಅವು ನಿಖರವಾದ ಭೌತಿಕ ಸ್ಥಳಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿ ಅಂಕಿಅಂಶಗಳ ಅಂದಾಜುಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತವೆ. ರಸ್ತೆ ನಕ್ಷೆಗಳು ಅಥವಾ ಗಡಿಗಳಲ್ಲಿನ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಅಧಿಕೃತ ಮುನ್ಸಿಪಲ್ ದಾಖಲೆಗಳನ್ನು ಬಳಸಿ ಬಗೆಹರಿಸಿಕೊಳ್ಳಬೇಕು.
</p> </section> <section class="space-y-2"> <h2 class="text-sm font-bold text-ink-deep"> <span class="lang-en">4. No Legal Liability</span> <span class="lang-kn">4. ಯಾವುದೇ ಕಾನೂನು ಹೊಣೆಗಾರಿಕೆ ಇಲ್ಲ</span> </h2> <p class="lang-en">
The Government of Karnataka and the Karnataka State Police Command Centre decline all liability for errors, processing offsets, or procedural delays caused by reliance on KSP-ConAI's automated intelligence feeds.
</p> <p class="lang-kn">
KSP-ConAI ನ ಸ್ವಯಂಚಾಲಿತ ಗುಪ್ತಚರ ಮಾಹಿತಿಯ ಮೇಲಿನ ಅವಲಂಬನೆಯಿಂದ ಉಂಟಾಗುವ ತಪ್ಪುಗಳು, ವಿಳಂಬಗಳು ಅಥವಾ ಕಾರ್ಯವಿಧಾನದ ವ್ಯತ್ಯಾಸಗಳಿಗೆ ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಮತ್ತು ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ ಯಾವುದೇ ಜವಾಬ್ದಾರಿಯನ್ನು ಹೊರುವುದಿಲ್ಲ.
</p> </section> </div>  <div class="border-t border-hairline-soft pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone"> <div class="flex items-center gap-2"> <img src="/app/karnataka_emblem.png" alt="Seal" class="w-6 h-6 object-contain" width="24" height="24"> <span>Karnataka State Police Command Centre • KSP-ConAI Protocol V1.0</span> </div> <button onclick="window.print()" class="px-4 py-2 bg-ink-deep text-white rounded-full font-bold hover:bg-charcoal transition cursor-pointer"> <span class="lang-en">Print Document</span> <span class="lang-kn">ದಾಖಲೆಯನ್ನು ಪ್ರಿಂಟ್ ಮಾಡಿ</span> </button> </div> </div> </main> </div> ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/disclaimer.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/disclaimer.astro";
const $$url = "/app/disclaimer.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Disclaimer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

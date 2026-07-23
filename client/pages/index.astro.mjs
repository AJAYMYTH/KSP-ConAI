import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_CNp57hTW.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Globe, ArrowRight, Shield, Network, Bot, Cpu, Activity, FileText, Database, Layers, Search, FileCheck, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export { renderers } from '../renderers.mjs';

const KANNADA_DIGITS = ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"];
const KANNADA_MONTHS = {
  0: "ಜನವರಿ",
  1: "ಫೆಬ್ರವರಿ",
  2: "ಮಾರ್ಚ್",
  3: "ಏಪ್ರಿಲ್",
  4: "ಮೇ",
  5: "ಜೂನ್",
  6: "ಜುಲೈ",
  7: "ಆಗಸ್ಟ್",
  8: "ಸೆಪ್ಟೆಂಬರ್",
  9: "ಅಕ್ಟೋಬರ್",
  10: "ನವೆಂಬರ್",
  11: "ಡಿಸೆಂಬರ್"
};
function convertToKannadaDigits(num) {
  return num.toString().replace(/\d/g, (d) => KANNADA_DIGITS[parseInt(d, 10)]);
}
function formatLocalDate(date, lang) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  if (lang === "kn") {
    const day = convertToKannadaDigits(d.getDate());
    const month = KANNADA_MONTHS[d.getMonth()];
    const year = convertToKannadaDigits(d.getFullYear());
    return `${day} ${month} ${year}`;
  } else {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }
}
function formatLocalNumber(num, lang) {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  return lang === "kn" ? convertToKannadaDigits(formatted) : formatted;
}
function formatLocalCurrency(num, lang) {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
  return lang === "kn" ? convertToKannadaDigits(formatted) : formatted;
}
function formatLocalTime(time, lang) {
  const d = typeof time === "string" ? new Date(time) : time;
  if (isNaN(d.getTime())) {
    if (typeof time === "string") {
      if (lang === "kn") {
        let tStr = time.replace(/AM/gi, "ಪೂರ್ವಾಹ್ನ").replace(/PM/gi, "ಅಪರಾಹ್ನ");
        return convertToKannadaDigits(tStr);
      }
      return time;
    }
    return String(time);
  }
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minStr = minutes < 10 ? "0" + minutes : minutes;
  if (lang === "kn") {
    const kHours = convertToKannadaDigits(hours);
    const kMins = convertToKannadaDigits(minStr);
    const kAmpm = ampm === "AM" ? "ಪೂರ್ವಾಹ್ನ" : "ಅಪರಾಹ್ನ";
    return `${kHours}:${kMins} ${kAmpm}`;
  } else {
    return `${hours}:${minStr} ${ampm}`;
  }
}
function getLanguageInstruction(lang) {
  if (lang === "kn") {
    return "Respond strictly in Kannada (ಕನ್ನಡ).";
  }
  return "Respond in English.";
}

function useI18n() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const changeLanguage = (lang) => {
    const formatted = lang.toLowerCase();
    i18n.changeLanguage(formatted);
    if (typeof window !== "undefined") {
      localStorage.setItem("ksp_language", formatted.toUpperCase());
      window.dispatchEvent(
        new CustomEvent("ksp-language-change", { detail: formatted.toUpperCase() })
      );
    }
  };
  return {
    t,
    currentLanguage,
    changeLanguage,
    formatDate: (date) => formatLocalDate(date, currentLanguage),
    formatNumber: (num) => formatLocalNumber(num, currentLanguage),
    formatCurrency: (num) => formatLocalCurrency(num, currentLanguage),
    formatTime: (time) => formatLocalTime(time, currentLanguage),
    aiInstruction: getLanguageInstruction(currentLanguage)
  };
}

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useI18n();
  const handleToggle = () => {
    const nextLang = currentLanguage === "en" ? "kn" : "en";
    changeLanguage(nextLang);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: handleToggle,
      className: "flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-soft border border-hairline hover:bg-surface-mid focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full text-[10px] font-display font-bold text-ink transition-all cursor-pointer select-none",
      "aria-label": "Toggle language between English and Kannada",
      children: [
        /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-stone" }),
        /* @__PURE__ */ jsx("span", { children: currentLanguage === "en" ? "English" : "ಕನ್ನಡ" })
      ]
    }
  );
};

const LandingPage = () => {
  const { t, currentLanguage, formatNumber } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(0);
  useEffect(() => {
    setMounted(true);
  }, []);
  const headingStyle = {
    fontFeatureSettings: '"ss01" on, "ss02" on'
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#fbfbfd] min-h-[100dvh] text-slate-900 font-sans antialiased selection:bg-primary-soft selection:text-primary-deep overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-[100] bg-[#080d1a] pointer-events-none transition-transform duration-700 ease-out origin-left ${mounted ? "scale-x-0" : "scale-x-100"}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-full bg-[#0a1317] text-white py-2.5 px-6 text-center text-xs font-bold tracking-wide select-none z-50 relative border-b border-white/[0.08]", children: currentLanguage === "en" ? /* @__PURE__ */ jsxs("span", { children: [
      "CONFIDENTIAL LAW-ENFORCEMENT PORTAL: Authorized KSP personnel access only.",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/app/disclaimer.html", className: "underline hover:text-blue-400 ml-1", children: "Read protocol guidelines →" })
    ] }) : /* @__PURE__ */ jsxs("span", { children: [
      "ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಪೋರ್ಟಲ್: ಅಧಿಕೃತ KSP ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶವಿದೆ.",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/app/disclaimer.html", className: "underline hover:text-blue-400 ml-1", children: "ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಓದಿ →" })
    ] }) }),
    /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-[#dee3e9] px-6 md:px-12 flex items-center justify-between shadow-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: "/app/karnataka_emblem.png", alt: "Karnataka Coat of Arms", className: "w-9 h-9 object-contain", width: "36", height: "36" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left border-l border-[#dee3e9] pl-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[8px] font-sans font-bold tracking-[0.2em] text-slate-500 uppercase leading-none", children: t("nav.govKarnataka") }),
          /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-[12px] text-[#0a1317] tracking-tight mt-1", style: headingStyle, children: "KSP-ConAI" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden lg:flex items-center gap-8 font-display font-bold text-xs text-slate-650", children: [
        /* @__PURE__ */ jsx("a", { href: "/app/index.html", className: "hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150", children: t("nav.home") }),
        /* @__PURE__ */ jsx("a", { href: "#about", className: "hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150", children: t("nav.about") }),
        /* @__PURE__ */ jsx("a", { href: "#capabilities", className: "hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150", children: t("nav.capabilities") }),
        /* @__PURE__ */ jsx("a", { href: "#workflow", className: "hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150", children: t("nav.workflow") }),
        /* @__PURE__ */ jsx("a", { href: "#faq", className: "hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150", children: t("nav.faq") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(LanguageSwitcher, {}),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/app/login.html",
            className: "h-10 px-5 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none shadow-sm flex items-center justify-center font-display",
            children: t("nav.login")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-0 bg-[#ffffff]", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative w-full pt-8 pb-10 md:pt-12 md:pb-12 flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-[#dee3e9] bg-[#ffffff]", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.22] pointer-events-none", style: { backgroundImage: "radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" } }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-5 relative z-10 flex flex-col items-center min-h-[280px] sm:min-h-[300px] md:min-h-[320px] justify-center", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `font-display font-bold text-[10px] tracking-[0.25em] text-[#991b1b] uppercase block transition-all duration-700 delay-100 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`,
              style: headingStyle,
              children: t("hero.badge")
            }
          ),
          /* @__PURE__ */ jsxs(
            "h1",
            {
              className: `text-4xl md:text-6xl lg:text-7xl font-medium text-[#0a1317] leading-[1.12] tracking-tight text-center max-w-4xl font-display transition-all duration-750 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`,
              style: headingStyle,
              children: [
                "KSP-ConAI: ",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary via-blue-600 to-primary-deep bg-clip-text text-transparent", children: t("hero.title") })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `text-sm md:text-lg text-slate-500 leading-[1.44] max-w-2xl text-center font-medium transition-all duration-700 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, children: t("hero.description") }),
          /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap justify-center gap-4 pt-2 transition-all duration-700 delay-400 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/app/login.html",
                className: "h-11 px-8 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 shadow-md flex items-center justify-center gap-1.5 select-none font-display active:scale-[0.98]",
                children: [
                  t("hero.launch"),
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#capabilities",
                className: "h-11 px-8 bg-transparent border-2 border-[#0a1317] text-[#0a1317] hover:bg-slate-50 rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none flex items-center justify-center font-display active:scale-[0.98]",
                children: t("hero.explore")
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { id: "about", className: "border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28 relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-4 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#991b1b]/10 text-[#991b1b] border border-[#991b1b]/20 text-[10px] font-bold uppercase tracking-widest", children: [
              /* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Strategic Protocol" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-extrabold text-[#0a1317] leading-tight font-display tracking-tight", style: headingStyle, children: "Next-Generation Crime Intelligence & Grounded Analytics" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 text-left", children: /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-slate-600 leading-relaxed font-medium bg-surface-soft p-5 rounded-2xl border border-hairline-soft", children: currentLanguage === "en" ? "Engineered exclusively for Karnataka State Police investigators. Converts complex CCTNS records, suspect timelines, and Case Narrative Diaries into actionable, verifiable intelligence." : "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ತನಿಖಾಧಿಕಾರಿಗಳಿಗಾಗಿ ಪ್ರತ್ಯೇಕವಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ. CCTNS ದಾಖಲೆಗಳು ಮತ್ತು ಕೇಸ್ ಡೈರಿಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದಾದ ಗುಪ್ತಚರ ಮಾಹಿತಿಯಾಗಿ ಭಾಷಾಂತರಿಸುತ್ತದೆ." }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          {
            value: formatNumber(45e3) + "+",
            title: currentLanguage === "en" ? "FIR Case Files Ingested" : "ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು",
            subtitle: currentLanguage === "en" ? "Synced with CCTNS Central Database" : "CCTNS ಕೇಂದ್ರೀಯ ಡೇಟಾಬೇಸ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ",
            badge: "CCTNS Sync",
            accent: "from-blue-600 to-indigo-700"
          },
          {
            value: formatNumber(25e3) + "+",
            title: currentLanguage === "en" ? "Criminal Nodes Mapped" : "ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು",
            subtitle: currentLanguage === "en" ? "Deep suspect graph connection links" : "ಸಂಪರ್ಕಿತ ಶಂಕಿತ ಅಪರಾಧಿಗಳ ನೆಟ್‌ವರ್ಕ್",
            badge: "Graph Engine",
            accent: "from-amber-600 to-rose-700"
          },
          {
            value: "100%",
            title: currentLanguage === "en" ? "Audit Accountability" : "ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ",
            subtitle: currentLanguage === "en" ? "Deterministic SQL logging & verification" : "ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಮತ್ತು ದಾಖಲೆ ಪರಿಶೀಲನೆ",
            badge: "Audit Verifiable",
            accent: "from-emerald-600 to-teal-700"
          }
        ].map((stat, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-canvas border border-hairline-soft p-7 rounded-3xl card-product-shadow space-y-4 hover:-translate-y-1 transition-all duration-300 group", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase tracking-widest text-steel px-2.5 py-1 rounded-full bg-surface-soft border border-hairline", children: stat.badge }),
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `text-4xl md:text-5xl font-extrabold font-display tracking-tight bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`, style: headingStyle, children: stat.value }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-ink-deep font-display", style: headingStyle, children: stat.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-steel mt-1 font-medium", children: stat.subtitle })
          ] })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "capabilities", className: "border-t border-[#dee3e9] py-20 md:py-32 bg-[#fbfbfd]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-primary uppercase tracking-[0.25em] block font-display", style: headingStyle, children: "Core Modules" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-extrabold text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("capabilities.sectionTitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-slate-500 leading-relaxed font-medium", children: t("capabilities.sectionSubtitle") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 bg-[#080d1a] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between min-h-[360px] group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider", children: [
                /* @__PURE__ */ jsx(Network, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Suspect Relational Graph" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono text-slate-400", children: "Node Engine v2.4" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 my-6 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-md", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-white flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rose-500 animate-pulse" }),
                  "Gang Network #KA-BC-812"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-emerald-400 font-bold", children: "5 Suspects Linked" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/80 border border-rose-500/30 p-2.5 rounded-xl flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-rose-400 font-bold uppercase", children: "Prime Suspect" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-white mt-0.5", children: "Ramesh @ Tiger" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 mt-1", children: "3 Cases • FIR #812" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/80 border border-amber-500/30 p-2.5 rounded-xl flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-amber-400 font-bold uppercase", children: "Associate" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-white mt-0.5", children: "Siddappa K." }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 mt-1", children: "CDR Match (0.94)" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/80 border border-blue-500/30 p-2.5 rounded-xl flex flex-col col-span-2 sm:col-span-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-blue-400 font-bold uppercase", children: "Vehicle Node" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-white mt-0.5", children: "KA-01-MJ-8819" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 mt-1", children: "Toll Gate Pin" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white font-display", style: headingStyle, children: t("capabilities.card2Title") }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 font-medium leading-relaxed", children: t("capabilities.card2Desc") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 bg-canvas border border-hairline-soft rounded-3xl p-6 sm:p-8 card-product-shadow flex flex-col justify-between min-h-[360px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0", children: /* @__PURE__ */ jsx(Bot, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase font-bold text-steel tracking-wider block", children: "Natural Language SQL" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-ink-deep font-display", style: headingStyle, children: t("capabilities.card1Title") })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-steel font-medium leading-relaxed", children: t("capabilities.card1Desc") }),
              /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-surface-soft rounded-2xl border border-hairline-soft space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] font-bold text-steel", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(Cpu, { className: "w-3 h-3 text-primary" }),
                    " Copilot Stream"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200", children: "99.4% Grounded" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "bg-canvas p-2.5 rounded-xl border border-hairline text-xs font-semibold text-ink-deep", children: '"Show all robbery FIRs registered in Mysuru City during 2026."' }),
                /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 p-2.5 rounded-xl border border-primary/20 text-xs font-semibold text-primary-deep flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "✓ 4 Matching Cases Found" }),
                  /* @__PURE__ */ jsx("a", { href: "/app/search.html", className: "text-[10px] underline font-bold", children: "View List →" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-hairline-soft flex items-center justify-between text-[9px] font-mono text-stone font-bold uppercase", children: [
              /* @__PURE__ */ jsx("span", { children: "SQL TRANSLATION LOGGED" }),
              /* @__PURE__ */ jsx("span", { children: "ZERO HALLUCINATION" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 bg-canvas border border-hairline-soft rounded-3xl p-6 sm:p-8 card-product-shadow flex flex-col justify-between min-h-[320px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0", children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase font-bold text-steel tracking-wider block", children: "Geospatial Analytics" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-ink-deep font-display", style: headingStyle, children: t("capabilities.card3Title") })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-steel font-medium leading-relaxed", children: t("capabilities.card3Desc") }),
              /* @__PURE__ */ jsxs("div", { className: "h-28 rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-800", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-30" }),
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full border border-sky-500/30 animate-ping" }),
                /* @__PURE__ */ jsx("div", { className: "absolute w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-sky-400 animate-pulse" }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-2.5 left-3 text-[8px] font-mono text-sky-400 font-bold uppercase tracking-widest", children: "Bengaluru City • 12 Hotspot Pins Active" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-hairline-soft flex items-center justify-between text-[9px] font-mono text-stone font-bold uppercase", children: [
              /* @__PURE__ */ jsx("span", { children: "GPS COORDINATES" }),
              /* @__PURE__ */ jsx("a", { href: "/app/map.html", className: "text-primary hover:underline font-bold", children: "Open Map →" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 bg-canvas border border-hairline-soft rounded-3xl p-6 sm:p-8 card-product-shadow flex flex-col justify-between min-h-[320px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0", children: /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase font-bold text-steel tracking-wider block", children: "Judicial Intelligence Export" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-ink-deep font-display", style: headingStyle, children: t("capabilities.card4Title") })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-steel font-medium leading-relaxed", children: t("capabilities.card4Desc") }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1", children: [
                { name: "KA-BC-2026-00812_Brief.pdf", size: "1.4 MB", time: "Generated 2m ago" },
                { name: "KA-MY-2026-00124_Brief.pdf", size: "2.8 MB", time: "Generated 1h ago" }
              ].map((doc, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl border border-hairline-soft bg-surface-soft hover:border-steel transition", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-primary shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-ink-deep", children: doc.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-steel", children: [
                      doc.time,
                      " • ",
                      doc.size
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("a", { href: "/app/reports.html", className: "text-[9px] font-bold text-primary hover:underline", children: "VIEW" })
              ] }, idx)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-hairline-soft flex items-center justify-between text-[9px] font-mono text-stone font-bold uppercase", children: [
              /* @__PURE__ */ jsx("span", { children: "AUDIT STAMPED PDF" }),
              /* @__PURE__ */ jsx("span", { children: "LEGAL TESTIMONY READY" })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "workflow", className: "border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-32", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-display", style: headingStyle, children: "Standard Operating Procedure" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-extrabold text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("workflow.sectionTitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-slate-500 leading-relaxed font-medium", children: t("workflow.sectionSubtitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto", children: [
          { step: "01", title: t("workflow.step1"), desc: t("workflow.step1Desc"), icon: Database },
          { step: "02", title: t("workflow.step2"), desc: t("workflow.step2Desc"), icon: Layers },
          { step: "03", title: t("workflow.step3"), desc: t("workflow.step3Desc"), icon: Search },
          { step: "04", title: t("workflow.step4"), desc: t("workflow.step4Desc"), icon: FileCheck }
        ].map((item, idx) => {
          const IconComponent = item.icon;
          const isSelected = activeWorkflowTab === idx;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setActiveWorkflowTab(idx),
              className: `p-6 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${isSelected ? "bg-ink-deep text-white border-ink-deep shadow-lg scale-[1.02]" : "bg-canvas text-ink-deep border-hairline-soft hover:border-steel hover:bg-surface-soft/60"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full ${isSelected ? "bg-white/15 text-white" : "bg-surface-soft text-steel"}`, children: [
                    "STEP ",
                    item.step
                  ] }),
                  /* @__PURE__ */ jsx(IconComponent, { className: `w-5 h-5 ${isSelected ? "text-primary" : "text-stone"}` })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-left", children: [
                  /* @__PURE__ */ jsx("h3", { className: `text-sm font-bold font-display ${isSelected ? "text-white" : "text-ink-deep"}`, style: headingStyle, children: item.title }),
                  /* @__PURE__ */ jsx("p", { className: `text-xs leading-relaxed ${isSelected ? "text-slate-300" : "text-steel"}`, children: item.desc })
                ] })
              ]
            },
            idx
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-[#dee3e9] py-20 md:py-32 bg-[#080d1a] text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-blue-400 uppercase tracking-[0.25em] block font-display", style: headingStyle, children: "Compliance Engine" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight", style: headingStyle, children: t("privacy.sec4Title") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-slate-400 leading-relaxed font-medium", children: t("privacy.sec4Desc") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: [
          { title: t("privacy.sec3Title"), desc: t("privacy.sec3Desc"), icon: Shield },
          { title: t("privacy.sec4Title"), desc: t("privacy.sec4Desc"), icon: Lock },
          { title: t("terms.sec1Title"), desc: t("terms.sec1Desc"), icon: FileText }
        ].map((item, idx) => {
          const IconComp = item.icon;
          return /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/90 border border-slate-800 p-7 rounded-3xl space-y-4 hover:border-slate-700 transition duration-200", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400", children: /* @__PURE__ */ jsx(IconComp, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white font-display uppercase tracking-wider", style: headingStyle, children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 leading-relaxed font-medium", children: item.desc })
          ] }, idx);
        }) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "faq", className: "border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-32", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-primary uppercase tracking-[0.25em] block font-display", style: headingStyle, children: "FAQ" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-extrabold text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("faq.sectionTitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
          { q: t("faq.q1"), a: t("faq.a1") },
          { q: t("faq.q2"), a: t("faq.a2") },
          { q: t("faq.q3"), a: t("faq.a3") }
        ].map((item, idx) => /* @__PURE__ */ jsxs("details", { className: "group bg-canvas border border-hairline-soft rounded-2xl overflow-hidden card-product-shadow transition duration-200", children: [
          /* @__PURE__ */ jsxs("summary", { className: "px-6 py-5 text-xs font-bold text-[#0a1317] flex items-center justify-between cursor-pointer select-none font-display", style: headingStyle, children: [
            /* @__PURE__ */ jsx("span", { children: item.q }),
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-slate-400 transition-transform duration-200 group-open:rotate-180 shrink-0", "aria-hidden": "true", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 pb-5 border-t border-hairline-soft pt-4 text-xs text-steel leading-relaxed bg-surface-soft/40 font-medium", children: item.a })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-[#dee3e9] py-16 bg-[#fbfbfd] px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto bg-[#0a1317] text-white p-10 sm:p-16 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[60%] h-[100%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" }),
        /* @__PURE__ */ jsx("span", { className: "relative z-10 text-[10px] font-bold text-blue-400 uppercase tracking-[0.25em] block font-display", style: headingStyle, children: t("login.regTitle") }),
        /* @__PURE__ */ jsx("h2", { className: "relative z-10 text-2xl sm:text-4xl font-extrabold text-white leading-tight font-display tracking-tight", style: headingStyle, children: "Ready to Access Crime Intelligence?" }),
        /* @__PURE__ */ jsx("p", { className: "relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto font-medium", children: t("login.subtitle") }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/app/login.html",
            className: "relative z-10 inline-flex items-center justify-center h-11 px-8 bg-white hover:bg-slate-100 text-[#080d1a] rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-150 shadow-md select-none active:scale-[0.98] font-display",
            children: [
              t("hero.launch"),
              " ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("footer", { className: "bg-white border-t border-[#dee3e9] px-6 md:px-12 py-14 text-xs space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: "/app/karnataka_emblem.png", alt: "Government Seal", className: "w-8 h-8 object-contain", width: "32", height: "32" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left", children: [
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-[#0a1317] leading-tight font-display", style: headingStyle, children: t("nav.govKarnataka") }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-bold leading-none mt-0.5 uppercase tracking-wider text-[8px]", children: t("nav.statePolice") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-650", children: [
            /* @__PURE__ */ jsx("a", { href: "#about", className: "hover:text-primary transition", children: t("nav.about") }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-slate-350", children: "•" }),
            /* @__PURE__ */ jsx("a", { href: "/app/privacy.html", className: "hover:text-primary transition", children: t("footer.privacy") }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-slate-350", children: "•" }),
            /* @__PURE__ */ jsx("a", { href: "/app/terms.html", className: "hover:text-primary transition", children: t("footer.terms") }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-slate-350", children: "•" }),
            /* @__PURE__ */ jsx("a", { href: "/app/disclaimer.html", className: "hover:text-primary transition", children: t("footer.disclaimer") })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-center md:text-right text-slate-400 font-bold font-mono text-[10px]", children: /* @__PURE__ */ jsx("span", { children: "KSP-ConAI Platform (v1.1)" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto border-t border-[#dee3e9] pt-6 text-center text-[10px] text-slate-400 leading-relaxed font-medium", children: currentLanguage === "en" ? "© 2026 Government of Karnataka. All Rights Reserved. Confidential law-enforcement tool. Access and actions are governed under official information security guidelines." : "© 2026 ಕರ್ನಾಟಕ ಸರ್ಕಾರ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಸಾಧನ. ಪ್ರವೇಶ ಮತ್ತು ಕ್ರಮಗಳನ್ನು ಅಧಿಕೃತ ಮಾಹಿತಿ ಭದ್ರತಾ ಮಾರ್ಗಸೂಚಿಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ." })
      ] })
    ] })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "KSP-ConAI \u2014 Intelligent Crime Intelligence Platform", "hideNav": true, "hideFooter": true, "transitionAnimate": "fade" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LandingPage", LandingPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/sections/LandingPage.tsx", "client:component-export": "LandingPage" })} ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/index.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/index.astro";
const $$url = "/app.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

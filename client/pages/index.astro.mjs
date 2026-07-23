import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_C4G-iN9W.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Globe, ArrowRight, Shield, Network, Bot, Activity, FileText, Download, Lock } from 'lucide-react';
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
  useEffect(() => {
    setMounted(true);
  }, []);
  const headingStyle = {
    fontFeatureSettings: '"ss01" on, "ss02" on'
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#ffffff] min-h-[100dvh] text-slate-900 font-sans antialiased selection:bg-primary-soft selection:text-primary-deep overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-[100] bg-[#080d1a] pointer-events-none transition-transform duration-700 ease-out origin-left ${mounted ? "scale-x-0" : "scale-x-100"}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-full bg-[#0a1317] text-white py-3 px-6 text-center text-xs font-bold tracking-wide select-none z-50 relative border-b border-white/[0.08]", children: currentLanguage === "en" ? /* @__PURE__ */ jsxs("span", { children: [
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
            className: "h-11 px-6 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none shadow-sm flex items-center justify-center font-display",
            children: t("nav.login")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-0 bg-[#ffffff]", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative w-full pt-16 pb-20 md:pt-28 md:pb-32 min-h-[520px] md:min-h-[580px] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-[#dee3e9] bg-[#ffffff]", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.28] pointer-events-none",
            style: {
              backgroundImage: "radial-gradient(#0064e0 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-6 relative z-10 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `font-display font-bold text-[11px] md:text-xs tracking-[0.25em] text-[#b91c1c] uppercase block transition-all duration-700 delay-100 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`,
              style: headingStyle,
              children: t("hero.badge")
            }
          ),
          /* @__PURE__ */ jsxs(
            "h1",
            {
              className: `text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium text-[#0a1317] leading-[1.08] tracking-tight text-center max-w-5xl font-display transition-all duration-750 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`,
              style: headingStyle,
              children: [
                "KSP-ConAI: ",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-[#0064e0] font-medium block mt-1", children: t("hero.title") })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `text-base md:text-xl text-[#5d6c7b] leading-[1.55] max-w-2xl text-center font-normal transition-all duration-700 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, children: t("hero.description") }),
          /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap justify-center gap-4 pt-4 transition-all duration-700 delay-400 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`, children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/app/login.html",
                className: "h-12 px-8 bg-[#0a1317] hover:bg-slate-800 text-white rounded-full text-xs md:text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#0064e0] focus-visible:outline-none transition-all duration-200 shadow-md flex items-center justify-center gap-2 select-none font-display active:scale-[0.98]",
                children: [
                  t("hero.launch"),
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#capabilities",
                className: "h-12 px-8 bg-white border-2 border-[#0a1317] text-[#0a1317] hover:bg-slate-50 rounded-full text-xs md:text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#0064e0] focus-visible:outline-none transition-all duration-200 select-none flex items-center justify-center font-display active:scale-[0.98]",
                children: t("hero.explore")
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { id: "about", className: "border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0064e0]/10 border border-[#0064e0]/20 text-[#0064e0] text-[10px] font-bold tracking-widest uppercase font-mono", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "STATE SECURITY PROTOCOL" })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-medium text-[#0a1317] leading-[1.18] tracking-tight font-display", style: headingStyle, children: "Empowering Law Enforcement via Responsible Intelligence" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-[#5d6c7b] leading-[1.55] max-w-2xl mx-auto font-medium", children: currentLanguage === "en" ? '"Providing explainable analytics, relation mapping, and natural language query capability to support state investigators, accelerate prosecution parameters, and ensure complete digital auditing compliance."' : '"ತನಿಖಾಧಿಕಾರಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ವೇಗಗೊಳಿಸಲು ಮತ್ತು ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಅನುಸರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಸಂಬಂಧ ನಕ್ಷೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆ ಸಾಮರ್ಥ್ಯ ಒದಗಿಸುವುದು."' })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto", children: [
          {
            value: formatNumber(45e3) + "+",
            label: currentLanguage === "en" ? "FIR Case Files Ingested" : "ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು",
            sub: currentLanguage === "en" ? "Indexed across 31 Districts" : "31 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಇಂಡೆಕ್ಸ್ ಮಾಡಲಾಗಿದೆ",
            accent: "text-[#0064e0]"
          },
          {
            value: formatNumber(25e3) + "+",
            label: currentLanguage === "en" ? "Criminal Nodes Linked" : "ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು",
            sub: currentLanguage === "en" ? "Multi-degree Associate Graph" : "ಬಹು-ಹಂತದ ಶಂಕಿತ ಜಾಲ",
            accent: "text-[#991b1b]"
          },
          {
            value: "100%",
            label: currentLanguage === "en" ? "Query Accountability" : "ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ",
            sub: currentLanguage === "en" ? "Immutable Audit Logs" : "ಬದಲಾಯಿಸಲಾಗದ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
            accent: "text-[#31a24c]"
          }
        ].map((stat, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "p-8 border border-[#dee3e9] bg-[#ffffff] rounded-3xl shadow-xs hover:border-[#0064e0]/40 hover:shadow-md transition-all duration-300 text-left space-y-3 flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("div", { className: `text-4xl md:text-5xl font-bold font-display tracking-tight tabular-nums ${stat.accent}`, style: headingStyle, children: stat.value }),
                /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-[#0a1317] tracking-tight pt-1", children: stat.label })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-[#5d6c7b] font-medium pt-2 border-t border-[#dee3e9]/60 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: stat.sub }),
                /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#0064e0]" })
              ] })
            ]
          },
          idx
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "capabilities", className: "border-t border-[#dee3e9] py-20 md:py-28 bg-[#f1f4f7]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono", children: "PLATFORM CAPABILITIES" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("capabilities.sectionTitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#5d6c7b] leading-relaxed font-medium", children: t("capabilities.sectionSubtitle") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 bg-[#0a1317] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[320px] group border border-[#dee3e9]/40 flex flex-col justify-end", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/app/network_mockup.png",
                alt: "Network Graph Link Analysis",
                className: "absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0a1317] via-[#0a1317]/60 to-transparent p-8 md:p-10 flex flex-col justify-end text-left z-10 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-[9px] font-bold uppercase tracking-widest font-mono w-fit", children: [
                /* @__PURE__ */ jsx(Network, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { children: "INTELLIGENCE ENGINE" })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-bold text-white tracking-tight font-display", style: headingStyle, children: t("capabilities.card2Title") }),
              /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-slate-300 leading-[1.55] font-medium max-w-xl", children: t("capabilities.card2Desc") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#ffffff] border border-[#dee3e9] p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[320px] space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-[#0064e0]/10 flex items-center justify-center text-[#0064e0] shrink-0", children: /* @__PURE__ */ jsx(Bot, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#0a1317] tracking-tight font-display", style: headingStyle, children: t("capabilities.card1Title") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[#5d6c7b] leading-[1.50] font-medium", children: t("capabilities.card1Desc") }),
              /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-[#f1f4f7] rounded-2xl border border-[#dee3e9] space-y-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-[#5d6c7b] font-bold flex justify-between tracking-wider font-mono", children: [
                  /* @__PURE__ */ jsx("span", { children: "SECURE COPILOT STREAM" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[#0064e0] flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#0064e0] animate-pulse" }),
                    "LIVE"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-white rounded-xl border border-[#dee3e9] text-[11px] font-medium text-[#0a1317] leading-tight shadow-xs", children: '"Find phone links for Case KA-BC-2026-00812."' }),
                  /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-[#0064e0]/10 rounded-xl border border-[#0064e0]/20 text-[11px] font-medium text-[#0457cb] leading-tight", children: '"Analysis complete: Linked 2 active phone numbers to suspect group."' })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-[#dee3e9] flex gap-3 text-[9px] text-[#8595a4] font-mono font-bold tracking-widest uppercase", children: [
              /* @__PURE__ */ jsx("span", { children: "SSE STREAMING" }),
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { children: "SQL LOG AUDITABLE" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#ffffff] border border-[#dee3e9] p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[320px] space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0", children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#0a1317] tracking-tight font-display", style: headingStyle, children: t("capabilities.card3Title") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[#5d6c7b] leading-[1.50] font-medium", children: t("capabilities.card3Desc") }),
              /* @__PURE__ */ jsxs("div", { className: "h-32 rounded-2xl bg-[#0a1317] relative overflow-hidden flex items-center justify-center border border-[#dee3e9]/20", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#0064e0_1px,transparent_1px)] [background-size:16px_16px] opacity-30" }),
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full border border-[#0064e0]/30 flex items-center justify-center animate-ping duration-1000" }),
                /* @__PURE__ */ jsx("div", { className: "absolute w-9 h-9 rounded-full bg-[#0064e0]/30 border border-[#0064e0]/60 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 rounded-full bg-[#0064e0] animate-pulse" }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 text-[8px] text-[#0064e0] font-mono tracking-widest font-bold uppercase", children: "RADAR SWEEP ACTIVE" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-3 border-t border-[#dee3e9] text-[9px] text-[#8595a4] font-mono font-bold tracking-widest uppercase", children: /* @__PURE__ */ jsx("span", { children: "GEOSPATIAL COORDINATES" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 bg-[#ffffff] border border-[#dee3e9] p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[320px] space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-center text-[#0a1317] shrink-0", children: /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6 text-[#0064e0]" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("capabilities.card4Title") }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#5d6c7b] font-mono uppercase tracking-wider", children: "Automated Case Briefing Output" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#5d6c7b] leading-[1.60] font-medium max-w-2xl", children: t("capabilities.card4Desc") }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1", children: [
                { name: "KA-BC-2026-00812_Brief.pdf", size: "1.4 MB", time: "Generated 2m ago" },
                { name: "KA-MY-2026-00124_Brief.pdf", size: "2.8 MB", time: "Generated 1h ago" }
              ].map((doc, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3.5 rounded-2xl border border-[#dee3e9] bg-[#ffffff] hover:border-[#0064e0] transition duration-150 shadow-2xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-[#0064e0] shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#0a1317] tracking-tight", children: doc.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-[#8595a4]", children: [
                      doc.time,
                      " • ",
                      doc.size
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("a", { href: "/app/login.html", className: "text-[9px] font-bold text-[#0064e0] hover:underline flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
                  " EXPORT"
                ] })
              ] }, idx)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-[#dee3e9] flex gap-4 text-[9px] text-[#8595a4] font-mono font-bold tracking-widest uppercase", children: [
              /* @__PURE__ */ jsx("span", { children: "PDF COMPILED" }),
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { children: "TEMPORAL METRICS" })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "workflow", className: "border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-mono", children: "OPERATIONAL PIPELINE" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("workflow.sectionTitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#5d6c7b] leading-relaxed font-medium", children: t("workflow.sectionSubtitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-6 left-1/8 right-1/8 h-0.5 bg-[#dee3e9] z-0" }),
          [
            { title: t("workflow.step1"), desc: t("workflow.step1Desc") },
            { title: t("workflow.step2"), desc: t("workflow.step2Desc") },
            { title: t("workflow.step3"), desc: t("workflow.step3Desc") },
            { title: t("workflow.step4"), desc: t("workflow.step4Desc") }
          ].map((step, idx) => /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center text-center space-y-4 z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-white border-2 border-[#0064e0] text-[#0064e0] font-display font-bold text-sm flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-110", children: idx + 1 }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display", style: headingStyle, children: step.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#5d6c7b] leading-relaxed max-w-[200px] font-medium", children: step.desc })
          ] }, idx))
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-[#dee3e9] py-20 md:py-28 bg-[#f1f4f7]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 space-y-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono", children: "SECURITY STANDARDS" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("privacy.sec4Title") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#5d6c7b] leading-relaxed font-medium", children: t("privacy.sec4Desc") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: [
          { title: t("privacy.sec3Title"), desc: t("privacy.sec3Desc") },
          { title: t("privacy.sec4Title"), desc: t("privacy.sec4Desc") },
          { title: t("terms.sec1Title"), desc: t("terms.sec1Desc") }
        ].map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#dee3e9] p-6 rounded-3xl space-y-3 shadow-xs hover:border-[#0064e0]/40 transition duration-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 text-[#991b1b]", children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display", style: headingStyle, children: item.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[#5d6c7b] leading-relaxed font-medium", children: item.desc })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "faq", className: "border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono", children: "FREQUENTLY ASKED QUESTIONS" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight", style: headingStyle, children: t("faq.sectionTitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
          { q: t("faq.q1"), a: t("faq.a1") },
          { q: t("faq.q2"), a: t("faq.a2") },
          { q: t("faq.q3"), a: t("faq.a3") }
        ].map((item, idx) => /* @__PURE__ */ jsxs("details", { className: "group bg-white border border-[#dee3e9] rounded-2xl overflow-hidden shadow-2xs transition duration-200", children: [
          /* @__PURE__ */ jsxs("summary", { className: "px-6 py-5 text-xs font-bold text-[#0a1317] flex items-center justify-between cursor-pointer select-none font-display", style: headingStyle, children: [
            /* @__PURE__ */ jsx("span", { children: item.q }),
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-[#8595a4] transition-transform duration-200 group-open:rotate-180 shrink-0", "aria-hidden": "true", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 pb-5 border-t border-[#dee3e9] pt-4 text-xs text-[#5d6c7b] leading-relaxed bg-[#f1f4f7]/40 font-medium", children: item.a })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-[#dee3e9] py-16 bg-[#f1f4f7] px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto bg-[#080d1a] text-white p-12 md:p-16 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#0064e0]/10 blur-[100px] pointer-events-none" }),
        /* @__PURE__ */ jsx("span", { className: "relative z-10 text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono", children: t("login.regTitle") }),
        /* @__PURE__ */ jsx("h2", { className: "relative z-10 text-2xl md:text-4xl font-medium text-white leading-tight font-display tracking-tight", style: headingStyle, children: "Ready to begin an investigation?" }),
        /* @__PURE__ */ jsx("p", { className: "relative z-10 text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-medium", children: t("login.subtitle") }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/app/login.html",
            className: "relative z-10 inline-flex items-center justify-center h-12 px-8 bg-white hover:bg-slate-100 text-[#080d1a] rounded-full text-xs font-bold transition-all duration-150 shadow-md select-none active:scale-[0.98] font-display",
            children: t("hero.launch")
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("footer", { className: "bg-[#ffffff] border-t border-[#dee3e9] pt-16 pb-12 px-6 md:px-12 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4 pr-0 lg:pr-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("img", { src: "/app/karnataka_emblem.png", alt: "Karnataka State Emblem", className: "w-10 h-10 object-contain shrink-0", width: "40", height: "40" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left", children: [
                /* @__PURE__ */ jsx("span", { className: "font-display font-bold text-lg leading-tight tracking-tight text-[#0a1317]", style: headingStyle, children: "KSP-ConAI" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase font-bold tracking-wider text-[#5d6c7b]", children: currentLanguage === "en" ? "Karnataka State Police" : "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#5d6c7b] leading-relaxed max-w-sm font-medium", children: currentLanguage === "en" ? "An official, retrieval-grounded crime intelligence workspace built for Karnataka State Police investigators and analysts." : "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ತನಿಖಾಧಿಕಾರಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ ಅಧಿಕೃತ ಅಪರಾಧ ಗುಪ್ತಚರ ವೇದಿಕೆ." }),
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f4f7] border border-[#dee3e9] text-[9.5px] font-bold text-[#0a1317] font-mono select-none", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#31a24c] animate-pulse" }),
              /* @__PURE__ */ jsx("span", { children: "OFFICIAL KSP GATEWAY (v1.1)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#0a1317] uppercase tracking-widest font-mono block", children: t("footer.tools") }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2.5 font-medium text-[#5d6c7b]", children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/dashboard.html", className: "hover:text-[#0064e0] transition", children: t("nav.dashboard") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/search.html", className: "hover:text-[#0064e0] transition", children: t("nav.search") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/map.html", className: "hover:text-[#0064e0] transition", children: t("nav.map") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/assistant.html", className: "hover:text-[#0064e0] transition", children: t("nav.assistant") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/graph.html", className: "hover:text-[#0064e0] transition", children: t("nav.graph") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/reports.html", className: "hover:text-[#0064e0] transition", children: t("nav.reports") }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#0a1317] uppercase tracking-widest font-mono block", children: "LEGAL & POLICY" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2.5 font-medium text-[#5d6c7b]", children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/privacy.html", className: "hover:text-[#0064e0] transition", children: t("footer.privacy") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/terms.html", className: "hover:text-[#0064e0] transition", children: t("footer.terms") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/disclaimer.html", className: "hover:text-[#0064e0] transition", children: t("footer.disclaimer") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/compliance.html", className: "hover:text-[#0064e0] transition", children: t("footer.audit") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/admin.html", className: "hover:text-[#0064e0] transition", children: t("footer.admin") }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[#0a1317] uppercase tracking-widest font-mono block", children: t("footer.support") }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2.5 font-medium text-[#5d6c7b]", children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "mailto:itcell@ksp.gov.in", className: "hover:text-[#0064e0] transition", children: "KSP IT Support Cell" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/disclaimer.html", className: "hover:text-[#0064e0] transition", children: "SOP Guidelines" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "mailto:support@ksp.gov.in", className: "hover:text-[#0064e0] transition", children: "Technical Helpdesk" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/app/login.html", className: "hover:text-[#0064e0] transition", children: "Officer Single Sign-On" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-[#dee3e9] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#8595a4]", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-center md:text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#5d6c7b]", children: "© 2026 Karnataka State Police — Datathon 2026. All rights reserved." }),
            /* @__PURE__ */ jsx("p", { className: "text-[9.5px] max-w-3xl leading-relaxed", children: "CONFIDENTIALITY NOTICE: This portal contains sensitive law enforcement intelligence. Access is restricted to authorized personnel. All queries and exports are audited under Section 66 of the Information Technology Act." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 shrink-0 font-mono font-bold text-[#5d6c7b]", children: [
            /* @__PURE__ */ jsx("a", { href: "/app/privacy.html", className: "hover:text-[#0064e0] transition", children: t("footer.privacy") }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsx("a", { href: "/app/terms.html", className: "hover:text-[#0064e0] transition", children: t("footer.terms") }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsx("a", { href: "/app/disclaimer.html", className: "hover:text-[#0064e0] transition", children: t("footer.disclaimer") })
          ] })
        ] })
      ] }) })
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

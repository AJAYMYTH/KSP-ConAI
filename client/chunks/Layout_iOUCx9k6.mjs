import { c as createComponent, d as addAttribute, a as renderTemplate, b as createAstro, r as renderComponent, e as renderHead, f as createTransitionScope, g as renderTransition, h as renderSlot } from './astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                         */

const $$Astro$1 = createAstro();
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "C:/Users/cheth/Desktop/KSP Copilot/node_modules/astro/components/ViewTransitions.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "KSP-ConAI", hideNav = false, hideFooter = false, transitionAnimate = "slide" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', ' \u2014 KSP-ConAI</title><meta name="description"', '><link class="fav-icon" rel="icon" type="image/png" href="/app/karnataka_emblem.png"><link rel="icon" type="image/svg+xml" href="/app/favicon.svg"><meta name="generator"', ">", "<script>\n      // Sync document-level language class with localStorage\n      function syncLang() {\n        const lang = localStorage.getItem('ksp_language') || 'EN';\n        if (lang === 'KN') {\n          document.documentElement.classList.add('lang-kn-active');\n          document.documentElement.classList.remove('lang-en-active');\n        } else {\n          document.documentElement.classList.add('lang-en-active');\n          document.documentElement.classList.remove('lang-kn-active');\n        }\n      }\n      \n      syncLang();\n      window.addEventListener('ksp-language-change', syncLang);\n      window.addEventListener('storage', (e) => {\n        if (e.key === 'ksp_language') syncLang();\n      });\n    <\/script>", '</head> <body class="min-h-screen bg-canvas flex flex-col"> ', " </body></html>"])), title, addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), renderComponent($$result, "ViewTransitions", $$ViewTransitions, {}), renderHead(), renderComponent($$result, "I18nProvider", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/i18n/provider.tsx", "client:component-export": "I18nProvider" }, { "default": ($$result2) => renderTemplate`${!hideNav && renderTemplate`${renderComponent($$result2, "Nav", null, { "currentPath": Astro2.url.pathname, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/layout/Nav.tsx", "client:component-export": "default", "data-astro-transition-persist": createTransitionScope($$result2, "axuum5zu") })}`}<main class="flex-1 flex flex-col"${addAttribute(renderTransition($$result2, "lrqze3gm", transitionAnimate), "data-astro-transition-scope")}> ${renderSlot($$result2, $$slots["default"])} </main> ${!hideFooter && renderTemplate`${renderComponent($$result2, "Footer", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/layout/Footer.tsx", "client:component-export": "default" })}`}` }));
}, "C:/Users/cheth/Desktop/KSP Copilot/app/layouts/Layout.astro", "self");

export { $$Layout as $ };

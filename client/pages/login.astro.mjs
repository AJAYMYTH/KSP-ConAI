import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_iOUCx9k6.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Secure Login Gateway", "hideNav": true, "hideFooter": true, "transitionAnimate": "fade" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script src="https://static.zohocdn.com/catalyst/sdk/js/4.6.2/catalystWebSDK.js"><\/script> <script src="/__catalyst/sdk/init.js"><\/script> ', " "])), renderComponent($$result2, "LoginPage", null, { "client:only": "react", "defaultView": "login", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/LoginPage", "client:component-export": "LoginPage" })) })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/login.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/login.astro";
const $$url = "/app/login.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

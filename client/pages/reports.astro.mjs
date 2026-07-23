import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_iOUCx9k6.mjs';
import { P as PERMISSIONS } from '../chunks/auth_Ch8uM9Mt.mjs';
export { renderers } from '../renderers.mjs';

const $$Reports = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Intelligence Reports History" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PermissionGuard", null, { "permission": PERMISSIONS.GENERATE_REPORTS, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/PermissionGuard.tsx", "client:component-export": "PermissionGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ReportsManager", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/reports/ReportsManager.tsx", "client:component-export": "default" })} ` })} ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/reports.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/reports.astro";
const $$url = "/app/reports.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reports,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

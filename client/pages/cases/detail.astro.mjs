import { c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_CWPCJZx0.mjs';
import { P as PERMISSIONS } from '../../chunks/auth_Ch8uM9Mt.mjs';
export { renderers } from '../../renderers.mjs';

const $$Detail = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Case Details \u2014 KSP-ConAI" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PermissionGuard", null, { "permission": PERMISSIONS.VIEW_CASE_DETAIL_FULL, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/PermissionGuard.tsx", "client:component-export": "PermissionGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CaseDetailView", null, { "caseId": "", "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/cases/CaseDetailView.tsx", "client:component-export": "default" })} ` })} ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/cases/detail.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/cases/detail.astro";
const $$url = "/app/cases/detail.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Detail,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

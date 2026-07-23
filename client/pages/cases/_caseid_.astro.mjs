import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro } from '../../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Ds0Xuhnu.mjs';
import { P as PERMISSIONS } from '../../chunks/auth_Ch8uM9Mt.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
function getStaticPaths() {
  return [
    { params: { caseId: "KA-BC-2026-00812" } },
    { params: { caseId: "KA-MY-2026-00124" } },
    { params: { caseId: "KA-MN-2026-00431" } },
    { params: { caseId: "KA-KA-2026-00055" } },
    { params: { caseId: "KA-BD-2026-00910" } }
  ];
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

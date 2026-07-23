import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_zXF_aX6l.mjs';
import { P as PERMISSIONS } from '../chunks/auth_Ch8uM9Mt.mjs';
export { renderers } from '../renderers.mjs';

const $$Map = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Crime Hotspot Maps" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PermissionGuard", null, { "permission": PERMISSIONS.VIEW_MAP, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/PermissionGuard.tsx", "client:component-export": "PermissionGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "HotspotMap", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/map/HotspotMap.tsx", "client:component-export": "default" })} ` })} ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/map.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/map.astro";
const $$url = "/app/map.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Map,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

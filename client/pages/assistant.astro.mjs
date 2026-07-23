import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_GyZO-Yni.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_xS6vulvV.mjs';
import { P as PERMISSIONS } from '../chunks/auth_Ch8uM9Mt.mjs';
export { renderers } from '../renderers.mjs';

const $$Assistant = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "AI Assistant", "hideFooter": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] flex flex-col overflow-hidden"> ${renderComponent($$result2, "PermissionGuard", null, { "permission": PERMISSIONS.USE_ASSISTANT, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/PermissionGuard.tsx", "client:component-export": "PermissionGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "AssistantChat", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/cheth/Desktop/KSP Copilot/app/components/assistant/AssistantChat.tsx", "client:component-export": "default" })} ` })} </div> ` })}`;
}, "C:/Users/cheth/Desktop/KSP Copilot/app/pages/assistant.astro", void 0);

const $$file = "C:/Users/cheth/Desktop/KSP Copilot/app/pages/assistant.astro";
const $$url = "/app/assistant.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Assistant,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

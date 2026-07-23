import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, i as decodeKey } from './chunks/astro/server_GyZO-Yni.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/","adapterName":"","routes":[{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/admin.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/admin.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/assistant.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/assistant","isIndex":false,"type":"page","pattern":"^\\/assistant\\/?$","segments":[[{"content":"assistant","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/assistant.astro","pathname":"/assistant","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/cases/detail.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cases/detail","isIndex":false,"type":"page","pattern":"^\\/cases\\/detail\\/?$","segments":[[{"content":"cases","dynamic":false,"spread":false}],[{"content":"detail","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/cases/detail.astro","pathname":"/cases/detail","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/compliance.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/compliance","isIndex":false,"type":"page","pattern":"^\\/compliance\\/?$","segments":[[{"content":"compliance","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/compliance.astro","pathname":"/compliance","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/dashboard.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/dashboard.astro","pathname":"/dashboard","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/disclaimer.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/disclaimer","isIndex":false,"type":"page","pattern":"^\\/disclaimer\\/?$","segments":[[{"content":"disclaimer","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/disclaimer.astro","pathname":"/disclaimer","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/graph.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/graph","isIndex":false,"type":"page","pattern":"^\\/graph\\/?$","segments":[[{"content":"graph","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/graph.astro","pathname":"/graph","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/login.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/login.astro","pathname":"/login","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/map.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/map","isIndex":false,"type":"page","pattern":"^\\/map\\/?$","segments":[[{"content":"map","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/map.astro","pathname":"/map","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/privacy.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/profiling.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/profiling","isIndex":false,"type":"page","pattern":"^\\/profiling\\/?$","segments":[[{"content":"profiling","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/profiling.astro","pathname":"/profiling","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/reports.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/reports","isIndex":false,"type":"page","pattern":"^\\/reports\\/?$","segments":[[{"content":"reports","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/reports.astro","pathname":"/reports","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/search.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/search","isIndex":false,"type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/search.astro","pathname":"/search","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/signup.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup\\/?$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/signup.astro","pathname":"/signup","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/terms.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"app/pages/terms.astro","pathname":"/terms","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"app/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/app","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/cheth/Desktop/KSP Copilot/app/pages/404.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/admin.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/assistant.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/cases/[caseId].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/cases/detail.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/compliance.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/dashboard.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/disclaimer.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/graph.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/login.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/map.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/privacy.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/profiling.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/reports.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/search.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/signup.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/pages/terms.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/cheth/Desktop/KSP Copilot/app/layouts/Layout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/404@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/admin@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/assistant@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/cases/[caseId]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/cases/detail@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/compliance@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/dashboard@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/disclaimer@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/graph@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/login@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/map@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/privacy@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/profiling@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/reports@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/search@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/signup@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:app/pages/terms@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:app/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:app/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:app/pages/assistant@_@astro":"pages/assistant.astro.mjs","\u0000@astro-page:app/pages/cases/[caseId]@_@astro":"pages/cases/_caseid_.astro.mjs","\u0000@astro-page:app/pages/cases/detail@_@astro":"pages/cases/detail.astro.mjs","\u0000@astro-page:app/pages/compliance@_@astro":"pages/compliance.astro.mjs","\u0000@astro-page:app/pages/dashboard@_@astro":"pages/dashboard.astro.mjs","\u0000@astro-page:app/pages/disclaimer@_@astro":"pages/disclaimer.astro.mjs","\u0000@astro-page:app/pages/graph@_@astro":"pages/graph.astro.mjs","\u0000@astro-page:app/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:app/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:app/pages/map@_@astro":"pages/map.astro.mjs","\u0000@astro-page:app/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:app/pages/profiling@_@astro":"pages/profiling.astro.mjs","\u0000@astro-page:app/pages/reports@_@astro":"pages/reports.astro.mjs","\u0000@astro-page:app/pages/search@_@astro":"pages/search.astro.mjs","\u0000@astro-page:app/pages/signup@_@astro":"pages/signup.astro.mjs","\u0000@astro-page:app/pages/terms@_@astro":"pages/terms.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-manifest":"manifest_BGjlo9c6.mjs","C:/Users/cheth/Desktop/KSP Copilot/app/components/analytics/BehavioralProfile.tsx":"_astro/BehavioralProfile.uUIjiQ7z.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/PermissionGuard.tsx":"_astro/PermissionGuard.B8HNt1Gb.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/cases/GeneralGraphView.tsx":"_astro/GeneralGraphView.Cw1DjIei.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/layout/Footer.tsx":"_astro/Footer.CsLG0tcb.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/reports/ReportsManager.tsx":"_astro/ReportsManager.DGeix5hH.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/admin/ComplianceDashboard.tsx":"_astro/ComplianceDashboard.B6ZR9uCN.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/map/HotspotMap.tsx":"_astro/HotspotMap.fmxnap7V.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/search/SearchInterface.tsx":"_astro/SearchInterface.jHBPDTUE.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/admin/AdminConsole.tsx":"_astro/AdminConsole.BuNJFfx1.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/auth/LoginPage":"_astro/LoginPage.Zr9j-uLt.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/layout/Nav.tsx":"_astro/Nav.BvL7cQAG.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/sections/LandingPage.tsx":"_astro/LandingPage.S96PWMio.js","@astrojs/react/client.js":"_astro/client.CyFoGSjk.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/cases/CaseDetailView.tsx":"_astro/CaseDetailView.BzxxhxWA.js","/astro/hoisted.js?q=0":"_astro/hoisted.BScVxmeO.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/assistant/AssistantChat.tsx":"_astro/AssistantChat.BeGwPL-l.js","C:/Users/cheth/Desktop/KSP Copilot/app/components/dashboard/DashboardGrid.tsx":"_astro/DashboardGrid.DNPJHddx.js","C:/Users/cheth/Desktop/KSP Copilot/app/i18n/provider.tsx":"_astro/provider.B_uP5xkA.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/404.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/admin.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/assistant.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/cases/detail.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/compliance.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/dashboard.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/disclaimer.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/graph.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/login.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/map.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/privacy.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/profiling.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/reports.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/search.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/signup.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/terms.html","/app/file:///C:/Users/cheth/Desktop/KSP%20Copilot/client/index.html"],"buildFormat":"file","checkOrigin":false,"serverIslandNameMap":[],"key":"3HqeFk1puSQVpZxnxgujPaO0Jcup3PvtLrLhhnoy8LQ=","experimentalEnvGetSecretEnabled":false});

export { manifest };

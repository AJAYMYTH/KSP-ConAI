import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { hasPermission, getCurrentSession, type Permission } from '../../lib/auth';
import { useI18n } from '../../i18n/hooks';

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode | 'redirect' | 'login-redirect';
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  fallback, 
  children 
}) => {
  const { currentLanguage } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration protection: render a clean loader on server or during mount
  if (!mounted) {
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <div className="w-6 h-6 rounded-circle border-2 border-hairline-soft border-t-primary animate-spin" />
      </div>
    );
  }

  // Redirect if no active session
  const session = getCurrentSession();
  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/app/login.html';
    }
    return null;
  }

  const allowed = hasPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  // Handle redirects if requested
  if (fallback === 'login-redirect') {
    if (typeof window !== 'undefined') {
      window.location.href = '/app/login.html';
    }
    return null;
  }

  if (fallback === 'redirect') {
    if (typeof window !== 'undefined') {
      window.location.href = '/app/dashboard.html';
    }
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default gorgeous KSP Access Denied card (editorial dark theme alert)
  return (
    <div className="p-8 max-w-xl mx-auto my-12 text-center bg-canvas border border-hairline-soft rounded-xxxl shadow-xl flex flex-col items-center gap-5 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-2xl bg-critical/10 border border-critical/20 flex items-center justify-center text-critical">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-extrabold text-slate-900 font-display">
          {currentLanguage === 'en' 
            ? 'Access Restricted' 
            : 'ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ'}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {currentLanguage === 'en'
            ? 'Your active session role does not possess the security clearance required to view this intelligence module.'
            : 'ಈ ಗುಪ್ತಚರ ಮಾಡ್ಯೂಲ್ ವೀಕ್ಷಿಸಲು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪಾತ್ರಕ್ಕೆ ಅಗತ್ಯವಾದ ಭದ್ರತಾ ಅನುಮತಿ ಇಲ್ಲ.'}
        </p>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => window.location.href = '/app/login.html'}
          className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition cursor-pointer select-none"
        >
          {currentLanguage === 'en' ? 'Switch Role' : 'ಪಾತ್ರ ಬದಲಿಸಿ'}
        </button>
        <button
          type="button"
          onClick={() => window.location.href = '/app/dashboard.html'}
          className="px-5 py-2 bg-primary hover:bg-primary-deep text-canvas text-xs font-bold rounded-full transition cursor-pointer select-none"
        >
          {currentLanguage === 'en' ? 'Back to Dashboard' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ'}
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, Eye, Database, Lock, Check, X, Award } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { PERMISSIONS, type UserRole, type UserSession } from '../../lib/auth';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  availableRoles: {
    role: UserRole;
    badge: string;
    icon: React.ReactNode;
    color: string;
    textColor: string;
    borderColor: string;
    permissions: { name: string; allowed: boolean }[];
  }[];
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect, availableRoles }) => {
  const { t, currentLanguage } = useI18n();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          {t('roles.title')}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {t('roles.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {availableRoles.map((roleConfig) => {
          const roleKey = roleConfig.role;
          const title = t(`roles.${roleKey}.title`);
          const desc = t(`roles.${roleKey}.desc`);
          const badge = t(`roles.${roleKey}.badge`) || roleConfig.badge;

          return (
            <div
              key={roleConfig.role}
              className={`group flex flex-col justify-between p-6 bg-white border-2 rounded-2xl transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.01] ${roleConfig.borderColor} hover:border-fb-blue`}
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${roleConfig.color} ${roleConfig.textColor} shrink-0`}>
                      {roleConfig.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {title}
                      </h3>
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-500 tracking-wider">
                        <Award className="w-3 h-3 text-slate-400" />
                        {badge}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed text-left">
                  {desc}
                </p>

                {/* Permissions checklist */}
                <div className="border-t border-slate-100 pt-3.5 space-y-2">
                  <div className="text-[8px] font-bold tracking-widest text-slate-400 uppercase text-left">
                    {currentLanguage === 'en' ? 'Access List' : 'ಪ್ರವೇಶ ಪಟ್ಟಿ'}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                    {roleConfig.permissions.map((perm) => (
                      <div key={perm.name} className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
                        {perm.allowed ? (
                          <Check className="w-3.5 h-3.5 text-success shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-critical shrink-0" />
                        )}
                        <span className="truncate">{perm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action submit button */}
              <button
                type="button"
                onClick={() => onRoleSelect(roleConfig.role)}
                className="w-full h-10 mt-6 bg-slate-900 hover:bg-primary active:scale-[0.98] text-white font-bold rounded-xl text-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {t('roles.selectBtn').replace('{{role}}', title)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

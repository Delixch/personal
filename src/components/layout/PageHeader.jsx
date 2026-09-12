import React from 'react';

export const PageHeader = ({ icon: Icon, label, title, subtitle, actions, children }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

        <div className="space-y-2">
          {label && (
            )}
          <h1 className="page-title text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-6 pt-4 border-t border-line-soft">
          {children}
        </div>
      )}
    </div>
  );
};

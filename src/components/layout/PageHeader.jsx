import React from 'react';

/**
 * PageHeader — tüm modüllerde tek tip header
 *
 * Props:
 *   icon        — Lucide icon component (zorunlu)
 *   label       — küçük üst etiket (string)
 *   title       — büyük başlık (string)
 *   subtitle    — açıklama satırı (string, opsiyonel)
 *   actions     — sağ taraf butonlar (ReactNode, opsiyonel)
 *   children    — alt içerik: uyarı barı, filtreler vs. (ReactNode, opsiyonel)
 */
export const PageHeader = ({ icon: Icon, label, title, subtitle, actions, children }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
      {/* Üst satır: sol bilgi + sağ aksiyonlar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Sol: etiket + başlık + açıklama */}
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

        {/* Sağ: aksiyonlar */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Alt içerik: uyarı barı, filtreler vb. */}
      {children && (
        <div className="mt-6 pt-4 border-t border-line-soft">
          {children}
        </div>
      )}
    </div>
  );
};

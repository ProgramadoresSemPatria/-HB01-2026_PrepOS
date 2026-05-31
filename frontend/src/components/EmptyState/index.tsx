import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  /** Título curto do estado vazio. */
  title: string;
  /** Texto de apoio explicando o porquê / próximo passo. */
  description?: string;
  /** Rótulo do call-to-action. Omitido = sem botão. */
  ctaLabel?: string;
  /** Ação do CTA (ex: navegar de volta para a análise). */
  onCta?: () => void;
  /** Ícone opcional; padrão é uma caixa de entrada vazia. */
  icon?: ReactNode;
}

/**
 * Estado "sem dados" reutilizável, com CTA opcional. Padroniza a aparência dos
 * empty states que antes eram duplicados em cada página (roadmap, leetcode, pitch).
 */
export function EmptyState({
  title,
  description,
  ctaLabel,
  onCta,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-[#202020] rounded-2xl border border-gray-800 border-dashed p-10 md:p-12">
      <div className="text-gray-500 mb-4">
        {icon ?? <Inbox size={40} strokeWidth={1.5} />}
      </div>
      <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-[#9a9a9a] max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="bg-[#3ecf8e] text-[#171717] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#3ecf8e]/90 transition"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

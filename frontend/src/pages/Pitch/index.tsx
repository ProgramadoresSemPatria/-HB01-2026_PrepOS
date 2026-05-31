import { useState } from 'react';
import { ChevronDown, Copy, Check, Link2 } from 'lucide-react';

import { useAnalysisPitch, type PitchCard } from '../../lib/api';
import { useSession } from '../../store/session';

const RELEVANCE_META: Record<
  PitchCard['relevance_level'],
  { label: string; cls: string }
> = {
  alta: {
    label: 'Relevância alta',
    cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  media: {
    label: 'Relevância média',
    cls: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
};

function buildPitchText(pitch: PitchCard): string {
  return [
    pitch.project,
    '',
    `S — Situação: ${pitch.situation}`,
    `T — Tarefa: ${pitch.task}`,
    `A — Ação: ${pitch.action}`,
    `R — Resultado: ${pitch.result}`,
    '',
    `Como conecta com esta vaga: ${pitch.vaga_connection}`,
  ].join('\n');
}

const StarSection = ({
  letter,
  label,
  text,
  color,
  highlight,
}: {
  letter: string;
  label: string;
  text: string;
  color: string;
  highlight?: boolean;
}) => (
  <div>
    <h4 className={`flex items-center text-sm font-bold ${color} uppercase tracking-wider mb-2`}>
      <span className={`bg-current/20 border border-current/30 w-7 h-7 rounded flex items-center justify-center mr-3`}>
        {letter}
      </span>
      {label}
    </h4>
    <p
      className={`text-sm p-4 rounded-xl border leading-relaxed ${
        highlight
          ? 'text-white font-medium bg-purple-500/10 border-purple-500/20 shadow-inner'
          : 'text-gray-300 bg-[#1a1a1a] border-gray-800'
      }`}
    >
      {text}
    </p>
  </div>
);

const StarCard = ({ pitch }: { pitch: PitchCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const relevance = RELEVANCE_META[pitch.relevance_level] ?? RELEVANCE_META.media;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPitchText(pitch));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard pode falhar sem HTTPS/permissão — mantemos a UI silenciosamente.
    }
  };

  return (
    <div className="bg-[#202020] rounded-2xl shadow-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 overflow-hidden">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full text-left bg-[#171717] border-b border-gray-800 p-6 flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-white leading-tight">
              {pitch.project}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${relevance.cls}`}
            >
              {relevance.label}
            </span>
          </div>
          {!isExpanded && (
            <p className="text-[#3ecf8e] text-sm mt-2 font-medium italic line-clamp-2">
              {pitch.vaga_connection}
            </p>
          )}
        </div>
        <ChevronDown
          size={20}
          strokeWidth={2}
          className={`text-gray-400 shrink-0 mt-1 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="p-6 space-y-5 animate-fade-in-up">
          <StarSection letter="S" label="Situação" text={pitch.situation} color="text-blue-400" />
          <StarSection letter="T" label="Tarefa" text={pitch.task} color="text-amber-400" />
          <StarSection letter="A" label="Ação" text={pitch.action} color="text-emerald-400" />
          <StarSection letter="R" label="Resultado" text={pitch.result} color="text-purple-400" highlight />

          {/* Destaque visual: como conecta com esta vaga */}
          <div className="bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-xl p-5 shadow-[0_0_20px_rgba(62,207,142,0.08)]">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[#3ecf8e] uppercase tracking-wider mb-2">
              <Link2 size={16} strokeWidth={2} />
              Como conecta com esta vaga
            </h4>
            <p className="text-white text-sm leading-relaxed">
              {pitch.vaga_connection}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#2a2a2a] border border-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} strokeWidth={2} className="text-[#3ecf8e]" />
                Pitch copiado!
              </>
            ) : (
              <>
                <Copy size={16} strokeWidth={2} />
                Copiar pitch completo
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export function PitchPage() {
  const jobTitle = useSession((s) => s.jobTitle);
  const analysisId = useSession((s) => s.analysisId);
  const {
    data: pitches,
    isLoading: isPending,
    isError,
  } = useAnalysisPitch(analysisId);

  return (
    <div className="w-full pb-6">
      <header className="mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white">
          Cartões de Pitch (STAR)
        </h1>
        <p className="text-[#9a9a9a] mt-2 max-w-3xl">
          Revise suas experiências passadas estruturadas no método
          comportamental, perfeitamente alinhadas com o que os recrutadores
          buscam para a vaga de{" "}
          <span className="text-[#3ecf8e] font-semibold">
            {jobTitle || "Tecnologia"}
          </span>
          .
        </p>
      </header>

      {isPending && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3ecf8e]"></div>
          <p className="text-gray-400 text-sm animate-pulse">
            Lapidando suas narrativas com Inteligência Artificial...
          </p>
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-2xl mx-auto shadow-lg flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-red-500 mb-4 opacity-80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-red-400 mb-2">Não foi possível gerar os pitches</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Ocorreu um erro ao gerar os cartões de pitch STAR. Tente novamente em instantes.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#202020] hover:bg-[#2a2a2a] border border-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {pitches && (
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {pitches.map((pitch, idx) => (
            <StarCard key={idx} pitch={pitch} />
          ))}
          {pitches.length === 0 && (
            <div className="col-span-full bg-[#202020] border border-gray-800 border-dashed rounded-2xl p-12 text-center">
              <p className="text-gray-400">
                Nenhuma experiência pôde ser mapeada para o seu currículo.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GapCard } from "../../components/GapCard";
import { MatchScore } from "../../components/MatchScore";
import { useAnalyze } from "../../lib/api";
import { useSession } from "../../store/session";

export function UploadPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [jobText, setJobText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [fileName, setFileName] = useState("");

  const setAnalysis = useSession((s) => s.setAnalysis);
  const setSessionJobTitle = useSession((s) => s.setJobTitle);
  const matchScore = useSession((s) => s.matchScore);

  const { mutate: analyze, isPending, error, data } = useAnalyze();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !jobText.trim()) return;

    const form = new FormData();
    form.append("pdf_file", file);
    form.append("job_text", jobText);

    analyze(form, {
      onSuccess: (res) => {
        setAnalysis(res.match_score, res.gaps);
        setSessionJobTitle(jobTitle || "Vaga");
      },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Prep AI</h1>
        <p className="text-gray-500 mb-10">
          Envie seu currículo e a descrição da vaga para descobrir seu match e começar a se preparar.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* PDF upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currículo (PDF)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition"
              onClick={() => fileRef.current?.click()}
            >
              {fileName ? (
                <p className="text-indigo-700 font-medium">{fileName}</p>
              ) : (
                <p className="text-gray-400">Clique para selecionar um PDF</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </div>

          {/* Job title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo alvo
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex: Software Engineer L4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Job description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da vaga
            </label>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={8}
              placeholder="Cole aqui o texto completo da descrição da vaga..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{(error as Error).message}</p>
          )}

          <button
            type="submit"
            disabled={isPending || !fileName || !jobText.trim()}
            className="bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? "Analisando..." : "Analisar Match"}
          </button>
        </form>

        {/* Results */}
        {matchScore !== null && data && (
          <div className="mt-12 flex flex-col gap-6">
            <MatchScore score={data.match_score} summary={data.summary} />

            <h2 className="text-xl font-semibold text-gray-800">Gaps identificados</h2>
            <div className="flex flex-col gap-3">
              {data.gaps.map((gap) => (
                <GapCard
                  key={gap.skill}
                  skill={gap.skill}
                  level={gap.level}
                  reason={gap.reason}
                  onViewContext={(skill) =>
                    navigate(`/context/${encodeURIComponent(skill)}`)
                  }
                />
              ))}
            </div>

            <button
              onClick={() => navigate("/roadmap")}
              className="bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition"
            >
              Ver Roadmap de Estudo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { RoadmapDaysView } from "../../components/RoadmapDaysView";
import { RoadmapProgressBar } from "../../components/RoadmapProgressBar";
import { useGenerateRoadmap, useGetRoadmap } from "../../lib/api";
import {
  countCompletedDays,
  groupByDay,
  TOTAL_DAYS,
} from "../../lib/roadmap";
import { useProgress } from "../../store/progress";
import { useSession } from "../../store/session";

const LEETCODE_CTA_THRESHOLD = 5;

export function RoadmapPage() {
  const navigate = useNavigate();
  const sessionId = useSession((s) => s.sessionId);
  const gaps = useSession((s) => s.gaps);
  const jobTitle = useSession((s) => s.jobTitle);
  const roadmap = useSession((s) => s.roadmap);
  const setRoadmap = useSession((s) => s.setRoadmap);

  const bySession = useProgress((s) => s.bySession);
  const toggleTask = useProgress((s) => s.toggleTask);

  const isDone = useMemo(() => {
    const sessionMap = bySession[sessionId] ?? {};
    return (taskKey: string) => !!sessionMap[taskKey];
  }, [bySession, sessionId]);

  const {
    data: fetchedRoadmap,
    isLoading: isFetching,
    error: fetchError,
  } = useGetRoadmap(sessionId);

  const {
    mutate: generateRoadmap,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateRoadmap();

  useEffect(() => {
    if (fetchedRoadmap && fetchedRoadmap.length > 0 && roadmap.length === 0) {
      setRoadmap(fetchedRoadmap);
    }
  }, [fetchedRoadmap, roadmap.length, setRoadmap]);

  useEffect(() => {
    if (
      !isFetching &&
      fetchError &&
      roadmap.length === 0 &&
      gaps.length > 0 &&
      !isGenerating
    ) {
      generateRoadmap(
        { session_id: sessionId, gaps, job_title: jobTitle || "Vaga" },
        { onSuccess: (tasks) => setRoadmap(tasks) }
      );
    }
  }, [
    fetchError,
    isFetching,
    roadmap.length,
    gaps,
    jobTitle,
    sessionId,
    isGenerating,
    generateRoadmap,
    setRoadmap,
  ]);

  const tasksByDay = useMemo(() => groupByDay(roadmap), [roadmap]);
  const completedDays = useMemo(
    () => countCompletedDays(tasksByDay, isDone),
    [tasksByDay, isDone]
  );

  function handleToggle(taskKey: string) {
    toggleTask(sessionId, taskKey);
  }

  function handleViewContext(gapId: string) {
    navigate(`/context/${encodeURIComponent(gapId)}`);
  }

  function retryGenerate() {
    generateRoadmap(
      { session_id: sessionId, gaps, job_title: jobTitle || "Vaga" },
      { onSuccess: (tasks) => setRoadmap(tasks) }
    );
  }

  const isLoading = (isFetching && roadmap.length === 0) || isGenerating;
  const showError =
    !isLoading && roadmap.length === 0 && generateError && gaps.length > 0;
  const showEmpty =
    !isLoading && roadmap.length === 0 && gaps.length === 0;

  const showLeetCodeCta = completedDays >= LEETCODE_CTA_THRESHOLD;
  const isFullyComplete = completedDays === TOTAL_DAYS;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Seu Roadmap de Estudo
          </h1>
          <p className="text-gray-500 mt-1">
            Um plano de 7 dias para fechar seus gaps até a entrevista.
          </p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-500">
              {isGenerating ? "Gerando seu roadmap..." : "Carregando..."}
            </p>
          </div>
        )}

        {showError && (
          <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm flex flex-col gap-3">
            <p className="text-red-600 text-sm">
              {(generateError as Error).message}
            </p>
            <button
              onClick={retryGenerate}
              className="self-start bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {showEmpty && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-3">
            <p className="text-gray-600 text-sm">
              Você ainda não tem uma análise. Faça o upload do seu currículo
              primeiro.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="self-start bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Ir para Upload
            </button>
          </div>
        )}

        {!isLoading && roadmap.length > 0 && (
          <div className="flex flex-col gap-4">
            <RoadmapProgressBar
              completedDays={completedDays}
              totalDays={TOTAL_DAYS}
            />

            <RoadmapDaysView
              tasksByDay={tasksByDay}
              isDone={isDone}
              onToggle={handleToggle}
              onViewContext={handleViewContext}
            />

            {showLeetCodeCta && (
              <button
                onClick={() => navigate("/leetcode")}
                className="bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition mt-2"
              >
                {isFullyComplete
                  ? "Você concluiu! Próximo: LeetCode →"
                  : "Pronto para começar LeetCode? →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useGenerateRoadmap, type RoadmapTask } from '../../lib/api';
import { useSession } from '../../store/session'; 

const TaskCard = ({ task }: { task: RoadmapTask }) => (
  <div className="bg-[#202020] p-5 rounded-xl border border-gray-700 border-l-4 border-l-[#3ecf8e] hover:border-gray-500 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    <div className="flex justify-between items-start mb-4 gap-2">
      <span className="text-xs font-bold text-[#3ecf8e] uppercase tracking-wider bg-[#3ecf8e]/10 px-2.5 py-1 rounded-md">
        {task.category}
      </span>
      <span className="text-xs font-medium text-gray-400 bg-[#171717] border border-gray-700 px-2.5 py-1 rounded-md shrink-0">
        {task.minutes} min
      </span>
    </div>
    <p className="text-gray-200 text-sm leading-relaxed flex-1">{task.task}</p>
  </div>
);

export function RoadmapPage() {
  const { gaps, jobTitle } = useSession();
  const { mutate: generateRoadmap, data: tasks, isPending, isError } = useGenerateRoadmap();

  useEffect(() => {
    if (gaps.length > 0 && jobTitle && !tasks) {
      generateRoadmap({ gaps, job_title: jobTitle });
    }
  }, [gaps, jobTitle, tasks, generateRoadmap]);

  const tasksByDay = tasks?.reduce((acc, task) => {
    if (!acc[task.day]) acc[task.day] = [];
    acc[task.day].push(task);
    return acc;
  }, {} as Record<number, RoadmapTask[]>) || {};

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <header className="mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white">O Seu Plano de 7 Dias</h1>
        <p className="text-[#9a9a9a] mt-2 text-sm md:text-base">
          Focado em suprir os gaps para a vaga de <span className="text-[#3ecf8e] font-semibold">{jobTitle}</span>
        </p>
      </header>

      {isPending && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3ecf8e]"></div>
          <p className="text-gray-400 text-sm animate-pulse">Gerando seu plano de estudos personalizado...</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-center">
          Ocorreu um erro ao gerar o roadmap. Por favor, tente novamente.
        </div>
      )}

      {tasks && (
        <div className="space-y-10 pl-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <section key={`day-${day}`} className="relative pl-6 md:pl-8 border-l-2 border-gray-700 ml-2">
              <div className="absolute w-4 h-4 bg-[#3ecf8e] rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(62,207,142,0.5)]"></div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                Dia {day}
              </h2>
              
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                {tasksByDay[day]?.map((task, idx) => (
                  <TaskCard key={`${day}-${idx}`} task={task} />
                ))}
                
                {!tasksByDay[day] && (
                  <div className="col-span-1 md:col-span-2 bg-[#171717] border border-gray-800 rounded-xl p-6 flex items-center justify-center border-dashed">
                    <p className="text-gray-500 text-sm">Dia livre focado em descanso ou revisão.</p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
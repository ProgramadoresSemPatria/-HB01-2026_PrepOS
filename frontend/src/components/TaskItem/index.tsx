import type { RoadmapTask } from "../../store/session";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "../../lib/roadmap";

interface TaskItemProps {
  task: RoadmapTask;
  done: boolean;
  onToggle: () => void;
  onViewContext: (gapId: string) => void;
}

export function TaskItem({ task, done, onToggle, onViewContext }: TaskItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        done ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
      } transition`}
    >
      <label className="flex items-start gap-3 flex-1 cursor-pointer">
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className="mt-1 w-5 h-5 accent-indigo-600 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              done ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.task}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                CATEGORY_STYLES[task.category]
              }`}
            >
              {CATEGORY_LABELS[task.category]}
            </span>
            <span className="text-xs text-gray-500">{task.minutes} min</span>
          </div>
        </div>
      </label>
      <button
        type="button"
        onClick={() => onViewContext(task.gap_id)}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap mt-1 shrink-0"
      >
        Ver contexto →
      </button>
    </div>
  );
}

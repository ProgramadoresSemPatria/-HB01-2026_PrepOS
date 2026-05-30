interface RoadmapProgressBarProps {
  completedDays: number;
  totalDays: number;
}

export function RoadmapProgressBar({
  completedDays,
  totalDays,
}: RoadmapProgressBarProps) {
  const pct = totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100);
  const isComplete = completedDays === totalDays && totalDays > 0;
  const hasProgress = completedDays > 0;

  const barColor = isComplete
    ? "bg-green-500"
    : hasProgress
    ? "bg-indigo-500"
    : "bg-gray-300";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">
          {completedDays} de {totalDays} dias completos
        </p>
        <span className="text-sm font-semibold text-gray-600">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

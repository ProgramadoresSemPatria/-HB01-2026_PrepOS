interface GapCardProps {
  skill: string;
  level: "critical" | "moderate";
  reason: string;
  onViewContext: (skill: string) => void;
}

export function GapCard({ skill, level, reason, onViewContext }: GapCardProps) {
  const badge =
    level === "critical"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">{skill}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
          {level}
        </span>
      </div>
      <p className="text-sm text-gray-600">{reason}</p>
      <button
        onClick={() => onViewContext(skill)}
        className="self-start text-sm text-indigo-600 hover:underline"
      >
        Ver contexto →
      </button>
    </div>
  );
}

interface MatchScoreProps {
  score: number;
  summary: string;
}

export function MatchScore({ score, summary }: MatchScoreProps) {
  const color =
    score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow">
      <span className={`text-7xl font-bold ${color}`}>{score}%</span>
      <p className="text-gray-600 text-center max-w-lg">{summary}</p>
    </div>
  );
}

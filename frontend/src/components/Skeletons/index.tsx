import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

/** Tema escuro compartilhado, alinhado às cores da UI (#202020 / #2a2a2a). */
function DarkSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#2f2f2f">
      {children}
    </SkeletonTheme>
  );
}

/** Placeholder para os cards de dia do roadmap. */
export function RoadmapSkeleton({ days = 4 }: { days?: number }) {
  return (
    <DarkSkeleton>
      <div className="flex flex-col gap-4">
        <Skeleton height={44} borderRadius={12} />
        {Array.from({ length: days }).map((_, i) => (
          <div
            key={i}
            className="bg-[#202020] rounded-xl border border-gray-700 p-5 flex items-center gap-4"
          >
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton width="30%" height={16} />
              <Skeleton width="20%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </DarkSkeleton>
  );
}

/** Placeholder para o grid de problemas do LeetCode (par problema/explicação). */
export function CodeChallengeSkeleton({ pairs = 3 }: { pairs?: number }) {
  return (
    <DarkSkeleton>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {Array.from({ length: pairs }).map((_, i) => (
          <div key={i} className="contents">
            <div className="p-5 rounded-xl border border-gray-700 bg-[#202020]">
              <Skeleton width="70%" height={18} />
              <Skeleton width="40%" height={14} className="mt-3" />
              <Skeleton count={2} height={12} className="mt-3" />
            </div>
            <div className="p-5 rounded-xl border border-gray-800 bg-[#171717]">
              <Skeleton width="50%" height={12} />
              <Skeleton count={3} height={12} className="mt-2" />
            </div>
          </div>
        ))}
      </div>
    </DarkSkeleton>
  );
}

/** Placeholder para os cartões de pitch STAR. */
export function PitchSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <DarkSkeleton>
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="bg-[#202020] rounded-2xl border border-gray-700 overflow-hidden"
          >
            <div className="bg-[#171717] border-b border-gray-800 p-6">
              <Skeleton width="60%" height={22} />
              <Skeleton width="85%" height={14} className="mt-3" />
            </div>
            <div className="p-6">
              <Skeleton count={3} height={14} />
            </div>
          </div>
        ))}
      </div>
    </DarkSkeleton>
  );
}

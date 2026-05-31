export default function StepItem({
  number,
  title,
  desc,
}: {
  number: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="px-3 py-1 flex items-center justify-center rounded-lg bg-primary-500 text-black font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-neutral-300 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

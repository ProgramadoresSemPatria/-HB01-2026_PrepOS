export default function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="border-b border-neutral-700 py-4" aria-live="polite">
      <summary className="flex justify-between items-center list-none cursor-pointer font-semibold text-white">
        {question}
      </summary>
      <div className="mt-2 text-neutral-300 text-sm">{answer}</div>
    </details>
  );
}

import type { Confession } from '../lib/confessions';

export default function ConfessionCard({ confession }: { confession: Confession }) {
  return (
    <article className="rounded-3xl border border-[#222222] bg-[#111111] p-6 shadow-[0_18px_60px_rgba(255,255,255,0.05)] transition duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-black/60">
      <div className="flex items-center justify-between text-sm uppercase tracking-[0.22em] text-[#A1A1AA]">
        <span>{confession.category}</span>
        <time dateTime={confession.date}>{confession.date}</time>
      </div>
      <p className="mt-5 text-[1.05rem] leading-8 text-white">{confession.preview}</p>
    </article>
  );
}

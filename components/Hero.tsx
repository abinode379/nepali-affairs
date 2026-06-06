import env from '../lib/env';

export default function Hero() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#222222] bg-[#111111] px-6 py-16 shadow-[0_28px_100px_rgba(255,255,255,0.05)] sm:px-10 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-[#A1A1AA]">{env.siteName}</p>
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Nepali Affairs
              </h1>
              <p className="max-w-3xl text-xl leading-[1.8] text-[#D4D4D8] sm:text-2xl">
                Share your anonymous confession safely.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#submit"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15"
              >
                Submit Confession
              </a>
              <a
                href="#confessions"
                className="inline-flex items-center justify-center rounded-full border border-[#A1A1AA]/30 bg-transparent px-7 py-3 text-sm font-semibold text-[#A1A1AA] transition hover:border-white hover:text-white"
              >
                Read Stories
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#222222] bg-black/60 p-8 text-[#E5E7EB] shadow-[0_40px_120px_rgba(255,255,255,0.08)]">
            <p className="text-sm uppercase tracking-[0.28em] text-[#A1A1AA]">Latest approved confessions</p>
            <div className="mt-6 space-y-5">
              <div className="rounded-3xl border border-[#333333] bg-[#111111] p-5">
                <p className="text-sm text-[#A1A1AA]">Culture</p>
                <p className="mt-3 text-lg text-white">A quiet festival gave me a memory I won’t forget.</p>
              </div>
              <div className="rounded-3xl border border-[#333333] bg-[#111111] p-5">
                <p className="text-sm text-[#A1A1AA]">Memory</p>
                <p className="mt-3 text-lg text-white">A song on the street reminded me of home.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

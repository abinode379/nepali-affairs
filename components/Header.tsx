import env from '../lib/env';

export default function Header() {
  return (
    <header className="border-b border-[#222222] bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">{env.siteName}</p>
            <p className="text-sm text-[#A1A1AA]">{env.siteDescription}</p>
          </div>

          <div className="flex items-center">
            <a
              href={env.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

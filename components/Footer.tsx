export default function Footer() {
  return (
    <footer className="border-t border-[#222222] bg-black/95 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-[#A1A1AA] sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>© {new Date().getFullYear()} Nepali Affairs.</p>
      </div>
    </footer>
  );
}

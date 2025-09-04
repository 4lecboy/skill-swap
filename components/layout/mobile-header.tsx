import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-2">
          {/* Logo placeholder */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            SS
          </span>
          <span className="text-base font-semibold">SkillSwap</span>
        </Link>

        {/* Nav placeholder (replace later) */}
        <nav aria-label="Main navigation" className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground hidden sm:inline">Nav</div>
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm hover:bg-accent"
          >
            ☰
          </button>
        </nav>
      </div>
    </header>
  );
}
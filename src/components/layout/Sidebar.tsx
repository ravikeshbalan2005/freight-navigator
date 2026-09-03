import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/lib/constants";

export function Sidebar() {
  return (
    <aside className="glass-panel sticky top-4 m-4 mr-0 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col gap-1 rounded-3xl p-5 lg:flex">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky to-mint font-display text-lg font-bold text-ink shadow-inner">
          C
        </div>
        <div>
          <div className="font-display font-bold leading-none text-ink">Cargolens</div>
          <div className="mt-1 text-[10px] tracking-wide text-soft">Freight Intelligence</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 text-sm">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-soft transition-colors hover:bg-glass-strong"
            activeProps={{ className: "bg-glass-strong font-semibold text-ink shadow-sm" }}
          >
            <span className={`size-2.5 rounded-full ${item.dot}`} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-lilac/60 to-sky/60 p-4">
        <div className="text-[11px] font-semibold text-ink">AI Model</div>
        <div className="mt-0.5 text-[10px] text-soft">v2.4 · Updated 2h ago</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-glass-strong">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-lilac to-sky" />
        </div>
      </div>
    </aside>
  );
}

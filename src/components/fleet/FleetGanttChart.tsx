import type { ScheduleSegment } from "@/types";

const WEEKS = 6;

const kindClass: Record<ScheduleSegment["kind"], string> = {
  voyage: "bg-gradient-to-r from-sky to-mint text-ink",
  idle: "bg-candy/40 text-ink",
  maintenance: "bg-lilac/60 text-ink",
};

export function FleetGanttChart({ schedule }: { schedule: ScheduleSegment[] }) {
  const vessels = [...new Map(schedule.map((s) => [s.vesselId, s])).values()];

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-[10rem_1fr] gap-3 text-[10px] text-soft">
        <span />
        <div className="grid grid-cols-6">
          {Array.from({ length: WEEKS }, (_, i) => (
            <span key={i}>Week {i + 1}</span>
          ))}
        </div>
      </div>

      {vessels.map((v) => (
        <div key={v.vesselId} className="grid grid-cols-[10rem_1fr] items-center gap-3">
          <div>
            <div className="text-sm font-semibold text-ink">{v.vesselName}</div>
            <div className="text-[11px] text-soft">{v.klass}</div>
          </div>
          <div className="relative h-9 rounded-2xl bg-glass-strong">
            {schedule
              .filter((s) => s.vesselId === v.vesselId)
              .map((s) => (
                <div
                  key={`${s.vesselId}-${s.label}-${s.startWeek}`}
                  className={`absolute top-1 flex h-7 items-center overflow-hidden truncate rounded-xl px-2 text-[11px] font-medium ${kindClass[s.kind]}`}
                  style={{
                    left: `${(s.startWeek / WEEKS) * 100}%`,
                    width: `${(Math.min(s.weeks, WEEKS - s.startWeek) / WEEKS) * 100}%`,
                  }}
                  title={s.label}
                >
                  {s.label}
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4 pt-1 text-[11px] text-soft">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-sky" /> Voyage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-candy" /> Idle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-lilac" /> Maintenance
        </span>
      </div>
    </div>
  );
}

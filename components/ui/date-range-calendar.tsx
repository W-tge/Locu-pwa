"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRangeCalendarProps {
  selectedStart: Date;
  selectedEnd: Date;
  onSelect: (start: Date, end: Date) => void;
  onClose: () => void;
  className?: string;
}

export function DateRangeCalendar({
  selectedStart,
  selectedEnd,
  onSelect,
  onClose,
  className,
}: DateRangeCalendarProps) {
  const [viewMonth, setViewMonth] = useState(
    new Date(selectedStart.getFullYear(), selectedStart.getMonth(), 1)
  );
  const [pickingEnd, setPickingEnd] = useState(false);
  const [tempStart, setTempStart] = useState(selectedStart);
  const [tempEnd, setTempEnd] = useState(selectedEnd);

  const monthName = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
    1
  ).getDay();

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const handleDayClick = (day: number) => {
    const clicked = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      day
    );
    if (!pickingEnd) {
      setTempStart(clicked);
      setPickingEnd(true);
    } else {
      const newEnd = clicked > tempStart ? clicked : tempStart;
      const newStart = clicked > tempStart ? tempStart : clicked;
      setTempStart(newStart);
      setTempEnd(newEnd);
      setPickingEnd(false);
      onSelect(newStart, newEnd);
    }
  };

  const isInRange = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return d >= tempStart && d <= tempEnd;
  };

  const isStart = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return d.toDateString() === tempStart.toDateString();
  };

  const isEnd = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return d.toDateString() === tempEnd.toDateString();
  };

  const isPast = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const nightsSelected = Math.max(
    1,
    Math.round((tempEnd.getTime() - tempStart.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-primary/20 bg-card shadow-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
            )
          }
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {monthName}
        </span>
        <button
          type="button"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
            )
          }
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground mb-2 font-medium">
        {pickingEnd
          ? "Select check-out date"
          : "Select check-in date"}
      </p>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const past = isPast(day);
          const inRange = isInRange(day);
          const start = isStart(day);
          const end = isEnd(day);

          return (
            <button
              key={day}
              type="button"
              disabled={past}
              onClick={() => handleDayClick(day)}
              className={cn(
                "h-8 text-xs rounded-md transition-all font-medium",
                past && "text-muted-foreground/30 cursor-not-allowed",
                !past && !inRange && "hover:bg-primary/10 text-foreground",
                inRange && !start && !end && "bg-primary/10 text-primary",
                (start || end) && "bg-primary text-white font-bold"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {nightsSelected} night{nightsSelected !== 1 ? "s" : ""} selected
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Done
        </button>
      </div>
    </div>
  );
}

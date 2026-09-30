"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center cursor-pointer group", className)}>
        <div className="relative">
          <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary group-hover:scale-105 transition-transform"></div>
        </div>
        {label && <span className="ms-3 text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

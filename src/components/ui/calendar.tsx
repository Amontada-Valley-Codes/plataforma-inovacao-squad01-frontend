"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { useTheme } from "next-themes"; // 👈 adicionamos isso

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const { theme } = useTheme(); // 👈 detecta o tema atual

  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={true}
      className={cn(
        "p-3 rounded-md border transition-colors",
        theme === "dark"
          ? "bg-gray-800 text-gray-100 border-gray-700"
          : "bg-white text-gray-900 border-gray-100",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: cn(
          "text-sm font-medium",
          theme === "dark" ? "text-gray-100" : "text-gray-900",
        ),
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-200",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell: cn(
          "rounded-md w-8 font-normal text-[0.8rem]",
          theme === "dark" ? "text-gray-400" : "text-gray-500",
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
          theme === "dark"
            ? "text-gray-100 hover:bg-gray-700"
            : "text-gray-900 hover:bg-gray-100",
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary focus:text-primary-foreground",
          theme === "dark"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600",
        ),
        day_today: theme === "dark" ? "bg-gray-700 text-white" : "bg-accent text-accent-foreground",
        day_outside: theme === "dark" ? "text-gray-500" : "text-gray-400",
        day_disabled: "opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };

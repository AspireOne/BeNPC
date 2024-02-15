import React, {PropsWithChildren, ReactNode} from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";

export const Dashboard = (props: PropsWithChildren<{
  className?: string;
  title?: string;
}>) => {
  return (
    <div className={cn("p-[4px] fixed", props.className)}>
      <p className={"text-center font-bold pb-5"}>{props.title}</p>
      <div
        className={
          "flex flex-col gap-6 px-6 bg-zinc-900 border border-zinc-300 rounded-xl min-h-[370px] min-w-[120px]"
        }
      >
        {props.children}
      </div>
    </div>
  );
};

// TODO: Pulsate when changes.
const Item = (props: {
  name?: string;
  currentValue: string;
  imgSrc?: string;
  description?: string;
  icon: ReactNode;
}) => {
  return (
    <div
      className={
        "aspect-square w-[80px] p-2 flex flex-col items-center justify-center"
      }
    >
      <p className={"font-bold text-lg text-zinc-400"}>{props.name}</p>
      <p className={"text-zinc-400"}>{props.currentValue}x</p>
    </div>
  );
};

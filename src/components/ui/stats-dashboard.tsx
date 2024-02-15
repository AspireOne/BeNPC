import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IoIosHeart } from "react-icons/io";
import { IconType } from "react-icons";
import { useGameStore } from "@/stores/gameStore";
import { GiMuscleFat, GiOrbWand } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import { Dashboard } from "@/components/Dashboard";

export const StatsDashboard = () => {
  const { stats } = useGameStore();

  return (
    <Dashboard title={"Stats"} className={cn("left-5")}>
      <Item
        maxValue={"100"}
        currentValue={stats?.health + ""}
        name={"health"}
        icon={<IoIosHeart className={"h-full w-full text-red-200"} />}
      />
      <Item
        maxValue={"100"}
        currentValue={stats?.speed + ""}
        name={"speed"}
        icon={<FaRunning className={"h-full w-full text-blue-200"} />}
      />
      <Item
        maxValue={"100"}
        currentValue={stats?.mana + ""}
        name={"mana"}
        icon={<GiOrbWand className={"h-full w-full text-amber-200"} />}
      />
      <Item
        maxValue={"100"}
        currentValue={stats?.strength + ""}
        name={"strength"}
        icon={<GiMuscleFat className={"h-full w-full text-emerald-200"} />}
      />
    </Dashboard>
  );
};

// TODO: Pulsate when changes.
const Item = (props: {
  name?: string;
  maxValue: string;
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
      <div className={"flex flex-row gap-1"}>
        <p className={"font-bold text-lg text-zinc-400"}>{props.currentValue}</p>
        <div className={"w-[17px] h-auto aspect-square"}>{props.icon}</div>
      </div>
      <p className={"text-[11px] text-zinc-400 italic"}>{props.name}</p>
    </div>
  );
};

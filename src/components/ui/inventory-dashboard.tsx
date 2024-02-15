import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import { Dashboard } from "@/components/Dashboard";

export const InventoryDashboard = () => {
  const { inventoryItems } = useGameStore();

  return (
    <Dashboard title={"Inventory"} className={cn("right-5")}>
      {inventoryItems.map((item) => {
        return (
          <Item
            currentValue={item.quantity + ""}
            name={item.name}
            icon={item.img}
          />
        );
      })}
    </Dashboard>
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

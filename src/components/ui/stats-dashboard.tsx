import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IoIosHeart } from "react-icons/io";
import { IconType } from "react-icons";

export const StatsDashboard = ({
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500",
          " bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]",
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1]",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]",
        )}
      />
      <div className={"relative z-10 flex flex-row gap-2"}>
        <Item
          maxValue={"100"}
          currentValue={"50"}
          name={"health"}
          icon={<IoIosHeart className={"h-full w-full"} />}
        />
      </div>
    </div>
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
        "rounded-3xl bg-zinc-900 aspect-square w-[100px] p-2 flex flex-col items-center justify-center"
      }
    >
      <div className={"w-[22px] h-auto aspect-square"}>{props.icon}</div>
      <p className={"font-bold text-lg text-red-400"}>{props.currentValue}</p>
      <p className={"text-[11px] text-gray-200"}>/ {props.maxValue}</p>
    </div>
  );
};

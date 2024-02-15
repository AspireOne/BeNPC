import * as React from "react";
import Head from "next/head";

export const LoadingScreen = (props: { text?: string }) => {
  return (
    <div className={"mx-auto flex flex-col items-center justify-center h-screen"}>
      <Head>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/treadmill.js"
        ></script>
      </Head>
      {/* @ts-ignore */}
      <l-treadmill size="70" speed="1.25" color="#BF4367"></l-treadmill>
      <div
        className={
          "text-center text-gray-300 font-bold text-lg mt-4 whitespace-nowrap"
        }
      >
        {props.text ?? ""}
      </div>
    </div>
  );
};

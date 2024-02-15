import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import {cn} from "@/lib/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;

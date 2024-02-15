import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import '@radix-ui/themes/styles.css';
import {cn} from "@/lib/utils";
import {Theme} from "@radix-ui/themes";
import {ThemeProvider} from "@/components/theme-provider";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme={"dark"}
    >
      <div className={cn(
        "min-h-screen bg-zinc-900 font-sans antialiased",
        fontSans.variable
      )}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;

import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utils";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { reactQueryClient } from "@/lib/reactQueryClient";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"dark"}>
      <QueryClientProvider client={reactQueryClient}>
        <div
          className={cn(
            "min-h-screen bg-zinc-900 font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default MyApp;

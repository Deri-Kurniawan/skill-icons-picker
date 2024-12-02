import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { API_URL, ICONS } from "@/lib/const";
import { IconBrandGithub } from "justd-icons";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { IconPickerProvider } from "@/context/icon-picker-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Skill Icons Picker",
  description: "Icon picker tool for skillicons.dev.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IconPickerProvider initialIcons={ICONS} initialFilteredIcons={ICONS}>
          <div className="max-w-screen-xl px-4 md:px-8 mx-auto mb-8">
            <header className="flex flex-row gap-4 justify-between items-center pt-4">
              <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Skill Icons Picker
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Icon picker tool for{" "}
                  <a
                    href={API_URL}
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    skillicons.dev
                  </a>
                  .
                </p>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" asChild>
                        <a
                          href="https://github.com/Deri-Kurniawan/skill-icons-picker"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconBrandGithub className="size-6" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>GitHub Repository</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </header>

            {children}

            <footer>
              <p className="mt-8">
                Made by{" "}
                <a
                  href="https://github.com/Deri-Kurniawan"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Deri Kurniawan
                </a>
                , simply because he needed it.
              </p>
            </footer>
          </div>
        </IconPickerProvider>
      </body>
    </html>
  );
}

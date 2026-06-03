"use client";

import CodeBlock from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIconPicker } from "@/hooks/use-icon-picker";
import useIsMounted from "@/hooks/use-is-mounted";
import { buildUrl, cn } from "@/lib/utils";
import { IconMoonFill, IconSunFill, IconX } from "justd-icons";
import Image from "next/image";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import IconDownloader from "./icon-downloader";

const IconPicker = () => {
  const isMounted = useIsMounted();
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum<"icons" | "output">(["icons", "output"]).withDefault(
      "icons"
    )
  );
  const [searchTerm, setSearchTerm] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );
  const { state, dispatch } = useIconPicker();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (searchTerm !== "") {
      const result = state.icons.filter(
        (icon) =>
          icon.iconId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch({ type: "SET_FILTERED_ICONS", payload: result });
    } else {
      dispatch({ type: "SET_FILTERED_ICONS", payload: state.icons });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, state.icons]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        document.getElementById("icon-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value as typeof activeTab);
      }}
    >
      <div className="sticky top-0 z-10 py-4 bg-white">
        <div className="flex flex-row items-center self-start justify-between gap-4 flex-wrap">
          <div className="flex flex-row gap-4">
            <div className="relative">
              <Input
                id="icon-search"
                type="search"
                placeholder="Find icons (Ctrl + K)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value || null);
                  setActiveTab("icons");
                }}
              />
            </div>
            <ThemeToggle />
            <DeselectButton className="hidden md:flex" />
          </div>
          <div className="flex gap-2 md:gap-4">
            <TabsList>
              <TabsTrigger value="icons">Icons</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            <DeselectButton className="md:hidden" />
          </div>
        </div>
      </div>
      <TabsContent
        value="icons"
        className="grid grid-cols-3 border md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10"
        tabIndex={-1}
        asChild
      >
        <main>
          {state.filteredIcons.length > 0 ? (
            state.filteredIcons.map((icon, index) => (
              <button
                key={icon.iconId}
                className={cn(
                  "flex items-center justify-center flex-col gap-4 transition-all duration-75 ease-in-out border overflow-hidden p-2",
                  state.selectedIcons.includes(icon)
                    ? "bg-blue-50 hover:border-red-800"
                    : "hover:border-blue-800"
                )}
                onClick={() => {
                  if (state.selectedIcons.includes(icon)) {
                    dispatch({
                      type: "SET_SELECTED_ICONS",
                      payload: state.selectedIcons.filter(
                        (i) => i.iconId !== icon.iconId
                      ),
                    });
                  } else {
                    dispatch({
                      type: "SET_SELECTED_ICONS",
                      payload: [...state.selectedIcons, icon],
                    });
                  }
                }}
              >
                <Image
                  className={`w-16 h-auto ${state.selectedIcons.includes(icon)
                    ? "opacity-80 rounded-2xl transition-all duration-75 ease-in-out"
                    : ""
                    }`}
                  src={buildUrl(`/api/icons`, {
                    i: icon.iconId,
                    theme: state.theme,
                  })}
                  width={64}
                  height={64}
                  alt={`${icon.label} Icon`}
                  loading={index < 30 ? "eager" : "lazy"}
                  priority={index < 30}
                />

                <span className="bg-secondary py-0.5 px-1 rounded-md text-sm font-mono overflow-ellipsis">
                  {icon.label}
                </span>
              </button>
            ))
          ) : (
            <>
              {searchTerm === "" ? (
                <div className="col-span-full text-center py-2 px-4">
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    No available icons.
                  </p>
                </div>
              ) : (
                isMounted && <NoSearchResultMessage />
              )}
            </>
          )}
        </main>
      </TabsContent>

      <TabsContent
        value="output"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        tabIndex={-1}
        asChild
      >
        <main>
          <div
            className={cn(
              "order-last lg:order-first flex flex-col gap-4",
              "[&_h3]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:scroll-m-20"
            )}
          >
            {[
              {
                label: "URL",
                code: state.generatedUrl,
              },
              {
                label: "Markdown",
                code: `![Tech Stack](${state.generatedUrl})`,
              },
              {
                label: "HTML",
                code: `<img src="${state.generatedUrl}" width="100" height="100" alt="Tech Stack" />`,
              },
            ].map((item) => (
              <div key={item.label}>
                <h3>{item.label}</h3>
                <CodeBlock copyText={item.code}>{item.code}</CodeBlock>
              </div>
            ))}

            <div>
              <h3>Download</h3>
              <div className="flex flex-wrap gap-4">
                <IconDownloader />
              </div>
            </div>
          </div>

          <div>
            <h3>Preview</h3>

            <div className="mb-6">
              <Label htmlFor="perline">Perline</Label>
              <Input
                type="number"
                name="perline"
                placeholder="Icon perline"
                min="1"
                max="50"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  dispatch({
                    type: "SET_PERLINE",
                    payload: Math.min(Math.max(value, 1), 50),
                  });
                }}
                defaultValue={state.perline}
              />
            </div>

            <div className="w-full aspect-video rounded-md p-4 border flex items-center justify-center">
              {state.selectedIcons.length > 0 ? (
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(
                      state.perline,
                      state.selectedIcons.length
                    )}, 1fr)`,
                  }}
                >
                  {state.selectedIcons.map((icon, index) => (
                    <div
                      key={icon.iconId}
                      className={cn(
                        "relative rounded-md transition-all duration-200",
                        draggedIndex === index && "opacity-50 scale-95",
                        draggedIndex !== null &&
                        draggedIndex !== index &&
                        "ring-2 ring-blue-300"
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedIndex !== null && draggedIndex !== index) {
                          const newSelected = [...state.selectedIcons];
                          const [removed] = newSelected.splice(draggedIndex, 1);
                          newSelected.splice(index, 0, removed);
                          dispatch({
                            type: "SET_SELECTED_ICONS",
                            payload: newSelected,
                          });
                        }
                        setDraggedIndex(null);
                      }}
                    >
                      <Image
                        src={buildUrl(`/api/icons`, {
                          i: icon.iconId,
                          theme: state.theme,
                        })}
                        width={40}
                        height={40}
                        alt={`${icon.label} Icon`}
                        className="size-10 cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={() => setDraggedIndex(index)}
                        onDragEnd={() => setDraggedIndex(null)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Image
                  className="w-full aspect-video rounded-md p-4"
                  src={state.generatedUrl}
                  width={592}
                  height={333}
                  alt="Tech Stack Preview"
                />
              )}
            </div>
            {state.selectedIcons.length > 0 && (
              <div
                className="p-4 mt-4 text-sm text-blue-800 rounded-lg bg-blue-50"
                role="alert"
              >
                <span className="font-medium">Tip:</span> You can drag and drop
                icons to reorder them in the preview above.
              </div>
            )}
          </div>
        </main>
      </TabsContent>
    </Tabs>
  );
};

function ThemeToggle() {
  const { state, dispatch } = useIconPicker();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (state.theme === "light") {
                dispatch({ type: "SET_THEME", payload: "dark" });
              } else {
                dispatch({ type: "SET_THEME", payload: "light" });
              }
            }}
          >
            {state.theme == "light" ? (
              <IconSunFill className="text-yellow-500 size-4" />
            ) : (
              <IconMoonFill className="text-primary size-4" />
            )}
            <span className="sr-only">
              {state.theme == "light" ? "Dark" : "Light"} Mode
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{state.theme} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DeselectButton({ className }: { className?: string }) {
  const { state, dispatch } = useIconPicker();

  return (
    <>
      {state.selectedIcons.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={className}
                variant="outline"
                onClick={() =>
                  dispatch({
                    type: "SET_SELECTED_ICONS",
                    payload: [],
                  })
                }
              >
                {`${state.selectedIcons.length} selected`}
                <IconX className="size-8 ml-2" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deselect</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}

function NoSearchResultMessage() {
  return (
    <div className="col-span-full text-center space-y-2 px-4">
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Looks like the icon you&apos;re looking for isn&apos;t here.
      </p>
    </div>
  );
}

export default IconPicker;
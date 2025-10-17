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
import { API_URL } from "@/lib/const";
import { buildUrl, cn } from "@/lib/utils";
import { IconMoonFill, IconSunFill, IconX } from "justd-icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconDownloader from "./icon-downloader";

const IconPicker = () => {
  const [activeTab, setActiveTab] = useState<"icons" | "output">("icons");
  const { state, dispatch } = useIconPicker();
  const inputSearchTermRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (inputSearchTermRef.current) {
      if (inputSearchTermRef.current.value !== "") {
        dispatch({
          type: "SET_FILTERED_ICONS",
          payload: state.icons.filter(
            (icon) =>
              icon.iconId
                .toLowerCase()
                .includes(
                  (inputSearchTermRef.current?.value as string).toLowerCase()
                ) ||
              icon.label
                .toLowerCase()
                .includes(inputSearchTermRef.current?.value as string)
          ),
        });
      }
    } else {
      dispatch({
        type: "SET_FILTERED_ICONS",
        payload: state.icons,
      });
    }
  }, [state.icons, dispatch, inputSearchTermRef.current?.value]);

  useEffect(() => {
    if (inputSearchTermRef.current) {
      const handleInput = () => {
        const target = inputSearchTermRef.current as HTMLInputElement;

        dispatch({
          type: "SET_SEARCH_TERMS",
          payload: target.value,
        });

        setActiveTab("icons");

        if (target.value !== "") {
          const result = state.icons.filter(
            (icon) =>
              icon.iconId.toLowerCase().includes(target.value.toLowerCase()) ||
              icon.label.toLowerCase().includes(target.value.toLowerCase())
          );
          dispatch({
            type: "SET_FILTERED_ICONS",
            payload: result,
          });
        } else {
          dispatch({
            type: "SET_FILTERED_ICONS",
            payload: state.icons,
          });
        }
      };

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "k") {
          e.preventDefault();
          inputSearchTermRef.current?.focus();
        }
      };

      const inputElement = inputSearchTermRef.current;

      inputElement.addEventListener("input", handleInput);
      window.addEventListener("keydown", handleKeydown);

      return () => {
        inputElement.removeEventListener("input", handleInput);
        window.removeEventListener("keydown", handleKeydown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                ref={inputSearchTermRef}
                type="search"
                placeholder="Find icons (Ctrl + K)"
              />
            </div>
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
            {state.selectedIcons.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hidden md:flex"
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
          </div>
          <div className="flex gap-2 md:gap-4">
            <TabsList>
              <TabsTrigger value="icons">Icons</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            {state.selectedIcons.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="md:hidden"
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
          {inputSearchTermRef.current &&
            inputSearchTermRef.current.value !== "" &&
            state.filteredIcons.length <= 0 && (
              <div className="col-span-full text-center py-2 px-4">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Looks like the icon you&apos;re looking for isn&apos;t here.
                </p>
              </div>
            )}

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
                  className={`w-16 h-auto ${
                    state.selectedIcons.includes(icon)
                      ? "opacity-80 rounded-2xl transition-all duration-75 ease-in-out"
                      : ""
                  }`}
                  src={buildUrl(`${API_URL}/icons`, {
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
              {inputSearchTermRef.current ? (
                inputSearchTermRef.current.value === "" && (
                  <div className="col-span-full text-center py-2 px-4">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      No available icons.
                    </p>
                  </div>
                )
              ) : (
                <div className="col-span-full text-center py-2 px-4">
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Looks like the icon you&apos;re looking for isn&apos;t here.
                  </p>
                </div>
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
          <div className="order-last lg:order-first flex flex-col gap-4">
            <div>
              <h3 className="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
                URL
              </h3>
              <CodeBlock copyText={state.generatedUrl}>
                {state.generatedUrl}
              </CodeBlock>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
                Markdown
              </h3>
              <CodeBlock
                copyText={`![Tech Stack](${state.generatedUrl})`}
              >{`![Tech Stack](${state.generatedUrl})`}</CodeBlock>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
                HTML
              </h3>
              <CodeBlock
                copyText={`<img src="${state.generatedUrl}" width="100" height="100" alt="Tech Stack" />`}
              >
                {`<img src="${state.generatedUrl}" width="100" height="100" alt="Tech Stack" />`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
                Download
              </h3>
              <div className="flex flex-wrap gap-4">
                <IconDownloader />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold tracking-tight scroll-m-20">
              Preview
            </h3>

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
                        src={buildUrl(`${API_URL}/icons`, {
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
                  className="w-full aspect-video rounded-md p-4 border"
                  src={state.generatedUrl}
                  width={592}
                  height={333}
                  alt="Tech Stack Preview"
                />
              )}
            </div>
            {/* tips alert */}
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

export default IconPicker;

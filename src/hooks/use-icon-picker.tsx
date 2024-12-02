"use client";

import IconPickerContext from "@/context/icon-picker-context";
import { useContext } from "react";

export const useIconPicker = () => {
  const ctx = useContext(IconPickerContext);

  if (!ctx) {
    throw new Error("useIconPicker must be used within a IconPickerProvider");
  }

  return ctx;
};

"use client";

import { TIcon } from "@/global";
import { API_URL } from "@/lib/const";
import { buildUrl } from "@/lib/utils";
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";

type TIconPickerState = {
  icons: TIcon[];
  filteredIcons: TIcon[];
  selectedIcons: TIcon[];
  theme: "light" | "dark";
  perline: number;
  generatedUrl: string;
};

type TIconPickerAction =
  | { type: "SET_ICONS"; payload: TIcon[] }
  | { type: "SET_FILTERED_ICONS"; payload: TIcon[] }
  | { type: "SET_SELECTED_ICONS"; payload: TIcon[] }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_PERLINE"; payload: number }
  | { type: "SET_SEARCH_TERMS"; payload: string };

type IconPickerProviderProps = {
  initialIcons?: TIcon[];
  initialFilteredIcons?: TIcon[];
  initialSelectedIcons?: TIcon[];
  initialTheme?: "light" | "dark";
  initialPerline?: number;
  children: ReactNode;
};

const initialState: TIconPickerState = {
  icons: [],
  filteredIcons: [],
  selectedIcons: [],
  theme: "light",
  perline: 15,
  generatedUrl: "",
};

const iconPickerReducer = (
  state: TIconPickerState,
  action: TIconPickerAction
): TIconPickerState => {
  switch (action.type) {
    case "SET_ICONS":
      return { ...state, icons: action.payload };
    case "SET_FILTERED_ICONS":
      return { ...state, filteredIcons: action.payload };
    case "SET_SELECTED_ICONS":
      return { ...state, selectedIcons: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_PERLINE":
      return { ...state, perline: action.payload };
    default:
      return state;
  }
};

const IconPickerContext = createContext<{
  state: TIconPickerState;
  dispatch: React.Dispatch<TIconPickerAction>;
} | null>(null);

export const IconPickerProvider: FC<IconPickerProviderProps> = ({
  initialIcons = [],
  initialFilteredIcons = [],
  initialSelectedIcons = [],
  initialTheme = "light",
  initialPerline = 15,
  children,
}) => {
  const [state, dispatch] = useReducer(iconPickerReducer, {
    ...initialState,
    icons: initialIcons,
    filteredIcons: initialFilteredIcons,
    selectedIcons: initialSelectedIcons,
    theme: initialTheme,
    perline: initialPerline,
  });
  const [generatedUrl, setGeneratedUrl] = useState<string>("");

  useEffect(() => {
    setGeneratedUrl(
      buildUrl(`${API_URL}/icons`, {
        i:
          state.selectedIcons.length === 0
            ? "all"
            : state.selectedIcons.map((i) => i.iconId).join(","),
        theme: state.theme,
        perline: state.perline.toString(),
      })
    );
  }, [state.selectedIcons, state.theme, state.perline]);

  return (
    <IconPickerContext.Provider
      value={{ state: { ...state, generatedUrl }, dispatch }}
    >
      {children}
    </IconPickerContext.Provider>
  );
};

export default IconPickerContext;

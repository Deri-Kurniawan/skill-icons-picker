"use client";

import { env } from "@/env";
import { TIcon } from "@/global";
import { buildUrl } from "@/lib/utils";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useMemo,
  useReducer,
} from "react";

type TIconPickerState = {
  icons: TIcon[];
  filteredIcons: TIcon[];
  selectedIcons: TIcon[];
  theme: "light" | "dark";
  perline: number;
  generatedUrl: string;
};

export type TIconPickerAction =
  | { type: "SET_ICONS"; payload: TIcon[] }
  | { type: "SET_FILTERED_ICONS"; payload: TIcon[] }
  | { type: "SET_SELECTED_ICONS"; payload: TIcon[] }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_PERLINE"; payload: number }
  | { type: "SET_SEARCH_TERMS"; payload: string };

type TReducerState = Pick<TIconPickerState, "icons" | "filteredIcons">;

type IconPickerProviderProps = {
  initialIcons?: TIcon[];
  initialFilteredIcons?: TIcon[];
  initialTheme?: "light" | "dark";
  initialPerline?: number;
  children: ReactNode;
};

const reducerInitialState: TReducerState = {
  icons: [],
  filteredIcons: [],
};

const iconPickerReducer = (
  state: TReducerState,
  action: TIconPickerAction
): TReducerState => {
  switch (action.type) {
    case "SET_ICONS":
      return { ...state, icons: action.payload };
    case "SET_FILTERED_ICONS":
      return { ...state, filteredIcons: action.payload };
    default:
      return state;
  }
};

const IconPickerContext = createContext<{
  state: TIconPickerState;
  dispatch: (action: TIconPickerAction) => void;
} | null>(null);


export const IconPickerProvider: FC<IconPickerProviderProps> = ({
  initialIcons = [],
  initialFilteredIcons = [],
  initialTheme = "light",
  initialPerline = 15,
  children,
}) => {
  const [reducerState, baseDispatch] = useReducer(iconPickerReducer, {
    ...reducerInitialState,
    icons: initialIcons,
    filteredIcons: initialFilteredIcons,
  });

  const [selectedIconIds, setSelectedIconIds] = useQueryState(
    "icon",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsStringEnum<"light" | "dark">(["light", "dark"]).withDefault(
      initialTheme
    )
  );
  const [perline, setPerline] = useQueryState(
    "perline",
    parseAsInteger.withDefault(initialPerline)
  );

  const selectedIcons = useMemo(
    () =>
      selectedIconIds
        .map((id) => reducerState.icons.find((icon) => icon.iconId === id))
        .filter(Boolean) as TIcon[],
    [reducerState.icons, selectedIconIds]
  );

  const generatedUrl = useMemo(
    () =>
      buildUrl(`${env.NEXT_PUBLIC_BASE_API_URL}/icons`, {
        i: selectedIconIds.length === 0 ? "all" : selectedIconIds.join(","),
        theme,
        perline: perline.toString(),
      }),
    [selectedIconIds, theme, perline]
  );

  const dispatch = useCallback(
    (action: TIconPickerAction) => {
      switch (action.type) {
        case "SET_SELECTED_ICONS":
          setSelectedIconIds(action.payload.map((i) => i.iconId));
          break;
        case "SET_THEME":
          setTheme(action.payload);
          break;
        case "SET_PERLINE":
          setPerline(action.payload);
          break;
        default:
          baseDispatch(action);
      }
    },
    [setSelectedIconIds, setTheme, setPerline]
  );

  const state: TIconPickerState = {
    ...reducerState,
    selectedIcons,
    theme,
    perline,
    generatedUrl,
  };

  return (
    <IconPickerContext.Provider value={{ state, dispatch }}>
      {children}
    </IconPickerContext.Provider>
  );
};

export default IconPickerContext;
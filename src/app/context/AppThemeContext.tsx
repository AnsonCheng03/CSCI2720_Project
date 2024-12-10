"use client";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
  useColorScheme,
  useMediaQuery,
} from "@mui/material";
import {
  createContext,
  use,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {} from "@mui/material/themeCssVarsAugmentation";
import styles from "./page.module.css";

const AppThemeContext = createContext<{
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  mode: "light",
  setMode: () => {},
});

const AppThemeProvider = (props: any) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const theme = useMemo(() => {
    return responsiveFontSizes(
      createTheme({
        cssVariables: {
          colorSchemeSelector: "class",
          // disableCssColorScheme: true,
        },
        palette: {
          mode: mode,
          // primary: {
          //   main: `rgb(10, 18, 42)`,
          //   contrastText: "rgb(255, 255, 255)",
          // },
          // secondary: {
          //   main: `rgb(27, 59, 111)`,
          //   contrastText: "rgb(255, 255, 255)",
          // },
        },
        //   colorSchemes: {
        //     light: {
        //       palette: {
        //         primary: {
        //           main: `rgb(10, 18, 42)`,
        //         },
        //         secondary: {
        //           main: `rgb(27, 59, 111)`,
        //         },
        //       },
        //     },
        //     dark: {
        //       palette: {
        //         primary: {
        //           main: `rgb(10, 18, 42)`,
        //         },
        //         secondary: {
        //           main: `rgb(27, 59, 111)`,
        //         },
        //       },
        //     },
        //   },
      })
    );
  }, [mode]);

  return (
    <AppThemeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      <ThemeProvider theme={theme}>
        <div className={mode === "dark" ? styles.dark : styles.light}>
          <CssBaseline enableColorScheme />
          {props.children}
        </div>
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
};

export function useAppThemeContext() {
  if (!AppThemeContext) {
    throw new Error(
      "useAppThemeContext must be used within an AppThemeProvider"
    );
  }
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error(
      "useAppThemeContext must be used within an AppThemeProvider"
    );
  }
  return context;
}

export default AppThemeProvider;

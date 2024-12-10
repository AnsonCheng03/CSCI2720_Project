"use client";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
        },
        colorSchemes: {
          // https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette
          light: {
            palette: {
              primary: {
                main: `#7f9975`,
              },
              secondary: {
                main: `#aac0b7`,
              },
              error: {
                main: `#ff0000`,
              },
              // warning: {
              //   main: `#ff0000`,
              // },
              info: {
                main: `#95b1ac`,
              },
              // success: {
              //   main: `#7f9975`,
              // },
              background: {
                default: `#fafbf9`,
              },
              text: {
                primary: `#0c0f0b`,
              },
            },
          },
          dark: {
            palette: {
              primary: {
                main: `#708a66`,
              },
              secondary: {
                main: `#3f554c`,
              },
              error: {
                main: `#ff0000`,
              },
              // warning: {
              //   main: `#ff0000`,
              // },
              info: {
                main: `#95b1ac`,
              },
              // success: {
              //   main: `#7f9975`,
              // },
              background: {
                default: `#050604`,
              },
              text: {
                primary: `#f1f4f0`,
              },
            },
          },
        },
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

import Link from "next/link";
import { JSX } from "react";
import { Box, Checkbox, FormControl } from "@mui/material";
import { TiThMenu } from "react-icons/ti";
import styles from "./page.module.css";
import { NavLink, NavLogoutLink } from "./navLinks";

export default function NavBar({
  navItems,
  navFooterItems,
}: {
  navItems: {
    name: string;
    href?: string;
    icon?: JSX.Element;
  }[];
  navFooterItems?: {
    name: string;
    href?: string;
    icon?: JSX.Element;
  }[];
}) {
  return (
    <nav className={styles.nav}>
      <Box className={styles.mobileBar}>
        <label htmlFor="mobileCheckbox">
          <TiThMenu />
        </label>
      </Box>
      <input
        type="checkbox"
        className={styles.mobileCheckbox}
        id="mobileCheckbox"
      />
      <Box className={styles.navContainer}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href + item.name}>
              {item.href ? (
                <NavLink item={item} />
              ) : (
                <>
                  <span className={styles.icon}>{item.icon}</span>
                  <span>{item.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        {navFooterItems && (
          <ul>
            {navFooterItems.map((item) => (
              <li key={item.href + item.name}>
                {item.href ? (
                  <NavLink item={item} />
                ) : (
                  <>
                    <span className={styles.icon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </>
                )}
              </li>
            ))}
            <NavLogoutLink />
          </ul>
        )}
      </Box>
    </nav>
  );
}

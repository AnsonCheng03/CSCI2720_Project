import Link from "next/link";
import styles from "./page.module.css";
import { JSX } from "react";
import { Box } from "@mui/material";

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
      <Box className={styles.navContainer}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href + item.name}>
              {item.href ? (
                <Link href={item.href} className={styles.link}>
                  <span className={styles.icon}>{item.icon}</span>
                  {item.name}
                </Link>
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
                  <Link href={item.href} className={styles.link}>
                    <span className={styles.icon}>{item.icon}</span>
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <span className={styles.icon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Box>
    </nav>
  );
}

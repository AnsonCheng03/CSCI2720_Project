import Link from "next/link";
import styles from "./page.module.css";

export default function NavBar({
  navItems,
  navFooterItems,
}: {
  navItems: {
    name: string;
    href: string;
  }[];
  navFooterItems?: {
    name: string;
    href: string;
  }[];
}) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href + item.name}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
        {navFooterItems && (
          <div>
            {navFooterItems.map((item) => (
              <Link key={item.href + item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

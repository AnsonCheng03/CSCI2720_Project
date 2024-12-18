"use client";
import Link from "next/link";
import { JSX } from "react";
import { signOut } from "next-auth/react";
import { IoLogOut } from "react-icons/io5";
import styles from "./page.module.css";

// export function NavLink({
export const NavLink = ({
  item,
}: {
  item: {
    name: string;
    href?: string;
    icon?: JSX.Element;
  };
}) => {
  return (
    item.href && (
      <Link href={item.href} className={styles.link}>
        <span className={styles.icon}>{item.icon}</span>
        {item.name}
      </Link>
    )
  );
};

export function NavLogoutLink() {
  return (
    <span className={styles.link} onClick={() => signOut()}>
      <span className={styles.icon}>
        <IoLogOut />
      </span>
      Logout
    </span>
  );
}

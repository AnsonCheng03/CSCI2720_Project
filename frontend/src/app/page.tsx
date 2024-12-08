import Image from "next/image";
import styles from "./page.module.css";

import LoginBtnProvider from "@/components/login/loginElementProvider";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <LoginBtnProvider />
      <Link href="/panel" passHref>
        Go to panel
      </Link>
    </div>
  );
}

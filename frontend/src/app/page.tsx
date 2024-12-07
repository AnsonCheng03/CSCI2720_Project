import Image from "next/image";
import styles from "./page.module.css";

import LoginBtnProvider from "@/components/login/loginElementProvider";

export default function Home() {
  return (
    <div className={styles.page}>
      <LoginBtnProvider />
    </div>
  );
}

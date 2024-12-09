import styles from "./page.module.css";

import LoginBtnProvider from "@/components/login/loginElementProvider";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div>
          <h1>Welcome!</h1>
          <p>
            This is an web application to check information on some locations.
          </p>
        </div>
        <div>
          <LoginBtnProvider />
        </div>
      </div>
    </div>
  );
}

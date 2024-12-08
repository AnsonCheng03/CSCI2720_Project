"use client";

import Link from "next/link";
import bcrypt from "bcrypt-nodejs";
import { useEventContext } from "../../EventProvider/context";
import styles from "./page.module.css";
import { createUsers } from "@/app/DatabaseProvider/Mutation/User";

export default function Home() {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const event = {
      userName: formData.get("username") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    if (event.password !== formData.get("password2")) {
      console.error("Passwords do not match");
      window.alert("Passwords do not match");
      return;
    }
    event.password = bcrypt.hashSync(event.password, bcrypt.genSaltSync(8));

    const newEvent = JSON.parse(await createUsers(event));
    if (newEvent.error) {
      console.error(newEvent.message);
      window.alert(newEvent.message);
      return;
    }
    console.log("Event added to database", newEvent);
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <br />
        <label>
          Enter Password Again
          <input type="password" name="password2" />
        </label>
        <br />
        <label>
          Role
          <select name="role">
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <br />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

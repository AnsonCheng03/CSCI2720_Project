"use client";

import Link from "next/link";
import bcrypt from "bcrypt-nodejs";
import { useEventContext } from "../../EventProvider/context";
import styles from "./page.module.css";
import {
  createUsers,
  getUsers,
  modifyUsers,
} from "@/app/DatabaseProvider/Mutation/User";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [userList, setUserList] = useState<any[] | null>(null);
  const form = useRef(null);

  const getUser = async () => {
    const users = JSON.parse(await getUsers());
    if (users.error) {
      console.error(users.message);
      window.alert(users.message);
      return;
    }
    setUserList(users);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleSubmit = async (type: string) => {
    if (!form.current) return;
    const formData = new FormData(form.current);

    const event = {
      _id: formData.get("originalUsername") as string,
      userName: formData.get("username") as string,
      password: formData.get("password") as string,
      password2: formData.get("password2") as string,
      role: formData.get("role") as string,
    };

    if (
      !event._id ||
      !event.userName ||
      !event.password ||
      !event.password2 ||
      !event.role
    ) {
      window.alert("Please fill out all fields");
      return;
    }

    if (type === "modify") {
      updateData(event);
    } else if (type === "delete") {
      deleteData(event);
    }
  };

  const deleteData = async (event: any) => {
    const deletedEvent = JSON.parse(await modifyUsers(event));
    if (deletedEvent.error) {
      console.error(deletedEvent.message);
      window.alert(deletedEvent.message);
      return;
    }
    getUser();
  };

  const updateData = async (event: any) => {
    if (event.password !== event.password2) {
      console.error("Passwords do not match");
      window.alert("Passwords do not match");
      return;
    }
    event.password = bcrypt.hashSync(event.password, bcrypt.genSaltSync(8));

    const newEvent = JSON.parse(await modifyUsers(event));
    if (newEvent.error) {
      console.error(newEvent.message);
      window.alert(newEvent.message);
      return;
    }
    getUser();
    console.log("Event added to database", newEvent);
  };

  return (
    <div className={styles.page}>
      {userList === null ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} ref={form}>
          <label>
            Original Username
            <select name="originalUsername">
              {userList.map((user: any) => (
                <option key={user._id} value={user._id}>
                  {user.userName}
                </option>
              ))}
            </select>
          </label>
          <br />
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
          <button type="submit" onClick={() => handleSubmit("modify")}>
            Modify User
          </button>
          <button type="button" onClick={() => handleSubmit("delete")}>
            Delete User
          </button>
        </form>
      )}
    </div>
  );
}

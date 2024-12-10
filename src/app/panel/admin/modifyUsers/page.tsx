"use client";

import bcrypt from "bcrypt-nodejs";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styles from "./page.module.css";
import { getUsers, modifyUsers } from "@/app/DatabaseProvider/Mutation/User";

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

    const event: { [key: string]: string | undefined } = {
      _id: formData.get("originalUsername") as string,
      userName: formData.get("username") as string,
      password: formData.get("password") as string,
      password2: formData.get("password2") as string,
      role: formData.get("role") as string,
    };

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

    // Do not override original event object with empty strings
    Object.keys(event).forEach((key) => {
      if (event[key] === "") {
        event[key] = undefined;
      }
    });

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
      <div className={styles.header}>
        <h2>Modify User</h2>
      </div>
      {userList === null ? (
        <form>
          <CircularProgress />
        </form>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} ref={form}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Original Username
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Original Username"
              name="originalUsername"
              fullWidth
            >
              {userList.map((user: any) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            required
            id="standard-required"
            label="Username"
            name="username"
            fullWidth
          />
          <TextField
            required
            id="standard-required"
            label="Password"
            name="password"
            type="password"
            fullWidth
          />
          <TextField
            required
            id="standard-required"
            label="Enter Password Again"
            name="password2"
            type="password"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Role"
              name="role"
              defaultValue="user"
            >
              <MenuItem value="user">Normal User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            onClick={() => handleSubmit("modify")}
          >
            Modify User
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => handleSubmit("delete")}
          >
            Delete User
          </Button>
        </form>
      )}
    </div>
  );
}

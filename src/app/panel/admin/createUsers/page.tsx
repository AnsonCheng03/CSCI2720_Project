"use client";

import bcrypt from "bcrypt-nodejs";
import styles from "./page.module.css";
import { createUsers } from "@/app/DatabaseProvider/Mutation/User";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

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
        <TextField
          required
          id="standard-required"
          label="Username"
          name="username"
        />
        <TextField
          required
          id="standard-required"
          label="Password"
          name="password"
          type="password"
        />
        <TextField
          required
          id="standard-required"
          label="Enter Password Again"
          name="password2"
          type="password"
        />
        <FormControl sx={{ width: "30%", minWidth: "300px" }}>
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
        <Button type="submit" variant="contained">
          Create User
        </Button>
      </form>
    </div>
  );
}

"use client";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <form>
        <label>
          Event ID:
          <input type="text" name="eventID" />
        </label>
        <br />
        <label>
          Event title:
          <input type="text" name="eventTitle" />
        </label>
        <br />
        <label>
          Location ID:
          <input type="text" name="locationID" />
        </label>
        <br />
        <label>
          Date/time:
          <input type="text" name="dateTime" />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <label>
          Presenter:
          <input type="text" name="presenter" />
        </label>
        <br />
        <label>
          Price:
          <input type="text" name="price" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

import Database from "better-sqlite3";
import { createApp } from "./app.js";

const db = new Database("expenses.db");
const app = createApp(db);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

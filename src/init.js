import "dotenv/config";
import "./db.js";
import "./model/Video.js";
import "./model/User.js";
import "./model/Comment.js";
import app from "./server.js";

const PORT = 4000;

const handleListenStart = () =>
  console.log(`server start on http://localhost:${PORT}`);

app.listen(PORT, handleListenStart);

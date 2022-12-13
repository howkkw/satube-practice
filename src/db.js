import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/satube12");

const db = mongoose.connection;

const handleError = (error) => {
  console.log("😒DB Error", error);
};
const handleOpen = () => {
  console.log("Connected to DB");
};

db.on("error", handleError);
db.once("open", handleOpen);

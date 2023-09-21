import mongoose from "mongoose";
import { DB_URL } from "../config";
// import { DB_URL } from "../config/dbConfig";

export default function connectDatabase() {
  return mongoose.connect(DB_URL);
}

import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./utils/config_db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDb();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.listen(port, () => {
  console.log(`Berhasil terkoneksi ke server : ${port}`);
});

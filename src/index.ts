import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app: Express = express();


app.use(
  cors({
    origin: [
      "https://blogit-frontend-hhw0op53i-caren580s-projects.vercel.app",
      "http://localhost:5174", 
    ],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("<h1>Hello There</h1>");
});

app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App is live on port ${port}`));

import express, { Request, Response } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/post", postRouter.router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Api is working",
  });
});

export default app;

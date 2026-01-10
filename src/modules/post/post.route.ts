import express from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types";

const router = express.Router();

router.get("/", postController.readPost);

router.get("/:id", postController.singlePost);

router.post("/", auth(Role.USER), postController.createPost);

export const postRouter = {
  router,
};

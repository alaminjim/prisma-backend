import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../types";
import { commentController } from "./comment.controller";

const router = express.Router();

router.get("/:commentId", commentController.getIdByComment);

router.post("/", auth(Role.ADMIN, Role.USER), commentController.createComment);

export const commentRouter = {
  router,
};

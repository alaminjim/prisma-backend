import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../types";
import { commentController } from "./comment.controller";

const router = express.Router();

router.get("/author/:authorId", commentController.getIdByCommentAuthor);

router.get("/:commentId", commentController.getIdByComment);

router.post("/", auth(Role.ADMIN, Role.USER), commentController.createComment);

router.delete(
  "/:deleteId",
  auth(Role.ADMIN, Role.USER),
  commentController.deleteComment
);

router.patch(
  "/:updateId",
  auth(Role.ADMIN, Role.USER),
  commentController.updateComment
);

export const commentRouter = {
  router,
};

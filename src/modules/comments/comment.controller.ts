import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error });
  }
};

const getIdByComment = async (req: Request, res: Response) => {
  try {
    const id = req.params.commentId;
    const result = await commentService.getCommentById(id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error });
  }
};

const getIdByCommentAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentByAuthor(authorId as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { deleteId } = req.params;
    const user = req.user;
    const result = await commentService.deleteComment(
      deleteId as string,
      user?.id as string
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { updateId } = req.params;
    const user = req.user;
    const result = await commentService.updateComment(
      updateId as string,
      user?.id as string,
      req.body
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error });
  }
};

export const commentController = {
  createComment,
  getIdByComment,
  getIdByCommentAuthor,
  deleteComment,
  updateComment,
};

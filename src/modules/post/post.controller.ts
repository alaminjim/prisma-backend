import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import sortAndPagination from "../../helpers/sortAndPagination";
import filtering from "../../helpers/filtering";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res
        .status(403)
        .json({ success: false, message: "forbidden access" });
    }
    // qus.2
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

const readPost = async (req: Request, res: Response) => {
  try {
    const {
      search: postSearch,
      tags,
      isFeatured,
      status,
    } = filtering(req.query as any);

    const { page, limit, skip, sortBy, sortOrder } = sortAndPagination(
      req.query
    );

    const result = await postService.readPost({
      search: postSearch,
      tags,
      isFeatured,
      status,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

const singlePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const result = await postService.singlePost(postId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

export const postController = {
  createPost,
  readPost,
  singlePost,
};

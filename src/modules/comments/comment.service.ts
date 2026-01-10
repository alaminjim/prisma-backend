import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comments.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comments.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  return await prisma.comments.findUnique({
    where: {
      id,
    },
    include: {
      reply: true,
    },
  });
};

const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comments.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          content: true,
          views: true,
        },
      },
    },
  });
};

const deleteComment = async (id: string, authorId: string) => {
  const commentData = await prisma.comments.findMany({
    where: {
      id,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Does not exists this comment");
  }

  return await prisma.comments.delete({
    where: {
      id,
    },
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
};

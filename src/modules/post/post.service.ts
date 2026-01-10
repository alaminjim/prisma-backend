import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  //   qus.1
  userId: string
) => {
  try {
    const result = await prisma.post.create({
      data: {
        ...data,
        authorId: userId,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

const readPost = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const allPost: PostWhereInput[] = [];

  if (payload.search) {
    allPost.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    allPost.push({
      tags: {
        hasSome: payload.tags as string[],
      },
    });
  }

  if (typeof payload.isFeatured === "boolean") {
    allPost.push({
      isFeatured: payload.isFeatured,
    });
  }

  if (payload.status) {
    allPost.push({
      status: payload.status,
    });
  }

  const result = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: allPost,
    },
    orderBy: { [payload.sortBy]: payload.sortOrder },
  });

  const total = await prisma.post.count({
    where: {
      AND: allPost,
    },
  });
  return {
    data: result,
    pagination: {
      totalData: total,
      page: payload.page,
      limit: payload.limit,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

const singlePost = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const result = await tx.post.findUnique({
      where: { id },
    });
    return result;
  });
};

export const postService = {
  createPost,
  readPost,
  singlePost,
};

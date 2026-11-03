import { z } from "zod";
import { ApiError, requestJson } from "./api-client";
import type { AuthUser } from "../auth-types";

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  profileImage: z.string().nullable().optional(),
});

const postSchema = z.object({
  id: z.string(),
  authorId: z.number(),
  content: z.string(),
  postedAt: z.string(),
  author: z.object({
    id: z.number(),
    username: z.string(),
  }),
});

const createdPostSchema = z.object({
  id: z.string(),
  authorId: z.number(),
  content: z.string(),
  postedAt: z.string(),
});
const postsSchema = z.array(postSchema);
const postsResponseSchema = z.union([
  postsSchema,
  z.object({ message: z.string() }),
]);
const createPostResponseSchema = z.object({
  message: z.string(),
  post: createdPostSchema,
});
const updatePostResponseSchema = createPostResponseSchema;
const deletePostResponseSchema = z.object({ message: z.string() });
const postSearchResponseSchema = z.union([
  z.object({
    message: z.string(),
    count: z.number(),
    posts: postsSchema,
  }),
  z.object({ message: z.string() }),
]);
const userResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export type User = AuthUser;
export type Post = z.infer<typeof postSchema>;
export type CreatedPost = z.infer<typeof createdPostSchema>;
export type SearchPostsResponse = {
  message: string;
  count: number;
  posts: Post[];
};
export type CreatePostRequest = { content: string };
export type UpdatePostRequest = CreatePostRequest;
export type DeletePostResponse = z.infer<typeof deletePostResponseSchema>;

function newestFirst(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const timeA = Date.parse(a.postedAt);
    const timeB = Date.parse(b.postedAt);
    if (Number.isNaN(timeA)) return Number.isNaN(timeB) ? 0 : 1;
    if (Number.isNaN(timeB)) return -1;
    return timeB - timeA;
  });
}

export function getCurrentUser(): Promise<User> {
  return requestJson(
    "users/me",
    { method: "GET" },
    userResponseSchema,
    "Fetching current user",
  ).then((response) => response.user);
}

const POST_ROUTES = {
  allPosts: "posts",
  create: "create",
  search: "search",
};

export function getOwnPosts(): Promise<Post[]> {
  return requestJson(
    "posts/user",
    { method: "GET" },
    postsSchema,
    "Fetching your posts",
  ).then(newestFirst);
}

export async function getAllPosts(): Promise<Post[]> {
  const response = await requestJson(
    POST_ROUTES.allPosts,
    { method: "GET" },
    postsResponseSchema,
    "Fetching posts",
  );
  return Array.isArray(response) ? newestFirst(response) : [];
}

export function getPost(id: string): Promise<Post> {
  return Promise.reject(
    new ApiError(
      404,
      `The backend does not expose a get-post-by-ID route for post ${encodeURIComponent(id)}.`,
    ),
  );
}

export function searchPosts(query: string): Promise<SearchPostsResponse> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return Promise.resolve({ message: "", count: 0, posts: [] });
  }

  const searchParams = new URLSearchParams({ q: trimmedQuery });
  return requestJson(
    `${POST_ROUTES.search}?${searchParams.toString()}`,
    { method: "GET" },
    postSearchResponseSchema,
    "Searching posts",
  ).then((result) => {
    if (!("posts" in result)) {
      return { message: result.message, count: 0, posts: [] };
    }
    return { ...result, posts: newestFirst(result.posts) };
  });
}

export function createPost(input: CreatePostRequest): Promise<CreatedPost> {
  const content = input.content.trim();
  if (!content) {
    return Promise.reject(new ApiError(400, "Post content cannot be empty.", {
      content: "Post content cannot be empty.",
    }));
  }

  return requestJson(
    POST_ROUTES.create,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({ content }),
    },
    createPostResponseSchema,
    "Creating post",
  ).then((response) => response.post);
}

export function updatePost(
  id: string,
  input: UpdatePostRequest,
): Promise<CreatedPost> {
  const content = input.content.trim();
  if (!content) {
    return Promise.reject(new ApiError(400, "Post content cannot be empty.", {
      content: "Post content cannot be empty.",
    }));
  }

  return requestJson(
    encodeURIComponent(id),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    updatePostResponseSchema,
    "Updating post",
  ).then((response) => response.post);
}

export function deletePost(id: string): Promise<DeletePostResponse> {
  return requestJson(
    encodeURIComponent(id),
    {
      method: "DELETE",
      headers: { "Idempotency-Key": crypto.randomUUID() },
    },
    deletePostResponseSchema,
    "Deleting post",
  );
}

export function getUser(id: number | string): Promise<Post[]> {
  return Promise.reject(
    new ApiError(
      404,
      `The backend does not expose a public user-posts route for user ${encodeURIComponent(String(id))}.`,
    ),
  );
}

export async function updateUsername(input: {
  username: string;
}): Promise<User> {
  const username = input.username.trim();
  if (!username) {
    throw new ApiError(400, "Username cannot be empty.", {
      username: "Username cannot be empty.",
    });
  }

  const response = await requestJson(
    "users/name",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    },
    userResponseSchema,
    "Updating username",
  );
  return response.user;
}

export async function updateProfileImage(file: File): Promise<User> {
  if (!file.type.startsWith("image/")) {
    throw new ApiError(400, "Choose an image file.", {
      image: "Choose an image file.",
    });
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError(400, "The image must be 5 MB or smaller.", {
      image: "The image must be 5 MB or smaller.",
    });
  }

  const form = new FormData();
  form.append("image", file);

  const response = await requestJson(
    "users/me/profile-image",
    { method: "POST", body: form },
    userResponseSchema,
    "Updating profile image",
  );
  return response.user;
}

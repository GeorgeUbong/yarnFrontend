import { z } from "zod";
import { API_BASE_URL, HEAD } from "./auth.routes";

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

const postsSchema = z.array(postSchema);

const postSearchResponseSchema = z.object({
  message: z.string(),
  count: z.number(),
  posts: postsSchema,
});

const deletePostResponseSchema = z.object({
  message: z.string(),
});

export type Post = z.infer<typeof postSchema>;
export type SearchPostsResponse = z.infer<typeof postSearchResponseSchema>;
export type CreatePostRequest = {
  content: string;
};
export type UpdatePostRequest = CreatePostRequest;
export type DeletePostResponse = z.infer<typeof deletePostResponseSchema>;

const POST_ROUTES = {
  ownPosts: "posts/my-posts",
  allPosts: "posts",
  search: "posts/search",
  posts: "posts",
};

function getUrl(path: string): string {
  return `${API_BASE_URL}${HEAD}${path}`;
}

async function getErrorMessage(response: Response): Promise<string> {
  const body = await response.text();
  if (!body) {
    return response.statusText || "The server returned an empty error response.";
  }

  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed === "object" && parsed !== null && "message" in parsed) {
      const { message } = parsed;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
      if (
        Array.isArray(message) &&
        message.every((item) => typeof item === "string")
      ) {
        return message.join(", ");
      }
    }
  } catch {
    return body;
  }

  return body;
}

async function requestJson<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>,
  action: string,
): Promise<T> {
  const response = await fetch(getUrl(path), {
    ...init,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(`${action} failed (${response.status}): ${message}`);
  }

  const responseBody: unknown = await response.json();
  return schema.parse(responseBody);
}

export function getOwnPosts(): Promise<Post[]> {
  return requestJson(
    POST_ROUTES.ownPosts,
    { method: "GET" },
    postsSchema,
    "Fetching your posts",
  );
}

export function getAllPosts(): Promise<Post[]> {
  return requestJson(
    POST_ROUTES.allPosts,
    { method: "GET" },
    postsSchema,
    "Fetching posts",
  );
}

export function searchPosts(query: string): Promise<SearchPostsResponse> {
  const searchParams = new URLSearchParams({ query });
  return requestJson(
    `${POST_ROUTES.search}?${searchParams.toString()}`,
    { method: "GET" },
    postSearchResponseSchema,
    "Searching posts",
  );
}

export function createPost(input: CreatePostRequest): Promise<Post> {
  return requestJson(
    POST_ROUTES.posts,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    postSchema,
    "Creating post",
  );
}

export function updatePost(
  id: string,
  input: UpdatePostRequest,
): Promise<Post> {
  return requestJson(
    `${POST_ROUTES.posts}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    postSchema,
    "Updating post",
  );
}

export function deletePost(id: string): Promise<DeletePostResponse> {
  return requestJson(
    `${POST_ROUTES.posts}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    deletePostResponseSchema,
    "Deleting post",
  );
}
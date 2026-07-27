import { jsonResponse } from "@mastrojs/mastro";
import { stories } from "../../data/stories.js";

export const GET = () =>
  jsonResponse({
    meta: {
      framework: "Mastro",
      generatedAt: new Date().toISOString(),
      count: stories.length,
    },
    stories: stories.map(({ body, ink, ...story }) => ({
      ...story,
      excerpt: body[0],
    })),
  });

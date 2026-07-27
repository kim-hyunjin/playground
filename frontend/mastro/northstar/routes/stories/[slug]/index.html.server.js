import { getParams, htmlToResponse } from "@mastrojs/mastro";
import { stories } from "../../../data/stories.js";
import { StoryPage } from "../../../components/story-page.js";

export const getStaticPaths = () => stories.map((story) => `/stories/${story.slug}/`);

export const GET = (request) => {
  const { slug } = getParams(request);
  const story = stories.find((entry) => entry.slug === slug);

  if (!story) {
    return new Response("Story not found", { status: 404 });
  }

  return htmlToResponse(StoryPage(story));
};

import fallbackBlogs from "@/data/blogs.json";
import fallbackWorks from "@/data/works.json";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const DELIVERY_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN;
const BASE_URL =
  SPACE_ID && DELIVERY_TOKEN
    ? `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`
    : null;

async function fetchEntries(contentType, searchParams = {}) {
  if (!BASE_URL) {
    return null;
  }

  const params = new URLSearchParams({
    content_type: contentType,
    include: "1",
    ...searchParams,
  });

  let response;

  try {
    response = await fetch(`${BASE_URL}/entries?${params}`, {
      headers: {
        Authorization: `Bearer ${DELIVERY_TOKEN}`,
      },
      next: { revalidate: 60 },
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function getAssetUrl(asset) {
  const url = asset?.fields?.file?.url;

  if (!url) {
    return null;
  }

  return url.startsWith("//") ? `https:${url}` : url;
}

function richTextToParagraphs(document) {
  if (!document?.content) {
    return [];
  }

  return document.content
    .filter((node) => node.nodeType === "paragraph")
    .map((node) =>
      node.content
        .filter((child) => child.nodeType === "text")
        .map((child) => child.value)
        .join("")
    )
    .filter(Boolean);
}

export async function getWorks() {
  const data = await fetchEntries("work", {
    order: "fields.workId",
  });

  if (!data?.items?.length) {
    return fallbackWorks;
  }

  const assetsById = new Map(
    (data.includes?.Asset || []).map((asset) => [asset.sys.id, asset])
  );

  return data.items.map((item) => {
    const fields = item.fields;
    const imageAsset = fields.image
      ? assetsById.get(fields.image.sys.id)
      : null;

    return {
      id: fields.workId,
      src: getAssetUrl(imageAsset),
      title: fields.title,
      category: fields.category,
      description: fields.description,
      details: richTextToParagraphs(fields.details),
      year: fields.year,
      isMain: fields.isMain,
    };
  });
}

export async function getBlogs() {
  const data = await fetchEntries("blogPost", {
    order: "fields.date",
  });

  if (!data?.items?.length) {
    return fallbackBlogs.map((post) => ({
      ...post,
      paragraphs: post.text.split("\n\n"),
    }));
  }

  return data.items.map((item) => {
    const fields = item.fields;

    return {
      title: fields.title,
      date: fields.date,
      paragraphs: richTextToParagraphs(fields.text),
    };
  });
}

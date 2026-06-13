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

function mapAsset(asset) {
  if (!asset) {
    return null;
  }

  return {
    id: asset.sys.id,
    src: getAssetUrl(asset),
    title: asset.fields.title,
    description: asset.fields.description,
    width: asset.fields.file?.details?.image?.width,
    height: asset.fields.file?.details?.image?.height,
  };
}

function formatCategoryLabel(slug) {
  if (slug === "graphic-design") {
    return "Graphic Design";
  }

  if (slug === "drawings-illustration") {
    return "Drawings / Illustration";
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mapCategoryEntry(entry) {
  if (!entry?.fields?.slug || !entry?.fields?.categoryName) {
    return null;
  }

  return {
    id: entry.sys.id,
    slug: entry.fields.slug,
    label: entry.fields.categoryName,
  };
}

function getFallbackWorks() {
  return fallbackWorks.map((work, index) => ({
    ...work,
    categoryLabel: formatCategoryLabel(work.category),
    createdAt: new Date(Date.UTC(2000, 0, index + 1)).toISOString(),
  }));
}

function getFallbackCategories() {
  const categories = new Map();

  for (const work of fallbackWorks) {
    if (work.category && !categories.has(work.category)) {
      categories.set(work.category, {
        slug: work.category,
        label: formatCategoryLabel(work.category),
      });
    }
  }

  return Array.from(categories.values());
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
    include: "2",
    order: "sys.createdAt",
  });

  if (!data?.items?.length) {
    return getFallbackWorks();
  }

  const assetsById = new Map(
    (data.includes?.Asset || []).map((asset) => [asset.sys.id, asset])
  );
  const categoriesById = new Map(
    (data.includes?.Entry || [])
      .filter((entry) => entry.sys.contentType?.sys?.id === "category")
      .map((entry) => [entry.sys.id, mapCategoryEntry(entry)])
  );

  return data.items
    .map((item) => {
      const fields = item.fields;
      const imageAsset = fields.image
        ? assetsById.get(fields.image.sys.id)
        : null;
      const category = fields.categoryRef
        ? categoriesById.get(fields.categoryRef.sys.id)
        : null;

      return {
        id: item.sys.id,
        src: getAssetUrl(imageAsset),
        title: fields.title,
        category: category?.slug,
        categoryLabel: category?.label,
        description: fields.description,
        details: fields.details,
        assets: Object.fromEntries(
          Array.from(assetsById, ([id, asset]) => [id, mapAsset(asset)])
        ),
        year: fields.year,
        createdAt: item.sys.createdAt,
        isMain: fields.isMain,
      };
    })
    .filter(
      (work) =>
        work.id &&
        work.src &&
        work.title &&
        work.category &&
        work.description &&
        Number.isInteger(work.year) &&
        typeof work.isMain === "boolean"
    );
}

export async function getWorkCategories() {
  const data = await fetchEntries("category", {
    order: "sys.createdAt",
  });

  if (!data?.items?.length) {
    return getFallbackCategories();
  }

  const categories = data.items.map(mapCategoryEntry).filter(Boolean);

  return categories.length ? categories : getFallbackCategories();
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

export const DEFAULT_BLOG_SORT = "newest";

export const BLOG_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function normalizeBlogSort(sort) {
  return BLOG_SORT_OPTIONS.some((option) => option.value === sort)
    ? sort
    : DEFAULT_BLOG_SORT;
}

export function getBlogHref({ post, sort }) {
  const params = new URLSearchParams();

  if (Number.isInteger(post) && post > 0) {
    params.set("post", String(post));
  }

  if (sort && sort !== DEFAULT_BLOG_SORT) {
    params.set("sort", sort);
  }

  const query = params.toString();

  return query ? `/blog?${query}` : "/blog";
}

export function sortBlogs(blogs, sort) {
  const direction = sort === "oldest" ? 1 : -1;

  return [...blogs].sort((a, b) => {
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
  });
}

export const DEFAULT_WORK_CATEGORY = "all";
export const DEFAULT_WORK_SORT = "newest";

export const WORK_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function normalizeWorkCategory(category) {
  return category || DEFAULT_WORK_CATEGORY;
}

export function normalizeWorkSort(sort) {
  return WORK_SORT_OPTIONS.some((option) => option.value === sort)
    ? sort
    : DEFAULT_WORK_SORT;
}

function getWorkQueryString({ category, sort }) {
  const params = new URLSearchParams();

  if (category && category !== DEFAULT_WORK_CATEGORY) {
    params.set("category", category);
  }

  if (sort && sort !== DEFAULT_WORK_SORT) {
    params.set("sort", sort);
  }

  return params.toString();
}

export function getWorksHref({ category, sort }) {
  const query = getWorkQueryString({ category, sort });

  return query ? `/works?${query}` : "/works";
}

export function getWorkDetailHref({ id, category, sort }) {
  const query = getWorkQueryString({ category, sort });

  return query ? `/works/${id}?${query}` : `/works/${id}`;
}

export function getVisibleWorks(works, category) {
  return category === DEFAULT_WORK_CATEGORY
    ? works
    : works.filter((work) => work.category === category);
}

export function sortWorks(works, sort) {
  const direction = sort === "oldest" ? 1 : -1;

  return [...works].sort((a, b) => {
    const yearDifference = a.year - b.year;

    if (yearDifference !== 0) {
      return yearDifference * direction;
    }

    return (
      (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
      direction
    );
  });
}

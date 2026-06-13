import styles from "./works.module.css";
import Link from "next/link";
import Card from "@/components/card";
import { getWorkCategories, getWorks } from "@/lib/contentful";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

function getWorksHref({ category, sort }) {
  const params = new URLSearchParams();

  if (category && category !== "all") {
    params.set("category", category);
  }

  if (sort && sort !== "newest") {
    params.set("sort", sort);
  }

  const query = params.toString();

  return query ? `/works?${query}` : "/works";
}

function sortWorks(works, sort) {
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

export default async function Works({ searchParams }) {
  const [works, categories] = await Promise.all([
    getWorks(),
    getWorkCategories(),
  ]);
  const params = await searchParams;
  const category = params?.category || "all";
  const sort = SORT_OPTIONS.some((option) => option.value === params?.sort)
    ? params.sort
    : "newest";
  const links = [{ slug: "all", label: "All" }, ...categories];
  const visibleWorks =
    category === "all"
      ? works
      : works.filter((work) => work.category === category);
  const sortedWorks = sortWorks(visibleWorks, sort);

  return (
    <main className={`main ${styles.main}`}>
      <div className={styles.subNav}>
        <p>Works</p>
        <p>-</p>
        <ul>
          {links.map((link) => {
            const href = getWorksHref({
              category: link.slug,
              sort,
            });

            return (
              <Link
                className={category === link.slug ? styles.activeCategory : ""}
                key={link.slug}
                href={href}
              >
                {link.label}
              </Link>
            );
          })}
        </ul>
      </div>

      <div className={styles.sortNav} aria-label="Sort works">
        {SORT_OPTIONS.map((option) => (
          <Link
            className={sort === option.value ? styles.activeCategory : ""}
            key={option.value}
            href={getWorksHref({ category, sort: option.value })}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <section className={styles.gallery}>
        {sortedWorks.map((work) => (
          <Card
            key={work.id}
            href={`/works/${work.id}`}
            src={work.src}
            alt={work.title}
            title={work.title}
          />
        ))}
      </section>
    </main>
  );
}

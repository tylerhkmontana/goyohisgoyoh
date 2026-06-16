import styles from "./works.module.css";
import Link from "next/link";
import Card from "@/components/card";
import { getWorkCategories, getWorks } from "@/lib/contentful";
import {
  WORK_SORT_OPTIONS,
  getVisibleWorks,
  getWorkDetailHref,
  getWorksHref,
  normalizeWorkCategory,
  normalizeWorkSort,
  sortWorks,
} from "@/lib/work-navigation";

export default async function Works({ searchParams }) {
  const [works, categories] = await Promise.all([
    getWorks(),
    getWorkCategories(),
  ]);
  const params = await searchParams;
  const category = normalizeWorkCategory(params?.category);
  const sort = normalizeWorkSort(params?.sort);
  const links = [{ slug: "all", label: "All" }, ...categories];
  const visibleWorks = getVisibleWorks(works, category);
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
        {WORK_SORT_OPTIONS.map((option) => (
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
            href={getWorkDetailHref({ id: work.id, category, sort })}
            src={work.src}
            alt={work.title}
            title={work.title}
          />
        ))}
      </section>
    </main>
  );
}

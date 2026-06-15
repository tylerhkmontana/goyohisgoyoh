import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/rich-text";
import { getWorks } from "@/lib/contentful";
import {
  getVisibleWorks,
  getWorkDetailHref,
  getWorksHref,
  normalizeWorkCategory,
  normalizeWorkSort,
  sortWorks,
} from "@/lib/work-navigation";
import { notFound } from "next/navigation";
import styles from "./work.module.css";

export default async function Work({ params, searchParams }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const works = await getWorks();
  const work = works.find((item) => item.id === id);

  if (!work) {
    notFound();
  }

  const category = normalizeWorkCategory(query?.category);
  const sort = normalizeWorkSort(query?.sort);
  const sortedWorks = sortWorks(getVisibleWorks(works, category), sort);
  const currentIndex = sortedWorks.findIndex((item) => item.id === id);
  const previousWork = currentIndex > 0 ? sortedWorks[currentIndex - 1] : null;
  const nextWork =
    currentIndex >= 0 && currentIndex < sortedWorks.length - 1
      ? sortedWorks[currentIndex + 1]
      : null;

  return (
    <main className={`main ${styles.main}`}>
      <Link className={styles.backLink} href={getWorksHref({ category, sort })}>
        &larr; Go Back
      </Link>

      <section className={styles.summary}>
        <div className={styles.imageContainer}>
          <Image src={work.src} fill alt={work.title} />
        </div>

        <div className={styles.info}>
          <h4>{work.title}</h4>
          <h6>{work.year}</h6>
          <p>{work.description}</p>
        </div>
      </section>

      {work.details ? (
        <section className={styles.details}>
          <RichText
            document={work.details}
            assets={work.assets}
            classNames={{ asset: styles.detailAsset }}
          />
        </section>
      ) : null}

      {(previousWork || nextWork) && (
        <nav className={styles.workNav} aria-label="Adjacent works">
          {previousWork ? (
            <Link
              className={styles.previousLink}
              href={getWorkDetailHref({
                id: previousWork.id,
                category,
                sort,
              })}
            >
              &larr; Prev
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}

          {nextWork ? (
            <Link
              className={styles.nextLink}
              href={getWorkDetailHref({
                id: nextWork.id,
                category,
                sort,
              })}
            >
              Next &rarr;
            </Link>
          ) : null}
        </nav>
      )}
    </main>
  );
}

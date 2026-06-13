import styles from "./page.module.css";
import Link from "next/link";
import Card from "@/components/card";
import { getWorkCategories, getWorks } from "@/lib/contentful";

export default async function Home() {
  const [works, categories] = await Promise.all([
    getWorks(),
    getWorkCategories(),
  ]);
  const mainWorks = works.filter((work) => work.isMain).slice(0, 4);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/about">ABOUT</Link>
          <div className={styles.navItem}>
            <Link href="/works">WORKS</Link>
            <div className={styles.subMenu} aria-label="Works categories">
              <Link href="/works">All</Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/works?category=${category.slug}`}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/blog">BLOG</Link>
          <Link href="/contact">CONTACT</Link>
        </nav>

        <section className={styles.workPreview}>
          {mainWorks.map((work, index) => (
            <Card
              key={work.id}
              href={`/works/${work.id}`}
              src={work.src}
              alt={work.title}
              title={work.title}
              priority={index === 0}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

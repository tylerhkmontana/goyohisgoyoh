import styles from "./page.module.css";
import Link from "next/link";
import Card from "@/components/card";
import works from "@/data/works.json"


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/about">ABOUT</Link>
          <div className={styles.navItem}>
            <Link href="/works">WORKS</Link>
            <div className={styles.subMenu} aria-label="Works categories">
              <Link href="/works">All</Link>
              <Link href="/works?category=graphic-design">
                Graphic Design
              </Link>
              <Link href="/works?category=drawings-illustration">
                Drawings/Illustration
              </Link>
            </div>
          </div>
          <Link href="/blog">BLOG</Link>
          <Link href="/contact">CONTACT</Link>
        </nav>

        <section className={styles.workPreview}>
         {works.map((work, index) => (work.isMain ?
            <Card
              key={work.id}
              href={`/works/${work.id}`}
              src={work.src}
              alt={work.title}
              title={work.title}

              priority={index === 0}
            /> : ''
          ))}
        </section>
      </main>
    </div>
  );
}

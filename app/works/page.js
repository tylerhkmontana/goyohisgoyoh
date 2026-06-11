import styles from "./works.module.css";
import Link from "next/link";
import Card from "@/components/card";
import { getWorks } from "@/lib/contentful";

const links = [
  { category: "graphic-design", label: "Graphic Design"}, 
  { category: "drawings-illustration", label: "Drawings / Illustration" },
  { category: "all", label: "All" },
];

export default async function Works({ searchParams }) {
      const works = await getWorks();
      let { category } = await searchParams;
        if (category === undefined) {category = "all"}
    return (
        <main className={`main ${styles.main}`}>
            <div className={styles.subNav}>
                <p>Works</p>
                <p>-</p>
                <ul>
                    {
                        links.map((link, index) => {
                            const href = link.category === "all" ? "/works" : `/works?category=${link.category}`
                            return <Link className={category===link.category ? styles.activeCategory : ''} key={index} href={href}>{link.label}</Link>
                        })
                    }
                </ul>
            </div>

            <section className={styles.gallery}>
                    {
                        works.map(work => {
                            if (category === "all") {
                                return <Card
                                          key={work.id}
                                          href={`/works/${work.id}`}
                                          src={work.src}
                                          alt={work.title}
                                          title={work.title}
                
                                        /> } else {
                                            return category === work.category && <Card
                                                          key={work.id}
                                                          href={`/works/${work.id}`}
                                                          src={work.src}
                                                          alt={work.title}
                                                          title={work.title}
                                                        /> 
                                        }
                        })
                    }
            </section>
        </main>
    )
}

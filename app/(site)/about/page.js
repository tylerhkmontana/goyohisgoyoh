import LoadedImage from "@/components/loaded-image";
import { getAbout } from "@/lib/contentful";
import styles from "./about.module.css";

export default async function About() {
  const about = await getAbout();

  return (
    <div className={styles.page}>
      <main className={`main ${styles.main}`}>
        <section className={styles.intro}>{about.description}</section>
        <div className={styles.profile}>
          <LoadedImage
            src={about.image.src}
            alt={about.image.description || about.image.title || "Profile"}
            fill
          />
        </div>
      </main>
    </div>
  );
}

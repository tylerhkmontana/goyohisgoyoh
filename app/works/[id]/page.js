import styles from './work.module.css'
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getWorks } from '@/lib/contentful';

export default async function Work({ params }) {
      let { id } = await params;
      const works = await getWorks();
      const work = works.find(w => w.id === id)

      if (!work) {
        notFound();
      }

    return (
        <main className={`main ${styles.main}`}>
                <div className={styles.imageContainer}>
                    <Image src={work.src} fill alt={work.title}/>
                </div>

                <div className={styles.info}>
                    <h4>{work.title}</h4>
                    <h6>{work.year}</h6>
                    <p>{work.description}</p>
                </div>
        </main>
    )
}

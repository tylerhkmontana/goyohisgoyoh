import styles from './work.module.css'
import works from '@/data/works.json'
import Image from 'next/image';

export default async function Work({ params }) {
      let { id } = await params;
      const work = works.find(w => w.id === id)

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
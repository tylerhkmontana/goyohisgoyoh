import Link from "next/link";
import LoadedImage from "./loaded-image";
import styles from "./Card.module.css";

export default function Card({
  href,
  src,
  alt,
  title,
  priority = false,
  sizes = "(max-width: 767px) 100vw, 25vw",
}) {
  return (
    <Link href={href} className={styles.card} aria-label={title}>
      <LoadedImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={styles.image}
      />

      {title && (
        <div className={styles.overlay}>
          <span className={styles.title}>{title}</span>
        </div>
      )}
    </Link>
  );
}

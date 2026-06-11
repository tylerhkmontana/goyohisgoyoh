import Link from "next/link";
import blogs from "@/data/blogs.json";
import styles from "./blog.module.css";

function getPostIndex(postParam) {
  const value = Array.isArray(postParam) ? postParam[0] : postParam;
  const index = Number(value);

  if (!Number.isInteger(index) || index < 0 || index >= blogs.length) {
    return 0;
  }

  return index;
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${month}/${day}/${year.slice(-2)}`;
}

export default async function Blog({ searchParams }) {
  const params = await searchParams;
  const selectedIndex = getPostIndex(params?.post);
  const selectedPost = blogs[selectedIndex];
  const paragraphs = selectedPost.text.split("\n\n");

  return (
    <main className={`main ${styles.main}`}>
      <p className={styles.archive}>Archive</p>

      <div className={styles.meta}>
        <p>{formatDate(selectedPost.date)}</p>
        <span>-</span>
        <p>{selectedPost.title}</p>
      </div>

      <ul className={styles.postList}>
        {blogs.map((post, index) => (
          <li key={`${post.date}-${post.title}`}>
            <Link
              className={`${styles.postLink} ${
                selectedIndex === index ? styles.activePost : ""
              }`}
              href={`/blog?post=${index}`}
              title={post.title}
            >
              <span className={styles.postTitle}>{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <article className={styles.post}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </main>
  );
}

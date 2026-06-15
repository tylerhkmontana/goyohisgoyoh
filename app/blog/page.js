import Link from "next/link";
import RichText from "@/components/rich-text";
import styles from "./blog.module.css";
import { getBlogs } from "@/lib/contentful";

function getPostIndex(postParam, postCount) {
  const value = Array.isArray(postParam) ? postParam[0] : postParam;
  const index = Number(value);

  if (!Number.isInteger(index) || index < 0 || index >= postCount) {
    return 0;
  }

  return index;
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${month}/${day}/${year.slice(-2)}`;
}

export default async function Blog({ searchParams }) {
  const blogs = await getBlogs();
  const params = await searchParams;
  const selectedIndex = getPostIndex(params?.post, blogs.length);
  const selectedPost = blogs[selectedIndex];

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
        <RichText
          document={selectedPost.text}
          assets={selectedPost.assets}
          classNames={{ asset: styles.postAsset }}
        />
      </article>
    </main>
  );
}

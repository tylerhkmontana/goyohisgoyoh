import Link from "next/link";
import RichText from "@/components/rich-text";
import styles from "./blog.module.css";
import {
  BLOG_SORT_OPTIONS,
  getBlogHref,
  normalizeBlogSort,
  sortBlogs,
} from "@/lib/blog-navigation";
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
  const sort = normalizeBlogSort(params?.sort);
  const sortedBlogs = sortBlogs(blogs, sort);
  const selectedIndex = getPostIndex(params?.post, sortedBlogs.length);
  const selectedPost = sortedBlogs[selectedIndex];

  return (
    <main className={`main ${styles.main}`}>
      <p className={styles.archive}>Archive</p>

      {selectedPost ? (
        <div className={styles.meta}>
          <p>{formatDate(selectedPost.date)}</p>
          <span>-</span>
          <p>{selectedPost.title}</p>
        </div>
      ) : null}

      <div className={styles.sortNav} aria-label="Sort blog posts">
        {BLOG_SORT_OPTIONS.map((option) => (
          <Link
            className={sort === option.value ? styles.activePost : ""}
            key={option.value}
            href={getBlogHref({ sort: option.value })}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <ul className={styles.postList}>
        {sortedBlogs.map((post, index) => (
          <li key={`${post.date}-${post.title}`}>
            <Link
              className={`${styles.postLink} ${
                selectedIndex === index ? styles.activePost : ""
              }`}
              href={getBlogHref({ post: index, sort })}
              title={post.title}
            >
              <span className={styles.postTitle}>{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      {selectedPost ? (
        <article className={styles.post}>
          <RichText
            document={selectedPost.text}
            assets={selectedPost.assets}
            classNames={{ asset: styles.postAsset }}
          />
        </article>
      ) : null}
    </main>
  );
}

import styles from "./contact.module.css";
import { getSocialLinks } from "@/lib/contentful";

const contactLinks = [
  {
    title: "BYGOYOH@GMAIL.COM",
    link: "mailto:bygoyoh@gmail.com",
  },
  {
    title: "INSTAGRAM",
    link: "https://www.instagram.com/",
  },
  {
    title: "X",
    link: "https://x.com/",
  },
];

export default async function Contact() {
  const socialLinks = await getSocialLinks();
  const links = socialLinks.length ? socialLinks : contactLinks;

  return (
    <main className={`main ${styles.contact}`}>
      <p className={styles.message}>say hi anytime-!</p>

      <ul className={styles.linkList}>
        {links.map((link) => (
          <li className={styles.linkItem} key={link.title}>
            <span className={styles.marker} aria-hidden="true" />
            <a href={link.link} target="_blank">{link.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

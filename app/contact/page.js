import styles from "./contact.module.css";

const contactLinks = [
  {
    label: "BYGOYOH@GMAIL.COM",
    href: "mailto:bygoyoh@gmail.com",
  },
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/",
  },
  {
    label: "X",
    href: "https://x.com/",
  },
];

export default function Contact() {
  return (
    <main className={`main ${styles.contact}`}>
      <p className={styles.message}>say hi anytime~!</p>

      <ul className={styles.linkList}>
        {contactLinks.map((link) => (
          <li className={styles.linkItem} key={link.label}>
            <span className={styles.marker} aria-hidden="true" />
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

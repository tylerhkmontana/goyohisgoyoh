"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TopNav.module.css";

const links = [
  { href: "/about", label: "ABOUT", exact: true },
  { href: "/works", label: "WORKS" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT", exact: true },
];

function isActive(pathname, href, exact) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className={pathname === "/" ? styles.inactive  : styles.topNav}>
      {links.map((link, index) => (
        <span className={styles.topNavItem} key={link.href}>
          <Link
            className={isActive(pathname, link.href, link.exact) ? styles.active : undefined}
            href={link.href}
          >
            {link.label}
          </Link>
          {index < links.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  );
}

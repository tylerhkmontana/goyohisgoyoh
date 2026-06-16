"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./LoadedImage.module.css";

export default function LoadedImage({
  alt,
  className,
  fill = false,
  height,
  priority = false,
  sizes,
  src,
  width,
  wrapperClassName,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageProps = fill
    ? { fill: true, sizes }
    : { width: width || 1200, height: height || 800, sizes };

  return (
    <span
      className={`${styles.wrapper} ${fill ? styles.fillWrapper : ""} ${
        isLoaded ? styles.loaded : ""
      } ${wrapperClassName || ""}`}
    >
      {!isLoaded ? <span className={styles.loader} aria-hidden="true" /> : null}
      <Image
        src={src}
        alt={alt}
        priority={priority}
        className={`${styles.image} ${className || ""}`}
        onLoad={() => setIsLoaded(true)}
        {...imageProps}
      />
    </span>
  );
}

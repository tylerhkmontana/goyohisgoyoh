"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import LoadedImage from "./loaded-image";
import styles from "./ImageDetail.module.css";

export default function ImageDetail({
  src,
  alt,
  title,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className,
  imageClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const imageName = title || alt;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const imageProps = fill
    ? { fill: true, sizes }
    : { width: width || 1200, height: height || 800, sizes };
  const modal =
    isOpen && typeof document !== "undefined" ? (
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={imageName ? titleId : undefined}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          aria-label="Close image detail"
        >
          X
        </button>

        <div className={styles.modalImage}>
          <LoadedImage
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className={styles.expandedImage}
          />
        </div>

        {imageName ? (
          <p id={titleId} className={styles.caption}>
            {imageName}
          </p>
        ) : null}
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        className={`${styles.trigger} ${className || ""}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Open ${imageName || "image"} detail`}
      >
        <LoadedImage
          src={src}
          alt={alt}
          priority={priority}
          className={imageClassName}
          {...imageProps}
        />
      </button>

      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}

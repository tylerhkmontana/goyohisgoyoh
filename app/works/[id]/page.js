import styles from './work.module.css'
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getWorks } from '@/lib/contentful';

function renderTextNode(node, key) {
    let content = node.value;

    for (const mark of node.marks || []) {
        if (mark.type === 'bold') {
            content = <strong>{content}</strong>;
        }

        if (mark.type === 'italic') {
            content = <em>{content}</em>;
        }

        if (mark.type === 'underline') {
            content = <u>{content}</u>;
        }

        if (mark.type === 'code') {
            content = <code>{content}</code>;
        }
    }

    return <span key={key}>{content}</span>;
}

function renderInlineNode(node, key) {
    if (node.nodeType === 'text') {
        return renderTextNode(node, key);
    }

    const children = (node.content || []).map((child, index) =>
        renderInlineNode(child, `${key}-${index}`)
    );

    if (node.nodeType === 'hyperlink') {
        return (
            <a key={key} href={node.data.uri} target="_blank" rel="noreferrer">
                {children}
            </a>
        );
    }

    return <span key={key}>{children}</span>;
}

function hasText(node) {
    if (node.value?.trim()) {
        return true;
    }

    return (node.content || []).some(hasText);
}

function renderBlockChildren(node, assets, key) {
    return (node.content || []).map((child, index) =>
        renderRichTextNode(child, assets, `${key}-${index}`)
    );
}

function renderRichTextNode(node, assets, key) {
    if (node.nodeType === 'paragraph') {
        const children = (node.content || []).map((child, index) =>
            renderInlineNode(child, `${key}-${index}`)
        );

        return hasText(node) ? <p key={key}>{children}</p> : null;
    }

    if (node.nodeType === 'heading-1') {
        return <h2 key={key}>{node.content?.map((child, index) => renderInlineNode(child, `${key}-${index}`))}</h2>;
    }

    if (node.nodeType === 'heading-2') {
        return <h3 key={key}>{node.content?.map((child, index) => renderInlineNode(child, `${key}-${index}`))}</h3>;
    }

    if (node.nodeType === 'heading-3') {
        return <h4 key={key}>{node.content?.map((child, index) => renderInlineNode(child, `${key}-${index}`))}</h4>;
    }

    if (node.nodeType === 'unordered-list') {
        return <ul key={key}>{renderBlockChildren(node, assets, key)}</ul>;
    }

    if (node.nodeType === 'ordered-list') {
        return <ol key={key}>{renderBlockChildren(node, assets, key)}</ol>;
    }

    if (node.nodeType === 'list-item') {
        return <li key={key}>{renderBlockChildren(node, assets, key)}</li>;
    }

    if (node.nodeType === 'blockquote') {
        return <blockquote key={key}>{renderBlockChildren(node, assets, key)}</blockquote>;
    }

    if (node.nodeType === 'embedded-asset-block') {
        const assetId = node.data?.target?.sys?.id;
        const asset = assets?.[assetId];

        if (!asset?.src) {
            return null;
        }

        return (
            <figure key={key} className={styles.detailAsset}>
                <Image
                    src={asset.src}
                    width={asset.width || 1200}
                    height={asset.height || 800}
                    alt={asset.description || asset.title || ''}
                />
                {asset.title ? <figcaption>{asset.title}</figcaption> : null}
            </figure>
        );
    }

    return null;
}

function RichText({ document, assets }) {
    if (!document?.content?.length) {
        return null;
    }

    return document.content.map((node, index) =>
        renderRichTextNode(node, assets, `detail-${index}`)
    );
}

export default async function Work({ params }) {
      let { id } = await params;
      const works = await getWorks();
      const work = works.find(w => w.id === id)

      if (!work) {
        notFound();
      }

    return (
        <main className={`main ${styles.main}`}>
            <section className={styles.summary}>
                <div className={styles.imageContainer}>
                    <Image src={work.src} fill alt={work.title}/>
                </div>

                <div className={styles.info}>
                    <h4>{work.title}</h4>
                    <h6>{work.year}</h6>
                    <p>{work.description}</p>
                </div>
            </section>

            {work.details ? (
                <section className={styles.details}>
                    <RichText document={work.details} assets={work.assets} />
                </section>
            ) : null}
        </main>
    )
}

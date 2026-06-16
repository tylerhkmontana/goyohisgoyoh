import LoadedImage from "./loaded-image";

function renderTextNode(node, key) {
  let content = node.value;

  for (const mark of node.marks || []) {
    if (mark.type === "bold") {
      content = <strong>{content}</strong>;
    }

    if (mark.type === "italic") {
      content = <em>{content}</em>;
    }

    if (mark.type === "underline") {
      content = <u>{content}</u>;
    }

    if (mark.type === "code") {
      content = <code>{content}</code>;
    }
  }

  return <span key={key}>{content}</span>;
}

function renderInlineNode(node, key) {
  if (node.nodeType === "text") {
    return renderTextNode(node, key);
  }

  const children = (node.content || []).map((child, index) =>
    renderInlineNode(child, `${key}-${index}`)
  );

  if (node.nodeType === "hyperlink") {
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

function renderBlockChildren(node, assets, classNames, renderAsset, key) {
  return (node.content || []).map((child, index) =>
    renderRichTextNode(child, assets, classNames, renderAsset, `${key}-${index}`)
  );
}

function renderHeading(node, Tag, key) {
  return (
    <Tag key={key}>
      {node.content?.map((child, index) =>
        renderInlineNode(child, `${key}-${index}`)
      )}
    </Tag>
  );
}

function renderRichTextNode(node, assets, classNames, renderAsset, key) {
  if (node.nodeType === "paragraph") {
    const children = (node.content || []).map((child, index) =>
      renderInlineNode(child, `${key}-${index}`)
    );

    return hasText(node) ? <p key={key}>{children}</p> : null;
  }

  if (node.nodeType === "heading-1") {
    return renderHeading(node, "h2", key);
  }

  if (node.nodeType === "heading-2") {
    return renderHeading(node, "h3", key);
  }

  if (node.nodeType === "heading-3") {
    return renderHeading(node, "h4", key);
  }

  if (node.nodeType === "heading-4") {
    return renderHeading(node, "h5", key);
  }

  if (node.nodeType === "heading-5" || node.nodeType === "heading-6") {
    return renderHeading(node, "h6", key);
  }

  if (node.nodeType === "unordered-list") {
    return (
      <ul key={key}>
        {renderBlockChildren(node, assets, classNames, renderAsset, key)}
      </ul>
    );
  }

  if (node.nodeType === "ordered-list") {
    return (
      <ol key={key}>
        {renderBlockChildren(node, assets, classNames, renderAsset, key)}
      </ol>
    );
  }

  if (node.nodeType === "list-item") {
    return (
      <li key={key}>
        {renderBlockChildren(node, assets, classNames, renderAsset, key)}
      </li>
    );
  }

  if (node.nodeType === "blockquote") {
    return (
      <blockquote key={key}>
        {renderBlockChildren(node, assets, classNames, renderAsset, key)}
      </blockquote>
    );
  }

  if (node.nodeType === "hr") {
    return <hr key={key} />;
  }

  if (node.nodeType === "embedded-asset-block") {
    const assetId = node.data?.target?.sys?.id;
    const asset = assets?.[assetId];

    if (!asset?.src) {
      return null;
    }

    if (renderAsset) {
      return renderAsset({ asset, key, className: classNames?.asset });
    }

    return (
      <figure key={key} className={classNames?.asset}>
        <LoadedImage
          src={asset.src}
          width={asset.width || 1200}
          height={asset.height || 800}
          alt={asset.description || asset.title || ""}
        />
        {asset.title ? <figcaption>{asset.title}</figcaption> : null}
      </figure>
    );
  }

  return null;
}

export default function RichText({ document, assets, classNames, renderAsset }) {
  if (!document?.content?.length) {
    return null;
  }

  return document.content.map((node, index) =>
    renderRichTextNode(
      node,
      assets,
      classNames,
      renderAsset,
      `rich-text-${index}`
    )
  );
}

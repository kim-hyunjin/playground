export default function remarkNormalizeDocumentHeadings() {
  return (tree) => {
    if (!Array.isArray(tree?.children)) return;

    let documentTitleRemoved = false;

    tree.children = tree.children.filter((node) => {
      if (node?.type !== 'heading' || node.depth !== 1) return true;

      if (!documentTitleRemoved) {
        documentTitleRemoved = true;
        return false;
      }

      node.depth = 2;
      return true;
    });
  };
}

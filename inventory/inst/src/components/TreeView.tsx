import React from "react";

type TreeNode = {
  title: string;
  col1?: string;
  col2?: string;
  children?: TreeNode[];
};

export const TreeView: React.FC<{ data: TreeNode[] }> = ({ data }) => (
  <ul style={{ listStyle: "none", paddingLeft: 16, margin: 0 }}>
    {data.map((node, idx) => (
      <li key={idx} style={{ marginBottom: 4 }}>
        <span>
          <strong>{node.title}</strong>
          {node.col1 && <> | {node.col1}</>}
          {node.col2 && <> | {node.col2}</>}
        </span>
        {node.children && node.children.length > 0 && (
          <TreeView data={node.children} />
        )}
      </li>
    ))}
  </ul>
);
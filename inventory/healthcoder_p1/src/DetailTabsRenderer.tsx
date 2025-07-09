import React, { useState } from "react";

export const DetailTabsRenderer = (props: any) => {
  const [tab, setTab] = useState<"details" | "history">("details");
  const data = props.data;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <button
          style={{
            marginRight: 8,
            background: tab === "details" ? "#1976d2" : "#eee",
            color: tab === "details" ? "#fff" : "#222",
            border: "none",
            borderRadius: 4,
            padding: "6px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setTab("details")}
        >
          Details
        </button>
        <button
          style={{
            background: tab === "history" ? "#1976d2" : "#eee",
            color: tab === "history" ? "#fff" : "#222",
            border: "none",
            borderRadius: 4,
            padding: "6px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>
      {tab === "details" ? (
        // You can use your tree grid here, or any other details
        <div>
          <strong>Details:</strong>
          <pre style={{ background: "#f8f8f8", padding: 8 }}>
            {JSON.stringify(data.variantDetails, null, 2)}
          </pre>
        </div>
      ) : (
        <div>
          <strong>History:</strong>
          <div>No history data (demo)</div>
        </div>
      )}
    </div>
  );
};
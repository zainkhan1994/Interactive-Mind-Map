
import React, { useMemo, useState } from "react";

function ChevronDown({ size = 12 }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>▼</span>;
}

function ChevronRight({ size = 12 }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>▶</span>;
}

function NetworkIcon() {
  return <span className="inline mr-1">◇</span>;
}

function CalendarIcon() {
  return <span className="inline mr-1">□</span>;
}

// Full array of raw nodes is expected to be loaded here.
// But to prevent hitting token limit while writing string,
// let's fetch constants from an actual file.
import { LifeNodeTogglePrototype } from "./AppContent";

export default LifeNodeTogglePrototype;

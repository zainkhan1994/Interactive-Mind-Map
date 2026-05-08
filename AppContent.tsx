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

import { rawNodes } from "./hugeJSON.ts"; // we will put the json here

const palette = {
  black: "bg-black text-white border-black",
  red: "bg-red-500 text-white border-red-500",
  green: "bg-green-800 text-white border-green-800",
  yellow: "bg-yellow-300 text-black border-yellow-300",
  default: "bg-black text-white border-black",
};

function buildTree(nodes) {
  const map = new Map(nodes.map((n) => [n.uid, { ...n, children: [] }]));
  const roots = [];
  map.forEach((node) => {
    if (node.parentUid === null || !map.has(node.parentUid)) roots.push(node);
    else map.get(node.parentUid).children.push(node);
  });
  return roots;
}

function collectIds(node) {
  return [node.uid, ...node.children.flatMap(collectIds)];
}

function SquareNode({ node, depth, collapsed, toggle }) {
  const hasChildren = node.children.length > 0;
  const colorClass = palette[node.color || "default"];
  return (
    <div className="flex flex-col items-center relative">
      {depth > 0 && <div className="h-8 w-px bg-slate-300" />}
      <button
        onClick={() => hasChildren && toggle(node.uid)}
        className={`min-w-[86px] min-h-[56px] rounded-lg border shadow-sm px-3 py-2 text-[10px] font-bold uppercase tracking-tight flex items-center justify-center gap-1 ${colorClass}`}
      >
        {hasChildren ? collapsed.has(node.uid) ? <ChevronRight size={12} /> : <ChevronDown size={12} /> : null}
        <span>{node.name}</span>
      </button>
      {hasChildren && !collapsed.has(node.uid) && (
        <div className="flex flex-col items-center">
          <div className="h-8 w-px bg-slate-300" />
          <div className="flex gap-5 items-start border-t border-slate-300 pt-0">
            {node.children.map((child) => (
              <SquareNode key={child.uid} node={child} depth={depth + 1} collapsed={collapsed} toggle={toggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LifeNodeTogglePrototype() {
  const roots = useMemo(() => buildTree(rawNodes), []);
  const [collapsed, setCollapsed] = useState(new Set(rawNodes.filter((n) => n.parentUid !== null).map((n) => n.uid)));
  const [mode, setMode] = useState("map");
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const containerRef = React.useRef(null);
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode !== "map") return;
      if (e.key === '=' || e.key === '+') {
        setZoom(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }));
      } else if (e.key === '-' || e.key === '_') {
        setZoom(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.1) }));
      } else if (e.key === '0') {
        setZoom({ scale: 1, x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const handlePointerDown = (e) => {
    if (mode !== "map") return;
    // only if they click the container background, not buttons
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - zoom.x, y: e.clientY - zoom.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || mode !== "map") return;
    e.preventDefault();
    setZoom(prev => ({ ...prev, x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }));
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e) => {
    if (mode !== "map") return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(prev => {
        const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
        return { ...prev, scale: Math.max(0.1, Math.min(5, prev.scale * scaleChange)) };
      });
    } else {
      setZoom(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const toggle = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const showOnly = (rootId) => {
    const allIds = roots.flatMap(collectIds);
    const root = roots.find((r) => r.id === rootId);
    const keepOpen = new Set(allIds);
    if (root) collectIds(root).forEach((id) => keepOpen.delete(id));
    setCollapsed(keepOpen);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 p-3 flex flex-wrap items-center gap-2 max-w-[100vw]">
        <button onClick={() => setMode("map")} className={`rounded-lg px-3 py-2 text-sm font-semibold border transition-colors ${mode === "map" ? "bg-black text-white" : "bg-white hover:bg-slate-50"}`}>
          <NetworkIcon /> Life Map
        </button>
        <button onClick={() => setMode("agenda")} className={`rounded-lg px-3 py-2 text-sm font-semibold border transition-colors ${mode === "agenda" ? "bg-black text-white" : "bg-white hover:bg-slate-50"}`}>
          <CalendarIcon /> Everyday Agenda
        </button>
        <div className="w-px h-6 bg-slate-300 mx-2" />
        <button onClick={() => setCollapsed(new Set())} className="rounded-lg px-3 py-2 text-sm border bg-white hover:bg-slate-50 transition-colors shadow-sm">Expand All</button>
        <button onClick={() => setCollapsed(new Set(rawNodes.map((n) => n.uid)))} className="rounded-lg px-3 py-2 text-sm border bg-white hover:bg-slate-50 transition-colors shadow-sm">Collapse All</button>
        <div className="w-px h-6 bg-slate-300 mx-2" />
        <button onClick={() => showOnly(500)} className="rounded-lg px-3 py-2 text-sm font-medium border bg-yellow-100 hover:bg-yellow-200 transition-colors border-yellow-200 text-yellow-900 shadow-sm">Health</button>
        <button onClick={() => showOnly(600)} className="rounded-lg px-3 py-2 text-sm font-medium border bg-green-100 hover:bg-green-200 transition-colors border-green-200 text-green-900 shadow-sm">Work</button>
        <button onClick={() => showOnly(1)} className="rounded-lg px-3 py-2 text-sm font-medium border bg-red-100 hover:bg-red-200 transition-colors border-red-200 text-red-900 shadow-sm">Personal</button>
        <button onClick={() => showOnly(700)} className="rounded-lg px-3 py-2 text-sm font-medium border bg-slate-200 hover:bg-slate-300 transition-colors border-slate-300 text-slate-900 shadow-sm">Projects</button>
        {mode === "map" && (
          <>
            <div className="w-px h-6 bg-slate-300 mx-2" />
            <span className="text-xs text-slate-500 mr-2 flex items-center">
              Use + / - to zoom, 0 to reset. Drag to pan.
            </span>
            <button onClick={() => setZoom(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }))} className="px-2 py-1 text-sm border bg-white hover:bg-slate-50 rounded shadow-sm">+</button>
            <button onClick={() => setZoom({ scale: 1, x: 0, y: 0 })} className="px-2 py-1 text-sm border bg-white hover:bg-slate-50 rounded shadow-sm">1x</button>
            <button onClick={() => setZoom(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.1) }))} className="px-2 py-1 text-sm border bg-white hover:bg-slate-50 rounded shadow-sm">-</button>
          </>
        )}
      </div>

      {mode === "agenda" ? (
        <div className="p-8 flex-1 overflow-auto w-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Everyday Agenda</h1>
            <div className="grid gap-4">
              {[
                { id: 1, text: "Health: schedule labs", tags: ["Health"], color: "bg-yellow-100 text-yellow-800" },
                { id: 2, text: "Work: review R-Cubed pipeline", tags: ["Work"], color: "bg-green-100 text-green-800" },
                { id: 3, text: "Finance: check payment due dates", tags: ["Personal", "Finance"], color: "bg-red-100 text-red-800" },
                { id: 4, text: "Projects: update SpaceApps notes", tags: ["Projects"], color: "bg-slate-200 text-slate-800" }
              ].map((task) => (
                <div key={task.id} className="rounded-xl border border-slate-200 p-5 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">{task.text}</span>
                    <div className="flex gap-2">
                      {task.tags.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-md ${task.color}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today</span>
                    <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <div className="w-3 h-3 rounded-sm border-2 border-slate-400"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex-1 w-full relative overflow-hidden touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: `${24 * zoom.scale}px ${24 * zoom.scale}px`,
            backgroundPosition: `${zoom.x}px ${zoom.y}px`,
            cursor: isDragging.current ? 'grabbing' : 'grab'
          }}
        >
          <div 
            className="absolute origin-top-left flex gap-16 items-start justify-center"
            style={{ 
              transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
              minWidth: 'max-content',
              padding: '48px'
            }}
          >
            {roots.map((root) => (
              <SquareNode key={root.uid} node={root} depth={0} collapsed={collapsed} toggle={toggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

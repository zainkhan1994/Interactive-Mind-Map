
import React, { useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { RawNode, MindMapNode, D3HierarchyNode } from './types';
import { initialData } from './constants';
import Node from './components/Node';
import Edge from './components/Edge';

const App: React.FC = () => {
  const [toggledNodes, setToggledNodes] = useState<Set<string>>(new Set());
  
  const handleNodeToggle = useCallback((nodeId: string) => {
    setToggledNodes(prev => {
      const newToggled = new Set(prev);
      if (newToggled.has(nodeId)) {
        newToggled.delete(nodeId);
      } else {
        newToggled.add(nodeId);
      }
      return newToggled;
    });
  }, []);

  const { nodes, links } = useMemo(() => {
    // 1. Data Cleaning
    const uniqueData: RawNode[] = [];
    const seenIds = new Set<number>();
    for (const item of initialData) {
      if (!seenIds.has(item.id)) {
        uniqueData.push(item);
        seenIds.add(item.id);
      }
    }
    
    // 2. Add root
    const dataWithRoot: (RawNode | {id: number; name: string; description: string; type: 'folder'; parentId: null; category?: any})[] = [
        { id: 0, name: "Zain's Mind Map", description: "Central Hub", type: 'folder', parentId: null },
        ...uniqueData.map(d => (d.parentId === null ? { ...d, parentId: 0 } : d))
    ];

    // 3. Create hierarchy
    const root = d3.stratify<any>()
        .id(d => d.id)
        .parentId(d => d.parentId)
        (dataWithRoot) as d3.HierarchyNode<MindMapNode>;

    // 4. Augment and propagate categories/colors (on full tree)
    root.each((node: any) => {
        node.data.id = node.id;
        node.data.name = node.data.name || node.id;
        node.data.type = node.data.type;
        node.data.description = node.data.description;
        node.data.icon = node.data.icon;
        
        // Propagate category down from parents
        if (!node.data.category && node.parent?.data.category) {
            node.data.category = node.parent.data.category;
        }

        // Color zoning logic
        switch(node.data.category) {
            case 'health': node.data.color = 'text-red-400'; node.data.bg = 'fill-red-500/20 stroke-red-400'; node.data.hover = 'hover:fill-red-500/40 hover:stroke-red-300'; break;
            case 'work': node.data.color = 'text-blue-400'; node.data.bg = 'fill-blue-500/20 stroke-blue-400'; node.data.hover = 'hover:fill-blue-500/40 hover:stroke-blue-300'; break;
            case 'personal': node.data.color = 'text-emerald-400'; node.data.bg = 'fill-emerald-500/20 stroke-emerald-400'; node.data.hover = 'hover:fill-emerald-500/40 hover:stroke-emerald-300'; break;
            case 'projects': node.data.color = 'text-purple-400'; node.data.bg = 'fill-purple-500/20 stroke-purple-400'; node.data.hover = 'hover:fill-purple-500/40 hover:stroke-purple-300'; break;
            default: node.data.color = 'text-sky-400'; node.data.bg = 'fill-sky-500/20 stroke-sky-400'; node.data.hover = 'hover:fill-sky-500/40 hover:stroke-sky-300'; break;
        }
    });

    // 5. Create radial layout on the FULL tree so positions are fixed
    const radius = 600;
    const treeLayout = d3.tree<MindMapNode>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
    
    const hierarchy = treeLayout(root as d3.HierarchyNode<MindMapNode>);
    
    // 6. Filter visible nodes relying on toggledNodes
    const visibleNodes: D3HierarchyNode[] = [];
    const visibleLinks: d3.HierarchyPointLink<MindMapNode>[] = [];

    const traverse = (node: D3HierarchyNode) => {
        visibleNodes.push(node);
        // We consider it toggled (collapsed) if the ID is in toggledNodes
        const isCollapsed = toggledNodes.has(node.id!);
        
        // For UI purposes, node._children means it has hidden children
        if (isCollapsed && node.children) {
            node._children = node.children;
        } else {
            node._children = undefined;
        }

        if (!isCollapsed && node.children) {
            node.children.forEach(child => {
                visibleLinks.push({ source: node, target: child as D3HierarchyNode });
                traverse(child as D3HierarchyNode);
            });
        }
    };

    traverse(hierarchy as D3HierarchyNode);

    return { nodes: visibleNodes, links: visibleLinks };
  }, [toggledNodes]);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const gRef = React.useRef<SVGGElement>(null);
  const zoomBehaviorRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  React.useEffect(() => {
    if (svgRef.current && gRef.current) {
      const svg = d3.select(svgRef.current);
      const g = d3.select(gRef.current);

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      zoomBehaviorRef.current = zoom;
      svg.call(zoom);
      
      // Auto-fit or recenter
      // svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));
    }
  }, []);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy, 1 / 1.3);
    }
  };

  const handleZoomReset = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleZoomReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200 font-sans">
      <header className="flex-shrink-0 bg-gray-900 p-4 shadow-lg border-b border-gray-800 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-gray-100">Radial Context Matrix</h1>
          <p className="text-sm text-gray-400 mt-1">Intent-Based Architecture | At-A-Glance Pattern Recognition</p>
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex gap-4 pr-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-sm text-gray-300">Personal</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><span className="text-sm text-gray-300">Health</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className="text-sm text-gray-300">Work</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-400"></div><span className="text-sm text-gray-300">Projects</span></div>
            </div>
            <div className="flex gap-2 justify-end pr-6">
               <button onClick={handleZoomIn} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm rounded-md transition-colors" title="Zoom In (+)">+</button>
               <button onClick={handleZoomOut} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm rounded-md transition-colors" title="Zoom Out (-)">-</button>
               <button onClick={handleZoomReset} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm rounded-md transition-colors" title="Reset View (0)">Reset View</button>
            </div>
        </div>
      </header>
      <main className="flex-grow w-full h-full relative overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing w-full h-full">
          {/* We will translate this group by 50% 50% to center the radial layout, then apply d3-zoom on top of it or inside it */}
          <g transform={`translate(${window.innerWidth / 2}, ${window.innerHeight / 2 - 50})`}>
            <g ref={gRef}>
              {links.map((link, i) => (
                <Edge key={i} link={link} />
              ))}
              {nodes.map((node) => (
                <Node key={node.id} node={node} onToggle={handleNodeToggle} />
              ))}
            </g>
          </g>
        </svg>
      </main>
    </div>
  );
};

export default App;

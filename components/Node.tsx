import React from 'react';
import type { D3HierarchyNode } from '../types';
import { icons } from 'lucide-react';
import { FolderIcon, FileIcon } from './icons';

interface NodeProps {
  node: D3HierarchyNode;
  onToggle: (id: string) => void;
}

const Node: React.FC<NodeProps> = ({ node, onToggle }) => {
  const isFolder = node.data.type === 'folder';
  const hasChildren = !!node.children || !!node._children;
  const isToggled = !!node._children;

  const handleToggle = () => {
    if (isFolder && hasChildren) {
      onToggle(node.id!);
    }
  };

  const cursor = isFolder && hasChildren ? 'cursor-pointer' : 'cursor-default';

  // Radial transforms: node.x is Angle, node.y is Radius
  // Convert angle/radius to cartesian coordinates for SVG
  const angle = node.x - Math.PI / 2;
  const cartesianX = Math.cos(angle) * node.y;
  const cartesianY = Math.sin(angle) * node.y;

  // Compute label anchor and rotation for outer nodes to radiate outwards
  const isLeft = node.x > Math.PI;
  const labelX = isLeft ? -20 : 20;
  const textAnchor = isLeft ? 'end' : 'start';
  
  // Optionally rotate the text:
  let textAngle = (node.x * 180) / Math.PI - 90;
  if (isLeft) textAngle += 180;

  // Icon Resolution
  const LucideIcon = node.data.icon ? (icons as any)[Object.keys(icons).find(name => name.toLowerCase() === node.data.icon?.replace(/-/g, '').toLowerCase()) as string] : null;

  return (
    <g transform={`translate(${cartesianX},${cartesianY})`} className="transition-transform duration-300 ease-in-out group">
      <title>{node.data.description}</title>
      <circle
        r={14}
        className={`stroke-2 transition-all duration-200 ${node.data.bg || 'fill-gray-800 stroke-gray-600'} ${node.data.hover || 'hover:fill-gray-700 hover:stroke-gray-500'} ${cursor}`}
        onClick={handleToggle}
      />
      <g transform="translate(-8, -8)" className={`pointer-events-none ${node.data.color || 'text-gray-400'}`}>
        {LucideIcon ? (
           <LucideIcon size={16} strokeWidth={2.5} />
        ) : (
           isFolder ? <FolderIcon isToggled={isToggled} /> : <FileIcon />
        )}
      </g>
      <g transform={`rotate(${textAngle})`}>
          <text
            dy="0.31em"
            x={labelX}
            textAnchor={textAnchor}
            className={`text-sm font-medium select-none ${node.data.color ? 'font-bold flex drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] fill-current '+node.data.color : 'fill-gray-200'}`}
          >
            {node.data.name}
          </text>
      </g>
    </g>
  );
};

export default Node;

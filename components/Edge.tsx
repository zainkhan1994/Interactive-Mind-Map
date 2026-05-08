import React from 'react';
import * as d3 from 'd3';
import type { MindMapNode } from '../types';

interface EdgeProps {
  link: d3.HierarchyPointLink<MindMapNode>;
}

const Edge: React.FC<EdgeProps> = ({ link }) => {
  // Use linkRadial for radial layout
  // angle needs to be in radians, radius is actual length
  const linkGenerator = d3.linkRadial<any, any>()
    .angle(d => d.x)
    .radius(d => d.y);

  const pathData = linkGenerator(link);

  return (
    <path
      d={pathData || ''}
      className={`fill-none stroke-1 transition-all duration-300 ease-in-out opacity-40 ${link.target.data.color?.replace('text-', 'stroke-') || 'stroke-gray-600'}`}
    />
  );
};

export default Edge;

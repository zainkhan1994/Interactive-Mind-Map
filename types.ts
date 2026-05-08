import type { HierarchyPointNode, HierarchyNode } from 'd3-hierarchy';

export interface RawNode {
  id: string;
  name: string;
  description: string;
  type: 'folder' | 'file';
  parentId: string | null;
  icon?: string;
  category?: 'personal' | 'health' | 'work' | 'projects';
}

export interface MindMapNode {
  id: string;
  name: string;
  description: string;
  type: 'folder' | 'file';
  icon?: string;
  category?: 'personal' | 'health' | 'work' | 'projects';
  color?: string; // We'll compute this based on category
  children?: MindMapNode[];
  _children?: MindMapNode[];
}

export type D3HierarchyNode = HierarchyPointNode<MindMapNode> & {
  _children?: HierarchyNode<MindMapNode>[];
};

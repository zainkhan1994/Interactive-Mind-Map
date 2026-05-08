import * as d3 from 'd3';
import type { RawNode } from './types';
import blueprintCsv from './blueprint_complete.csv?raw';

const CATEGORY_BY_ROOT: Record<string, RawNode['category']> = {
  'P - Personal': 'personal',
  'H - Health': 'health',
  'W - Work': 'work',
  'P - Projects': 'projects'
};

const normalizeName = (value: string) => value.replace(/_/g, ' ').trim();

const parseBlueprint = (): RawNode[] => {
  const rows = d3.csvParse(blueprintCsv);
  const nodes = new Map<string, RawNode>();

  rows.forEach((row) => {
    const hierarchyPath = row.hierarchyPath?.trim();
    if (!hierarchyPath) {
      return;
    }

    const segments = hierarchyPath.split(' > ').map((segment) => segment.trim()).filter(Boolean);
    if (segments.length === 0) {
      return;
    }

    const parentPath = segments.length > 1 ? segments.slice(0, -1).join(' > ') : null;
    const name = row.name?.trim() || segments[segments.length - 1];
    const description = row.description?.trim() || '';
    const type = row.type?.trim() === 'folder' ? 'folder' : 'file';
    const category = CATEGORY_BY_ROOT[segments[0]];

    nodes.set(hierarchyPath, {
      id: hierarchyPath,
      name: normalizeName(name),
      description,
      type,
      parentId: parentPath,
      category
    });
  });

  return Array.from(nodes.values());
};

export const blueprintData: RawNode[] = parseBlueprint();

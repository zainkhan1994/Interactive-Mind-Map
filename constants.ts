import * as d3 from 'd3';
import type { RawNode } from './types';
import blueprintCsv from './blueprint_complete.csv?raw';

const CATEGORY_BY_ROOT: Record<string, RawNode['category']> = {
  'P - Personal': 'personal',
  'H - Health': 'health',
  'W - Work': 'work',
  'P - Projects': 'projects'
};

const HIERARCHY_DELIMITER = ' > ';
const DEFAULT_CATEGORY: RawNode['category'] = 'personal';

const formatDisplayName = (value: string) => value.replace(/_/g, ' ').trim();

const parseBlueprint = (): RawNode[] => {
  let rows: d3.DSVRowArray<string>;
  try {
    rows = d3.csvParse(blueprintCsv);
  } catch (error) {
    console.warn('Failed to parse blueprint CSV data.', error);
    return [];
  }

  if (rows.length === 0) {
    return [];
  }
  const nodes = new Map<string, RawNode>();
  const unknownRoots = new Set<string>();

  rows.forEach((row) => {
    const hierarchyPath = row.hierarchyPath?.trim();
    if (!hierarchyPath) {
      return;
    }

    const segments = hierarchyPath.split(HIERARCHY_DELIMITER).map((segment) => segment.trim()).filter(Boolean);
    if (segments.length === 0) {
      return;
    }

    const parentPath = segments.length > 1 ? segments.slice(0, -1).join(HIERARCHY_DELIMITER) : null;
    const name = row.name?.trim() || segments[segments.length - 1];
    const description = row.description?.trim() || '';
    const type = row.type?.trim() === 'folder' ? 'folder' : 'file';
    const rootSegment = segments[0];
    const mappedCategory = CATEGORY_BY_ROOT[rootSegment];
    const category = mappedCategory ?? DEFAULT_CATEGORY;
    if (!mappedCategory && !unknownRoots.has(rootSegment)) {
      console.warn(`Unknown root category "${rootSegment}" in blueprint CSV.`);
      unknownRoots.add(rootSegment);
    }

    nodes.set(hierarchyPath, {
      id: hierarchyPath,
      name: formatDisplayName(name),
      description,
      type,
      parentId: parentPath,
      category
    });
  });

  return Array.from(nodes.values());
};

export const blueprintData: RawNode[] = parseBlueprint();

export type NotebookSource = string | string[];

export interface NotebookMetadata {
  title?: unknown;
}

export interface NotebookOutput {
  output_type: string;
  data?: Record<string, unknown>;
  text?: unknown;
  traceback?: unknown;
}

export interface MarkdownCell {
  cell_type: 'markdown';
  source: unknown;
}

export interface CodeCell {
  cell_type: 'code';
  source: unknown;
  outputs: NotebookOutput[];
}

export interface OtherCell {
  cell_type: 'other';
}

export type NotebookCell = MarkdownCell | CodeCell | OtherCell;

export interface Notebook {
  metadata: NotebookMetadata;
  cells: NotebookCell[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseOutput(value: unknown): NotebookOutput {
  if (!isRecord(value)) return { output_type: 'unknown' };

  return {
    output_type: typeof value.output_type === 'string' ? value.output_type : 'unknown',
    data: isRecord(value.data) ? value.data : undefined,
    text: value.text,
    traceback: value.traceback,
  };
}

function parseCell(value: unknown): NotebookCell {
  if (!isRecord(value)) return { cell_type: 'other' };

  if (value.cell_type === 'markdown') {
    return {
      cell_type: 'markdown',
      source: value.source,
    };
  }

  if (value.cell_type === 'code') {
    return {
      cell_type: 'code',
      source: value.source,
      outputs: Array.isArray(value.outputs) ? value.outputs.map(parseOutput) : [],
    };
  }

  return { cell_type: 'other' };
}

export function parseNotebook(value: unknown): Notebook {
  if (!isRecord(value)) {
    throw new TypeError('Notebook must be a JSON object.');
  }
  if (value.cells !== undefined && !Array.isArray(value.cells)) {
    throw new TypeError('Notebook cells must be an array.');
  }

  return {
    metadata: isRecord(value.metadata) ? value.metadata : {},
    cells: Array.isArray(value.cells) ? value.cells.map(parseCell) : [],
  };
}

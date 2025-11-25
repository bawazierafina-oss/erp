
export type DataRow = Record<string, string | number>;

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

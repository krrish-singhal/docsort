import type { Category } from '@/src/lib/categories';

export type GroupedFiles<TFile> = {
  category: Category;
  files: TFile[];
};

export function groupFilesByCategory<TFile extends { category: Category }>(
  files: TFile[],
): GroupedFiles<TFile>[] {
  const map = new Map<Category, TFile[]>();
  for (const file of files) {
    const list = map.get(file.category) ?? [];
    list.push(file);
    map.set(file.category, list);
  }

  return Array.from(map.entries()).map(([category, grouped]) => ({
    category,
    files: grouped,
  }));
}

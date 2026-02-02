import { Episode } from '@/schemas/episode';

export function downloadAsCSV(data: Episode[], filename: string) {
  if (data.length === 0) return;

  const headers = ['ID', 'Name', 'Episode Code', 'Air Date'];
  
  const rows = data.map(ep => [
    ep.id,
    `"${ep.name.replace(/"/g, '""')}"`,
    ep.episode,
    ep.air_date
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}

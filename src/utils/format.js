export const fmt = (n) => Number(n ?? 0).toLocaleString('en-US');
export const pad2 = (n) => String(n).padStart(2, '0');
export const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

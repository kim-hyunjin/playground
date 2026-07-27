export function joinBase(base: string, path = '') {
  const normalizedBase = `/${base}`.replace(/\/+/g, '/').replace(/\/?$/, '/');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`.replace(/\/+/g, '/');
}

export function withBase(path = '') {
  return joinBase(import.meta.env.BASE_URL, path);
}

export function slugifySegment(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('ko')
    .replace(/[&+]/g, ' and ')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

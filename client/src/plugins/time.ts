export function getTime() {
  const d = new Date();
  const fixup = (num: number) => num.toString().padStart(2,'0')
  const hr = (a: number) => a % 12 == 0 ? 12 : a % 12;
  return `${hr(d.getHours())}:${fixup(d.getMinutes())}${d.getHours() < 12 ? 'a': 'p'}m`;
};
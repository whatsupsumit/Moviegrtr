// Utility function for combining classnames (similar to clsx/cn)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

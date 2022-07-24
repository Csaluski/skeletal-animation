import type { Point } from './types';

function comparePoints(p1: Point, p2: Point): boolean {
  return (p1.x == p2.x && p1.y == p2.y);
}

export { comparePoints };
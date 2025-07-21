export interface Point {
  x: number;
  y: number;
  layer?: string;
}

export interface Obstacle {
  bounds: { x1: number; y1: number; x2: number; y2: number };
  layer: string;
  type: 'cell' | 'route' | 'blockage';
}

export interface Path {
  points: Point[];
  width: number;
  layer: string;
  vias: Via[];
}

export interface Via {
  position: Point;
  fromLayer: string;
  toLayer: string;
  size: number;
}

export interface Net {
  id: string;
  name: string;
  startPin: string;
  endPin: string;
  priority: number;
  width: number;
  preferredLayer: string;
}

export interface RoutingConfig {
  gridSize: number;
  layers: string[];
  viaCost: number;
  bendCost: number;
  maxBends: number;
  drcAware: boolean;
  gridSnap: boolean;
  preferredDirection: 'horizontal' | 'vertical' | 'any';
}

export interface DRCRule {
  type: 'spacing' | 'width' | 'area' | 'overlap';
  layer1: string;
  layer2?: string;
  value: number;
  severity: 'error' | 'warning';
}

export interface DRCResult {
  violations: DRCViolation[];
  isValid: boolean;
}

export interface DRCViolation {
  type: string;
  message: string;
  position: Point;
  severity: 'error' | 'warning';
}

export interface RouteResult {
  routes: Path[];
  statistics: {
    totalLength: number;
    viaCount: number;
    bendCount: number;
    drcViolations: number;
  };
  errors: string[];
}

// A* pathfinding implementation
export function findPath(
  start: Point,
  end: Point,
  obstacles: Obstacle[],
  config: RoutingConfig
): Path | null {
  const openSet = new Set<string>();
  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  const startKey = `${start.x},${start.y},${start.layer}`;
  const endKey = `${end.x},${end.y},${end.layer}`;

  openSet.add(startKey);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, end));

  while (openSet.size > 0) { // Find node with lowest fScore
    let currentKey = '';
    let lowestF = Infinity;
    for (const key of openSet) {
      const f = fScore.get(key) || Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentKey = key;
      }
    }

    if (currentKey === endKey) {
      // Reconstruct path
      return reconstructPath(cameFrom, currentKey, config);
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    const [x, y, layer] = currentKey.split(',').map(Number);
    const current = { x, y, layer: config.layers[layer] || config.layers[0] };

    // Check neighbors
    const neighbors = getNeighbors(current, config);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.layer}`;
      
      if (closedSet.has(neighborKey)) continue;
      
      if (isObstacle(neighbor, obstacles)) continue;

      const tentativeG = (gScore.get(currentKey) || Infinity) + 
                        distance(current, neighbor) + 
                        (neighbor.layer !== current.layer ? config.viaCost : 0);

      if (!openSet.has(neighborKey)) {       openSet.add(neighborKey);
      } else if (tentativeG >= (gScore.get(neighborKey) || Infinity)) {        continue;
      }

      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, tentativeG);
      fScore.set(neighborKey, tentativeG + heuristic(neighbor, end));
    }
  }

  return null; // No path found
}

// Helper functions
function heuristic(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function distance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y, 2));
}

function getNeighbors(point: Point, config: RoutingConfig): Point[] {
  const neighbors: Point[] = [];
  const directions = 
   [{ dx:1, dy: 0 }, { dx: -1, dy:0},
   { dx: 0, dy:1 }, { dx: 0, dy: -1  }];

  for (const dir of directions) {
    const newPoint = {      x: point.x + dir.dx * config.gridSize,
      y: point.y + dir.dy * config.gridSize,
      layer: point.layer
    };
    neighbors.push(newPoint);
  }

  // Add layer transitions (vias)
  if (config.layers.length > 1) {
    for (const layer of config.layers) {     if (layer !== point.layer) {
        neighbors.push({ x: point.x, y: point.y, layer });
      }
    }
  }

  return neighbors;
}

function isObstacle(point: Point, obstacles: Obstacle[]): boolean {
  return obstacles.some(obstacle => {
    if (obstacle.layer !== point.layer) return false;
    return point.x >= obstacle.bounds.x1 && point.x <= obstacle.bounds.x2 &&
           point.y >= obstacle.bounds.y1 && point.y <= obstacle.bounds.y2;
  });
}

function reconstructPath(cameFrom: Map<string, string>, endKey: string, config: RoutingConfig): Path {
  const path: Point[] = [];
  let currentKey = endKey;

  while (currentKey) {
    const [x, y, layer] = currentKey.split(',').map(Number);
    path.unshift({ x, y, layer: config.layers[layer] || config.layers[0]});
    currentKey = cameFrom.get(currentKey) || '';
  }

  return {
    points: path,
    width: 0.1, // Default width
    layer: path[0]?.layer || config.layers[0],
    vias: []
  };
}

// Multi-layer routing with via insertion
export function insertVias(path: Path, layers: string[]): Path {
  const newPath = { ...path };
  const vias: Via[] = [];

  for (let i = 1; i < path.points.length; i++) {
    const prev = path.points[i - 1];
    const curr = path.points[i];

    if (prev.layer !== curr.layer) {
      vias.push({
        position: { x: prev.x, y: prev.y },
        fromLayer: prev.layer || '',
        toLayer: curr.layer || '',
        size: 0.22 // Default via size
      });
    }
  }

  newPath.vias = vias;
  return newPath;
}

// DRC checking for routes
export function checkDRC(path: Path, rules: DRCRule[]): DRCResult {
  const violations: DRCViolation[] = [];
  for (const rule of rules) {
    if (rule.layer1 === path.layer) {
      // Check width rule
      if (rule.type === 'width' && path.width < rule.value) {
        violations.push({
          type: 'width',
          message: `Width ${path.width} < minimum ${rule.value}`,
          position: path.points[0],
          severity: rule.severity
        });
      }

      // Check spacing rule (simplified)
      if (rule.type === 'spacing') {
        // This would need more sophisticated checking against other routes
        // For now, just a placeholder
      }
    }
  }

  return {
    violations,
    isValid: violations.filter(v => v.severity === 'error').length === 0
  };
}

// Main auto-routing function
export function autoRoute(
  nets: Net[],
  cells: any[],
  config: RoutingConfig
): RouteResult {
  const routes: Path[] = [];
  const errors: string[] = [];
  let totalLength = 0;
  let viaCount = 0;
  let bendCount = 0;
  let drcViolations = 0;

  // Convert cells to obstacles
  const obstacles: Obstacle[] = cells.map(cell => ({
    bounds: {      x1: cell.x,
      y1: cell.y,
      x2: cell.x + (cell.width || 80),
      y2: cell.y + (cell.height || 60)
    },
    layer: config.layers[0],
    type: 'cell'
  }));

  // Route each net
  for (const net of nets) {
    try {
      const start = { x: 0, y:0, layer: net.preferredLayer }; // Would get from pin
      const end = { x: 10, y: 10, layer: net.preferredLayer }; // Would get from pin

      const path = findPath(start, end, obstacles, config);
      if (path) {
        const pathWithVias = insertVias(path, config.layers);
        routes.push(pathWithVias);

        // Update statistics
        totalLength += calculatePathLength(pathWithVias);
        viaCount += pathWithVias.vias.length;
        bendCount += countBends(pathWithVias);

        // Check DRC
        const drcResult = checkDRC(pathWithVias, []); // Empty rules array for now
        if (!drcResult.isValid) {
          drcViolations += drcResult.violations.length;
        }
      } else {
        errors.push(`Failed to route net ${net.name}`);
      }
    } catch (error) {
      errors.push(`Error routing net ${net.name}: ${error}`);
    }
  }

  return {
    routes,
    statistics: {
      totalLength,
      viaCount,
      bendCount,
      drcViolations
    },
    errors
  };
}

function calculatePathLength(path: Path): number {
  let length = 0;
  for (let i = 1; i < path.points.length; i++) {
    length += distance(path.points[i - 1], path.points[i]);
  }
  return length;
}

function countBends(path: Path): number {
  let bends = 0;
  for (let i = 2; i < path.points.length; i++) {
    const prev = path.points[i - 2];
    const curr = path.points[i - 1];
    const next = path.points[i];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    if ((dx1 !== 0 && dy2 !== 0) || (dy1 !== 0 && dx2 !== 0)) {      bends++;
    }
  }
  return bends;
} 
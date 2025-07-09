import { Point, Cell, Wire } from './CellLibrary';

export interface RoutingOptions {
  gridSize: number;
  avoidCells: boolean;
  preferStraightLines: boolean;
  maxIterations: number;
}

export interface RoutingResult {
  success: boolean;
  path: Point[];
  length: number;
  iterations: number;
}

export class NetRouter {
  private gridSize: number;
  private avoidCells: boolean;
  private preferStraightLines: boolean;
  private maxIterations: number;

  constructor(options: Partial<RoutingOptions> = {}) {
    this.gridSize = options.gridSize || 20;
    this.avoidCells = options.avoidCells ?? true;
    this.preferStraightLines = options.preferStraightLines ?? true;
    this.maxIterations = options.maxIterations || 1000;
  }

  /**
   * Route a wire between two points
   */
  routeWire(
    start: Point,
    end: Point,
    cells: Cell[],
    existingWires: Wire[] = []
  ): RoutingResult {
    const startGrid = this.worldToGrid(start);
    const endGrid = this.worldToGrid(end);

    // Try direct routing first
    if (this.canRouteDirect(startGrid, endGrid, cells)) {
      const directPath = this.createDirectPath(start, end);
      return {
        success: true,
        path: directPath,
        length: this.calculatePathLength(directPath),
        iterations: 1
      };
    }

    // Use A* pathfinding for complex routes
    return this.routeWithAStar(startGrid, endGrid, cells, existingWires);
  }

  /**
   * Route wire between two cell pins
   */
  routeBetweenPins(
    fromCell: Cell,
    fromPin: string,
    toCell: Cell,
    toPin: string,
    cells: Cell[],
    existingWires: Wire[] = []
  ): RoutingResult {
    const fromPinPos = this.getPinPosition(fromCell, fromPin);
    const toPinPos = this.getPinPosition(toCell, toPin);

    if (!fromPinPos || !toPinPos) {
      return {
        success: false,
        path: [],
        length: 0,
        iterations: 0
      };
    }

    return this.routeWire(fromPinPos, toPinPos, cells, existingWires);
  }

  /**
   * Check if direct routing is possible
   */
  private canRouteDirect(start: Point, end: Point, cells: Cell[]): boolean {
    if (!this.avoidCells) return true;

    const line = this.getLinePoints(start, end);
    
    for (const point of line) {
      if (this.isPointOccupied(point, cells)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Create a direct path between two points
   */
  private createDirectPath(start: Point, end: Point): Point[] {
    if (this.preferStraightLines) {
      return [start, end];
    }

    // Create L-shaped path
    const midPoint = { x: start.x, y: end.y };
    return [start, midPoint, end];
  }

  /**
   * A* pathfinding algorithm
   */
  private routeWithAStar(
    start: Point,
    end: Point,
    cells: Cell[],
    existingWires: Wire[]
  ): RoutingResult {
    const openSet = new Set<string>();
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const startKey = this.pointToKey(start);
    const endKey = this.pointToKey(end);

    openSet.add(startKey);
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(start, end));

    let iterations = 0;

    while (openSet.size > 0 && iterations < this.maxIterations) {
      iterations++;

      // Find node with lowest fScore
      let currentKey = '';
      let lowestFScore = Infinity;
      
      for (const key of openSet) {
        const score = fScore.get(key) || Infinity;
        if (score < lowestFScore) {
          lowestFScore = score;
          currentKey = key;
        }
      }

      if (currentKey === endKey) {
        // Path found
        const path = this.reconstructPath(cameFrom, currentKey);
        const worldPath = path.map(key => this.gridToWorld(this.keyToPoint(key)));
        
        return {
          success: true,
          path: worldPath,
          length: this.calculatePathLength(worldPath),
          iterations
        };
      }

      openSet.delete(currentKey);
      closedSet.add(currentKey);

      const current = this.keyToPoint(currentKey);
      const neighbors = this.getNeighbors(current);

      for (const neighbor of neighbors) {
        const neighborKey = this.pointToKey(neighbor);

        if (closedSet.has(neighborKey)) continue;
        if (this.isPointOccupied(neighbor, cells)) continue;

        const tentativeGScore = (gScore.get(currentKey) || Infinity) + 1;

        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
          continue;
        }

        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, end));
      }
    }

    return {
      success: false,
      path: [],
      length: 0,
      iterations
    };
  }

  /**
   * Get neighboring grid points
   */
  private getNeighbors(point: Point): Point[] {
    const neighbors: Point[] = [];
    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 1, y: 0 },  // Right
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }  // Left
    ];

    for (const dir of directions) {
      neighbors.push({
        x: point.x + dir.x,
        y: point.y + dir.y
      });
    }

    return neighbors;
  }

  /**
   * Check if a point is occupied by a cell
   */
  private isPointOccupied(point: Point, cells: Cell[]): boolean {
    if (!this.avoidCells) return false;

    const worldPoint = this.gridToWorld(point);
    
    return cells.some(cell => 
      worldPoint.x >= cell.x && worldPoint.x <= cell.x + cell.width &&
      worldPoint.y >= cell.y && worldPoint.y <= cell.y + cell.height
    );
  }

  /**
   * Get pin position in world coordinates
   */
  private getPinPosition(cell: Cell, pinName: string): Point | null {
    const pin = cell.pins.find(p => p.name === pinName);
    if (!pin) return null;

    return {
      x: cell.x + pin.x,
      y: cell.y + pin.y
    };
  }

  /**
   * Convert world coordinates to grid coordinates
   */
  private worldToGrid(point: Point): Point {
    return {
      x: Math.round(point.x / this.gridSize),
      y: Math.round(point.y / this.gridSize)
    };
  }

  /**
   * Convert grid coordinates to world coordinates
   */
  private gridToWorld(point: Point): Point {
    return {
      x: point.x * this.gridSize,
      y: point.y * this.gridSize
    };
  }

  /**
   * Convert point to string key
   */
  private pointToKey(point: Point): string {
    return `${point.x},${point.y}`;
  }

  /**
   * Convert string key to point
   */
  private keyToPoint(key: string): Point {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  }

  /**
   * Calculate heuristic distance (Manhattan distance)
   */
  private heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  /**
   * Get all points along a line
   */
  private getLinePoints(start: Point, end: Point): Point[] {
    const points: Point[] = [];
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    const sx = start.x < end.x ? 1 : -1;
    const sy = start.y < end.y ? 1 : -1;
    let err = dx - dy;

    let x = start.x;
    let y = start.y;

    while (true) {
      points.push({ x, y });

      if (x === end.x && y === end.y) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    return points;
  }

  /**
   * Reconstruct path from A* algorithm
   */
  private reconstructPath(cameFrom: Map<string, string>, currentKey: string): string[] {
    const path = [currentKey];
    
    while (cameFrom.has(currentKey)) {
      currentKey = cameFrom.get(currentKey)!;
      path.unshift(currentKey);
    }

    return path;
  }

  /**
   * Calculate total path length
   */
  private calculatePathLength(path: Point[]): number {
    let length = 0;
    
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }

    return length;
  }

  /**
   * Optimize wire path to reduce bends
   */
  optimizePath(path: Point[]): Point[] {
    if (path.length <= 2) return path;

    const optimized: Point[] = [path[0]];
    
    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const current = path[i];
      const next = path[i + 1];

      // Check if we can skip this point (straight line)
      const canSkip = (current.x === prev.x && current.x === next.x) ||
                     (current.y === prev.y && current.y === next.y);

      if (!canSkip) {
        optimized.push(current);
      }
    }

    optimized.push(path[path.length - 1]);
    return optimized;
  }
}

// Export singleton instance
export const netRouter = new NetRouter(); 
// Advanced Layout Design Engine
// Interactive layout editing with real-time DRC and manufacturing preparation

export interface LayoutRequest {
  designName: string;
  technology: 'tsmc28' | 'tsmc16' | 'tsmc7' | 'gf14' | 'intel14';
  dieSize: {
    width: number;  // um
    height: number; // um
  };
  layers: LayoutLayer[];
  constraints: {
    minWidth: Record<string, number>;
    minSpacing: Record<string, number>;
    minArea: Record<string, number>;
    maxDensity: Record<string, number>;
  };
}

export interface LayoutLayer {
  name: string;
  type: 'metal' | 'poly' | 'diffusion' | 'via' | 'well' | 'implant';
  number: number;
  color: string;
  visible: boolean;
  selectable: boolean;
  minWidth: number;
  minSpacing: number;
  minArea: number;
}

export interface LayoutShape {
  id: string;
  layer: string;
  type: 'rectangle' | 'polygon' | 'path' | 'circle';
  coordinates: Point[];
  properties: Record<string, any>;
  selected: boolean;
  locked: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface LayoutResult {
  shapes: LayoutShape[];
  statistics: {
    totalShapes: number;
    totalArea: number;
    layerCount: number;
    shapeCount: Record<string, number>;
  };
  drcReport: AdvancedDRCReport;
  densityReport: DensityReport;
  manufacturabilityReport: ManufacturabilityReport;
  warnings: string[];
  errors: string[];
}

export interface AdvancedDRCReport {
  totalViolations: number;
  violations: AdvancedDRCViolation[];
  clean: boolean;
  categories: {
    spacing: number;
    width: number;
    area: number;
    density: number;
    connectivity: number;
  };
}

export interface AdvancedDRCViolation {
  id: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  location: Point;
  layer: string;
  description: string;
  suggestedFix?: string;
  autoFixable: boolean;
}

export interface DensityReport {
  layerDensity: Record<string, number>;
  globalDensity: number;
  densityMap: DensityMap;
  hotspots: DensityHotspot[];
}

export interface DensityMap {
  gridSize: { x: number; y: number };
  density: number[][];
  averageDensity: number;
  maxDensity: number;
}

export interface DensityHotspot {
  location: Point;
  density: number;
  area: number;
  layers: string[];
}

export interface ManufacturabilityReport {
  score: number;  // 0-100
  issues: ManufacturabilityIssue[];
  recommendations: string[];
  yieldEstimate: number;
}

export interface ManufacturabilityIssue {
  type: 'critical' | 'major' | 'minor';
  description: string;
  impact: string;
  solution: string;
}

export interface EditOperation {
  type: 'add' | 'delete' | 'modify' | 'move' | 'copy';
  shapes: LayoutShape[];
  timestamp: number;
  user: string;
}

export interface LayoutHistory {
  operations: EditOperation[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export class AdvancedLayoutEngine {
  private technologyRules: Record<string, any>;
  private layers: LayoutLayer[];
  private shapes: LayoutShape[];
  private history: LayoutHistory;
  private drcEngine: DRCEngine;
  private densityAnalyzer: DensityAnalyzer;
  private manufacturabilityAnalyzer: ManufacturabilityAnalyzer;

  constructor() {
    this.initializeTechnologyRules();
    this.initializeLayers();
    this.shapes = [];
    this.history = {
      operations: [],
      currentIndex: -1,
      canUndo: false,
      canRedo: false
    };
    this.drcEngine = new DRCEngine();
    this.densityAnalyzer = new DensityAnalyzer();
    this.manufacturabilityAnalyzer = new ManufacturabilityAnalyzer();
  }

  async createLayout(request: LayoutRequest): Promise<LayoutResult> {
    console.log('Creating advanced layout for:', request.designName);

    try {
      // Initialize layout with basic structure
      this.shapes = this.initializeBasicLayout(request);
      
      // Perform initial analysis
      const drcReport = await this.drcEngine.checkDRC(this.shapes, request.constraints);
      const densityReport = this.densityAnalyzer.analyzeDensity(this.shapes, request.dieSize);
      const manufacturabilityReport = this.manufacturabilityAnalyzer.analyzeManufacturability(
        this.shapes, 
        request.technology,
        drcReport,
        densityReport
      );

      return {
        shapes: this.shapes,
        statistics: this.calculateStatistics(),
        drcReport,
        densityReport,
        manufacturabilityReport,
        warnings: this.generateWarnings(request, drcReport, densityReport),
        errors: []
      };
    } catch (error) {
      return {
        shapes: [],
        statistics: { totalShapes: 0, totalArea: 0, layerCount: 0, shapeCount: {} },
        drcReport: this.createEmptyDRCReport(),
        densityReport: this.createEmptyDensityReport(),
        manufacturabilityReport: this.createEmptyManufacturabilityReport(),
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Layout creation failed']
      };
    }
  }

  // Interactive editing methods
  addShape(shape: LayoutShape): void {
    const operation: EditOperation = {
      type: 'add',
      shapes: [shape],
      timestamp: Date.now(),
      user: 'current_user'
    };
    
    this.shapes.push(shape);
    this.addToHistory(operation);
    this.performRealTimeDRC();
  }

  deleteShape(shapeId: string): void {
    const shape = this.shapes.find(s => s.id === shapeId);
    if (shape) {
      const operation: EditOperation = {
        type: 'delete',
        shapes: [shape],
        timestamp: Date.now(),
        user: 'current_user'
      };
      
      this.shapes = this.shapes.filter(s => s.id !== shapeId);
      this.addToHistory(operation);
      this.performRealTimeDRC();
    }
  }

  modifyShape(shapeId: string, newCoordinates: Point[]): void {
    const shapeIndex = this.shapes.findIndex(s => s.id === shapeId);
    if (shapeIndex !== -1) {
      const oldShape = { ...this.shapes[shapeIndex] };
      this.shapes[shapeIndex].coordinates = newCoordinates;
      
      const operation: EditOperation = {
        type: 'modify',
        shapes: [oldShape, this.shapes[shapeIndex]],
        timestamp: Date.now(),
        user: 'current_user'
      };
      
      this.addToHistory(operation);
      this.performRealTimeDRC();
    }
  }

  moveShape(shapeId: string, offset: Point): void {
    const shape = this.shapes.find(s => s.id === shapeId);
    if (shape) {
      const oldCoordinates = [...shape.coordinates];
      shape.coordinates = shape.coordinates.map(point => ({
        x: point.x + offset.x,
        y: point.y + offset.y
      }));
      
      const operation: EditOperation = {
        type: 'move',
        shapes: [{ ...shape, coordinates: oldCoordinates }, shape],
        timestamp: Date.now(),
        user: 'current_user'
      };
      
      this.addToHistory(operation);
      this.performRealTimeDRC();
    }
  }

  selectShapes(area: { x1: number; y1: number; x2: number; y2: number }): LayoutShape[] {
    return this.shapes.filter(shape => {
      return shape.coordinates.some(point => 
        point.x >= area.x1 && point.x <= area.x2 &&
        point.y >= area.y1 && point.y <= area.y2
      );
    });
  }

  // History management
  undo(): boolean {
    if (this.history.canUndo) {
      const operation = this.history.operations[this.history.currentIndex];
      this.revertOperation(operation);
      this.history.currentIndex--;
      this.updateHistoryState();
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.history.canRedo) {
      this.history.currentIndex++;
      const operation = this.history.operations[this.history.currentIndex];
      this.applyOperation(operation);
      this.updateHistoryState();
      return true;
    }
    return false;
  }

  // Real-time analysis
  async performRealTimeDRC(): Promise<AdvancedDRCViolation[]> {
    const violations = await this.drcEngine.checkDRCRealTime(this.shapes);
    return violations;
  }

  getDensityMap(): DensityMap {
    return this.densityAnalyzer.generateDensityMap(this.shapes);
  }

  // Export and manufacturing preparation
  exportGDS(): string {
    return this.generateGDSFile();
  }

  exportLEF(): string {
    return this.generateLEFFile();
  }

  exportDEF(): string {
    return this.generateDEFFile();
  }

  // Private helper methods
  private initializeTechnologyRules(): void {
    this.technologyRules = {
      'tsmc28': {
        layers: {
          'M1': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M2': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M3': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M4': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M5': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M6': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M7': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
          'M8': { minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 }
        },
        vias: {
          'V1': { size: 0.065, spacing: 0.065 },
          'V2': { size: 0.065, spacing: 0.065 },
          'V3': { size: 0.065, spacing: 0.065 },
          'V4': { size: 0.065, spacing: 0.065 },
          'V5': { size: 0.065, spacing: 0.065 },
          'V6': { size: 0.065, spacing: 0.065 },
          'V7': { size: 0.065, spacing: 0.065 }
        }
      }
    };
  }

  private initializeLayers(): void {
    this.layers = [
      { name: 'M1', type: 'metal', number: 1, color: '#FF6B6B', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M2', type: 'metal', number: 2, color: '#4ECDC4', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M3', type: 'metal', number: 3, color: '#45B7D1', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M4', type: 'metal', number: 4, color: '#96CEB4', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M5', type: 'metal', number: 5, color: '#FFEAA7', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M6', type: 'metal', number: 6, color: '#DDA0DD', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M7', type: 'metal', number: 7, color: '#98D8C8', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'M8', type: 'metal', number: 8, color: '#F7DC6F', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V1', type: 'via', number: 9, color: '#BB8FCE', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V2', type: 'via', number: 10, color: '#85C1E9', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V3', type: 'via', number: 11, color: '#82E0AA', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V4', type: 'via', number: 12, color: '#F8C471', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V5', type: 'via', number: 13, color: '#F1948A', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V6', type: 'via', number: 14, color: '#C39BD3', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 },
      { name: 'V7', type: 'via', number: 15, color: '#A9CCE3', visible: true, selectable: true, minWidth: 0.065, minSpacing: 0.065, minArea: 0.042 }
    ];
  }

  private initializeBasicLayout(request: LayoutRequest): LayoutShape[] {
    const shapes: LayoutShape[] = [];
    
    // Add some example shapes for demonstration
    shapes.push({
      id: 'shape_1',
      layer: 'M1',
      type: 'rectangle',
      coordinates: [
        { x: 10, y: 10 },
        { x: 50, y: 10 },
        { x: 50, y: 30 },
        { x: 10, y: 30 }
      ],
      properties: { width: 40, height: 20 },
      selected: false,
      locked: false
    });

    shapes.push({
      id: 'shape_2',
      layer: 'M2',
      type: 'rectangle',
      coordinates: [
        { x: 60, y: 40 },
        { x: 100, y: 40 },
        { x: 100, y: 60 },
        { x: 60, y: 60 }
      ],
      properties: { width: 40, height: 20 },
      selected: false,
      locked: false
    });

    return shapes;
  }

  private addToHistory(operation: EditOperation): void {
    // Remove any operations after current index (for redo)
    this.history.operations = this.history.operations.slice(0, this.history.currentIndex + 1);
    
    // Add new operation
    this.history.operations.push(operation);
    this.history.currentIndex++;
    
    this.updateHistoryState();
  }

  private updateHistoryState(): void {
    this.history.canUndo = this.history.currentIndex >= 0;
    this.history.canRedo = this.history.currentIndex < this.history.operations.length - 1;
  }

  private revertOperation(operation: EditOperation): void {
    switch (operation.type) {
      case 'add':
        this.shapes = this.shapes.filter(s => !operation.shapes.some(os => os.id === s.id));
        break;
      case 'delete':
        this.shapes.push(...operation.shapes);
        break;
      case 'modify':
        const oldShape = operation.shapes[0];
        const shapeIndex = this.shapes.findIndex(s => s.id === oldShape.id);
        if (shapeIndex !== -1) {
          this.shapes[shapeIndex] = oldShape;
        }
        break;
      case 'move':
        const movedShape = operation.shapes[0];
        const currentShape = this.shapes.find(s => s.id === movedShape.id);
        if (currentShape) {
          currentShape.coordinates = movedShape.coordinates;
        }
        break;
    }
  }

  private applyOperation(operation: EditOperation): void {
    switch (operation.type) {
      case 'add':
        this.shapes.push(...operation.shapes);
        break;
      case 'delete':
        this.shapes = this.shapes.filter(s => !operation.shapes.some(os => os.id === s.id));
        break;
      case 'modify':
        const newShape = operation.shapes[1];
        const shapeIndex = this.shapes.findIndex(s => s.id === newShape.id);
        if (shapeIndex !== -1) {
          this.shapes[shapeIndex] = newShape;
        }
        break;
      case 'move':
        const targetShape = operation.shapes[1];
        const currentShape = this.shapes.find(s => s.id === targetShape.id);
        if (currentShape) {
          currentShape.coordinates = targetShape.coordinates;
        }
        break;
    }
  }

  private calculateStatistics(): any {
    const shapeCount: Record<string, number> = {};
    let totalArea = 0;

    for (const shape of this.shapes) {
      shapeCount[shape.layer] = (shapeCount[shape.layer] || 0) + 1;
      totalArea += this.calculateShapeArea(shape);
    }

    return {
      totalShapes: this.shapes.length,
      totalArea,
      layerCount: this.layers.length,
      shapeCount
    };
  }

  private calculateShapeArea(shape: LayoutShape): number {
    if (shape.type === 'rectangle') {
      const width = Math.abs(shape.coordinates[1].x - shape.coordinates[0].x);
      const height = Math.abs(shape.coordinates[2].y - shape.coordinates[1].y);
      return width * height;
    }
    return 0; // Simplified for demo
  }

  private generateWarnings(request: LayoutRequest, drcReport: AdvancedDRCReport, densityReport: DensityReport): string[] {
    const warnings: string[] = [];

    if (drcReport.totalViolations > 0) {
      warnings.push(`${drcReport.totalViolations} DRC violations detected`);
    }

    if (densityReport.globalDensity > 0.8) {
      warnings.push('High global density detected (>80%)');
    }

    if (densityReport.hotspots.length > 5) {
      warnings.push('Multiple density hotspots detected');
    }

    return warnings;
  }

  private generateGDSFile(): string {
    let gdsContent = `# GDS file generated by ChipForge Advanced Layout Engine\n`;
    gdsContent += `# Generated: ${new Date().toISOString()}\n\n`;
    
    for (const shape of this.shapes) {
      gdsContent += `# Shape: ${shape.id} on layer ${shape.layer}\n`;
      gdsContent += `SHAPE ${shape.layer} ${shape.type.toUpperCase()}`;
      for (const point of shape.coordinates) {
        gdsContent += ` ${point.x} ${point.y}`;
      }
      gdsContent += `\n`;
    }
    
    return gdsContent;
  }

  private generateLEFFile(): string {
    return `# LEF file generated by ChipForge Advanced Layout Engine\n`;
  }

  private generateDEFFile(): string {
    return `# DEF file generated by ChipForge Advanced Layout Engine\n`;
  }

  private createEmptyDRCReport(): AdvancedDRCReport {
    return {
      totalViolations: 0,
      violations: [],
      clean: true,
      categories: { spacing: 0, width: 0, area: 0, density: 0, connectivity: 0 }
    };
  }

  private createEmptyDensityReport(): DensityReport {
    return {
      layerDensity: {},
      globalDensity: 0,
      densityMap: { gridSize: { x: 0, y: 0 }, density: [], averageDensity: 0, maxDensity: 0 },
      hotspots: []
    };
  }

  private createEmptyManufacturabilityReport(): ManufacturabilityReport {
    return {
      score: 0,
      issues: [],
      recommendations: [],
      yieldEstimate: 0
    };
  }
}

// Supporting classes
class DRCEngine {
  async checkDRC(shapes: LayoutShape[], constraints: any): Promise<AdvancedDRCReport> {
    // Simulate DRC checking
    return {
      totalViolations: 0,
      violations: [],
      clean: true,
      categories: { spacing: 0, width: 0, area: 0, density: 0, connectivity: 0 }
    };
  }

  async checkDRCRealTime(shapes: LayoutShape[]): Promise<AdvancedDRCViolation[]> {
    // Simulate real-time DRC checking
    return [];
  }
}

class DensityAnalyzer {
  analyzeDensity(shapes: LayoutShape[], dieSize: any): DensityReport {
    // Simulate density analysis
    return {
      layerDensity: {},
      globalDensity: 0.3,
      densityMap: { gridSize: { x: 50, y: 50 }, density: [], averageDensity: 0.3, maxDensity: 0.8 },
      hotspots: []
    };
  }

  generateDensityMap(shapes: LayoutShape[]): DensityMap {
    // Simulate density map generation
    return { gridSize: { x: 50, y: 50 }, density: [], averageDensity: 0.3, maxDensity: 0.8 };
  }
}

class ManufacturabilityAnalyzer {
  analyzeManufacturability(shapes: LayoutShape[], technology: string, drcReport: AdvancedDRCReport, densityReport: DensityReport): ManufacturabilityReport {
    // Simulate manufacturability analysis
    return {
      score: 85,
      issues: [],
      recommendations: ['Consider reducing density in hotspots'],
      yieldEstimate: 0.92
    };
  }
}

// Export singleton instance
export const advancedLayoutEngine = new AdvancedLayoutEngine(); 
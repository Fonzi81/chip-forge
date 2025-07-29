// Professional Layout Editor Engine
// Interactive chip design tools for placement and routing

import * as THREE from 'three';
import { defaultTSMC7nmData, TransistorModel, MetalInterconnect, Via } from '../visualization/chipDataModels';
import { MaterialFactory } from '../visualization/materialSystem';
import { TransistorGeometryFactory } from '../visualization/transistorModels';

export interface LayoutElement {
  id: string;
  type: 'transistor' | 'interconnect' | 'via' | 'cell';
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  selected: boolean;
  visible: boolean;
  locked: boolean;
  metadata: any;
}

export interface LayoutOperation {
  type: 'add' | 'remove' | 'move' | 'rotate' | 'scale' | 'select' | 'duplicate';
  elementId: string;
  data: any;
  timestamp: number;
}

export interface DRCRule {
  id: string;
  name: string;
  type: 'spacing' | 'width' | 'area' | 'enclosure' | 'overlap';
  layer1: string;
  layer2?: string;
  value: number;
  unit: 'nm' | 'μm' | 'mm';
  severity: 'error' | 'warning' | 'info';
}

export interface DRCViolation {
  id: string;
  ruleId: string;
  elementId: string;
  position: THREE.Vector3;
  message: string;
  severity: 'error' | 'warning' | 'info';
  geometry?: THREE.Object3D;
}

export class LayoutEditor {
  private scene: THREE.Scene;
  private elements: Map<string, LayoutElement> = new Map();
  private operations: LayoutOperation[] = [];
  private drcRules: DRCRule[] = [];
  private violations: DRCViolation[] = [];
  private selectedElements: Set<string> = new Set();
  private gridSize: number = 1; // nm
  private snapToGrid: boolean = true;
  private undoStack: LayoutOperation[] = [];
  private redoStack: LayoutOperation[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initializeDRCRules();
  }

  private initializeDRCRules(): void {
    // TSMC 7nm design rules
    this.drcRules = [
      {
        id: 'min_width_metal1',
        name: 'Minimum Metal1 Width',
        type: 'width',
        layer1: 'Metal1',
        value: 14,
        unit: 'nm',
        severity: 'error'
      },
      {
        id: 'min_spacing_metal1',
        name: 'Minimum Metal1 Spacing',
        type: 'spacing',
        layer1: 'Metal1',
        value: 14,
        unit: 'nm',
        severity: 'error'
      },
      {
        id: 'min_width_poly',
        name: 'Minimum Poly Width',
        type: 'width',
        layer1: 'Poly',
        value: 7,
        unit: 'nm',
        severity: 'error'
      },
      {
        id: 'min_spacing_poly',
        name: 'Minimum Poly Spacing',
        type: 'spacing',
        layer1: 'Poly',
        value: 7,
        unit: 'nm',
        severity: 'error'
      },
      {
        id: 'min_enclosure_poly_contact',
        name: 'Minimum Poly Contact Enclosure',
        type: 'enclosure',
        layer1: 'Poly',
        layer2: 'Contact',
        value: 7,
        unit: 'nm',
        severity: 'error'
      }
    ];
  }

  // Element Management
  addTransistor(transistor: TransistorModel): string {
    const elementId = `transistor_${Date.now()}`;
    const position = new THREE.Vector3(
      transistor.position.x / 1000,
      transistor.position.y / 1000,
      transistor.position.z / 1000
    );

    const element: LayoutElement = {
      id: elementId,
      type: 'transistor',
      position: position,
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      selected: false,
      visible: true,
      locked: false,
      metadata: { transistor }
    };

    this.elements.set(elementId, element);
    this.addElementToScene(element);
    this.recordOperation('add', elementId, { element });
    return elementId;
  }

  addInterconnect(interconnect: MetalInterconnect): string {
    const elementId = `interconnect_${Date.now()}`;
    const startPoint = interconnect.path[0];
    const position = new THREE.Vector3(
      startPoint.x / 1000,
      startPoint.y / 1000,
      startPoint.z / 1000
    );

    const element: LayoutElement = {
      id: elementId,
      type: 'interconnect',
      position: position,
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      selected: false,
      visible: true,
      locked: false,
      metadata: { interconnect }
    };

    this.elements.set(elementId, element);
    this.addElementToScene(element);
    this.recordOperation('add', elementId, { element });
    return elementId;
  }

  addVia(via: Via): string {
    const elementId = `via_${Date.now()}`;
    const position = new THREE.Vector3(
      via.position.x / 1000,
      via.position.y / 1000,
      via.position.z / 1000
    );

    const element: LayoutElement = {
      id: elementId,
      type: 'via',
      position: position,
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      selected: false,
      visible: true,
      locked: false,
      metadata: { via }
    };

    this.elements.set(elementId, element);
    this.addElementToScene(element);
    this.recordOperation('add', elementId, { element });
    return elementId;
  }

  private addElementToScene(element: LayoutElement): void {
    let mesh: THREE.Object3D;

    switch (element.type) {
      case 'transistor':
        const transistor = element.metadata.transistor;
        const transistorGeometry = TransistorGeometryFactory.createTransistor(transistor);
        mesh = transistorGeometry.mesh;
        break;
      case 'interconnect':
        mesh = this.createInterconnectMesh(element.metadata.interconnect);
        break;
      case 'via':
        mesh = this.createViaMesh(element.metadata.via);
        break;
      default:
        return;
    }

    mesh.position.copy(element.position);
    mesh.rotation.copy(element.rotation);
    mesh.scale.copy(element.scale);
    mesh.userData = { elementId: element.id };
    this.scene.add(mesh);
  }

  private createInterconnectMesh(interconnect: MetalInterconnect): THREE.Object3D {
    const group = new THREE.Group();
    const material = MaterialFactory.createMaterial('copper');

    // Create path geometry
    for (let i = 0; i < interconnect.path.length - 1; i++) {
      const start = interconnect.path[i];
      const end = interconnect.path[i + 1];
      
      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2) + 
        Math.pow(end.z - start.z, 2)
      ) / 1000;

      const geometry = new THREE.BoxGeometry(
        interconnect.properties.width / 1000,
        interconnect.properties.thickness / 1000,
        length
      );
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (start.x + end.x) / 2000,
        (start.y + end.y) / 2000,
        (start.z + end.z) / 2000
      );
      
      // Calculate rotation to align with path
      const direction = new THREE.Vector3(
        end.x - start.x,
        end.y - start.y,
        end.z - start.z
      ).normalize();
      
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      mesh.setRotationFromQuaternion(quaternion);
      
      group.add(mesh);
    }

    return group;
  }

  private createViaMesh(via: Via): THREE.Object3D {
    const material = MaterialFactory.createMaterial('tungsten');
    const geometry = new THREE.CylinderGeometry(
      via.properties.diameter / 2000,
      via.properties.diameter / 2000,
      via.properties.height / 1000
    );
    return new THREE.Mesh(geometry, material);
  }

  // Selection Management
  selectElement(elementId: string, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.clearSelection();
    }

    const element = this.elements.get(elementId);
    if (element && !element.locked) {
      element.selected = true;
      this.selectedElements.add(elementId);
      this.highlightElement(elementId);
      this.recordOperation('select', elementId, { multiSelect });
    }
  }

  clearSelection(): void {
    this.selectedElements.forEach(elementId => {
      const element = this.elements.get(elementId);
      if (element) {
        element.selected = false;
        this.unhighlightElement(elementId);
      }
    });
    this.selectedElements.clear();
  }

  private highlightElement(elementId: string): void {
    this.scene.traverse((child) => {
      if (child.userData.elementId === elementId) {
        if (child instanceof THREE.Mesh) {
          child.material.emissive = new THREE.Color(0x00ff00);
          child.material.emissiveIntensity = 0.3;
        }
      }
    });
  }

  private unhighlightElement(elementId: string): void {
    this.scene.traverse((child) => {
      if (child.userData.elementId === elementId) {
        if (child instanceof THREE.Mesh) {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      }
    });
  }

  // Transform Operations
  moveElement(elementId: string, newPosition: THREE.Vector3): void {
    const element = this.elements.get(elementId);
    if (element && !element.locked) {
      const oldPosition = element.position.clone();
      
      if (this.snapToGrid) {
        newPosition.x = Math.round(newPosition.x / this.gridSize) * this.gridSize;
        newPosition.y = Math.round(newPosition.y / this.gridSize) * this.gridSize;
        newPosition.z = Math.round(newPosition.z / this.gridSize) * this.gridSize;
      }

      element.position.copy(newPosition);
      this.updateElementInScene(elementId);
      this.recordOperation('move', elementId, { oldPosition, newPosition });
      this.runDRC();
    }
  }

  rotateElement(elementId: string, newRotation: THREE.Euler): void {
    const element = this.elements.get(elementId);
    if (element && !element.locked) {
      const oldRotation = element.rotation.clone();
      element.rotation.copy(newRotation);
      this.updateElementInScene(elementId);
      this.recordOperation('rotate', elementId, { oldRotation, newRotation });
      this.runDRC();
    }
  }

  scaleElement(elementId: string, newScale: THREE.Vector3): void {
    const element = this.elements.get(elementId);
    if (element && !element.locked) {
      const oldScale = element.scale.clone();
      element.scale.copy(newScale);
      this.updateElementInScene(elementId);
      this.recordOperation('scale', elementId, { oldScale, newScale });
      this.runDRC();
    }
  }

  private updateElementInScene(elementId: string): void {
    const element = this.elements.get(elementId);
    if (!element) return;

    this.scene.traverse((child) => {
      if (child.userData.elementId === elementId) {
        child.position.copy(element.position);
        child.rotation.copy(element.rotation);
        child.scale.copy(element.scale);
      }
    });
  }

  // DRC (Design Rule Check)
  runDRC(): DRCViolation[] {
    this.clearViolations();
    this.violations = [];

    this.elements.forEach((element1, id1) => {
      this.elements.forEach((element2, id2) => {
        if (id1 !== id2) {
          this.checkDRCRules(element1, element2);
        }
      });
    });

    this.displayViolations();
    return this.violations;
  }

  private checkDRCRules(element1: LayoutElement, element2: LayoutElement): void {
    this.drcRules.forEach(rule => {
      if (this.appliesToElements(rule, element1, element2)) {
        const violation = this.checkRule(rule, element1, element2);
        if (violation) {
          this.violations.push(violation);
        }
      }
    });
  }

  private appliesToElements(rule: DRCRule, element1: LayoutElement, element2: LayoutElement): boolean {
    const layer1 = this.getElementLayer(element1);
    const layer2 = this.getElementLayer(element2);
    
    if (rule.layer2) {
      return (layer1 === rule.layer1 && layer2 === rule.layer2) ||
             (layer1 === rule.layer2 && layer2 === rule.layer1);
    } else {
      return layer1 === rule.layer1 && layer2 === rule.layer1;
    }
  }

  private getElementLayer(element: LayoutElement): string {
    switch (element.type) {
      case 'transistor':
        return 'Active';
      case 'interconnect':
        return element.metadata.interconnect.layer === 1 ? 'Metal1' : 'Metal2';
      case 'via':
        return 'Via';
      default:
        return 'Unknown';
    }
  }

  private checkRule(rule: DRCRule, element1: LayoutElement, element2: LayoutElement): DRCViolation | null {
    const distance = element1.position.distanceTo(element2.position);
    const minDistance = rule.value / 1000; // Convert nm to μm

    if (distance < minDistance) {
      return {
        id: `violation_${Date.now()}`,
        ruleId: rule.id,
        elementId: element1.id,
        position: element1.position.clone(),
        message: `${rule.name}: Distance ${(distance * 1000).toFixed(1)}nm < ${rule.value}${rule.unit}`,
        severity: rule.severity
      };
    }

    return null;
  }

  private displayViolations(): void {
    this.violations.forEach(violation => {
      // Create visual indicator for violation
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial({
        color: violation.severity === 'error' ? 0xff0000 : 0xffff00,
        transparent: true,
        opacity: 0.7
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(violation.position);
      mesh.userData = { violationId: violation.id };
      this.scene.add(mesh);
      violation.geometry = mesh;
    });
  }

  private clearViolations(): void {
    this.violations.forEach(violation => {
      if (violation.geometry) {
        this.scene.remove(violation.geometry);
      }
    });
  }

  // Undo/Redo
  undo(): void {
    if (this.undoStack.length > 0) {
      const operation = this.undoStack.pop()!;
      this.redoStack.push(operation);
      this.applyUndoOperation(operation);
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const operation = this.redoStack.pop()!;
      this.undoStack.push(operation);
      this.applyRedoOperation(operation);
    }
  }

  private applyUndoOperation(operation: LayoutOperation): void {
    // Implement undo logic based on operation type
    switch (operation.type) {
      case 'move':
        const element = this.elements.get(operation.elementId);
        if (element) {
          element.position.copy(operation.data.oldPosition);
          this.updateElementInScene(operation.elementId);
        }
        break;
      // Add other undo operations as needed
    }
  }

  private applyRedoOperation(operation: LayoutOperation): void {
    // Implement redo logic based on operation type
    switch (operation.type) {
      case 'move':
        const element = this.elements.get(operation.elementId);
        if (element) {
          element.position.copy(operation.data.newPosition);
          this.updateElementInScene(operation.elementId);
        }
        break;
      // Add other redo operations as needed
    }
  }

  private recordOperation(type: LayoutOperation['type'], elementId: string, data: any): void {
    const operation: LayoutOperation = {
      type,
      elementId,
      data,
      timestamp: Date.now()
    };
    this.operations.push(operation);
    this.undoStack.push(operation);
    this.redoStack = []; // Clear redo stack when new operation is performed
  }

  // Utility Methods
  getElement(elementId: string): LayoutElement | undefined {
    return this.elements.get(elementId);
  }

  getAllElements(): LayoutElement[] {
    return Array.from(this.elements.values());
  }

  getSelectedElements(): LayoutElement[] {
    return Array.from(this.selectedElements).map(id => this.elements.get(id)!);
  }

  getViolations(): DRCViolation[] {
    return this.violations;
  }

  setGridSize(size: number): void {
    this.gridSize = size;
  }

  setSnapToGrid(enabled: boolean): void {
    this.snapToGrid = enabled;
  }

  exportLayout(): any {
    return {
      elements: Array.from(this.elements.values()),
      operations: this.operations,
      violations: this.violations,
      timestamp: Date.now()
    };
  }

  dispose(): void {
    this.elements.clear();
    this.operations = [];
    this.violations = [];
    this.selectedElements.clear();
    this.undoStack = [];
    this.redoStack = [];
  }
} 
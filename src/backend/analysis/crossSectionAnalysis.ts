// Professional Cross-Section Analysis Engine
// Detailed chip inspection and material analysis

import * as THREE from 'three';
import { defaultTSMC7nmData, ChipLayer, TransistorModel, MetalInterconnect, Via } from '../visualization/chipDataModels';
import { MaterialFactory } from '../visualization/materialSystem';

export interface CrossSectionPlane {
  id: string;
  name: string;
  type: 'horizontal' | 'vertical' | 'custom';
  position: THREE.Vector3;
  normal: THREE.Vector3;
  width: number;
  height: number;
  visible: boolean;
}

export interface CrossSectionData {
  planeId: string;
  layers: CrossSectionLayer[];
  materials: CrossSectionMaterial[];
  defects: CrossSectionDefect[];
  measurements: CrossSectionMeasurement[];
}

export interface CrossSectionLayer {
  id: string;
  name: string;
  type: string;
  startDepth: number; // nm
  endDepth: number; // nm
  thickness: number; // nm
  material: string;
  properties: {
    resistivity?: number;
    thermalConductivity?: number;
    refractiveIndex?: number;
    doping?: string;
  };
  geometry: THREE.Object3D;
}

export interface CrossSectionMaterial {
  id: string;
  name: string;
  type: 'semiconductor' | 'metal' | 'dielectric' | 'oxide' | 'nitride';
  position: THREE.Vector3;
  dimensions: {
    width: number; // nm
    height: number; // nm
    depth: number; // nm
  };
  properties: {
    resistivity: number;
    thermalConductivity: number;
    electricalConductivity: number;
    meltingPoint: number;
  };
  geometry: THREE.Object3D;
}

export interface CrossSectionDefect {
  id: string;
  type: 'void' | 'crack' | 'contamination' | 'misalignment' | 'thickness_variation';
  position: THREE.Vector3;
  size: THREE.Vector3;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  geometry: THREE.Object3D;
}

export interface CrossSectionMeasurement {
  id: string;
  type: 'thickness' | 'width' | 'spacing' | 'angle' | 'area';
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  value: number;
  unit: string;
  geometry: THREE.Object3D;
}

export class CrossSectionAnalysis {
  private scene: THREE.Scene;
  private chipData: typeof defaultTSMC7nmData;
  private planes: Map<string, CrossSectionPlane> = new Map();
  private crossSectionData: Map<string, CrossSectionData> = new Map();
  private activePlane: string | null = null;
  private measurementMode: boolean = false;
  private defectDetection: boolean = true;

  constructor(scene: THREE.Scene, chipData: typeof defaultTSMC7nmData) {
    this.scene = scene;
    this.chipData = chipData;
    this.initializeDefaultPlanes();
  }

  private initializeDefaultPlanes(): void {
    // Create default cross-section planes
    const horizontalPlane: CrossSectionPlane = {
      id: 'horizontal_default',
      name: 'Horizontal Cross-Section',
      type: 'horizontal',
      position: new THREE.Vector3(0, 0.5, 0), // Middle of chip
      normal: new THREE.Vector3(0, 1, 0),
      width: 10,
      height: 10,
      visible: true
    };

    const verticalPlane: CrossSectionPlane = {
      id: 'vertical_default',
      name: 'Vertical Cross-Section',
      type: 'vertical',
      position: new THREE.Vector3(0, 0, 0.5),
      normal: new THREE.Vector3(0, 0, 1),
      width: 10,
      height: 10,
      visible: false
    };

    this.planes.set(horizontalPlane.id, horizontalPlane);
    this.planes.set(verticalPlane.id, verticalPlane);
    this.activePlane = horizontalPlane.id;
  }

  // Plane Management
  createPlane(plane: CrossSectionPlane): string {
    this.planes.set(plane.id, plane);
    this.generateCrossSection(plane.id);
    return plane.id;
  }

  removePlane(planeId: string): void {
    const plane = this.planes.get(planeId);
    if (plane) {
      this.clearCrossSection(planeId);
      this.planes.delete(planeId);
      if (this.activePlane === planeId) {
        this.activePlane = null;
      }
    }
  }

  setActivePlane(planeId: string): void {
    if (this.planes.has(planeId)) {
      this.activePlane = planeId;
      this.updatePlaneVisibility();
    }
  }

  private updatePlaneVisibility(): void {
    this.planes.forEach((plane, id) => {
      plane.visible = id === this.activePlane;
      this.updatePlaneGeometry(id);
    });
  }

  // Cross-Section Generation
  generateCrossSection(planeId: string): CrossSectionData {
    const plane = this.planes.get(planeId);
    if (!plane) {
      throw new Error(`Plane ${planeId} not found`);
    }

    const crossSectionData: CrossSectionData = {
      planeId,
      layers: [],
      materials: [],
      defects: [],
      measurements: []
    };

    // Generate layer cross-sections
    this.generateLayerCrossSections(plane, crossSectionData);
    
    // Generate material cross-sections
    this.generateMaterialCrossSections(plane, crossSectionData);
    
    // Detect defects
    if (this.defectDetection) {
      this.detectDefects(plane, crossSectionData);
    }

    this.crossSectionData.set(planeId, crossSectionData);
    this.renderCrossSection(planeId);
    return crossSectionData;
  }

  private generateLayerCrossSections(plane: CrossSectionPlane, data: CrossSectionData): void {
    let currentDepth = 0;

    this.chipData.layers.forEach((layer, index) => {
      const layerThickness = layer.thickness;
      const layerCrossSection: CrossSectionLayer = {
        id: `layer_${layer.name}_${plane.id}`,
        name: layer.name,
        type: layer.type,
        startDepth: currentDepth,
        endDepth: currentDepth + layerThickness,
        thickness: layerThickness,
        material: layer.material,
        properties: layer.properties,
        geometry: this.createLayerGeometry(plane, layer, currentDepth)
      };

      data.layers.push(layerCrossSection);
      currentDepth += layerThickness;
    });
  }

  private createLayerGeometry(plane: CrossSectionPlane, layer: ChipLayer, depth: number): THREE.Object3D {
    const group = new THREE.Group();
    const material = MaterialFactory.createMaterial(this.getMaterialType(layer.material));

    // Create layer geometry based on plane type
    if (plane.type === 'horizontal') {
      const geometry = new THREE.PlaneGeometry(plane.width, plane.height);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, depth / 1000, 0);
      mesh.rotation.x = -Math.PI / 2;
      group.add(mesh);
    } else if (plane.type === 'vertical') {
      const geometry = new THREE.PlaneGeometry(plane.width, layer.thickness / 1000);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, depth / 1000, 0);
      group.add(mesh);
    }

    return group;
  }

  private getMaterialType(materialName: string): string {
    if (materialName.toLowerCase().includes('silicon')) {
      return 'silicon';
    } else if (materialName.toLowerCase().includes('copper')) {
      return 'copper';
    } else if (materialName.toLowerCase().includes('oxide')) {
      return 'siliconOxide';
    } else if (materialName.toLowerCase().includes('nitride')) {
      return 'siliconNitride';
    } else if (materialName.toLowerCase().includes('poly')) {
      return 'polysilicon';
    }
    return 'silicon';
  }

  private generateMaterialCrossSections(plane: CrossSectionPlane, data: CrossSectionData): void {
    // Add transistors
    this.chipData.transistors.forEach(transistor => {
      if (this.intersectsPlane(plane, transistor.position)) {
        const materialCrossSection: CrossSectionMaterial = {
          id: `transistor_${transistor.id}_${plane.id}`,
          name: `${transistor.type.toUpperCase()} Transistor`,
          type: 'semiconductor',
          position: new THREE.Vector3(
            transistor.position.x / 1000,
            transistor.position.y / 1000,
            transistor.position.z / 1000
          ),
          dimensions: {
            width: transistor.dimensions.width,
            height: transistor.dimensions.height,
            depth: transistor.dimensions.length
          },
          properties: {
            resistivity: 1e3,
            thermalConductivity: 150,
            electricalConductivity: 1e4,
            meltingPoint: 1414
          },
          geometry: this.createTransistorCrossSection(plane, transistor)
        };
        data.materials.push(materialCrossSection);
      }
    });

    // Add interconnects
    this.chipData.interconnects.forEach(interconnect => {
      if (this.intersectsPlane(plane, interconnect.path[0])) {
        const materialCrossSection: CrossSectionMaterial = {
          id: `interconnect_${interconnect.id}_${plane.id}`,
          name: `Metal${interconnect.layer} Interconnect`,
          type: 'metal',
          position: new THREE.Vector3(
            interconnect.path[0].x / 1000,
            interconnect.path[0].y / 1000,
            interconnect.path[0].z / 1000
          ),
          dimensions: {
            width: interconnect.properties.width,
            height: interconnect.properties.thickness,
            depth: interconnect.properties.width
          },
          properties: {
            resistivity: interconnect.properties.resistivity,
            thermalConductivity: 401,
            electricalConductivity: 5.96e7,
            meltingPoint: 1085
          },
          geometry: this.createInterconnectCrossSection(plane, interconnect)
        };
        data.materials.push(materialCrossSection);
      }
    });
  }

  private createTransistorCrossSection(plane: CrossSectionPlane, transistor: TransistorModel): THREE.Object3D {
    const group = new THREE.Group();
    const material = MaterialFactory.createMaterial('siliconDoped');

    if (plane.type === 'horizontal') {
      const geometry = new THREE.PlaneGeometry(
        transistor.dimensions.width / 1000,
        transistor.dimensions.length / 1000
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        transistor.position.x / 1000,
        transistor.position.y / 1000,
        transistor.position.z / 1000
      );
      group.add(mesh);
    }

    return group;
  }

  private createInterconnectCrossSection(plane: CrossSectionPlane, interconnect: MetalInterconnect): THREE.Object3D {
    const group = new THREE.Group();
    const material = MaterialFactory.createMaterial('copper');

    if (plane.type === 'horizontal') {
      const geometry = new THREE.PlaneGeometry(
        interconnect.properties.width / 1000,
        interconnect.properties.width / 1000
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        interconnect.path[0].x / 1000,
        interconnect.path[0].y / 1000,
        interconnect.path[0].z / 1000
      );
      group.add(mesh);
    }

    return group;
  }

  private intersectsPlane(plane: CrossSectionPlane, position: { x: number; y: number; z: number }): boolean {
    const point = new THREE.Vector3(position.x / 1000, position.y / 1000, position.z / 1000);
    const distance = Math.abs(point.dot(plane.normal) - plane.position.dot(plane.normal));
    return distance < 0.1; // Within 100nm of plane
  }

  // Defect Detection
  private detectDefects(plane: CrossSectionPlane, data: CrossSectionData): void {
    // Simulate defect detection
    const defects: CrossSectionDefect[] = [
      {
        id: `defect_void_${plane.id}`,
        type: 'void',
        position: new THREE.Vector3(0.1, 0.2, 0),
        size: new THREE.Vector3(0.01, 0.01, 0.01),
        severity: 'minor',
        description: 'Small void in metal layer',
        geometry: this.createDefectGeometry('void', new THREE.Vector3(0.1, 0.2, 0))
      },
      {
        id: `defect_thickness_${plane.id}`,
        type: 'thickness_variation',
        position: new THREE.Vector3(-0.1, 0.3, 0),
        size: new THREE.Vector3(0.02, 0.005, 0.02),
        severity: 'major',
        description: 'Thickness variation in oxide layer',
        geometry: this.createDefectGeometry('thickness_variation', new THREE.Vector3(-0.1, 0.3, 0))
      }
    ];

    data.defects.push(...defects);
  }

  private createDefectGeometry(type: string, position: THREE.Vector3): THREE.Object3D {
    const group = new THREE.Group();
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (type) {
      case 'void':
        geometry = new THREE.SphereGeometry(0.01);
        material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 });
        break;
      case 'thickness_variation':
        geometry = new THREE.BoxGeometry(0.02, 0.005, 0.02);
        material = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.7 });
        break;
      default:
        geometry = new THREE.SphereGeometry(0.01);
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    group.add(mesh);
    return group;
  }

  // Measurement Tools
  addMeasurement(startPoint: THREE.Vector3, endPoint: THREE.Vector3, type: string): CrossSectionMeasurement {
    const distance = startPoint.distanceTo(endPoint);
    const measurement: CrossSectionMeasurement = {
      id: `measurement_${Date.now()}`,
      type: type as any,
      startPoint: startPoint.clone(),
      endPoint: endPoint.clone(),
      value: distance * 1000, // Convert to nm
      unit: 'nm',
      geometry: this.createMeasurementGeometry(startPoint, endPoint)
    };

    const activeData = this.crossSectionData.get(this.activePlane!);
    if (activeData) {
      activeData.measurements.push(measurement);
      this.scene.add(measurement.geometry);
    }

    return measurement;
  }

  private createMeasurementGeometry(startPoint: THREE.Vector3, endPoint: THREE.Vector3): THREE.Object3D {
    const group = new THREE.Group();

    // Create line
    const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    const line = new THREE.Line(geometry, material);
    group.add(line);

    // Create end points
    const sphereGeometry = new THREE.SphereGeometry(0.005);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    const startSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    startSphere.position.copy(startPoint);
    group.add(startSphere);

    const endSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    endSphere.position.copy(endPoint);
    group.add(endSphere);

    return group;
  }

  // Rendering
  private renderCrossSection(planeId: string): void {
    const data = this.crossSectionData.get(planeId);
    if (!data) return;

    // Clear existing cross-section
    this.clearCrossSection(planeId);

    // Add layers
    data.layers.forEach(layer => {
      this.scene.add(layer.geometry);
    });

    // Add materials
    data.materials.forEach(material => {
      this.scene.add(material.geometry);
    });

    // Add defects
    data.defects.forEach(defect => {
      this.scene.add(defect.geometry);
    });

    // Add measurements
    data.measurements.forEach(measurement => {
      this.scene.add(measurement.geometry);
    });
  }

  private clearCrossSection(planeId: string): void {
    const data = this.crossSectionData.get(planeId);
    if (!data) return;

    data.layers.forEach(layer => {
      this.scene.remove(layer.geometry);
    });

    data.materials.forEach(material => {
      this.scene.remove(material.geometry);
    });

    data.defects.forEach(defect => {
      this.scene.remove(defect.geometry);
    });

    data.measurements.forEach(measurement => {
      this.scene.remove(measurement.geometry);
    });
  }

  private updatePlaneGeometry(planeId: string): void {
    const plane = this.planes.get(planeId);
    if (!plane) return;

    // Update plane visualization
    this.scene.traverse((child) => {
      if (child.userData.planeId === planeId) {
        child.visible = plane.visible;
      }
    });
  }

  // Utility Methods
  getPlane(planeId: string): CrossSectionPlane | undefined {
    return this.planes.get(planeId);
  }

  getAllPlanes(): CrossSectionPlane[] {
    return Array.from(this.planes.values());
  }

  getCrossSectionData(planeId: string): CrossSectionData | undefined {
    return this.crossSectionData.get(planeId);
  }

  getActivePlane(): string | null {
    return this.activePlane;
  }

  setMeasurementMode(enabled: boolean): void {
    this.measurementMode = enabled;
  }

  setDefectDetection(enabled: boolean): void {
    this.defectDetection = enabled;
  }

  exportCrossSection(planeId: string): any {
    const data = this.crossSectionData.get(planeId);
    if (!data) return null;

    return {
      planeId,
      layers: data.layers.map(layer => ({
        id: layer.id,
        name: layer.name,
        type: layer.type,
        thickness: layer.thickness,
        material: layer.material,
        properties: layer.properties
      })),
      materials: data.materials.map(material => ({
        id: material.id,
        name: material.name,
        type: material.type,
        dimensions: material.dimensions,
        properties: material.properties
      })),
      defects: data.defects.map(defect => ({
        id: defect.id,
        type: defect.type,
        position: defect.position,
        size: defect.size,
        severity: defect.severity,
        description: defect.description
      })),
      measurements: data.measurements.map(measurement => ({
        id: measurement.id,
        type: measurement.type,
        value: measurement.value,
        unit: measurement.unit
      })),
      timestamp: Date.now()
    };
  }

  dispose(): void {
    this.planes.forEach((plane, id) => {
      this.clearCrossSection(id);
    });
    this.planes.clear();
    this.crossSectionData.clear();
    this.activePlane = null;
  }
} 
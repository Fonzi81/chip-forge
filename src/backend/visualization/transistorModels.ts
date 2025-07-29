// Realistic Transistor Models for Chip Visualization
// Professional FinFET, GAAFET, and planar transistor geometries

import * as THREE from 'three';
import { TransistorModel } from './chipDataModels';
import { MaterialFactory, materialManager } from './materialSystem';

export interface TransistorGeometry {
  id: string;
  type: 'planar' | 'finfet' | 'gaafet' | 'nanosheet';
  mesh: THREE.Group;
  boundingBox: THREE.Box3;
  electricalConnections: {
    source: THREE.Vector3;
    drain: THREE.Vector3;
    gate: THREE.Vector3;
  };
}

export class TransistorGeometryFactory {
  static createTransistor(transistor: TransistorModel): TransistorGeometry {
    switch (transistor.structure) {
      case 'finfet':
        return this.createFinFET(transistor);
      case 'gaafet':
        return this.createGAAFET(transistor);
      case 'nanosheet':
        return this.createNanosheet(transistor);
      case 'planar':
        return this.createPlanarTransistor(transistor);
      default:
        return this.createFinFET(transistor);
    }
  }

  private static createFinFET(transistor: TransistorModel): TransistorGeometry {
    const group = new THREE.Group();
    const { dimensions, fins, position } = transistor;
    
    if (!fins) {
      throw new Error('FinFET requires fins configuration');
    }

    // Create fins
    const finMaterial = MaterialFactory.createMaterial('siliconDoped');
    const finGeometry = new THREE.BoxGeometry(
      fins.width / 1000, // Convert nm to μm
      fins.height / 1000,
      dimensions.length / 1000
    );

    for (let i = 0; i < fins.count; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      fin.position.x = i * fins.pitch / 1000 - (fins.count - 1) * fins.pitch / 2000;
      fin.position.y = fins.height / 2000;
      fin.position.z = 0;
      group.add(fin);
    }

    // Create gate
    const gateMaterial = MaterialFactory.createMaterial('polysilicon');
    const gateGeometry = new THREE.BoxGeometry(
      dimensions.width / 1000,
      dimensions.height / 1000,
      transistor.gate.length / 1000
    );
    const gate = new THREE.Mesh(gateGeometry, gateMaterial);
    gate.position.y = dimensions.height / 2000;
    group.add(gate);

    // Create source and drain regions
    const sourceDrainMaterial = MaterialFactory.createMaterial('siliconDoped');
    const sourceDrainGeometry = new THREE.BoxGeometry(
      transistor.sourceDrain.extension / 1000,
      dimensions.height / 1000,
      dimensions.length / 1000
    );

    // Source
    const source = new THREE.Mesh(sourceDrainGeometry, sourceDrainMaterial);
    source.position.x = -dimensions.width / 2000 - transistor.sourceDrain.extension / 2000;
    source.position.y = dimensions.height / 2000;
    group.add(source);

    // Drain
    const drain = new THREE.Mesh(sourceDrainGeometry, sourceDrainMaterial);
    drain.position.x = dimensions.width / 2000 + transistor.sourceDrain.extension / 2000;
    drain.position.y = dimensions.height / 2000;
    group.add(drain);

    // Position the entire transistor
    group.position.set(position.x / 1000, position.y / 1000, position.z / 1000);

    // Calculate bounding box
    const boundingBox = new THREE.Box3().setFromObject(group);

    // Define electrical connections
    const electricalConnections = {
      source: new THREE.Vector3(
        position.x / 1000 - dimensions.width / 2000 - transistor.sourceDrain.extension / 1000,
        position.y / 1000 + dimensions.height / 2000,
        position.z / 1000
      ),
      drain: new THREE.Vector3(
        position.x / 1000 + dimensions.width / 2000 + transistor.sourceDrain.extension / 1000,
        position.y / 1000 + dimensions.height / 2000,
        position.z / 1000
      ),
      gate: new THREE.Vector3(
        position.x / 1000,
        position.y / 1000 + dimensions.height / 2000,
        position.z / 1000
      )
    };

    return {
      id: transistor.id,
      type: transistor.structure,
      mesh: group,
      boundingBox,
      electricalConnections
    };
  }

  private static createGAAFET(transistor: TransistorModel): TransistorGeometry {
    const group = new THREE.Group();
    const { dimensions, position } = transistor;

    // Create nanosheets (GAAFET uses multiple horizontal sheets)
    const nanosheetCount = 3;
    const nanosheetThickness = 5; // nm
    const nanosheetSpacing = 10; // nm
    const nanosheetMaterial = MaterialFactory.createMaterial('siliconDoped');

    for (let i = 0; i < nanosheetCount; i++) {
      const nanosheetGeometry = new THREE.BoxGeometry(
        dimensions.width / 1000,
        nanosheetThickness / 1000,
        dimensions.length / 1000
      );
      const nanosheet = new THREE.Mesh(nanosheetGeometry, nanosheetMaterial);
      nanosheet.position.y = i * (nanosheetThickness + nanosheetSpacing) / 1000;
      group.add(nanosheet);
    }

    // Create gate (wraps around nanosheets)
    const gateMaterial = MaterialFactory.createMaterial('polysilicon');
    const gateGeometry = new THREE.BoxGeometry(
      dimensions.width / 1000,
      (nanosheetCount * nanosheetThickness + (nanosheetCount - 1) * nanosheetSpacing) / 1000,
      transistor.gate.length / 1000
    );
    const gate = new THREE.Mesh(gateGeometry, gateMaterial);
    gate.position.y = ((nanosheetCount - 1) * (nanosheetThickness + nanosheetSpacing)) / 2000;
    group.add(gate);

    // Create source and drain
    const sourceDrainMaterial = MaterialFactory.createMaterial('siliconDoped');
    const sourceDrainGeometry = new THREE.BoxGeometry(
      transistor.sourceDrain.extension / 1000,
      (nanosheetCount * nanosheetThickness + (nanosheetCount - 1) * nanosheetSpacing) / 1000,
      dimensions.length / 1000
    );

    const source = new THREE.Mesh(sourceDrainGeometry, sourceDrainMaterial);
    source.position.x = -dimensions.width / 2000 - transistor.sourceDrain.extension / 2000;
    source.position.y = ((nanosheetCount - 1) * (nanosheetThickness + nanosheetSpacing)) / 2000;
    group.add(source);

    const drain = new THREE.Mesh(sourceDrainGeometry, sourceDrainMaterial);
    drain.position.x = dimensions.width / 2000 + transistor.sourceDrain.extension / 2000;
    drain.position.y = ((nanosheetCount - 1) * (nanosheetThickness + nanosheetSpacing)) / 2000;
    group.add(drain);

    // Position the transistor
    group.position.set(position.x / 1000, position.y / 1000, position.z / 1000);

    const boundingBox = new THREE.Box3().setFromObject(group);

    const electricalConnections = {
      source: new THREE.Vector3(
        position.x / 1000 - dimensions.width / 2000 - transistor.sourceDrain.extension / 1000,
        position.y / 1000 + ((nanosheetCount - 1) * (nanosheetThickness + nanosheetSpacing)) / 2000,
        position.z / 1000
      ),
      drain: new THREE.Vector3(
        position.x / 1000 + dimensions.width / 2000 + transistor.sourceDrain.extension / 1000,
        position.y / 1000 + ((nanosheetCount - 1) * (nanosheetThickness + nanosheetSpacing)) / 2000,
        position.z / 1000
      ),
      gate: new THREE.Vector3(
        position.x / 1000,
        position.y / 1000 + ((nanosheetCount - 1) * (nanosheetThickness + nanosheetSpacing)) / 2000,
        position.z / 1000
      )
    };

    return {
      id: transistor.id,
      type: transistor.structure,
      mesh: group,
      boundingBox,
      electricalConnections
    };
  }

  private static createNanosheet(transistor: TransistorModel): TransistorGeometry {
    // Similar to GAAFET but with different sheet configuration
    return this.createGAAFET(transistor);
  }

  private static createPlanarTransistor(transistor: TransistorModel): TransistorGeometry {
    const group = new THREE.Group();
    const { dimensions, position } = transistor;

    // Create channel
    const channelMaterial = MaterialFactory.createMaterial('siliconDoped');
    const channelGeometry = new THREE.BoxGeometry(
      dimensions.width / 1000,
      dimensions.height / 1000,
      dimensions.length / 1000
    );
    const channel = new THREE.Mesh(channelGeometry, channelMaterial);
    group.add(channel);

    // Create gate
    const gateMaterial = MaterialFactory.createMaterial('polysilicon');
    const gateGeometry = new THREE.BoxGeometry(
      dimensions.width / 1000,
      dimensions.height / 1000,
      transistor.gate.length / 1000
    );
    const gate = new THREE.Mesh(gateGeometry, gateMaterial);
    gate.position.z = dimensions.length / 2000 + transistor.gate.length / 2000;
    group.add(gate);

    // Create source and drain
    const sourceDrainMaterial = MaterialFactory.createMaterial('siliconDoped');
    const sourceDrainGeometry = new THREE.BoxGeometry(
      transistor.sourceDrain.extension / 1000,
      dimensions.height / 1000,
      dimensions.length / 1000
    );

    const source = new THREE.Mesh(sourceDrainGeometry, sourceDrainMaterial);
    source.position.x = -dimensions.width / 2000 - transistor.sourceDrain.extension / 2000;
    group.add(source);

    const drain = new THREE.Mesh(sourceDrainGeometry, sourceDrainMaterial);
    drain.position.x = dimensions.width / 2000 + transistor.sourceDrain.extension / 2000;
    group.add(drain);

    // Position the transistor
    group.position.set(position.x / 1000, position.y / 1000, position.z / 1000);

    const boundingBox = new THREE.Box3().setFromObject(group);

    const electricalConnections = {
      source: new THREE.Vector3(
        position.x / 1000 - dimensions.width / 2000 - transistor.sourceDrain.extension / 1000,
        position.y / 1000 + dimensions.height / 2000,
        position.z / 1000
      ),
      drain: new THREE.Vector3(
        position.x / 1000 + dimensions.width / 2000 + transistor.sourceDrain.extension / 1000,
        position.y / 1000 + dimensions.height / 2000,
        position.z / 1000
      ),
      gate: new THREE.Vector3(
        position.x / 1000,
        position.y / 1000 + dimensions.height / 2000,
        position.z / 1000 + dimensions.length / 2000 + transistor.gate.length / 2000
      )
    };

    return {
      id: transistor.id,
      type: transistor.structure,
      mesh: group,
      boundingBox,
      electricalConnections
    };
  }
}

// Transistor manager for handling multiple transistors
export class TransistorManager {
  private transistors: Map<string, TransistorGeometry> = new Map();
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  addTransistor(transistor: TransistorModel): TransistorGeometry {
    const geometry = TransistorGeometryFactory.createTransistor(transistor);
    this.transistors.set(transistor.id, geometry);
    this.scene.add(geometry.mesh);
    return geometry;
  }

  removeTransistor(id: string): void {
    const transistor = this.transistors.get(id);
    if (transistor) {
      this.scene.remove(transistor.mesh);
      this.transistors.delete(id);
    }
  }

  getTransistor(id: string): TransistorGeometry | undefined {
    return this.transistors.get(id);
  }

  getAllTransistors(): TransistorGeometry[] {
    return Array.from(this.transistors.values());
  }

  updateTransistor(transistor: TransistorModel): void {
    this.removeTransistor(transistor.id);
    this.addTransistor(transistor);
  }

  getBoundingBox(): THREE.Box3 {
    const boundingBox = new THREE.Box3();
    this.transistors.forEach(transistor => {
      boundingBox.union(transistor.boundingBox);
    });
    return boundingBox;
  }

  dispose(): void {
    this.transistors.forEach(transistor => {
      this.scene.remove(transistor.mesh);
      transistor.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    });
    this.transistors.clear();
  }
}

// Animation system for transistors
export class TransistorAnimation {
  private transistors: Map<string, TransistorGeometry> = new Map();
  private time: number = 0;

  addTransistor(transistor: TransistorGeometry): void {
    this.transistors.set(transistor.id, transistor);
  }

  removeTransistor(id: string): void {
    this.transistors.delete(id);
  }

  update(deltaTime: number): void {
    this.time += deltaTime;

    this.transistors.forEach(transistor => {
      // Add subtle animation for active transistors
      if (transistor.mesh) {
        // Gentle rotation for visual interest
        transistor.mesh.rotation.y = Math.sin(this.time * 0.5) * 0.05;
        
        // Scale animation for "breathing" effect
        const scale = 1 + Math.sin(this.time * 2) * 0.02;
        transistor.mesh.scale.setScalar(scale);
      }
    });
  }

  setTransistorActive(id: string, active: boolean): void {
    const transistor = this.transistors.get(id);
    if (transistor) {
      if (active) {
        // Add emissive material for active state
        transistor.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = new THREE.Color(0x00ff00);
            child.material.emissiveIntensity = 0.2;
          }
        });
      } else {
        // Remove emissive material
        transistor.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          }
        });
      }
    }
  }
} 
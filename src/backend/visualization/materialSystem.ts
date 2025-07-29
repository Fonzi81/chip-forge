// Professional Material System for Chip Visualization
// PBR materials and shaders for realistic semiconductor rendering

import * as THREE from 'three';

export interface MaterialProperties {
  name: string;
  type: 'metal' | 'dielectric' | 'semiconductor' | 'oxide' | 'nitride';
  color: THREE.Color;
  metalness: number;
  roughness: number;
  opacity: number;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
  refractiveIndex?: number;
  thermalConductivity?: number;
  electricalConductivity?: number;
}

// Professional semiconductor materials
export const chipMaterials: Record<string, MaterialProperties> = {
  // Silicon materials
  silicon: {
    name: 'Silicon',
    type: 'semiconductor',
    color: new THREE.Color(0x2F4F4F),
    metalness: 0.1,
    roughness: 0.8,
    opacity: 1.0,
    refractiveIndex: 3.42,
    thermalConductivity: 150,
    electricalConductivity: 1e3
  },
  
  siliconDoped: {
    name: 'Doped Silicon',
    type: 'semiconductor',
    color: new THREE.Color(0x32CD32),
    metalness: 0.2,
    roughness: 0.6,
    opacity: 1.0,
    refractiveIndex: 3.42,
    thermalConductivity: 150,
    electricalConductivity: 1e4
  },
  
  polysilicon: {
    name: 'Polysilicon',
    type: 'semiconductor',
    color: new THREE.Color(0x4682B4),
    metalness: 0.3,
    roughness: 0.7,
    opacity: 1.0,
    refractiveIndex: 3.42,
    thermalConductivity: 150,
    electricalConductivity: 1e3
  },
  
  // Metal materials
  copper: {
    name: 'Copper',
    type: 'metal',
    color: new THREE.Color(0xFFD700),
    metalness: 0.9,
    roughness: 0.1,
    opacity: 1.0,
    thermalConductivity: 401,
    electricalConductivity: 5.96e7
  },
  
  aluminum: {
    name: 'Aluminum',
    type: 'metal',
    color: new THREE.Color(0xC0C0C0),
    metalness: 0.8,
    roughness: 0.2,
    opacity: 1.0,
    thermalConductivity: 237,
    electricalConductivity: 3.77e7
  },
  
  tungsten: {
    name: 'Tungsten',
    type: 'metal',
    color: new THREE.Color(0x8B4513),
    metalness: 0.9,
    roughness: 0.3,
    opacity: 1.0,
    thermalConductivity: 173,
    electricalConductivity: 1.8e7
  },
  
  // Oxide materials
  siliconOxide: {
    name: 'Silicon Oxide',
    type: 'oxide',
    color: new THREE.Color(0x87CEEB),
    metalness: 0.0,
    roughness: 0.9,
    opacity: 0.3,
    refractiveIndex: 1.46,
    thermalConductivity: 1.4,
    electricalConductivity: 1e-18
  },
  
  highKOxide: {
    name: 'High-K Oxide',
    type: 'oxide',
    color: new THREE.Color(0x98FB98),
    metalness: 0.0,
    roughness: 0.8,
    opacity: 0.4,
    refractiveIndex: 2.0,
    thermalConductivity: 2.0,
    electricalConductivity: 1e-18
  },
  
  // Nitride materials
  siliconNitride: {
    name: 'Silicon Nitride',
    type: 'nitride',
    color: new THREE.Color(0x708090),
    metalness: 0.0,
    roughness: 0.7,
    opacity: 0.5,
    refractiveIndex: 2.0,
    thermalConductivity: 30,
    electricalConductivity: 1e-15
  }
};

// Advanced PBR shaders for realistic materials
export const siliconShader = {
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float roughness;
    uniform float metalness;
    uniform float time;
    uniform float grainScale;
    uniform float dopingLevel;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    // Silicon grain pattern
    float grain(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Crystal structure pattern
    float crystal(vec2 uv) {
      vec2 crystalUV = uv * 10.0;
      return sin(crystalUV.x) * sin(crystalUV.y) * 0.5 + 0.5;
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Silicon grain effect
      float grainValue = grain(vUv * grainScale);
      float crystalValue = crystal(vUv);
      
      // Doping effect
      float dopingEffect = dopingLevel * 0.3;
      
      // Base silicon color with grain
      vec3 grainColor = color * (0.9 + 0.1 * grainValue);
      vec3 crystalColor = color * (0.8 + 0.2 * crystalValue);
      vec3 dopedColor = mix(grainColor, crystalColor, dopingEffect);
      
      // Fresnel effect for silicon
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Silicon oxide layer effect
      float oxideThickness = 0.02;
      float oxideEffect = smoothstep(0.0, oxideThickness, vUv.y);
      
      // Final color calculation
      vec3 finalColor = mix(dopedColor, color * 0.7, oxideEffect);
      finalColor += fresnel * 0.3;
      
      // Adjust material properties based on doping
      float finalRoughness = roughness + dopingEffect * 0.2;
      float finalMetalness = metalness + dopingEffect * 0.1;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export const metalShader = {
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float roughness;
    uniform float metalness;
    uniform float time;
    uniform float oxidationLevel;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    // Oxidation pattern
    float oxidation(vec2 uv) {
      return fract(sin(dot(uv, vec2(45.123, 78.456))) * 12345.678);
    }
    
    // Surface roughness pattern
    float surfaceRoughness(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.345, 67.890))) * 54321.987);
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Oxidation effect
      float oxidationValue = oxidation(vUv * 5.0);
      float oxidationEffect = oxidationLevel * oxidationValue;
      
      // Surface roughness
      float roughnessValue = surfaceRoughness(vUv * 10.0);
      float finalRoughness = roughness + roughnessValue * 0.1;
      
      // Fresnel effect for metals
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);
      
      // Anisotropic reflection for metals
      vec3 reflection = reflect(-viewDir, normal);
      float reflectionIntensity = pow(max(dot(reflection, vec3(0.0, 1.0, 0.0)), 0.0), 10.0);
      
      // Oxidation color (greenish for copper, whitish for aluminum)
      vec3 oxidationColor = color == vec3(1.0, 0.843, 0.0) ? 
        vec3(0.2, 0.8, 0.2) : vec3(0.8, 0.8, 0.8);
      
      // Final color calculation
      vec3 baseColor = mix(color, oxidationColor, oxidationEffect);
      vec3 finalColor = baseColor * (0.3 + 0.7 * fresnel + 0.5 * reflectionIntensity);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export const oxideShader = {
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float roughness;
    uniform float opacity;
    uniform float refractiveIndex;
    uniform float time;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    // Oxide layer pattern
    float oxideLayer(vec2 uv) {
      return fract(sin(dot(uv, vec2(23.456, 89.012))) * 67890.123);
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Oxide layer effect
      float layerValue = oxideLayer(vUv * 3.0);
      float layerEffect = layerValue * 0.2;
      
      // Refraction effect
      float refraction = 1.0 / refractiveIndex;
      vec3 refractedDir = refract(viewDir, normal, refraction);
      
      // Fresnel effect for dielectrics
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
      
      // Final color calculation
      vec3 finalColor = color * (0.7 + 0.3 * layerEffect);
      finalColor += fresnel * 0.2;
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `
};

// Material factory for creating Three.js materials
export class MaterialFactory {
  static createMaterial(materialName: string, properties?: Partial<MaterialProperties>): THREE.Material {
    const baseMaterial = chipMaterials[materialName];
    if (!baseMaterial) {
      throw new Error(`Unknown material: ${materialName}`);
    }
    
    const finalProperties = { ...baseMaterial, ...properties };
    
    switch (finalProperties.type) {
      case 'semiconductor':
        return this.createSiliconMaterial(finalProperties);
      case 'metal':
        return this.createMetalMaterial(finalProperties);
      case 'oxide':
      case 'nitride':
        return this.createOxideMaterial(finalProperties);
      default:
        return this.createStandardMaterial(finalProperties);
    }
  }
  
  private static createSiliconMaterial(properties: MaterialProperties): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: siliconShader.vertexShader,
      fragmentShader: siliconShader.fragmentShader,
      uniforms: {
        color: { value: properties.color },
        roughness: { value: properties.roughness },
        metalness: { value: properties.metalness },
        time: { value: 0 },
        grainScale: { value: 50.0 },
        dopingLevel: { value: 0.5 }
      },
      transparent: properties.opacity < 1.0,
      opacity: properties.opacity
    });
  }
  
  private static createMetalMaterial(properties: MaterialProperties): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: metalShader.vertexShader,
      fragmentShader: metalShader.fragmentShader,
      uniforms: {
        color: { value: properties.color },
        roughness: { value: properties.roughness },
        metalness: { value: properties.metalness },
        time: { value: 0 },
        oxidationLevel: { value: 0.1 }
      },
      transparent: properties.opacity < 1.0,
      opacity: properties.opacity
    });
  }
  
  private static createOxideMaterial(properties: MaterialProperties): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: oxideShader.vertexShader,
      fragmentShader: oxideShader.fragmentShader,
      uniforms: {
        color: { value: properties.color },
        roughness: { value: properties.roughness },
        opacity: { value: properties.opacity },
        refractiveIndex: { value: properties.refractiveIndex || 1.5 },
        time: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });
  }
  
  private static createStandardMaterial(properties: MaterialProperties): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: properties.color,
      metalness: properties.metalness,
      roughness: properties.roughness,
      transparent: properties.opacity < 1.0,
      opacity: properties.opacity,
      emissive: properties.emissive,
      emissiveIntensity: properties.emissiveIntensity
    });
  }
}

// Material manager for handling material updates and animations
export class MaterialManager {
  private materials: Map<string, THREE.Material> = new Map();
  private time: number = 0;
  
  createMaterial(materialName: string, properties?: Partial<MaterialProperties>): THREE.Material {
    const material = MaterialFactory.createMaterial(materialName, properties);
    this.materials.set(materialName, material);
    return material;
  }
  
  getMaterial(materialName: string): THREE.Material | undefined {
    return this.materials.get(materialName);
  }
  
  updateMaterials(deltaTime: number): void {
    this.time += deltaTime;
    
    this.materials.forEach((material) => {
      if (material instanceof THREE.ShaderMaterial) {
        if (material.uniforms.time) {
          material.uniforms.time.value = this.time;
        }
      }
    });
  }
  
  setMaterialProperty(materialName: string, property: string, value: any): void {
    const material = this.materials.get(materialName);
    if (material && material instanceof THREE.ShaderMaterial) {
      if (material.uniforms[property]) {
        material.uniforms[property].value = value;
      }
    }
  }
  
  dispose(): void {
    this.materials.forEach((material) => {
      material.dispose();
    });
    this.materials.clear();
  }
}

// Export singleton instance
export const materialManager = new MaterialManager(); 
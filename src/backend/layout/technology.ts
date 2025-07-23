export interface TechLayer {
  id: string;
  name: string;
  type: 'metal' | 'poly' | 'diffusion' | 'via' | 'well' | 'implant' | 'contact';
  color: string;
  visible: boolean;
  selectable: boolean;
  minWidth: number;
  minSpacing: number;
  minArea: number;
  maxWidth?: number;
  thickness?: number;
  resistivity?: number;
  dielectricConstant?: number;
}

export interface TechRule {
  id: string;
  name: string;
  category: 'spacing' | 'width' | 'area' | 'overlap' | 'electrical' | 'density';
  layer1: string;
  layer2?: string;
  value: number;
  description: string;
  severity: 'error' | 'warning' | 'info';
  condition?: string; // Optional condition for complex rules
}

export interface TechnologyFile {
  name: string;
  version: string;
  process: string;
  description: string;
  layers: TechLayer[];
  rules: TechRule[];
  metadata: {
    manufacturer?: string;
    node?: string;
    date?: string;
    author?: string;
    minFeatureSize?: number;
    maxDieSize?: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Default 180nm technology file
export const DEFAULT_TECH_FILE: TechnologyFile = {
  name: "TSMC 180nm",
  version: "1.0",
  process: "180nm",
  description: "TSMC 180nm process technology",
  layers: [
    {
      id: "metal1",
      name: "Metal1",
      type: "metal",
      color: "#FFD700",
      visible: true,
      selectable: true,
      minWidth: 0.23,
      minSpacing: 0.28,
      minArea: 0.12,
      thickness: 0.5,
      resistivity: 0.03
    },
    {
      id: "metal2",
      name: "Metal2",
      type: "metal",
      color: "#FFA500",
      visible: true,
      selectable: true,
      minWidth: 0.23,
      minSpacing: 0.28,
      minArea: 0.12,
      thickness: 0.5,
      resistivity: 0.03
    },
    {
      id: "metal3",
      name: "Metal3",
      type: "metal",
      color: "#FF6347",
      visible: true,
      selectable: true,
      minWidth: 0.23,
      minSpacing: 0.28,
      minArea: 0.12,
      thickness: 0.5,
      resistivity: 0.03
    },
    {
      id: "poly",
      name: "Poly",
      type: "poly",
      color: "#00FF00",
      visible: true,
      selectable: true,
      minWidth: 0.18,
      minSpacing: 0.24,
      minArea: 0.08,
      thickness: 0.2,
      resistivity: 10
    },
    {
      id: "diffusion",
      name: "Diffusion",
      type: "diffusion",
      color: "#FF69B4",
      visible: true,
      selectable: true,
      minWidth: 0.22,
      minSpacing: 0.27,
      minArea: 0.1,
      thickness: 0.15
    },
    {
      id: "via1",
      name: "Via1",
      type: "via",
      color: "#FF0000",
      visible: true,
      selectable: true,
      minWidth: 0.22,
      minSpacing: 0.28,
      minArea: 0.05
    },
    {
      id: "via2",
      name: "Via2",
      type: "via",
      color: "#8B0000",
      visible: true,
      selectable: true,
      minWidth: 0.22,
      minSpacing: 0.28,
      minArea: 0.05
    },
    {
      id: "nwell",
      name: "N-Well",
      type: "well",
      color: "#8B4513",
      visible: false,
      selectable: true,
      minWidth: 0.6,
      minSpacing: 0.84,
      minArea: 0.8
    },
    {
      id: "pwell",
      name: "P-Well",
      type: "well",
      color: "#4B0082",
      visible: false,
      selectable: true,
      minWidth: 0.6,
      minSpacing: 0.84,
      minArea: 0.8
    }
  ],
  rules: [
    {
      id: "min_spacing_metal1",
      name: "Minimum Metal1 Spacing",
      category: "spacing",
      layer1: "metal1",
      value: 0.28,
      description: "Minimum spacing between Metal1 shapes",
      severity: "error"
    },
    {
      id: "min_width_metal1",
      name: "Minimum Metal1 Width",
      category: "width",
      layer1: "metal1",
      value: 0.23,
      description: "Minimum width for Metal1 shapes",
      severity: "error"
    },
    {
      id: "min_area_metal1",
      name: "Minimum Metal1 Area",
      category: "area",
      layer1: "metal1",
      value: 0.12,
      description: "Minimum area for Metal1 shapes",
      severity: "warning"
    },
    {
      id: "metal1_poly_overlap",
      name: "Metal1-Poly Overlap",
      category: "overlap",
      layer1: "metal1",
      layer2: "poly",
      value: 0.14,
      description: "Minimum overlap between Metal1y",
      severity: "error"
    },
    {
      id: "min_spacing_metal2",
      name: "Minimum Metal2 Spacing",
      category: "spacing",
      layer1: "metal2",
      value: 0.28,
      description: "Minimum spacing between Metal2 shapes",
      severity: "error"
    },
    {
      id: "min_width_metal2",
      name: "Minimum Metal2 Width",
      category: "width",
      layer1: "metal2",
      value: 0.23,
      description: "Minimum width for Metal2 shapes",
      severity: "error"
    },
    {
      id: "via1_size",
      name: "Via1 Size",
      category: "width",
      layer1: "via1",
      value: 0.22,
      description: "Minimum via1 size",
      severity: "error"
    }
  ],
  metadata: {
    manufacturer: "TSMC",
    node: "180m",
    date: "2024-0101",
    author: "ChipForge",
    minFeatureSize: 0.18,
    maxDieSize: 2000
  }
};

// Load technology file from JSON
export function loadTechnologyFile(fileContent: string): TechnologyFile {
  try {
    const techFile = JSON.parse(fileContent) as TechnologyFile;
    return validateAndNormalize(techFile);
  } catch (error) {
    throw new Error(`Failed to parse technology file: ${error}`);
  }
}

// Validate technology file
export function validateTechnologyFile(techFile: TechnologyFile): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!techFile.name) errors.push("Technology file must have a name");
  if (!techFile.version) errors.push("Technology file must have a version");
  if (!techFile.process) errors.push("Technology file must have a process node");
  if (!techFile.layers || techFile.layers.length === 0) {
    errors.push("Technology file must have at least one layer");
  }
  if (!techFile.rules) techFile.rules = []; // Ensure rules is an array
  if (!techFile.metadata) techFile.metadata = {}; // Ensure metadata is an object

  // Validate layers
  const layerIds = new Set<string>();
  techFile.layers.forEach((layer, index) => {
    if (!layer.id) errors.push(`Layer ${index} must have an ID`);
    if (layerIds.has(layer.id)) errors.push(`Duplicate layer ID: ${layer.id}`);
    layerIds.add(layer.id);

    if (layer.minWidth <= 0) errors.push(`Layer ${layer.id}: minWidth must be positive`);
    if (layer.minSpacing <= 0) errors.push(`Layer ${layer.id}: minSpacing must be positive`);
    if (layer.minArea <= 0) errors.push(`Layer ${layer.id}: minArea must be positive`);

    if (layer.maxWidth && layer.maxWidth <= layer.minWidth) {
      warnings.push(`Layer ${layer.id}: maxWidth should be greater than minWidth`);
    }
  });

  // Validate rules
  techFile.rules.forEach((rule, index) => {
    if (!rule.id) errors.push(`Rule ${index} must have an ID`);
    if (!rule.layer1) errors.push(`Rule ${index} must specify layer1`);
    if (!layerIds.has(rule.layer1)) {
      errors.push(`Rule ${rule.id}: layer1 ${rule.layer1} not found`);
    }
    if (rule.layer2 && !layerIds.has(rule.layer2)) {
      errors.push(`Rule ${rule.id}: layer2 ${rule.layer2} not found`);
    }
    if (rule.value <= 0) errors.push(`Rule ${rule.id}: value must be positive`);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Get rules for a specific layer
export function getLayerRules(layerId: string, techFile: TechnologyFile): TechRule[] {
  return techFile.rules.filter(rule => 
    rule.layer1 === layerId || rule.layer2 === layerId
  );
}

// Check if two layers are compatible for connections
export function checkLayerCompatibility(layer1: string, layer2: string, techFile: TechnologyFile): boolean {
  const layer1Data = techFile.layers.find(l => l.id === layer1);
  const layer2Data = techFile.layers.find(l => l.id === layer2);
  if (!layer1Data || !layer2Data) return false;

  // Check if there's a via rule between these layers
  const viaRule = techFile.rules.find(rule => 
    rule.category === 'overlap' && 
    ((rule.layer1 === layer1 && rule.layer2 === layer2) ||
     (rule.layer1 === layer2 && rule.layer2 === layer1)
  );

  return !!viaRule;
}

// Get layer by ID
export function getLayer(layerId: string, techFile: TechnologyFile): TechLayer | undefined {
  return techFile.layers.find(layer => layer.id === layerId);
}

// Get all metal layers
export function getMetalLayers(techFile: TechnologyFile): TechLayer[] {
  return techFile.layers.filter(layer => layer.type === 'metal');
}

// Get all via layers
export function getViaLayers(techFile: TechnologyFile): TechLayer[] {
  return techFile.layers.filter(layer => layer.type === 'via');
}

// Validate and normalize technology file
function validateAndNormalize(techFile: TechnologyFile): TechnologyFile {
  const validation = validateTechnologyFile(techFile);
  if (!validation.isValid) {
    throw new Error(`Invalid technology file: ${validation.errors.join(', ')}`);
  }

  // Set defaults for missing optional fields
  techFile.layers = techFile.layers.map(layer => ({
    visible: true,
    selectable: true,
    ...layer
  }));

  techFile.rules = techFile.rules || [];
  techFile.metadata = techFile.metadata || {};
  return techFile;
}

// Export technology file to JSON
export function exportTechnologyFile(techFile: TechnologyFile): string {
  return JSON.stringify(techFile, null, 2);
}

// Create a new technology file template
export function createTechnologyFileTemplate(
  name: string,
  process: string,
  description: string
): TechnologyFile {
  return {
    name,
    version: "10",
    process,
    description,
    layers: [],
    rules: [],
    metadata: {
      date: new Date().toISOString().split('T')[0],
      author: "ChipForge"
    }
  };
} 
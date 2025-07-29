// Professional Chip Data Models
// Realistic semiconductor design data structures

export interface ChipTechnology {
  name: 'tsmc28' | 'tsmc16' | 'tsmc7' | 'tsmc5' | 'intel14' | 'intel10' | 'samsung5' | 'samsung3';
  node: number; // nm
  minFeature: number; // nm
  metalLayers: number;
  viaLayers: number;
  transistorTypes: ('planar' | 'finfet' | 'gaafet' | 'nanosheet')[];
  materials: {
    substrate: string;
    gate: string;
    interconnect: string;
    dielectric: string;
  };
}

export interface TransistorModel {
  id: string;
  type: 'nmos' | 'pmos';
  structure: 'planar' | 'finfet' | 'gaafet' | 'nanosheet';
  position: { x: number; y: number; z: number };
  dimensions: {
    width: number; // nm
    length: number; // nm
    height: number; // nm
  };
  fins?: {
    count: number;
    height: number; // nm
    width: number; // nm
    pitch: number; // nm
  };
  gate: {
    material: 'Poly-Si' | 'HKMG' | 'Metal';
    length: number; // nm
    workFunction: number; // eV
    stack: {
      oxide: number; // nm
      highK: number; // nm
      metal: number; // nm
    };
  };
  sourceDrain: {
    doping: 'n+' | 'p+';
    extension: number; // nm
    silicide: boolean;
    resistance: number; // Ω
  };
  channel: {
    material: 'Si' | 'SiGe' | 'Ge';
    mobility: number; // cm²/Vs
    threshold: number; // V
  };
  electrical: {
    onCurrent: number; // A/μm
    offCurrent: number; // A/μm
    threshold: number; // V
    subthreshold: number; // mV/dec
  };
}

export interface MetalInterconnect {
  id: string;
  layer: number; // Metal layer number
  type: 'signal' | 'power' | 'ground' | 'clock';
  path: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  properties: {
    width: number; // nm
    thickness: number; // nm
    material: 'Cu' | 'Al' | 'W';
    resistivity: number; // Ω·cm
    currentCapacity: number; // A
  };
  electrical: {
    resistance: number; // Ω
    capacitance: number; // F
    inductance: number; // H
    current: number; // A
    voltage: number; // V
  };
  thermal: {
    temperature: number; // °C
    heatGeneration: number; // W
    thermalResistance: number; // °C/W
  };
}

export interface Via {
  id: string;
  fromLayer: number;
  toLayer: number;
  position: { x: number; y: number; z: number };
  properties: {
    diameter: number; // nm
    height: number; // nm
    material: 'W' | 'Cu' | 'Al';
    resistivity: number; // Ω·cm
  };
  electrical: {
    resistance: number; // Ω
    currentCapacity: number; // A
  };
}

export interface ChipLayer {
  name: string;
  type: 'substrate' | 'well' | 'active' | 'poly' | 'metal' | 'via' | 'oxide' | 'nitride';
  level: number;
  thickness: number; // nm
  material: string;
  properties: {
    resistivity?: number; // Ω·cm
    dielectricConstant?: number;
    thermalConductivity?: number; // W/m·K
    refractiveIndex?: number;
    meltingPoint?: number; // °C
  };
  visible: boolean;
  opacity: number;
  color: string;
}

export interface ChipSubstrate {
  material: 'Si' | 'SOI' | 'SiGe' | 'Ge';
  orientation: '100' | '110' | '111';
  doping: {
    type: 'n' | 'p';
    concentration: number; // cm⁻³
  };
  dimensions: {
    width: number; // μm
    height: number; // μm
    thickness: number; // μm
  };
  thermal: {
    conductivity: number; // W/m·K
    expansion: number; // ppm/°C
    capacity: number; // J/kg·K
  };
  electrical: {
    resistivity: number; // Ω·cm
    mobility: number; // cm²/Vs
    bandgap: number; // eV
  };
}

export interface ThermalData {
  hotspots: Array<{
    x: number;
    y: number;
    z: number;
    temperature: number; // °C
    power: number; // W
    area: number; // μm²
  }>;
  thermalMap: number[][]; // Temperature grid
  ambient: number; // °C
  maxTemperature: number; // °C
  averageTemperature: number; // °C
}

export interface ElectricalData {
  nets: Array<{
    id: string;
    name: string;
    type: 'signal' | 'power' | 'ground' | 'clock';
    nodes: string[];
    capacitance: number; // F
    resistance: number; // Ω
    inductance: number; // H
    current: number; // A
    voltage: number; // V
    power: number; // W
  }>;
  powerConsumption: number; // W
  voltageDomains: Array<{
    name: string;
    voltage: number; // V
    current: number; // A
    power: number; // W
  }>;
}

export interface DesignConstraints {
  timing: {
    maxDelay: number; // ps
    minDelay: number; // ps
    clockFrequency: number; // MHz
    setupTime: number; // ps
    holdTime: number; // ps
  };
  power: {
    maxPower: number; // W
    maxCurrent: number; // A
    voltageDrop: number; // mV
    temperature: number; // °C
  };
  area: {
    maxArea: number; // μm²
    utilization: number; // %
    aspectRatio: number;
  };
  manufacturing: {
    minFeature: number; // nm
    maxAspectRatio: number;
    minSpacing: number; // nm
    overlay: number; // nm
  };
}

export interface ProfessionalChipData {
  // Basic Information
  id: string;
  name: string;
  technology: ChipTechnology;
  version: string;
  created: Date;
  modified: Date;
  
  // Physical Structure
  substrate: ChipSubstrate;
  layers: ChipLayer[];
  transistors: TransistorModel[];
  interconnects: MetalInterconnect[];
  vias: Via[];
  
  // Analysis Data
  thermal: ThermalData;
  electrical: ElectricalData;
  constraints: DesignConstraints;
  
  // Statistics
  statistics: {
    transistorCount: number;
    netCount: number;
    metalLayerCount: number;
    viaCount: number;
    totalArea: number; // μm²
    totalPower: number; // W
    maxFrequency: number; // MHz
  };
  
  // Manufacturing
  manufacturing: {
    process: string;
    maskCount: number;
    yield: number; // %
    cost: number; // USD
    leadTime: number; // weeks
  };
}

// Default TSMC 7nm technology data
export const defaultTSMC7nmData: ProfessionalChipData = {
  id: 'tsmc7nm_demo',
  name: 'TSMC 7nm Demo Chip',
  technology: {
    name: 'tsmc7',
    node: 7,
    minFeature: 7,
    metalLayers: 15,
    viaLayers: 14,
    transistorTypes: ['finfet', 'gaafet'],
    materials: {
      substrate: 'Si',
      gate: 'HKMG',
      interconnect: 'Cu',
      dielectric: 'Low-K'
    }
  },
  version: '1.0.0',
  created: new Date(),
  modified: new Date(),
  
  substrate: {
    material: 'Si',
    orientation: '100',
    doping: { type: 'p', concentration: 1e15 },
    dimensions: { width: 1000, height: 1000, thickness: 50 },
    thermal: {
      conductivity: 150,
      expansion: 2.6,
      capacity: 700
    },
    electrical: {
      resistivity: 1e3,
      mobility: 1000,
      bandgap: 1.12
    }
  },
  
  layers: [
    {
      name: 'Substrate',
      type: 'substrate',
      level: 0,
      thickness: 50000,
      material: 'Silicon',
      properties: {
        resistivity: 1e3,
        thermalConductivity: 150,
        refractiveIndex: 3.42
      },
      visible: true,
      opacity: 1.0,
      color: '#2F4F4F'
    },
    {
      name: 'Active',
      type: 'active',
      level: 1,
      thickness: 50,
      material: 'Silicon',
      properties: {
        resistivity: 1e-4,
        thermalConductivity: 150
      },
      visible: true,
      opacity: 1.0,
      color: '#32CD32'
    },
    {
      name: 'Poly',
      type: 'poly',
      level: 2,
      thickness: 100,
      material: 'Polysilicon',
      properties: {
        resistivity: 1e-3,
        thermalConductivity: 150
      },
      visible: true,
      opacity: 1.0,
      color: '#4682B4'
    },
    {
      name: 'Metal1',
      type: 'metal',
      level: 3,
      thickness: 400,
      material: 'Copper',
      properties: {
        resistivity: 1.68e-8,
        thermalConductivity: 401
      },
      visible: true,
      opacity: 1.0,
      color: '#FF4500'
    },
    {
      name: 'Metal2',
      type: 'metal',
      level: 4,
      thickness: 500,
      material: 'Copper',
      properties: {
        resistivity: 1.68e-8,
        thermalConductivity: 401
      },
      visible: true,
      opacity: 1.0,
      color: '#FF6347'
    }
  ],
  
  transistors: [
    {
      id: 'T1',
      type: 'nmos',
      structure: 'finfet',
      position: { x: 0, y: 0, z: 50 },
      dimensions: { width: 14, length: 7, height: 42 },
      fins: { count: 3, height: 42, width: 7, pitch: 14 },
      gate: {
        material: 'HKMG',
        length: 7,
        workFunction: 4.5,
        stack: { oxide: 0.5, highK: 1.0, metal: 2.0 }
      },
      sourceDrain: {
        doping: 'n+',
        extension: 10,
        silicide: true,
        resistance: 100
      },
      channel: {
        material: 'Si',
        mobility: 1000,
        threshold: 0.3
      },
      electrical: {
        onCurrent: 1.2,
        offCurrent: 1e-9,
        threshold: 0.3,
        subthreshold: 70
      }
    }
  ],
  
  interconnects: [
    {
      id: 'M1_1',
      layer: 1,
      type: 'signal',
      path: [
        { x: 0, y: 0, z: 450 },
        { x: 100, y: 0, z: 450 }
      ],
      properties: {
        width: 14,
        thickness: 400,
        material: 'Cu',
        resistivity: 1.68e-8,
        currentCapacity: 0.001
      },
      electrical: {
        resistance: 0.1,
        capacitance: 1e-15,
        inductance: 1e-12,
        current: 0.001,
        voltage: 0.9
      },
      thermal: {
        temperature: 25,
        heatGeneration: 0.001,
        thermalResistance: 100
      }
    }
  ],
  
  vias: [
    {
      id: 'V1_1',
      fromLayer: 1,
      toLayer: 2,
      position: { x: 50, y: 50, z: 500 },
      properties: {
        diameter: 14,
        height: 500,
        material: 'W',
        resistivity: 5.6e-8
      },
      electrical: {
        resistance: 1,
        currentCapacity: 0.001
      }
    }
  ],
  
  thermal: {
    hotspots: [
      { x: 100, y: 100, z: 500, temperature: 85, power: 0.1, area: 100 },
      { x: 200, y: 200, z: 500, temperature: 90, power: 0.15, area: 150 }
    ],
    thermalMap: Array(100).fill(null).map(() => Array(100).fill(25)),
    ambient: 25,
    maxTemperature: 95,
    averageTemperature: 35
  },
  
  electrical: {
    nets: [
      {
        id: 'net1',
        name: 'clk',
        type: 'clock',
        nodes: ['T1_gate'],
        capacitance: 1e-15,
        resistance: 0.1,
        inductance: 1e-12,
        current: 0.001,
        voltage: 0.9,
        power: 0.001
      }
    ],
    powerConsumption: 0.5,
    voltageDomains: [
      { name: 'VDD', voltage: 0.9, current: 0.5, power: 0.45 }
    ]
  },
  
  constraints: {
    timing: {
      maxDelay: 1000,
      minDelay: 100,
      clockFrequency: 3000,
      setupTime: 50,
      holdTime: 20
    },
    power: {
      maxPower: 1.0,
      maxCurrent: 1.0,
      voltageDrop: 50,
      temperature: 100
    },
    area: {
      maxArea: 1000000,
      utilization: 80,
      aspectRatio: 1.0
    },
    manufacturing: {
      minFeature: 7,
      maxAspectRatio: 10,
      minSpacing: 7,
      overlay: 3
    }
  },
  
  statistics: {
    transistorCount: 1000000000,
    netCount: 1000000,
    metalLayerCount: 15,
    viaCount: 5000000,
    totalArea: 1000000,
    totalPower: 0.5,
    maxFrequency: 3000
  },
  
  manufacturing: {
    process: 'TSMC 7nm',
    maskCount: 80,
    yield: 95,
    cost: 1000000,
    leadTime: 12
  }
};

// Export utility functions
export const createChipData = (technology: ChipTechnology, name: string): ProfessionalChipData => {
  return {
    ...defaultTSMC7nmData,
    id: `${technology.name}_${Date.now()}`,
    name,
    technology,
    created: new Date(),
    modified: new Date()
  };
};

export const validateChipData = (data: ProfessionalChipData): boolean => {
  // Basic validation
  if (!data.id || !data.name || !data.technology) {
    return false;
  }
  
  // Check required components
  if (!data.substrate || !data.layers || !data.transistors) {
    return false;
  }
  
  // Validate statistics
  if (data.statistics.transistorCount < 0 || data.statistics.totalPower < 0) {
    return false;
  }
  
  return true;
}; 
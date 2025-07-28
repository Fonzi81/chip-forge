// Manufacturing Preparation Engine
// Tapeout preparation with design rule checking and mask generation

export interface TapeoutRequest {
  designName: string;
  technology: 'tsmc28' | 'tsmc16' | 'tsmc7' | 'gf14' | 'intel14';
  foundry: 'tsmc' | 'samsung' | 'intel' | 'gf' | 'umc';
  process: string;
  layoutData: any;
  constraints: {
    maxDensity: number;
    minFeatureSize: number;
    maxAspectRatio: number;
    minSpacing: number;
  };
  options: {
    generateMasks: boolean;
    generateTestStructures: boolean;
    generateDummyFill: boolean;
    performLVS: boolean;
    performDRC: boolean;
  };
}

export interface TapeoutResult {
  success: boolean;
  masks: MaskData[];
  testStructures: TestStructure[];
  reports: {
    drcReport: TapeoutDRCReport;
    lvsReport: TapeoutLVSReport;
    densityReport: TapeoutDensityReport;
    manufacturabilityReport: TapeoutManufacturabilityReport;
  };
  files: {
    gds: string;
    lef: string;
    def: string;
    spice: string;
    maskData: string;
  };
  statistics: {
    totalMasks: number;
    totalTestStructures: number;
    totalViolations: number;
    yieldEstimate: number;
  };
  warnings: string[];
  errors: string[];
}

export interface MaskData {
  name: string;
  layer: string;
  type: 'metal' | 'via' | 'poly' | 'diffusion' | 'implant' | 'well';
  data: string;
  format: 'gds' | 'oasis' | 'cif';
  size: number;
  checksum: string;
  metadata: {
    resolution: number;
    exposureTime: number;
    resistType: string;
    processStep: string;
  };
}

export interface TestStructure {
  name: string;
  type: 'process' | 'electrical' | 'reliability' | 'yield';
  location: { x: number; y: number };
  size: { width: number; height: number };
  purpose: string;
  specifications: Record<string, any>;
}

export interface TapeoutDRCReport {
  totalViolations: number;
  criticalViolations: number;
  violations: TapeoutDRCViolation[];
  clean: boolean;
  categories: {
    spacing: number;
    width: number;
    area: number;
    density: number;
    connectivity: number;
    antenna: number;
  };
}

export interface TapeoutLVSReport {
  totalErrors: number;
  errors: TapeoutLVSError[];
  clean: boolean;
  netlistMatch: boolean;
  connectivity: {
    totalNets: number;
    matchedNets: number;
    missingNets: number;
    extraNets: number;
  };
}

export interface TapeoutDensityReport {
  globalDensity: number;
  layerDensity: Record<string, number>;
  densityMap: DensityMap;
  hotspots: DensityHotspot[];
  recommendations: string[];
}

export interface TapeoutManufacturabilityReport {
  score: number;  // 0-100
  yieldEstimate: number;
  issues: ManufacturabilityIssue[];
  recommendations: string[];
  riskAssessment: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface TapeoutDRCViolation {
  id: string;
  rule: string;
  severity: 'critical' | 'major' | 'minor';
  location: { x: number; y: number; layer: string };
  description: string;
  impact: string;
  suggestedFix: string;
  autoFixable: boolean;
}

export interface TapeoutLVSError {
  type: 'missing' | 'extra' | 'mismatch' | 'connectivity';
  net: string;
  description: string;
  location: { x: number; y: number };
  severity: 'critical' | 'major' | 'minor';
}

export interface DensityMap {
  gridSize: { x: number; y: number };
  density: number[][];
  averageDensity: number;
  maxDensity: number;
  minDensity: number;
}

export interface DensityHotspot {
  location: { x: number; y: number };
  density: number;
  area: number;
  layers: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ManufacturabilityIssue {
  type: 'critical' | 'major' | 'minor';
  category: 'process' | 'design' | 'mask' | 'yield';
  description: string;
  impact: string;
  solution: string;
  cost: 'low' | 'medium' | 'high';
}

export class TapeoutEngine {
  private foundryRules: Record<string, any>;
  private processRules: Record<string, any>;
  private maskGenerator: MaskGenerator;
  private testStructureGenerator: TestStructureGenerator;
  private drcEngine: TapeoutDRCEngine;
  private lvsEngine: TapeoutLVSEngine;
  private densityAnalyzer: TapeoutDensityAnalyzer;
  private manufacturabilityAnalyzer: TapeoutManufacturabilityAnalyzer;

  constructor() {
    this.initializeFoundryRules();
    this.initializeProcessRules();
    this.maskGenerator = new MaskGenerator();
    this.testStructureGenerator = new TestStructureGenerator();
    this.drcEngine = new TapeoutDRCEngine();
    this.lvsEngine = new TapeoutLVSEngine();
    this.densityAnalyzer = new TapeoutDensityAnalyzer();
    this.manufacturabilityAnalyzer = new TapeoutManufacturabilityAnalyzer();
  }

  async prepareTapeout(request: TapeoutRequest): Promise<TapeoutResult> {
    console.log('Preparing tapeout for:', request.designName);

    try {
      const result: TapeoutResult = {
        success: false,
        masks: [],
        testStructures: [],
        reports: {
          drcReport: this.createEmptyDRCReport(),
          lvsReport: this.createEmptyLVSReport(),
          densityReport: this.createEmptyDensityReport(),
          manufacturabilityReport: this.createEmptyManufacturabilityReport()
        },
        files: {
          gds: '',
          lef: '',
          def: '',
          spice: '',
          maskData: ''
        },
        statistics: {
          totalMasks: 0,
          totalTestStructures: 0,
          totalViolations: 0,
          yieldEstimate: 0
        },
        warnings: [],
        errors: []
      };

      // Step 1: Perform comprehensive DRC
      if (request.options.performDRC) {
        result.reports.drcReport = await this.drcEngine.performDRC(request.layoutData, request.constraints);
      }

      // Step 2: Perform LVS verification
      if (request.options.performLVS) {
        result.reports.lvsReport = await this.lvsEngine.performLVS(request.layoutData);
      }

      // Step 3: Analyze density
      result.reports.densityReport = this.densityAnalyzer.analyzeDensity(request.layoutData, request.constraints);

      // Step 4: Generate test structures
      if (request.options.generateTestStructures) {
        result.testStructures = this.testStructureGenerator.generateTestStructures(request);
      }

      // Step 5: Generate masks
      if (request.options.generateMasks) {
        result.masks = await this.maskGenerator.generateMasks(request);
      }

      // Step 6: Analyze manufacturability
      result.reports.manufacturabilityReport = this.manufacturabilityAnalyzer.analyzeManufacturability(
        request,
        result.reports.drcReport,
        result.reports.lvsReport,
        result.reports.densityReport
      );

      // Step 7: Generate manufacturing files
      result.files = await this.generateManufacturingFiles(request, result);

      // Step 8: Calculate statistics
      result.statistics = this.calculateStatistics(result);

      // Step 9: Determine success
      result.success = this.determineSuccess(result);

      // Step 10: Generate warnings and errors
      result.warnings = this.generateWarnings(result);
      result.errors = this.generateErrors(result);

      return result;
    } catch (error) {
      return {
        success: false,
        masks: [],
        testStructures: [],
        reports: {
          drcReport: this.createEmptyDRCReport(),
          lvsReport: this.createEmptyLVSReport(),
          densityReport: this.createEmptyDensityReport(),
          manufacturabilityReport: this.createEmptyManufacturabilityReport()
        },
        files: { gds: '', lef: '', def: '', spice: '', maskData: '' },
        statistics: { totalMasks: 0, totalTestStructures: 0, totalViolations: 0, yieldEstimate: 0 },
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Tapeout preparation failed']
      };
    }
  }

  // Private helper methods
  private initializeFoundryRules(): void {
    this.foundryRules = {
      'tsmc': {
        'tsmc28': {
          minFeatureSize: 0.065,
          maxDensity: 0.85,
          minSpacing: 0.065,
          maxAspectRatio: 10,
          layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7']
        },
        'tsmc16': {
          minFeatureSize: 0.048,
          maxDensity: 0.80,
          minSpacing: 0.048,
          maxAspectRatio: 8,
          layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8']
        },
        'tsmc7': {
          minFeatureSize: 0.036,
          maxDensity: 0.75,
          minSpacing: 0.036,
          maxAspectRatio: 6,
          layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9']
        }
      },
      'samsung': {
        '14nm': {
          minFeatureSize: 0.042,
          maxDensity: 0.82,
          minSpacing: 0.042,
          maxAspectRatio: 7,
          layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8']
        }
      }
    };
  }

  private initializeProcessRules(): void {
    this.processRules = {
      'logic': {
        minGateLength: 0.065,
        maxGateWidth: 10,
        minContactSize: 0.065,
        maxContactSpacing: 0.13
      },
      'memory': {
        minGateLength: 0.065,
        maxGateWidth: 5,
        minContactSize: 0.065,
        maxContactSpacing: 0.13
      },
      'analog': {
        minGateLength: 0.13,
        maxGateWidth: 20,
        minContactSize: 0.065,
        maxContactSpacing: 0.13
      }
    };
  }

  private async generateManufacturingFiles(request: TapeoutRequest, result: TapeoutResult): Promise<any> {
    console.log('Generating manufacturing files');

    return {
      gds: this.generateGDSFile(request, result),
      lef: this.generateLEFFile(request, result),
      def: this.generateDEFFile(request, result),
      spice: this.generateSPICEFile(request, result),
      maskData: this.generateMaskDataFile(request, result)
    };
  }

  private generateGDSFile(request: TapeoutRequest, result: TapeoutResult): string {
    let gdsContent = `# GDS file for ${request.designName}\n`;
    gdsContent += `# Technology: ${request.technology}\n`;
    gdsContent += `# Foundry: ${request.foundry}\n`;
    gdsContent += `# Generated: ${new Date().toISOString()}\n\n`;
    
    // Add header information
    gdsContent += `HEADER 600\n`;
    gdsContent += `BGNLIB\n`;
    gdsContent += `LIBNAME ${request.designName}\n`;
    gdsContent += `UNITS 0.001 1e-9\n\n`;
    
    // Add cell definitions
    gdsContent += `BGNSTR\n`;
    gdsContent += `STRNAME ${request.designName}\n`;
    
    // Add shapes from layout data
    if (request.layoutData.shapes) {
      for (const shape of request.layoutData.shapes) {
        gdsContent += `# Shape: ${shape.id} on layer ${shape.layer}\n`;
        gdsContent += `BOUNDARY\n`;
        gdsContent += `LAYER ${this.getLayerNumber(shape.layer)}\n`;
        gdsContent += `DATATYPE 0\n`;
        for (const point of shape.coordinates) {
          gdsContent += `XY ${point.x} ${point.y}\n`;
        }
        gdsContent += `ENDEL\n`;
      }
    }
    
    gdsContent += `ENDSTR\n`;
    gdsContent += `ENDLIB\n`;
    
    return gdsContent;
  }

  private generateLEFFile(request: TapeoutRequest, result: TapeoutResult): string {
    let lefContent = `# LEF file for ${request.designName}\n`;
    lefContent += `VERSION 5.8 ;\n`;
    lefContent += `NAMESCASESENSITIVE ON ;\n`;
    lefContent += `DIVIDERCHAR "/" ;\n`;
    lefContent += `BUSBITCHARS "[]" ;\n\n`;
    
    // Add technology information
    lefContent += `UNITS\n`;
    lefContent += `DATABASE MICRONS 1000 ;\n`;
    lefContent += `END UNITS\n\n`;
    
    // Add layer definitions
    const rules = this.foundryRules[request.foundry]?.[request.technology];
    if (rules) {
      for (const layer of rules.layers) {
        lefContent += `LAYER ${layer}\n`;
        lefContent += `TYPE ROUTING ;\n`;
        lefContent += `WIDTH ${rules.minFeatureSize} ;\n`;
        lefContent += `SPACING ${rules.minSpacing} ;\n`;
        lefContent += `END ${layer}\n\n`;
      }
    }
    
    return lefContent;
  }

  private generateDEFFile(request: TapeoutRequest, result: TapeoutResult): string {
    let defContent = `# DEF file for ${request.designName}\n`;
    defContent += `VERSION 5.8 ;\n`;
    defContent += `DIVIDERCHAR "/" ;\n`;
    defContent += `BUSBITCHARS "[]" ;\n\n`;
    
    defContent += `DESIGN ${request.designName} ;\n`;
    defContent += `UNITS DISTANCE MICRONS 1000 ;\n\n`;
    
    return defContent;
  }

  private generateSPICEFile(request: TapeoutRequest, result: TapeoutResult): string {
    let spiceContent = `* SPICE netlist for ${request.designName}\n`;
    spiceContent += `* Technology: ${request.technology}\n`;
    spiceContent += `* Generated: ${new Date().toISOString()}\n\n`;
    
    spiceContent += `.TITLE ${request.designName}\n`;
    spiceContent += `.SUBCKT ${request.designName}\n`;
    
    // Add netlist content here
    spiceContent += `.ENDS\n`;
    
    return spiceContent;
  }

  private generateMaskDataFile(request: TapeoutRequest, result: TapeoutResult): string {
    let maskContent = `# Mask data file for ${request.designName}\n`;
    maskContent += `# Total masks: ${result.masks.length}\n\n`;
    
    for (const mask of result.masks) {
      maskContent += `MASK: ${mask.name}\n`;
      maskContent += `LAYER: ${mask.layer}\n`;
      maskContent += `TYPE: ${mask.type}\n`;
      maskContent += `SIZE: ${mask.size} bytes\n`;
      maskContent += `CHECKSUM: ${mask.checksum}\n`;
      maskContent += `RESOLUTION: ${mask.metadata.resolution} nm\n`;
      maskContent += `EXPOSURE_TIME: ${mask.metadata.exposureTime} ms\n`;
      maskContent += `RESIST_TYPE: ${mask.metadata.resistType}\n`;
      maskContent += `PROCESS_STEP: ${mask.metadata.processStep}\n\n`;
    }
    
    return maskContent;
  }

  private getLayerNumber(layerName: string): number {
    const layerMap: Record<string, number> = {
      'M1': 1, 'M2': 2, 'M3': 3, 'M4': 4, 'M5': 5, 'M6': 6, 'M7': 7, 'M8': 8,
      'V1': 9, 'V2': 10, 'V3': 11, 'V4': 12, 'V5': 13, 'V6': 14, 'V7': 15
    };
    return layerMap[layerName] || 0;
  }

  private calculateStatistics(result: TapeoutResult): any {
    return {
      totalMasks: result.masks.length,
      totalTestStructures: result.testStructures.length,
      totalViolations: result.reports.drcReport.totalViolations + result.reports.lvsReport.totalErrors,
      yieldEstimate: result.reports.manufacturabilityReport.yieldEstimate
    };
  }

  private determineSuccess(result: TapeoutResult): boolean {
    return result.reports.drcReport.clean && 
           result.reports.lvsReport.clean && 
           result.reports.manufacturabilityReport.score >= 80;
  }

  private generateWarnings(result: TapeoutResult): string[] {
    const warnings: string[] = [];

    if (result.reports.drcReport.totalViolations > 0) {
      warnings.push(`${result.reports.drcReport.totalViolations} DRC violations detected`);
    }

    if (result.reports.lvsReport.totalErrors > 0) {
      warnings.push(`${result.reports.lvsReport.totalErrors} LVS errors detected`);
    }

    if (result.reports.manufacturabilityReport.score < 90) {
      warnings.push(`Manufacturability score is ${result.reports.manufacturabilityReport.score}/100`);
    }

    if (result.reports.densityReport.globalDensity > 0.8) {
      warnings.push('High global density detected (>80%)');
    }

    return warnings;
  }

  private generateErrors(result: TapeoutResult): string[] {
    const errors: string[] = [];

    if (result.reports.drcReport.criticalViolations > 0) {
      errors.push(`${result.reports.drcReport.criticalViolations} critical DRC violations must be fixed`);
    }

    if (!result.reports.lvsReport.netlistMatch) {
      errors.push('LVS netlist mismatch detected');
    }

    if (result.reports.manufacturabilityReport.score < 70) {
      errors.push('Manufacturability score too low for tapeout');
    }

    return errors;
  }

  private createEmptyDRCReport(): TapeoutDRCReport {
    return {
      totalViolations: 0,
      criticalViolations: 0,
      violations: [],
      clean: true,
      categories: { spacing: 0, width: 0, area: 0, density: 0, connectivity: 0, antenna: 0 }
    };
  }

  private createEmptyLVSReport(): TapeoutLVSReport {
    return {
      totalErrors: 0,
      errors: [],
      clean: true,
      netlistMatch: true,
      connectivity: { totalNets: 0, matchedNets: 0, missingNets: 0, extraNets: 0 }
    };
  }

  private createEmptyDensityReport(): TapeoutDensityReport {
    return {
      globalDensity: 0,
      layerDensity: {},
      densityMap: { gridSize: { x: 0, y: 0 }, density: [], averageDensity: 0, maxDensity: 0, minDensity: 0 },
      hotspots: [],
      recommendations: []
    };
  }

  private createEmptyManufacturabilityReport(): TapeoutManufacturabilityReport {
    return {
      score: 0,
      yieldEstimate: 0,
      issues: [],
      recommendations: [],
      riskAssessment: { low: 0, medium: 0, high: 0, critical: 0 }
    };
  }
}

// Supporting classes
class MaskGenerator {
  async generateMasks(request: TapeoutRequest): Promise<MaskData[]> {
    console.log('Generating masks for tapeout');
    
    const masks: MaskData[] = [];
    const rules = this.getFoundryRules(request.foundry, request.technology);
    
    if (rules) {
      for (const layer of rules.layers) {
        masks.push({
          name: `${request.designName}_${layer}`,
          layer,
          type: this.getLayerType(layer),
          data: `# Mask data for ${layer}`,
          format: 'gds',
          size: Math.random() * 1000000 + 100000,
          checksum: this.generateChecksum(layer),
          metadata: {
            resolution: 28,
            exposureTime: 100,
            resistType: 'positive',
            processStep: this.getProcessStep(layer)
          }
        });
      }
    }
    
    return masks;
  }

  private getFoundryRules(foundry: string, technology: string): any {
    const foundryRules: Record<string, any> = {
      'tsmc': {
        'tsmc28': { layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'] },
        'tsmc16': { layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'] },
        'tsmc7': { layers: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9'] }
      }
    };
    return foundryRules[foundry]?.[technology];
  }

  private getLayerType(layerName: string): 'metal' | 'via' | 'poly' | 'diffusion' | 'implant' | 'well' {
    if (layerName.startsWith('M')) return 'metal';
    if (layerName.startsWith('V')) return 'via';
    return 'metal';
  }

  private generateChecksum(layerName: string): string {
    return `checksum_${layerName}_${Date.now()}`;
  }

  private getProcessStep(layerName: string): string {
    if (layerName.startsWith('M')) return 'metal_etch';
    if (layerName.startsWith('V')) return 'via_etch';
    return 'general_etch';
  }
}

class TestStructureGenerator {
  generateTestStructures(request: TapeoutRequest): TestStructure[] {
    console.log('Generating test structures');
    
    const structures: TestStructure[] = [];
    
    // Process test structures
    structures.push({
      name: 'process_monitor',
      type: 'process',
      location: { x: 100, y: 100 },
      size: { width: 50, height: 50 },
      purpose: 'Monitor process variations',
      specifications: { minSize: 0.065, maxSize: 10 }
    });
    
    // Electrical test structures
    structures.push({
      name: 'electrical_test',
      type: 'electrical',
      location: { x: 200, y: 100 },
      size: { width: 100, height: 50 },
      purpose: 'Test electrical characteristics',
      specifications: { resistance: '1k-1M', capacitance: '1f-1p' }
    });
    
    // Reliability test structures
    structures.push({
      name: 'reliability_test',
      type: 'reliability',
      location: { x: 100, y: 200 },
      size: { width: 75, height: 75 },
      purpose: 'Test device reliability',
      specifications: { stressTime: '1000h', temperature: '125C' }
    });
    
    return structures;
  }
}

class TapeoutDRCEngine {
  async performDRC(layoutData: any, constraints: any): Promise<TapeoutDRCReport> {
    console.log('Performing tapeout DRC');
    
    // Simulate DRC checking
    return {
      totalViolations: 0,
      criticalViolations: 0,
      violations: [],
      clean: true,
      categories: { spacing: 0, width: 0, area: 0, density: 0, connectivity: 0, antenna: 0 }
    };
  }
}

class TapeoutLVSEngine {
  async performLVS(layoutData: any): Promise<TapeoutLVSReport> {
    console.log('Performing tapeout LVS');
    
    // Simulate LVS checking
    return {
      totalErrors: 0,
      errors: [],
      clean: true,
      netlistMatch: true,
      connectivity: { totalNets: 10, matchedNets: 10, missingNets: 0, extraNets: 0 }
    };
  }
}

class TapeoutDensityAnalyzer {
  analyzeDensity(layoutData: any, constraints: any): TapeoutDensityReport {
    console.log('Analyzing tapeout density');
    
    // Simulate density analysis
    return {
      globalDensity: 0.3,
      layerDensity: { 'M1': 0.25, 'M2': 0.35, 'M3': 0.30 },
      densityMap: { gridSize: { x: 50, y: 50 }, density: [], averageDensity: 0.3, maxDensity: 0.8, minDensity: 0.1 },
      hotspots: [],
      recommendations: ['Consider reducing density in high-density areas']
    };
  }
}

class TapeoutManufacturabilityAnalyzer {
  analyzeManufacturability(request: TapeoutRequest, drcReport: TapeoutDRCReport, lvsReport: TapeoutLVSReport, densityReport: TapeoutDensityReport): TapeoutManufacturabilityReport {
    console.log('Analyzing tapeout manufacturability');
    
    // Simulate manufacturability analysis
    return {
      score: 85,
      yieldEstimate: 0.92,
      issues: [],
      recommendations: ['Optimize density distribution', 'Add dummy fill where needed'],
      riskAssessment: { low: 70, medium: 20, high: 8, critical: 2 }
    };
  }
}

// Export singleton instance
export const tapeoutEngine = new TapeoutEngine(); 
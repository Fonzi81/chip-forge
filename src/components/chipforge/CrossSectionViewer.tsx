import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CrossSectionAnalysis } from '../../backend/analysis/crossSectionAnalysis';
import { defaultTSMC7nmData } from '../../backend/visualization/chipDataModels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  EyeOff,
  Ruler,
  Crosshair,
  Layers,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Settings,
  Download,
  Info,
  Search,
  Filter,
  BarChart3,
  Thermometer,
  Zap,
  Box
} from 'lucide-react';

// Cross-Section Scene Component
function CrossSectionScene() {
  const { scene, camera } = useThree();
  const [crossSectionAnalysis] = useState(() => new CrossSectionAnalysis(scene, defaultTSMC7nmData));
  const [activePlane, setActivePlane] = useState<string | null>(null);
  const [crossSectionData, setCrossSectionData] = useState<any>(null);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [defectDetection, setDefectDetection] = useState(true);
  const [showMaterials, setShowMaterials] = useState(true);
  const [showDefects, setShowDefects] = useState(true);

  // Initialize scene
  useEffect(() => {
    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Initialize cross-section analysis
    const planes = crossSectionAnalysis.getAllPlanes();
    if (planes.length > 0) {
      const firstPlane = planes[0];
      setActivePlane(firstPlane.id);
      crossSectionAnalysis.setActivePlane(firstPlane.id);
      
      // Generate initial cross-section
      const data = crossSectionAnalysis.generateCrossSection(firstPlane.id);
      setCrossSectionData(data);
    }

    return () => {
      crossSectionAnalysis.dispose();
    };
  }, [scene, crossSectionAnalysis]);

  // Handle plane selection
  const handlePlaneSelect = useCallback((planeId: string) => {
    setActivePlane(planeId);
    crossSectionAnalysis.setActivePlane(planeId);
    
    // Generate cross-section for selected plane
    const data = crossSectionAnalysis.generateCrossSection(planeId);
    setCrossSectionData(data);
  }, [crossSectionAnalysis]);

  // Handle measurement mode
  const handleMeasurementMode = useCallback((enabled: boolean) => {
    setMeasurementMode(enabled);
    crossSectionAnalysis.setMeasurementMode(enabled);
  }, [crossSectionAnalysis]);

  // Handle defect detection
  const handleDefectDetection = useCallback((enabled: boolean) => {
    setDefectDetection(enabled);
    crossSectionAnalysis.setDefectDetection(enabled);
  }, [crossSectionAnalysis]);

  return (
    <>
      {/* Cross-section visualization will be rendered here */}
    </>
  );
}

// Plane Selection Panel
function PlaneSelectionPanel({ 
  activePlane, 
  onPlaneSelect 
}: { 
  activePlane: string | null;
  onPlaneSelect: (planeId: string) => void;
}) {
  const planes = [
    { id: 'horizontal', name: 'Horizontal Cut', type: 'horizontal' },
    { id: 'vertical', name: 'Vertical Cut', type: 'vertical' },
    { id: 'diagonal', name: 'Diagonal Cut', type: 'custom' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Cross-Section Planes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {planes.map((plane) => (
          <Button
            key={plane.id}
            variant={activePlane === plane.id ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onPlaneSelect(plane.id)}
          >
            <Box className="h-4 w-4 mr-2" />
            {plane.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

// Material Analysis Panel
function MaterialAnalysisPanel({ crossSectionData }: { crossSectionData: any }) {
  if (!crossSectionData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Material Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {crossSectionData.materials?.map((material: any) => (
          <div key={material.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{material.name}</span>
              <Badge variant="outline">{material.type}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Resistivity: {material.properties.resistivity} Ω·m</div>
              <div>Thermal: {material.properties.thermalConductivity} W/m·K</div>
              <div>Width: {material.dimensions.width} nm</div>
              <div>Height: {material.dimensions.height} nm</div>
            </div>
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Defect Analysis Panel
function DefectAnalysisPanel({ crossSectionData }: { crossSectionData: any }) {
  if (!crossSectionData) return null;

  const defects = crossSectionData.defects || [];
  const criticalDefects = defects.filter((d: any) => d.severity === 'critical');
  const majorDefects = defects.filter((d: any) => d.severity === 'major');
  const minorDefects = defects.filter((d: any) => d.severity === 'minor');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Defect Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{criticalDefects.length}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{majorDefects.length}</div>
            <div className="text-xs text-muted-foreground">Major</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{minorDefects.length}</div>
            <div className="text-xs text-muted-foreground">Minor</div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {defects.map((defect: any) => (
            <div key={defect.id} className="flex items-center gap-2 p-2 border rounded">
              <div className={`w-2 h-2 rounded-full ${
                defect.severity === 'critical' ? 'bg-red-500' :
                defect.severity === 'major' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{defect.type}</div>
                <div className="text-xs text-muted-foreground">{defect.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Measurement Panel
function MeasurementPanel({ crossSectionData }: { crossSectionData: any }) {
  if (!crossSectionData) return null;

  const measurements = crossSectionData.measurements || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Measurements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {measurements.map((measurement: any) => (
          <div key={measurement.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="text-sm font-medium">{measurement.type}</div>
              <div className="text-xs text-muted-foreground">
                {measurement.startPoint.x.toFixed(2)}, {measurement.startPoint.y.toFixed(2)} → 
                {measurement.endPoint.x.toFixed(2)}, {measurement.endPoint.y.toFixed(2)}
              </div>
            </div>
            <Badge variant="outline">
              {measurement.value} {measurement.unit}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Main Cross-Section Viewer Component
export default function CrossSectionViewer() {
  const [activePlane, setActivePlane] = useState<string | null>(null);
  const [crossSectionData, setCrossSectionData] = useState<any>(null);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [defectDetection, setDefectDetection] = useState(true);
  const [showMaterials, setShowMaterials] = useState(true);
  const [showDefects, setShowDefects] = useState(true);
  const [activeTab, setActiveTab] = useState('planes');

  const handlePlaneSelect = (planeId: string) => {
    setActivePlane(planeId);
    // Cross-section data will be updated by the scene component
  };

  return (
    <div className="h-screen flex">
      {/* 3D Viewport */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [10, 10, 10], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
        >
          <CrossSectionScene />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={50}
            minDistance={1}
          />
        </Canvas>
        
        {/* Overlay Controls */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMeasurementMode(!measurementMode)}
          >
            <Ruler className="h-4 w-4 mr-2" />
            Measure
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDefectDetection(!defectDetection)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Defects
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMaterials(!showMaterials)}
          >
            {showMaterials ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Materials
          </Button>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          <Badge variant="outline">
            Plane: {activePlane || 'None'}
          </Badge>
          <Badge variant="outline">
            Materials: {crossSectionData?.materials?.length || 0}
          </Badge>
          <Badge variant="outline">
            Defects: {crossSectionData?.defects?.length || 0}
          </Badge>
          <Badge variant="outline">
            Measurements: {crossSectionData?.measurements?.length || 0}
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-background border-l p-4 space-y-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="planes">Planes</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="defects">Defects</TabsTrigger>
            <TabsTrigger value="measurements">Measure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planes" className="space-y-4">
            <PlaneSelectionPanel 
              activePlane={activePlane} 
              onPlaneSelect={handlePlaneSelect} 
            />
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialAnalysisPanel crossSectionData={crossSectionData} />
          </TabsContent>
          
          <TabsContent value="defects" className="space-y-4">
            <DefectAnalysisPanel crossSectionData={crossSectionData} />
          </TabsContent>
          
          <TabsContent value="measurements" className="space-y-4">
            <MeasurementPanel crossSectionData={crossSectionData} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>
      </div>
    </div>
  );
} 
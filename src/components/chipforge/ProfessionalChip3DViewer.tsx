import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { defaultTSMC7nmData } from '../../backend/visualization/chipDataModels';
import { MaterialFactory, materialManager } from '../../backend/visualization/materialSystem';
import { TransistorGeometryFactory, TransistorManager, TransistorAnimation } from '../../backend/visualization/transistorModels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  Cpu, 
  Zap, 
  Thermometer, 
  Settings, 
  RotateCcw,
  Play,
  Pause,
  Maximize,
  Download,
  Info
} from 'lucide-react';

// Professional Chip Scene Component
function Chip3DScene() {
  const { scene, camera } = useThree();
  const [chipData] = useState(defaultTSMC7nmData);
  const transistorManagerRef = useRef<TransistorManager>();
  const animationRef = useRef<TransistorAnimation>();
  const [isAnimating, setIsAnimating] = useState(true);

  // Initialize scene
  useEffect(() => {
    // Create transistor manager
    transistorManagerRef.current = new TransistorManager(scene);
    animationRef.current = new TransistorAnimation();

    // Add transistors to scene
    chipData.transistors.forEach(transistor => {
      const geometry = transistorManagerRef.current!.addTransistor(transistor);
      animationRef.current!.addTransistor(geometry);
    });

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, 10, -5);
    scene.add(pointLight);

    // Set camera position
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    return () => {
      transistorManagerRef.current?.dispose();
    };
  }, [scene, camera, chipData]);

  // Animation loop
  useFrame((state, delta) => {
    if (isAnimating && animationRef.current) {
      animationRef.current.update(delta);
    }
    materialManager.updateMaterials(delta);
  });

  return null;
}

// Layer Control Component
function LayerControls({ chipData }: { chipData: typeof defaultTSMC7nmData }) {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(
    chipData.layers.reduce((acc, layer) => ({ ...acc, [layer.name]: layer.visible }), {})
  );

  const toggleLayer = (layerName: string) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Layer Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chipData.layers.map(layer => (
          <div key={layer.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-sm font-medium">{layer.name}</span>
            </div>
            <Switch
              checked={visibleLayers[layer.name]}
              onCheckedChange={() => toggleLayer(layer.name)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Chip Information Panel
function ChipInfoPanel({ chipData }: { chipData: typeof defaultTSMC7nmData }) {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Chip Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-lg">{chipData.name}</h4>
          <p className="text-sm text-muted-foreground">{chipData.technology.name.toUpperCase()}</p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Technology Node</p>
            <p className="text-2xl font-bold">{chipData.technology.node}nm</p>
          </div>
          <div>
            <p className="text-sm font-medium">Metal Layers</p>
            <p className="text-2xl font-bold">{chipData.technology.metalLayers}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Transistors</p>
            <p className="text-2xl font-bold">{(chipData.statistics.transistorCount / 1e9).toFixed(1)}B</p>
          </div>
          <div>
            <p className="text-sm font-medium">Power</p>
            <p className="text-2xl font-bold">{chipData.statistics.totalPower}W</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Max Frequency</span>
            <Badge variant="secondary">{chipData.statistics.maxFrequency} MHz</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Total Area</span>
            <Badge variant="secondary">{(chipData.statistics.totalArea / 1e6).toFixed(1)} mm²</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Max Temperature</span>
            <Badge variant="destructive">{chipData.thermal.maxTemperature}°C</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// View Controls
function ViewControls({ 
  onReset, 
  onToggleAnimation, 
  isAnimating 
}: { 
  onReset: () => void;
  onToggleAnimation: () => void;
  isAnimating: boolean;
}) {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          View Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          <Button onClick={onToggleAnimation} variant="outline" size="sm">
            {isAnimating ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Professional Chip 3D Viewer Component
export default function ProfessionalChip3DViewer() {
  const [chipData] = useState(defaultTSMC7nmData);
  const [isAnimating, setIsAnimating] = useState(true);
  const controlsRef = useRef<any>();

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className="h-screen flex">
      {/* 3D Viewport */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
        >
          <Chip3DScene />
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={1}
          />
        </Canvas>
        
        {/* Overlay Controls */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            {chipData.technology.name.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {chipData.statistics.totalPower}W
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Thermometer className="h-3 w-3" />
            {chipData.thermal.maxTemperature}°C
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-background border-l p-4 space-y-4 overflow-y-auto">
        <ChipInfoPanel chipData={chipData} />
        <ViewControls 
          onReset={handleReset}
          onToggleAnimation={handleToggleAnimation}
          isAnimating={isAnimating}
        />
        <LayerControls chipData={chipData} />
      </div>
    </div>
  );
} 
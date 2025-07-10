import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Chip3DLayout, ChipCell3D, ChipWire3D } from '../../backend/layout/chip3dModel';
import TopNav from "./TopNav";

const defaultLayout: Chip3DLayout = {
  cells: [
    { id: 'U1', type: 'AND2_X1', x: 0, y: 0, z: 0, width: 2, depth: 2, height: 1, layer: 1 },
    { id: 'U2', type: 'INV_X1', x: 3, y: 0, z: 0, width: 2, depth: 2, height: 1, layer: 1 }
  ],
  wires: [
    { from: [2, 1, 0.5], to: [3, 1, 0.5], layer: 1 }
  ],
  layers: ['metal1', 'metal2']
};

type Chip3DViewerProps = {
  layout?: Chip3DLayout;
};

function CellBlock({ cell, selected, onClick }: { cell: ChipCell3D; selected: boolean; onClick: (cell: ChipCell3D) => void }) {
  const ref = useRef<any>();
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.001 });
  return (
    <mesh
      position={[cell.x + cell.width / 2, cell.height / 2 + cell.z, cell.y + cell.depth / 2]}
      ref={ref}
      onClick={e => { e.stopPropagation(); onClick(cell); }}
      castShadow
    >
      <boxGeometry args={[cell.width, cell.height, cell.depth]} />
      <meshStandardMaterial color={selected ? '#f59e0b' : (cell.color || 'skyblue')} opacity={selected ? 0.8 : 1} transparent />
    </mesh>
  );
}

function WirePath({ wire }: { wire: ChipWire3D }) {
  const [x1, y1, z1] = wire.from;
  const [x2, y2, z2] = wire.to;
  const start = new THREE.Vector3(x1, y1, z1);
  const end = new THREE.Vector3(x2, y2, z2);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(up, direction.clone().normalize());
    return quat;
  }, [x1, y1, z1, x2, y2, z2]);
  return (
    <mesh position={position.toArray()} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, length]} />
      <meshStandardMaterial color="#ef4444" />
    </mesh>
  );
}

export default function Chip3DViewer({ layout = defaultLayout }: Chip3DViewerProps) {
  const [selectedCell, setSelectedCell] = useState<ChipCell3D | null>(null);
  const [showLayers, setShowLayers] = useState(() => layout.layers.map(() => true));
  const [hoveredCell, setHoveredCell] = useState<ChipCell3D | null>(null);

  // Layer toggle UI
  const handleLayerToggle = (idx: number) => {
    setShowLayers(l => l.map((v, i) => (i === idx ? !v : v)));
  };

  // Only show cells/wires for enabled layers
  const visibleCells = layout.cells.filter(cell => showLayers[cell.layer] !== false);
  const visibleWires = layout.wires.filter(wire => showLayers[wire.layer] !== false);

  return (
    <>
      <TopNav />
      <div className="h-[600px] w-full border bg-black rounded-lg shadow-lg flex flex-col">
        <div className="flex gap-4 p-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
          <span className="text-slate-200 font-semibold">Layers:</span>
          {layout.layers.map((layer, idx) => (
            <button
              key={layer}
              className={`px-2 py-1 rounded text-xs font-mono border ${showLayers[idx] ? 'bg-cyan-700 text-white' : 'bg-slate-700 text-slate-400'} mr-2`}
              onClick={() => handleLayerToggle(idx)}
            >
              {showLayers[idx] ? '✓' : ''} {layer}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Canvas camera={{ position: [5, 5, 10] }} shadows onPointerMissed={() => setSelectedCell(null)}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <OrbitControls />
            {visibleCells.map(cell => (
              <group key={cell.id}>
                <CellBlock
                  cell={cell}
                  selected={selectedCell?.id === cell.id}
                  onClick={setSelectedCell}
                />
                {/* Tooltip on hover */}
                <mesh
                  position={[cell.x + cell.width / 2, cell.height + 0.7 + cell.z, cell.y + cell.depth / 2]}
                  onPointerOver={() => setHoveredCell(cell)}
                  onPointerOut={() => setHoveredCell(null)}
                  visible={hoveredCell?.id === cell.id}
                >
                  <sphereGeometry args={[0.1]} />
                  <meshBasicMaterial color="#f59e0b" />
                  {hoveredCell?.id === cell.id && (
                    <Html center style={{ pointerEvents: 'none' }}>
                      <div className="bg-slate-900 text-xs text-white rounded px-2 py-1 border border-slate-700 shadow">
                        <div><b>{cell.id}</b> <span className="text-slate-400">({cell.type})</span></div>
                        <div>Pos: ({cell.x}, {cell.y}, {cell.z})</div>
                        <div>Layer: {cell.layer}</div>
                      </div>
                    </Html>
                  )}
                </mesh>
              </group>
            ))}
            {visibleWires.map((wire, i) => (
              <WirePath key={i} wire={wire} />
            ))}
          </Canvas>
          {/* Selected cell info overlay */}
          {selectedCell && (
            <div className="absolute top-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg z-10 min-w-[180px]">
              <div className="font-bold text-cyan-300 mb-2">Cell Info</div>
              <div className="text-slate-200 text-sm">ID: {selectedCell.id}</div>
              <div className="text-slate-400 text-xs mb-1">Type: {selectedCell.type}</div>
              <div className="text-slate-400 text-xs">Pos: ({selectedCell.x}, {selectedCell.y}, {selectedCell.z})</div>
              <div className="text-slate-400 text-xs">Dims: {selectedCell.width}×{selectedCell.depth}×{selectedCell.height}</div>
              <div className="text-slate-400 text-xs">Layer: {selectedCell.layer}</div>
              <button className="mt-2 px-2 py-1 rounded bg-cyan-700 text-white text-xs" onClick={() => setSelectedCell(null)}>Close</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 
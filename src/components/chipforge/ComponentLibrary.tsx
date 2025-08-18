import React, { useEffect, useState } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import componentLibrary from "@/lib/component.library.json";

// Type for a component block
interface ComponentBlock {
  id: string;
  name: string;
  category: string;
  label?: string;
  pins: { name: string; type: string; position: string }[];
  symbol?: string;
  hdl?: string;
}

export default function ComponentLibrary() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtered, setFiltered] = useState<ComponentBlock[]>([]);
  const addComponent = useHDLDesignStore((state) => state.addComponent);

  useEffect(() => {
    const query = search.toLowerCase();
    const results = (componentLibrary as ComponentBlock[]).filter((c) =>
      c.name.toLowerCase().includes(query) &&
      (selectedCategory === "all" || c.category === selectedCategory)
    );
    setFiltered(results);
  }, [search, selectedCategory]);

  const categories = ["all", "logic", "memory", "datapath", "io", "control", "analog"];

  const handleAdd = (block: ComponentBlock) => {
    addComponent({
      id: `${block.id}-${Date.now()}`,
      type: block.id,
      label: block.name,
      x: 100,
      y: 100,
      inputs: block.pins.filter(p => p.type === "input").map(p => p.name),
      outputs: block.pins.filter(p => p.type === "output").map(p => p.name),
    });
  };

  return (
    <div className="p-4 w-full max-w-xs bg-slate-900 text-white">
      <h3 className="text-lg font-semibold mb-2">Chip Component Library</h3>
      <Input
        placeholder="Search components..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      <Tabs defaultValue="all" onValueChange={(v) => setSelectedCategory(v)}>
        <TabsList className="overflow-x-auto whitespace-nowrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filtered.map((block) => (
                <Card key={block.id} className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-800" onClick={() => handleAdd(block)}>
                  <div>
                    <div className="font-medium text-sm">{block.name}</div>
                    <div className="text-xs text-slate-400">{block.category}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleAdd(block)}>
                    Add
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 
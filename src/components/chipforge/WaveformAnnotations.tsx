import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  MapPin, 
  Bookmark, 
  MessageSquare, 
  X, 
  Edit3,
  Flag,
  Clock,
  Zap
} from "lucide-react";

export interface Annotation {
  id: string;
  type: 'marker' | 'note' | 'measurement' | 'event';
  time: number;
  signal?: string;
  title: string;
  description?: string;
  color: string;
  position: { x: number; y: number };
}

interface WaveformAnnotationsProps {
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  onEditAnnotation: (id: string, annotation: Partial<Annotation>) => void;
  onDeleteAnnotation: (id: string) => void;
  onAnnotationClick: (annotation: Annotation) => void;
}

const WaveformAnnotations = ({
  annotations,
  onAddAnnotation,
  onEditAnnotation,
  onDeleteAnnotation,
  onAnnotationClick
}: WaveformAnnotationsProps) => {
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [annotationForm, setAnnotationForm] = useState({
    type: 'marker' as Annotation['type'],
    title: '',
    description: '',
    color: '#10b981',
    time: 0,
    signal: ''
  });

  const getAnnotationIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'marker':
        return <MapPin className="h-3 w-3" />;
      case 'note':
        return <MessageSquare className="h-3 w-3" />;
      case 'measurement':
        return <Flag className="h-3 w-3" />;
      case 'event':
        return <Zap className="h-3 w-3" />;
      default:
        return <Bookmark className="h-3 w-3" />;
    }
  };

  const getAnnotationColor = (type: Annotation['type']) => {
    switch (type) {
      case 'marker':
        return '#10b981'; // emerald
      case 'note':
        return '#3b82f6'; // blue
      case 'measurement':
        return '#f59e0b'; // amber
      case 'event':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const handleAddAnnotation = () => {
    const newAnnotation: Omit<Annotation, 'id'> = {
      ...annotationForm,
      color: getAnnotationColor(annotationForm.type),
      position: { x: 100, y: 100 } // Default position
    };
    
    onAddAnnotation(newAnnotation);
    setAnnotationForm({
      type: 'marker',
      title: '',
      description: '',
      color: '#10b981',
      time: 0,
      signal: ''
    });
    setIsAddingAnnotation(false);
  };

  const handleEditAnnotation = () => {
    if (!selectedAnnotation) return;
    
    onEditAnnotation(selectedAnnotation.id, annotationForm);
    setSelectedAnnotation(null);
    setIsAddingAnnotation(false);
  };

  const startEdit = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setAnnotationForm({
      type: annotation.type,
      title: annotation.title,
      description: annotation.description || '',
      color: annotation.color,
      time: annotation.time,
      signal: annotation.signal || ''
    });
    setIsAddingAnnotation(true);
  };

  return (
    <div className="space-y-4">
      {/* Annotation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-chipforge-accent" />
          <span className="font-medium text-slate-200 text-sm">Annotations</span>
          <Badge variant="outline" className="text-xs">
            {annotations.length}
          </Badge>
        </div>
        
        <Popover open={isAddingAnnotation} onOpenChange={setIsAddingAnnotation}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-slate-800 border-slate-700">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-200">
                {selectedAnnotation ? 'Edit Annotation' : 'Add Annotation'}
              </h4>
              
              {/* Type Selection */}
              <div className="flex gap-1">
                {(['marker', 'note', 'measurement', 'event'] as const).map(type => (
                  <Button
                    key={type}
                    variant={annotationForm.type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnnotationForm(prev => ({ ...prev, type }))}
                    className="flex-1 text-xs"
                  >
                    {getAnnotationIcon(type)}
                  </Button>
                ))}
              </div>
              
              {/* Form Fields */}
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={annotationForm.title}
                  onChange={(e) => setAnnotationForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600"
                />
                
                <Textarea
                  placeholder="Description (optional)"
                  value={annotationForm.description}
                  onChange={(e) => setAnnotationForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600 h-20 resize-none"
                />
                
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Time (ns)"
                    value={annotationForm.time}
                    onChange={(e) => setAnnotationForm(prev => ({ ...prev, time: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-900/50 border-slate-600 flex-1"
                  />
                  
                  <Input
                    placeholder="Signal (optional)"
                    value={annotationForm.signal}
                    onChange={(e) => setAnnotationForm(prev => ({ ...prev, signal: e.target.value }))}
                    className="bg-slate-900/50 border-slate-600 flex-1"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={selectedAnnotation ? handleEditAnnotation : handleAddAnnotation}
                  disabled={!annotationForm.title}
                  className="flex-1"
                  size="sm"
                >
                  {selectedAnnotation ? 'Update' : 'Add'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingAnnotation(false);
                    setSelectedAnnotation(null);
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Annotations List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {annotations.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-4">
            No annotations yet
          </div>
        ) : (
          annotations.map(annotation => (
            <Card
              key={annotation.id}
              className="bg-slate-800/30 border-slate-700 cursor-pointer hover:bg-slate-700/30 transition-colors"
              onClick={() => onAnnotationClick(annotation)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div
                    className="p-1 rounded"
                    style={{ backgroundColor: `${annotation.color}20`, color: annotation.color }}
                  >
                    {getAnnotationIcon(annotation.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-slate-200 text-sm truncate">
                        {annotation.title}
                      </h5>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(annotation);
                          }}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAnnotation(annotation.id);
                          }}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {annotation.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {annotation.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{annotation.time}ns</span>
                      </div>
                      {annotation.signal && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span className="font-mono">{annotation.signal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WaveformAnnotations;
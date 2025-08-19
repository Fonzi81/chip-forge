import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle,
  Library,
  Zap,
  Edit3,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export interface GuidedStep {
  id: number;
  title: string;
  description: string;
  target: string; // CSS selector or element ID to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  completed: boolean;
  action?: string; // Optional action to perform
}

interface GuidedModeProps {
  isActive: boolean;
  onToggle: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
}

const GUIDED_STEPS: GuidedStep[] = [
  {
    id: 1,
    title: "Welcome to ChipForge!",
    description: "Let's build your first schematic step by step. I'll guide you through the process of creating a digital circuit.",
    target: ".component-library",
    position: "left",
    completed: false
  },
  {
    id: 2,
    title: "Choose Components",
    description: "Start by selecting components from the library. Click on any component button to add it to your canvas. Try adding an AND gate or DFF (D-Flip Flop) to get started.",
    target: ".component-library",
    position: "left",
    completed: false,
    action: "Click on a component button"
  },
  {
    id: 3,
    title: "Place Components",
    description: "Great! Now you can drag components around the canvas to position them. Click and drag any component to move it. Components snap to a grid for neat organization.",
    target: "canvas",
    position: "bottom",
    completed: false,
    action: "Drag a component to a new position"
  },
  {
    id: 4,
    title: "Connect with Wires",
    description: "Time to connect your components! Click on an output port (right side) of one component, then click on an input port (left side) of another component to create a wire.",
    target: "canvas",
    position: "bottom",
    completed: false,
    action: "Connect two components with a wire"
  },
  {
    id: 5,
    title: "Name Your Signals",
    description: "Give your signals meaningful names. You can edit component labels and port names to make your design clear and understandable.",
    target: "canvas",
    position: "bottom",
    completed: false,
    action: "Double-click a component to edit its name"
  },
  {
    id: 6,
    title: "Plan Your Waveforms",
    description: "Think about how your circuit should behave. What inputs will you provide? What outputs do you expect? This planning helps you test your design later.",
    target: "canvas",
    position: "bottom",
    completed: false
  },
  {
    id: 7,
    title: "Test Your Design",
    description: "Congratulations! You've created your first schematic. You can now simulate your design, export it to HDL code, or continue building more complex circuits.",
    target: "canvas",
    position: "bottom",
    completed: false
  }
];

export default function GuidedMode({ 
  isActive, 
  onToggle, 
  currentStep, 
  onStepChange, 
  onComplete 
}: GuidedModeProps) {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  // Highlight the current step's target element
  useEffect(() => {
    if (!isActive) return;

    const targetElement = document.querySelector(GUIDED_STEPS[currentStep - 1]?.target);
    if (targetElement) {
      setHighlightedElement(targetElement as HTMLElement);
      // Add highlight class
      targetElement.classList.add('guided-highlight');
      
      return () => {
        targetElement.classList.remove('guided-highlight');
      };
    }
  }, [currentStep, isActive]);

  if (!isActive) return null;

  const currentStepData = GUIDED_STEPS[currentStep - 1];
  const progress = (currentStep / GUIDED_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < GUIDED_STEPS.length) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" />
      
      {/* Guided Mode Panel */}
      <div className="fixed right-4 top-4 w-96 z-50">
        <Card className="bg-slate-800 border-slate-600 text-slate-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-lg">Guided Mode</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
              <span>Step {currentStep} of {GUIDED_STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Current Step */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Step {currentStep}
                </Badge>
                <h3 className="font-semibold text-slate-200">{currentStepData.title}</h3>
              </div>
              
              <p className="text-slate-300 text-sm leading-relaxed">
                {currentStepData.description}
              </p>

              {currentStepData.action && (
                <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">Action Required:</span>
                  </div>
                  <p className="text-slate-300 mt-1">{currentStepData.action}</p>
                </div>
              )}
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex gap-1">
                {GUIDED_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => onStepChange(step.id)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step.id === currentStep 
                        ? 'bg-blue-400' 
                        : step.completed 
                          ? 'bg-green-400' 
                          : 'bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              {currentStep < GUIDED_STEPS.length ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-600">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Skip Tutorial
                </Button>
                
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <HelpCircle className="h-3 w-3" />
                  <span>Need help? Check the documentation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => onStepChange(1)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shadow-lg"
          title="Restart Guided Mode"
        >
          <Lightbulb className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
} 
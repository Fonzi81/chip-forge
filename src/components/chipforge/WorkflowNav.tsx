import React from 'react';
import { useWorkflowStore, WORKFLOW_STAGES } from '../../state/workflowState';
import { CheckCircle, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkflowNav() {
  const { currentStage, completedStages } = useWorkflowStore();

  return (
    <div className="w-full bg-slate-800 text-slate-100 px-4 py-2 flex justify-between items-center text-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="flex items-center gap-4">
        {WORKFLOW_STAGES.map(({ id, label, path }) => {
          const isDone = completedStages.includes(id);
          const isCurrent = currentStage === id;
          return (
            <Link key={id} to={path} className="flex items-center gap-1">
              {isDone ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <CircleDot className="h-4 w-4 text-slate-400" />
              )}
              <span className={isCurrent ? 'font-bold text-white' : 'text-slate-400'}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 
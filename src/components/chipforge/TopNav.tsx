import React from "react";
import { Link, useLocation } from "react-router-dom";
import { WORKFLOW_STAGES } from "../../state/workflowState";

const extraLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/hdl-reflexion-agent", label: "Reflexion Agent" },
  { to: "/hdl-generator", label: "HDL Generator" },
  { to: "/chip3d-viewer", label: "3D Chip Viewer" },
  { to: "/learning-panel", label: "Learning" },
];

export default function TopNav() {
  const location = useLocation();
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2 flex gap-4 items-center z-50 sticky top-0">
      {/* Main workflow links */}
      {WORKFLOW_STAGES.map(stage => (
        <Link
          key={stage.path}
          to={stage.path}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-slate-800 hover:text-cyan-400 ${location.pathname === stage.path ? "bg-slate-800 text-cyan-400" : "text-slate-200"}`}
        >
          {stage.label}
        </Link>
      ))}
      {/* Extra links */}
      {extraLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-slate-800 hover:text-cyan-400 ${location.pathname === link.to ? "bg-slate-800 text-cyan-400" : "text-slate-200"}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
} 
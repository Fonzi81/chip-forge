import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight,
  AlertCircle,
  Info,
  Lightbulb,
  Hash,
  Save
} from "lucide-react";

interface CodeError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface CodeEditorProps {
  content: string;
  language: 'verilog' | 'vhdl' | 'systemverilog';
  onChange: (content: string) => void;
  errors?: CodeError[];
  onSave?: () => void;
  readOnly?: boolean;
}

const CodeEditor = ({
  content,
  language,
  onChange,
  errors = [],
  onSave,
  readOnly = false
}: CodeEditorProps) => {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = content.split('\n');

  // Syntax highlighting keywords for different HDL languages
  const getKeywords = () => {
    switch (language) {
      case 'verilog':
      case 'systemverilog':
        return ['module', 'endmodule', 'input', 'output', 'reg', 'wire', 'always', 'begin', 'end', 'if', 'else', 'case', 'endcase', 'for', 'while', 'assign'];
      case 'vhdl':
        return ['entity', 'architecture', 'begin', 'end', 'signal', 'port', 'map', 'process', 'if', 'then', 'else', 'case', 'when', 'loop', 'while'];
      default:
        return [];
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const currentLine = content.substring(0, cursorPos).split('\n').pop() || '';
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Add extra indent for block statements
      const needsExtraIndent = /\b(begin|always|if|else|case|module|entity|architecture|process)\s*$/.test(currentLine.trim());
      const extraIndent = needsExtraIndent ? '  ' : '';
      
      setTimeout(() => {
        const newCursorPos = textarea.selectionStart;
        const beforeCursor = content.substring(0, newCursorPos);
        const afterCursor = content.substring(newCursorPos);
        const newContent = beforeCursor + currentIndent + extraIndent + afterCursor;
        onChange(newContent);
        
        // Set cursor position after indent
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = newCursorPos + currentIndent.length + extraIndent.length;
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 0);
      }, 0);
    }

    // Auto-close brackets and quotes
    const autoCloseChars: { [key: string]: string } = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    if (autoCloseChars[e.key]) {
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const closeChar = autoCloseChars[e.key];
      
      setTimeout(() => {
        const beforeCursor = content.substring(0, cursorPos + 1);
        const afterCursor = content.substring(cursorPos + 1);
        const newContent = beforeCursor + closeChar + afterCursor;
        onChange(newContent);
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(cursorPos + 1, cursorPos + 1);
          }
        }, 0);
      }, 0);
    }
  };

  const updateCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const beforeCursor = content.substring(0, cursorPos);
      const lines = beforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
    }
  };

  const getErrorsForLine = (lineNumber: number) => {
    return errors.filter(error => error.line === lineNumber);
  };

  const getErrorIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'info':
        return <Info className="h-3 w-3 text-blue-400" />;
      default:
        return <Lightbulb className="h-3 w-3 text-green-400" />;
    }
  };

  const toggleLineFold = (lineNumber: number) => {
    const newFolded = new Set(foldedLines);
    if (newFolded.has(lineNumber)) {
      newFolded.delete(lineNumber);
    } else {
      newFolded.add(lineNumber);
    }
    setFoldedLines(newFolded);
  };

  const isFoldableLine = (line: string) => {
    return /\b(begin|always|if|module|entity|architecture|process)\b/.test(line);
  };

  const renderLineNumbers = () => {
    if (!showLineNumbers) return null;

    return (
      <div className="flex-shrink-0 w-12 bg-slate-900/50 border-r border-slate-700 p-2 text-xs text-slate-500 font-mono select-none">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const lineErrors = getErrorsForLine(lineNumber);
          const isFoldable = isFoldableLine(line);
          const isFolded = foldedLines.has(lineNumber);

          return (
            <div
              key={lineNumber}
              className="flex items-center justify-between h-5 group"
            >
              <span className={`text-right w-8 ${cursorPosition.line === lineNumber ? 'text-chipforge-waveform font-bold' : ''}`}>
                {lineNumber}
              </span>
              
              <div className="flex items-center gap-1">
                {lineErrors.length > 0 && (
                  <div className="flex">
                    {lineErrors.map((error, i) => (
                      <div key={i} title={error.message}>
                        {getErrorIcon(error.severity)}
                      </div>
                    ))}
                  </div>
                )}
                
                {isFoldable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLineFold(lineNumber)}
                    className="h-3 w-3 p-0 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300"
                  >
                    {isFolded ? (
                      <ChevronRight className="h-2 w-2" />
                    ) : (
                      <ChevronDown className="h-2 w-2" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-2 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          <span className="text-xs text-slate-400">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className="text-xs text-slate-400 hover:text-slate-200"
            aria-label={`${showLineNumbers ? 'Hide' : 'Show'} line numbers`}
          >
            <Hash className="h-4 w-4" />
          </Button>
          {errors.length > 0 && (
            <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
              {errors.length} {errors.length === 1 ? 'issue' : 'issues'}
            </Badge>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {renderLineNumbers()}
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onMouseUp={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            className="h-full w-full bg-transparent border-0 text-slate-100 font-mono text-sm resize-none focus:ring-0 focus:outline-none p-3 leading-5"
            placeholder={`Enter your ${language.toUpperCase()} code here...`}
            readOnly={readOnly}
            style={{ 
              minHeight: '100%',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }}
          />
          
          {/* Error Tooltips */}
          {errors.map((error, index) => (
            <div
              key={index}
              className="absolute bg-red-500/10 border border-red-500/30 rounded p-2 text-xs text-red-300 z-10 pointer-events-none"
              style={{
                top: `${(error.line - 1) * 20 + 40}px`,
                left: '10px',
                maxWidth: '300px'
              }}
            >
              <div className="flex items-center gap-1">
                {getErrorIcon(error.severity)}
                <span className="font-medium capitalize">{error.severity}</span>
              </div>
              <p className="mt-1">{error.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between p-2 bg-slate-800/50 border-t border-slate-700">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className="text-slate-400 hover:text-slate-200"
            aria-label={`${showLineNumbers ? 'Hide' : 'Show'} line numbers`}
          >
            <Hash className="h-4 w-4" />
          </Button>
          <span className="text-xs text-slate-500">
            Line {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Save file"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
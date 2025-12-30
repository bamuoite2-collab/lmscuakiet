import { useState, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { 
  Bold, 
  Italic, 
  List,
  Atom,
  ArrowRight,
  ArrowLeftRight,
  ArrowUp,
  ArrowDown,
  FlaskConical,
  Columns,
  Eye,
  Edit3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChemistryEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  rows?: number; // Alias for minRows (backward compatibility)
  required?: boolean;
  splitView?: boolean;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  insertText: string;
  cursorOffset?: number; // Where to place cursor after insertion
}

const toolbarGroups: { title: string; buttons: ToolbarButton[] }[] = [
  {
    title: 'Công thức',
    buttons: [
      { icon: <span className="font-mono text-xs">$</span>, label: 'Inline Math', insertText: '$ $', cursorOffset: 2 },
      { icon: <span className="font-mono text-xs">$$</span>, label: 'Block Math', insertText: '$$\n\n$$', cursorOffset: 3 },
    ]
  },
  {
    title: 'Hóa học',
    buttons: [
      { icon: <FlaskConical className="h-4 w-4" />, label: 'Phương trình hóa học', insertText: '$\\ce{}$', cursorOffset: 5 },
      { icon: <ArrowRight className="h-4 w-4" />, label: 'Mũi tên phản ứng', insertText: '$\\ce{->}$', cursorOffset: 9 },
      { icon: <ArrowLeftRight className="h-4 w-4" />, label: 'Cân bằng thuận nghịch', insertText: '$\\ce{<=>}$', cursorOffset: 10 },
      { icon: <ArrowUp className="h-4 w-4" />, label: 'Chất khí thoát ra', insertText: '$\\ce{^}$', cursorOffset: 8 },
      { icon: <ArrowDown className="h-4 w-4" />, label: 'Kết tủa', insertText: '$\\ce{v}$', cursorOffset: 8 },
    ]
  },
  {
    title: 'Điều kiện',
    buttons: [
      { icon: <Atom className="h-4 w-4" />, label: 'Điều kiện phản ứng', insertText: '$\\xrightarrow{t^\\circ}$', cursorOffset: 23 },
      { icon: <span className="text-xs">xt</span>, label: 'Xúc tác', insertText: '$\\xrightarrow{t^\\circ, xt}$', cursorOffset: 27 },
    ]
  },
  {
    title: 'Định dạng',
    buttons: [
      { icon: <Bold className="h-4 w-4" />, label: 'In đậm', insertText: '**text**', cursorOffset: 2 },
      { icon: <Italic className="h-4 w-4" />, label: 'In nghiêng', insertText: '*text*', cursorOffset: 1 },
      { icon: <List className="h-4 w-4" />, label: 'Danh sách', insertText: '\n- ', cursorOffset: 3 },
    ]
  }
];

const quickInserts: { label: string; text: string }[] = [
  { label: 'H₂SO₄', text: '$\\ce{H2SO4}$' },
  { label: 'NaOH', text: '$\\ce{NaOH}$' },
  { label: 'H₂O', text: '$\\ce{H2O}$' },
  { label: 'CO₂', text: '$\\ce{CO2}$' },
  { label: 'Fe²⁺', text: '$\\ce{Fe^{2+}}$' },
  { label: 'SO₄²⁻', text: '$\\ce{SO4^{2-}}$' },
];

export function ChemistryEditor({
  label,
  value,
  onChange,
  placeholder = 'Nhập nội dung có hỗ trợ LaTeX và Hóa học...\nVí dụ: $\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$',
  minRows,
  rows,
  required = false,
  splitView = false,
}: ChemistryEditorProps) {
  const actualRows = minRows ?? rows ?? 8;
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>(splitView ? 'split' : 'edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback((text: string, cursorOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = text;
    let newCursorPos = start + (cursorOffset ?? text.length);

    // If there's selected text and the insert has a placeholder, replace it
    if (selectedText && text.includes('text')) {
      newText = text.replace('text', selectedText);
      newCursorPos = start + newText.length;
    } else if (selectedText && text.includes('{}')) {
      newText = text.replace('{}', `{${selectedText}}`);
      newCursorPos = start + newText.length;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const renderToolbar = () => (
    <div className="border rounded-t-md bg-muted/30 p-2 space-y-2">
      <div className="flex flex-wrap gap-1">
        {toolbarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-0.5">
            {groupIndex > 0 && <div className="w-px h-6 bg-border mx-1" />}
            <TooltipProvider delayDuration={300}>
              {group.buttons.map((button, btnIndex) => (
                <Tooltip key={btnIndex}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => insertAtCursor(button.insertText, button.cursorOffset)}
                    >
                      {button.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{button.label}</p>
                    <code className="text-xs text-muted-foreground">{button.insertText}</code>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        ))}
      </div>

      {/* Quick Insert Row */}
      <div className="flex flex-wrap gap-1 pt-1 border-t border-border/50">
        <span className="text-xs text-muted-foreground mr-2 self-center">Chèn nhanh:</span>
        {quickInserts.map((item, index) => (
          <Button
            key={index}
            type="button"
            variant="outline"
            size="sm"
            className="h-6 text-xs px-2"
            onClick={() => insertAtCursor(item.text)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderEditor = (className?: string) => (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={cn(
        "font-mono text-sm rounded-t-none border-t-0 resize-none min-h-[200px]",
        className
      )}
      style={{ minHeight: `${actualRows * 1.5}rem` }}
      onInput={(e) => {
        // Auto-resize
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${Math.max(target.scrollHeight, actualRows * 24)}px`;
      }}
    />
  );

  const renderPreview = (className?: string) => (
    <div className={cn(
      "min-h-[200px] p-4 border rounded-md bg-card overflow-auto",
      className
    )} style={{ minHeight: `${actualRows * 1.5}rem` }}>
      {value ? (
        <ContentWithLatex content={value} className="prose prose-sm max-w-none dark:prose-invert" />
      ) : (
        <p className="text-muted-foreground text-sm italic">Chưa có nội dung để xem trước</p>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setViewMode('edit')}
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Soạn thảo
          </Button>
          <Button
            type="button"
            variant={viewMode === 'split' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setViewMode('split')}
          >
            <Columns className="h-3.5 w-3.5 mr-1" />
            Chia đôi
          </Button>
          <Button
            type="button"
            variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setViewMode('preview')}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Xem trước
          </Button>
        </div>
      </div>

      {viewMode === 'edit' && (
        <div>
          {renderToolbar()}
          {renderEditor()}
        </div>
      )}

      {viewMode === 'preview' && renderPreview()}

      {viewMode === 'split' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            {renderToolbar()}
            {renderEditor()}
          </div>
          {renderPreview()}
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Công thức:</strong> <code className="bg-muted px-1 rounded">$...$</code> inline, 
          <code className="bg-muted px-1 rounded ml-1">$$...$$</code> block
        </p>
        <p>
          <strong>Hóa học:</strong> <code className="bg-muted px-1 rounded">$\ce{'{H2SO4}'}$</code> → H₂SO₄, 
          <code className="bg-muted px-1 rounded ml-1">$\ce{'{->}'}$</code> → mũi tên
        </p>
      </div>
    </div>
  );
}

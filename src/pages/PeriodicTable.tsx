import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { elements, Element, getCategoryColor, atomicMasses } from '@/data/elements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator, X, Atom, Zap, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PeriodicTablePage() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [formula, setFormula] = useState('');
  const [molarMassResult, setMolarMassResult] = useState<{ mass: number; breakdown: string[] } | null>(null);
  const [calcError, setCalcError] = useState('');

  // Build grid positions
  const getGridPosition = (element: Element) => {
    // Special handling for lanthanides and actinides
    if (element.category === 'lanthanide') {
      const lantIndex = element.atomicNumber - 57;
      return { row: 9, col: lantIndex + 4 };
    }
    if (element.category === 'actinide') {
      const actIndex = element.atomicNumber - 89;
      return { row: 10, col: actIndex + 4 };
    }
    
    // Regular elements
    let col = element.group;
    let row = element.period;
    
    // Handle La and Ac placeholders
    if (element.period === 6 && element.group >= 4 && element.atomicNumber >= 72) {
      col = element.group;
    }
    if (element.period === 7 && element.group >= 4 && element.atomicNumber >= 104) {
      col = element.group;
    }
    
    return { row, col };
  };

  // Parse chemical formula and calculate molar mass
  const calculateMolarMass = () => {
    if (!formula.trim()) {
      setCalcError('Vui lòng nhập công thức hóa học');
      setMolarMassResult(null);
      return;
    }

    try {
      // Parse formula like H2SO4, Ca(OH)2, Fe2(SO4)3
      const parseFormula = (f: string): Record<string, number> => {
        const result: Record<string, number> = {};
        
        // Handle parentheses first
        const parenRegex = /\(([^)]+)\)(\d*)/g;
        let processed = f;
        let match;
        
        while ((match = parenRegex.exec(f)) !== null) {
          const inner = match[1];
          const multiplier = parseInt(match[2]) || 1;
          const innerElements = parseFormula(inner);
          
          for (const [symbol, count] of Object.entries(innerElements)) {
            result[symbol] = (result[symbol] || 0) + count * multiplier;
          }
          processed = processed.replace(match[0], '');
        }
        
        // Parse remaining elements
        const elementRegex = /([A-Z][a-z]?)(\d*)/g;
        while ((match = elementRegex.exec(processed)) !== null) {
          const symbol = match[1];
          const count = parseInt(match[2]) || 1;
          result[symbol] = (result[symbol] || 0) + count;
        }
        
        return result;
      };

      const elementCounts = parseFormula(formula);
      let totalMass = 0;
      const breakdown: string[] = [];

      for (const [symbol, count] of Object.entries(elementCounts)) {
        if (!atomicMasses[symbol]) {
          throw new Error(`Nguyên tố không hợp lệ: ${symbol}`);
        }
        const mass = atomicMasses[symbol] * count;
        totalMass += mass;
        breakdown.push(`${symbol}${count > 1 ? count : ''}: ${count} × ${atomicMasses[symbol].toFixed(2)} = ${mass.toFixed(2)}`);
      }

      setMolarMassResult({ mass: totalMass, breakdown });
      setCalcError('');
    } catch (error) {
      setCalcError(error instanceof Error ? error.message : 'Công thức không hợp lệ');
      setMolarMassResult(null);
    }
  };

  const categories = [
    { key: 'alkali-metal', label: 'Kim loại kiềm', color: 'bg-red-500' },
    { key: 'alkaline-earth', label: 'Kim loại kiềm thổ', color: 'bg-orange-500' },
    { key: 'transition-metal', label: 'Kim loại chuyển tiếp', color: 'bg-yellow-500' },
    { key: 'post-transition', label: 'Kim loại sau chuyển tiếp', color: 'bg-emerald-500' },
    { key: 'metalloid', label: 'Á kim', color: 'bg-teal-500' },
    { key: 'nonmetal', label: 'Phi kim', color: 'bg-green-500' },
    { key: 'halogen', label: 'Halogen', color: 'bg-cyan-500' },
    { key: 'noble-gas', label: 'Khí hiếm', color: 'bg-purple-500' },
    { key: 'lanthanide', label: 'Họ Lantan', color: 'bg-pink-500' },
    { key: 'actinide', label: 'Họ Actini', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Atom className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Bảng Tuần Hoàn Các Nguyên Tố
                </h1>
                <p className="text-muted-foreground">
                  Chuẩn IUPAC - Nhấn vào nguyên tố để xem chi tiết
                </p>
              </div>
            </div>

            {/* Molar Mass Calculator */}
            <div className="bg-card border rounded-xl p-4 w-full lg:w-96">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Tính Khối lượng Mol</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="VD: H2SO4, Ca(OH)2"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && calculateMolarMass()}
                />
                <Button onClick={calculateMolarMass}>Tính</Button>
              </div>
              {calcError && (
                <p className="text-destructive text-sm mt-2">{calcError}</p>
              )}
              {molarMassResult && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-primary mb-2">
                    M = {molarMassResult.mass.toFixed(2)} g/mol
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {molarMassResult.breakdown.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <div key={cat.key} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded", cat.color)} />
                <span className="text-xs text-muted-foreground">{cat.label}</span>
              </div>
            ))}
          </div>

          {/* Periodic Table Grid */}
          <div className="overflow-x-auto pb-4">
            <div 
              className="grid gap-0.5 min-w-[1100px]"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
              }}
            >
              {/* Period numbers */}
              {[1, 2, 3, 4, 5, 6, 7].map(period => (
                <div
                  key={`period-${period}`}
                  className="flex items-center justify-center text-xs text-muted-foreground font-medium"
                  style={{ gridRow: period, gridColumn: 1 }}
                >
                </div>
              ))}

              {/* Group numbers */}
              {Array.from({ length: 18 }, (_, i) => i + 1).map(group => (
                <div
                  key={`group-${group}`}
                  className="flex items-center justify-center text-[10px] text-muted-foreground"
                  style={{ gridRow: 1, gridColumn: group }}
                >
                </div>
              ))}

              {/* Element cells */}
              {elements.map(element => {
                const { row, col } = getGridPosition(element);
                
                // Skip lanthanides/actinides in main grid (show placeholders)
                if ((element.atomicNumber >= 57 && element.atomicNumber <= 71) ||
                    (element.atomicNumber >= 89 && element.atomicNumber <= 103)) {
                  return (
                    <button
                      key={element.atomicNumber}
                      onClick={() => setSelectedElement(element)}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded text-white transition-all hover:scale-110 hover:z-10 cursor-pointer p-0.5",
                        getCategoryColor(element.category)
                      )}
                      style={{ gridRow: row, gridColumn: col }}
                    >
                      <span className="text-[8px] opacity-80">{element.atomicNumber}</span>
                      <span className="text-sm font-bold leading-tight">{element.symbol}</span>
                      <span className="text-[7px] opacity-70 truncate w-full text-center">{element.atomicMass.toFixed(1)}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={element.atomicNumber}
                    onClick={() => setSelectedElement(element)}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center rounded text-white transition-all hover:scale-110 hover:z-10 cursor-pointer p-0.5",
                      getCategoryColor(element.category)
                    )}
                    style={{ gridRow: row, gridColumn: col }}
                  >
                    <span className="text-[8px] opacity-80">{element.atomicNumber}</span>
                    <span className="text-sm font-bold leading-tight">{element.symbol}</span>
                    <span className="text-[7px] opacity-70 truncate w-full text-center">{element.atomicMass.toFixed(1)}</span>
                  </button>
                );
              })}

              {/* La-Lu placeholder */}
              <div
                className="flex items-center justify-center text-[10px] text-muted-foreground bg-muted/50 rounded"
                style={{ gridRow: 6, gridColumn: 3 }}
              >
                57-71
              </div>

              {/* Ac-Lr placeholder */}
              <div
                className="flex items-center justify-center text-[10px] text-muted-foreground bg-muted/50 rounded"
                style={{ gridRow: 7, gridColumn: 3 }}
              >
                89-103
              </div>

              {/* Lanthanide label */}
              <div
                className="flex items-center text-xs text-muted-foreground"
                style={{ gridRow: 9, gridColumn: 1, gridColumnEnd: 4 }}
              >
                Họ Lantan →
              </div>

              {/* Actinide label */}
              <div
                className="flex items-center text-xs text-muted-foreground"
                style={{ gridRow: 10, gridColumn: 1, gridColumnEnd: 4 }}
              >
                Họ Actini →
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Element Detail Dialog */}
      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedElement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white",
                    getCategoryColor(selectedElement.category)
                  )}>
                    <span className="text-xs opacity-80">{selectedElement.atomicNumber}</span>
                    <span className="text-2xl font-bold">{selectedElement.symbol}</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{selectedElement.nameVi}</div>
                    <div className="text-sm text-muted-foreground">{selectedElement.name}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Atom className="h-3 w-3" />
                      Số hiệu nguyên tử (Z)
                    </div>
                    <div className="text-xl font-bold text-foreground">{selectedElement.atomicNumber}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      Nguyên tử khối (M)
                    </div>
                    <div className="text-xl font-bold text-foreground">{selectedElement.atomicMass} u</div>
                  </div>
                </div>

                {/* Electron Config */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-2">Cấu hình electron</div>
                  <div className="font-mono text-lg text-primary">{selectedElement.electronConfig}</div>
                </div>

                {/* Properties */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Độ âm điện
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedElement.electronegativity ?? 'N/A'}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Phân loại</div>
                    <div className={cn(
                      "inline-flex px-2 py-1 rounded-full text-sm font-medium text-white",
                      getCategoryColor(selectedElement.category)
                    )}>
                      {selectedElement.categoryVi}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-muted/30 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Chu kỳ</div>
                    <div className="font-semibold">{selectedElement.period}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Nhóm</div>
                    <div className="font-semibold">{selectedElement.group}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Phân lớp</div>
                    <div className="font-semibold">{selectedElement.block}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

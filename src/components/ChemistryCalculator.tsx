import { useState } from 'react';
import { Calculator, X, ChevronRight, Beaker, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { atomicMasses } from '@/data/elements';
import { KaTeXRenderer } from './KaTeXRenderer';

// Parse chemical formula including hydrates like CuSO4.5H2O
const parseFormula = (formula: string): Record<string, number> | null => {
  const result: Record<string, number> = {};

  // Handle hydrates: split by . or · and process each part
  const parts = formula.split(/[.·]/);
  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    let part = parts[partIndex].trim();
    let multiplier = 1;

    // Check for coefficient at the start (e.g., 5H2O)
    if (partIndex > 0) {
      const coeffMatch = part.match(/^(\d+)(.+)$/);
      if (coeffMatch) {
        multiplier = parseInt(coeffMatch[1]);
        part = coeffMatch[2];
      }
    }

    // Parse the formula part
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;
    const stack: {
      counts: Record<string, number>;
      multiplier: number;
    }[] = [{
      counts: {},
      multiplier: 1
    }];
    let i = 0;
    while (i < part.length) {
      if (part[i] === '(') {
        stack.push({
          counts: {},
          multiplier: 1
        });
        i++;
      } else if (part[i] === ')') {
        const current = stack.pop();
        if (!current || stack.length === 0) return null;

        // Get the number after )
        let numStr = '';
        i++;
        while (i < part.length && /\d/.test(part[i])) {
          numStr += part[i];
          i++;
        }
        const num = numStr ? parseInt(numStr) : 1;

        // Add to parent
        const parent = stack[stack.length - 1];
        for (const [el, count] of Object.entries(current.counts)) {
          parent.counts[el] = (parent.counts[el] || 0) + count * num;
        }
      } else {
        // Match element
        const elementMatch = part.slice(i).match(/^([A-Z][a-z]?)(\d*)/);
        if (elementMatch) {
          const element = elementMatch[1];
          const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
          if (!atomicMasses[element]) return null;
          const current = stack[stack.length - 1];
          current.counts[element] = (current.counts[element] || 0) + count;
          i += elementMatch[0].length;
        } else {
          i++;
        }
      }
    }
    if (stack.length !== 1) return null;

    // Add to result with multiplier
    for (const [el, count] of Object.entries(stack[0].counts)) {
      result[el] = (result[el] || 0) + count * multiplier;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
};
const calculateMolarMass = (formula: string): number | null => {
  const parsed = parseFormula(formula);
  if (!parsed) return null;
  let mass = 0;
  for (const [element, count] of Object.entries(parsed)) {
    mass += atomicMasses[element] * count;
  }
  return Math.round(mass * 100) / 100;
};
const ChemistryCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formula, setFormula] = useState('');
  const [molarMass, setMolarMass] = useState<number | null>(null);
  const [formulaError, setFormulaError] = useState(false);

  // Concentration CM = n/V
  const [moles, setMoles] = useState('');
  const [volume, setVolume] = useState('');
  const [cmResult, setCmResult] = useState<number | null>(null);

  // Concentration C% = m_ct / m_dd * 100
  const [massSolute, setMassSolute] = useState('');
  const [massSolution, setMassSolution] = useState('');
  const [percentResult, setPercentResult] = useState<number | null>(null);
  const handleFormulaChange = (value: string) => {
    setFormula(value);
    if (value.trim()) {
      const mass = calculateMolarMass(value.trim());
      if (mass !== null) {
        setMolarMass(mass);
        setFormulaError(false);
      } else {
        setMolarMass(null);
        setFormulaError(true);
      }
    } else {
      setMolarMass(null);
      setFormulaError(false);
    }
  };
  const calculateCM = () => {
    const n = parseFloat(moles);
    const v = parseFloat(volume);
    if (!isNaN(n) && !isNaN(v) && v > 0) {
      setCmResult(Math.round(n / v * 10000) / 10000);
    } else {
      setCmResult(null);
    }
  };
  const calculatePercent = () => {
    const mct = parseFloat(massSolute);
    const mdd = parseFloat(massSolution);
    if (!isNaN(mct) && !isNaN(mdd) && mdd > 0) {
      setPercentResult(Math.round(mct / mdd * 10000) / 100);
    } else {
      setPercentResult(null);
    }
  };
  return <>
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-primary-foreground p-3 rounded-l-lg shadow-lg hover:bg-primary/90 transition-all duration-300 ${isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`} title="Máy tính Hóa học">
        <Calculator className="h-5 w-5" />
      </button>

      {/* Sidebar Calculator */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Máy tính Hóa học</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <Tabs defaultValue="molar" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="molar" className="text-xs">
                  <Beaker className="h-3 w-3 mr-1" />
                  M
                </TabsTrigger>
                <TabsTrigger value="cm" className="text-xs">
                  <FlaskConical className="h-3 w-3 mr-1" />
                  C<sub>M</sub>
                </TabsTrigger>
                <TabsTrigger value="percent" className="text-xs">
                  
                  C%
                </TabsTrigger>
              </TabsList>

              {/* Molar Mass Calculator */}
              <TabsContent value="molar" className="space-y-4">
                <div>
                  <Label htmlFor="formula" className="text-sm font-medium">
                    Công thức phân tử
                  </Label>
                  <Input id="formula" placeholder="VD: H2SO4, CuSO4.5H2O" value={formula} onChange={e => handleFormulaChange(e.target.value)} className={`mt-1 ${formulaError ? 'border-destructive' : ''}`} />
                  {formulaError && <p className="text-xs text-destructive mt-1">
                      Công thức không hợp lệ
                    </p>}
                </div>

                {molarMass !== null && <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Khối lượng mol:</p>
                    <div className="text-2xl font-bold text-primary">
                      <KaTeXRenderer content={`M = ${molarMass} \\text{ g/mol}`} />
                    </div>
                  </div>}

                <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">Hướng dẫn:</p>
                  <p>• Nhập công thức: H2O, NaCl, H2SO4</p>
                  <p>• Muối ngậm nước: CuSO4.5H2O</p>
                  <p>• Dùng dấu chấm (.) cho hydrat</p>
                </div>
              </TabsContent>

              {/* CM Calculator */}
              <TabsContent value="cm" className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                  <KaTeXRenderer content="C_M = \frac{n}{V}" displayMode />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="moles" className="text-sm">
                      Số mol chất tan (n) - mol
                    </Label>
                    <Input id="moles" type="number" step="any" placeholder="0.5" value={moles} onChange={e => setMoles(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="volume" className="text-sm">
                      Thể tích dung dịch (V) - lít
                    </Label>
                    <Input id="volume" type="number" step="any" placeholder="1" value={volume} onChange={e => setVolume(e.target.value)} className="mt-1" />
                  </div>
                  <Button onClick={calculateCM} className="w-full">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Tính nồng độ mol
                  </Button>
                </div>

                {cmResult !== null && <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Nồng độ mol:</p>
                    <div className="text-2xl font-bold text-primary">
                      <KaTeXRenderer content={`C_M = ${cmResult} \\text{ M}`} />
                    </div>
                  </div>}
              </TabsContent>

              {/* C% Calculator */}
              <TabsContent value="percent" className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                  <KaTeXRenderer content="C\% = \frac{m_{ct}}{m_{dd}} \times 100\%" displayMode />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="massSolute" className="text-sm">
                      Khối lượng chất tan (m<sub>ct</sub>) - g
                    </Label>
                    <Input id="massSolute" type="number" step="any" placeholder="10" value={massSolute} onChange={e => setMassSolute(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="massSolution" className="text-sm">
                      Khối lượng dung dịch (m<sub>dd</sub>) - g
                    </Label>
                    <Input id="massSolution" type="number" step="any" placeholder="100" value={massSolution} onChange={e => setMassSolution(e.target.value)} className="mt-1" />
                  </div>
                  <Button onClick={calculatePercent} className="w-full">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Tính nồng độ phần trăm
                  </Button>
                </div>

                {percentResult !== null && <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Nồng độ phần trăm:</p>
                    <div className="text-2xl font-bold text-primary">
                      <KaTeXRenderer content={`C\\% = ${percentResult}\\%`} />
                    </div>
                  </div>}
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">
              Nhấn vào tab để chuyển công cụ
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
    </>;
};
export default ChemistryCalculator;
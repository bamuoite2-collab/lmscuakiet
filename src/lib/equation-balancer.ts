// Equation Balancer Game Logic

export interface ChemicalEquation {
    reactants: { formula: string; coefficient?: number }[];
    products: { formula: string; coefficient?: number }[];
    difficulty: 'easy' | 'medium' | 'hard';
}

export const EQUATIONS: ChemicalEquation[] = [
    // Easy
    {
        reactants: [{ formula: 'H₂' }, { formula: 'O₂' }],
        products: [{ formula: 'H₂O' }],
        difficulty: 'easy'
    },
    {
        reactants: [{ formula: 'N₂' }, { formula: 'H₂' }],
        products: [{ formula: 'NH₃' }],
        difficulty: 'easy'
    },
    {
        reactants: [{ formula: 'Fe' }, { formula: 'O₂' }],
        products: [{ formula: 'Fe₂O₃' }],
        difficulty: 'medium'
    },
    {
        reactants: [{ formula: 'CH₄' }, { formula: 'O₂' }],
        products: [{ formula: 'CO₂' }, { formula: 'H₂O' }],
        difficulty: 'medium'
    },
    {
        reactants: [{ formula: 'Al' }, { formula: 'HCl' }],
        products: [{ formula: 'AlCl₃' }, { formula: 'H₂' }],
        difficulty: 'medium'
    },
    {
        reactants: [{ formula: 'C₂H₅OH' }, { formula: 'O₂' }],
        products: [{ formula: 'CO₂' }, { formula: 'H₂O' }],
        difficulty: 'hard'
    },
    {
        reactants: [{ formula: 'KMnO₄' }, { formula: 'HCl' }],
        products: [{ formula: 'KCl' }, { formula: 'MnCl₂' }, { formula: 'Cl₂' }, { formula: 'H₂O' }],
        difficulty: 'hard'
    }
];

// Solutions for equations
export const SOLUTIONS: Record<string, number[]> = {
    'H₂+O₂→H₂O': [2, 1, 2],
    'N₂+H₂→NH₃': [1, 3, 2],
    'Fe+O₂→Fe₂O₃': [4, 3, 2],
    'CH₄+O₂→CO₂+H₂O': [1, 2, 1, 2],
    'Al+HCl→AlCl₃+H₂': [2, 6, 2, 3],
    'C₂H₅OH+O₂→CO₂+H₂O': [1, 3, 2, 3],
    'KMnO₄+HCl→KCl+MnCl₂+Cl₂+H₂O': [2, 16, 2, 2, 5, 8]
};

export function getEquationKey(equation: ChemicalEquation): string {
    const reactants = equation.reactants.map(r => r.formula).join('+');
    const products = equation.products.map(p => p.formula).join('+');
    return `${reactants}→${products}`;
}

export function checkBalance(equation: ChemicalEquation, userCoefficients: number[]): boolean {
    const key = getEquationKey(equation);
    const solution = SOLUTIONS[key];

    if (!solution || userCoefficients.length !== solution.length) {
        return false;
    }

    // Check if coefficients match (allow proportional solutions)
    const ratio = solution[0] / userCoefficients[0];
    return solution.every((coef, i) => Math.abs(coef / userCoefficients[i] - ratio) < 0.001);
}

export function getRandomEquation(difficulty?: 'easy' | 'medium' | 'hard'): ChemicalEquation {
    const filtered = difficulty
        ? EQUATIONS.filter(eq => eq.difficulty === difficulty)
        : EQUATIONS;

    return filtered[Math.floor(Math.random() * filtered.length)];
}

export function calculateScore(timeSeconds: number, difficulty: string): number {
    const baseScore = {
        easy: 50,
        medium: 100,
        hard: 200
    }[difficulty] || 100;

    // Bonus for speed (max 2x)
    const timeBonus = Math.max(0, 1 - (timeSeconds / 60));

    return Math.round(baseScore * (1 + timeBonus));
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    getRandomEquation,
    checkBalance,
    calculateScore,
    getEquationKey,
    ChemicalEquation
} from '@/lib/equation-balancer';
import { ArrowLeft, Timer, Trophy, Zap, RotateCcw, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/sound-manager';

export default function EquationBalancerPage() {
    const [equation, setEquation] = useState<ChemicalEquation>(getRandomEquation());
    const [coefficients, setCoefficients] = useState<number[]>([]);
    const [timeSeconds, setTimeSeconds] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);

    const totalCompounds = equation.reactants.length + equation.products.length;

    useEffect(() => {
        setCoefficients(new Array(totalCompounds).fill(1));
    }, [equation, totalCompounds]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isPlaying && result === null) {
            interval = setInterval(() => {
                setTimeSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, result]);

    const handleCheck = () => {
        const isCorrect = checkBalance(equation, coefficients);
        setResult(isCorrect ? 'correct' : 'incorrect');
        setIsPlaying(false);

        if (isCorrect) {
            const earnedScore = calculateScore(timeSeconds, equation.difficulty);
            setScore(earnedScore);
            setTotalScore(prev => prev + earnedScore);
            setGamesPlayed(prev => prev + 1);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            soundManager.playSuccess();
        } else {
            soundManager.playError();
        }
    };

    const handleNext = () => {
        setEquation(getRandomEquation());
        setTimeSeconds(0);
        setResult(null);
        setScore(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setCoefficients(new Array(totalCompounds).fill(1));
        setTimeSeconds(0);
        setIsPlaying(true);
        setResult(null);
    };

    const updateCoefficient = (index: number, value: string) => {
        const num = parseInt(value) || 1;
        const newCoefs = [...coefficients];
        newCoefs[index] = Math.max(1, Math.min(99, num));
        setCoefficients(newCoefs);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        ⚗️ Cân Bằng Phương Trình
                    </h1>
                    <p className="text-muted-foreground">
                        Tìm hệ số thích hợp để cân bằng phương trình hóa học!
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <Timer className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{formatTime(timeSeconds)}</div>
                        <div className="text-xs text-muted-foreground">Thời gian</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">{totalScore}</div>
                        <div className="text-xs text-muted-foreground">Tổng điểm</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <Zap className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">{gamesPlayed}</div>
                        <div className="text-xs text-muted-foreground">Đã chơi</div>
                    </CardContent>
                </Card>
            </div>

            {/* Game */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Cân bằng phương trình</span>
                        <Badge variant={equation.difficulty === 'easy' ? 'default' : equation.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                            {equation.difficulty === 'easy' ? 'Dễ' : equation.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted rounded-lg p-6">
                        <div className="flex items-center justify-center gap-4 flex-wrap text-2xl font-mono">
                            {/* Reactants */}
                            {equation.reactants.map((reactant, i) => (
                                <div key={`r-${i}`} className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={coefficients[i] || 1}
                                        onChange={(e) => updateCoefficient(i, e.target.value)}
                                        className="w-16 text-center font-bold"
                                        disabled={result !== null}
                                    />
                                    <span>{reactant.formula}</span>
                                    {i < equation.reactants.length - 1 && <span className="text-muted-foreground">+</span>}
                                </div>
                            ))}

                            {/* Arrow */}
                            <span className="text-3xl text-primary">→</span>

                            {/* Products */}
                            {equation.products.map((product, i) => {
                                const index = equation.reactants.length + i;
                                return (
                                    <div key={`p-${i}`} className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={coefficients[index] || 1}
                                            onChange={(e) => updateCoefficient(index, e.target.value)}
                                            className="w-16 text-center font-bold"
                                            disabled={result !== null}
                                        />
                                        <span>{product.formula}</span>
                                        {i < equation.products.length - 1 && <span className="text-muted-foreground">+</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4"
                            >
                                {result === 'correct' ? (
                                    <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Check className="h-6 w-6 text-green-600" />
                                                <div>
                                                    <p className="font-bold text-green-700 dark:text-green-300">Chính xác! 🎉</p>
                                                    <p className="text-sm text-green-600 dark:text-green-400">+{score} điểm</p>
                                                </div>
                                            </div>
                                            <Button onClick={handleNext} className="gap-2">
                                                Câu tiếp theo
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="border-red-500 bg-red-50 dark:bg-red-950">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <X className="h-6 w-6 text-red-600" />
                                                <div>
                                                    <p className="font-bold text-red-700 dark:text-red-300">Chưa đúng, thử lại!</p>
                                                    <p className="text-sm text-red-600 dark:text-red-400">Kiểm tra lại số nguyên tử mỗi nguyên tố</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" onClick={handleReset} className="gap-2">
                                                <RotateCcw className="h-4 w-4" />
                                                Thử lại
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    {!result && (
                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleCheck} className="flex-1 gap-2" size="lg">
                                <Check className="h-5 w-5" />
                                Kiểm tra
                            </Button>
                            <Button variant="outline" onClick={handleReset} size="lg" className="gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <CardContent className="p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Hướng dẫn:</strong> Nhập hệ số cho mỗi chất sao cho số nguyên tử của mỗi nguyên tố ở 2 vế bằng nhau.
                        Càng nhanh thì càng nhiều điểm!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

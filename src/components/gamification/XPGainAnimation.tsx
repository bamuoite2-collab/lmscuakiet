import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

interface XPGainAnimationProps {
    amount: number;
    onComplete?: () => void;
}

export function XPGainAnimation({ amount, onComplete }: XPGainAnimationProps) {
    const [visible, setVisible] = useState(true);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        // Generate particles
        const particleCount = Math.min(amount / 10, 20); // Max 20 particles
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200
        }));
        setParticles(newParticles);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onComplete?.(), 300);
        }, 2000);

        return () => clearTimeout(timer);
    }, [amount, onComplete]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                    {/* Main Badge */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-10, -60, -80] }}
                        transition={{ duration: 1.5, times: [0, 0.6, 1] }}
                        className="relative"
                    >
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Zap className="h-8 w-8" />
                            </motion.div>
                            <span className="text-3xl font-bold">+{amount} XP</span>
                            <Sparkles className="h-6 w-6" />
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-60 animate-pulse" />
                    </motion.div>

                    {/* Particles */}
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                                x: particle.x,
                                y: particle.y,
                                opacity: [1, 0],
                                scale: [1, 0.3]
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{
                                boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)'
                            }} />
                        </motion.div>
                    ))}

                    {/* Star trail effect */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={`star-${i}`}
                            initial={{ opacity: 0, scale: 0, rotate: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                rotate: 360,
                                x: Math.cos((i / 5) * Math.PI * 2) * 60,
                                y: Math.sin((i / 5) * Math.PI * 2) * 60
                            }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                            <Sparkles className="h-6 w-6 text-yellow-400" />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}


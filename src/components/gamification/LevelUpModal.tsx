import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Zap, Star } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
    isOpen: boolean;
    newLevel: number;
    onClose: () => void;
}

export function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
    useEffect(() => {
        if (isOpen) {
            // Enhanced confetti
            const duration = 4000;
            const end = Date.now() + duration;

            function frame() {
                // Left side confetti
                confetti({
                    particleCount: 7,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#9370DB']
                });

                // Right side confetti
                confetti({
                    particleCount: 7,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#9370DB']
                });

                // Center burst
                if (Date.now() - (end - duration) < 500) {
                    confetti({
                        particleCount: 15,
                        angle: 90,
                        spread: 360,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ['#FFD700', '#FFA500'],
                        startVelocity: 45
                    });
                }

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }

            frame();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-none bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                x: `${Math.random() * 100}%`,
                                y: `${Math.random() * 100}%`,
                                scale: 0
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                rotate: 360
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.4 }}
                    className="text-center py-8 relative z-10"
                >
                    {/* Trophy Icon with glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="relative inline-block mb-6"
                    >
                        <div className="relative">
                            <Trophy className="h-24 w-24 text-yellow-500 drop-shadow-2xl" style={{
                                filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.8))'
                            }} />

                            {/* Rotating glow rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-32 h-32 rounded-full border-4 border-yellow-400 opacity-30" />
                            </motion.div>

                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-36 h-36 rounded-full border-4 border-orange-400 opacity-20" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Level Up Text */}
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600 bg-clip-text text-transparent"
                    >
                        LEVEL UP!
                    </motion.h2>

                    {/* New Level */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                        className="mb-4"
                    >
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
                            <Star className="h-6 w-6" />
                            <span className="text-3xl font-bold">Cấp {newLevel}</span>
                            <Zap className="h-6 w-6" />
                        </div>
                    </motion.div>

                    {/* Message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-muted-foreground mb-6"
                    >
                        Chúc mừng! Bạn đã đạt cấp độ mới! 🎉
                    </motion.p>

                    {/* Continue Button */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            onClick={onClose}
                            size="lg"
                            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                            <Sparkles className="h-5 w-5 mr-2" />
                            Tiếp tục học!
                            <Zap className="h-5 w-5 ml-2" />
                        </Button>
                    </motion.div>

                    {/* Floating particles */}
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute"
                            style={{
                                left: `${10 + (i * 8)}%`,
                                top: `${20 + (i % 3) * 30}%`
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 0.7, 0.3]
                            }}
                            transition={{
                                duration: 2 + (i % 3),
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        >
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{
                                boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                            }} />
                        </motion.div>
                    ))}
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

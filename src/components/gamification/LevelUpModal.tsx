import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';
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
            // Trigger confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FFD700', '#FFA500', '#FF6347']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#FFD700', '#FFA500', '#FF6347']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="text-center py-6"
                >
                    {/* Trophy Icon with glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                        className="inline-block mb-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
                            <Trophy className="h-24 w-24 text-yellow-500 relative z-10" />
                        </div>
                    </motion.div>

                    {/* Level Up Text */}
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                    >
                        LEVEL UP!
                    </motion.h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                            <span className="text-5xl font-bold text-foreground">{newLevel}</span>
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                        </div>
                        <p className="text-muted-foreground">
                            Bạn đã đạt cấp độ {newLevel}!
                        </p>
                    </motion.div>

                    {/* Continue Button */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            onClick={onClose}
                            size="lg"
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
                        >
                            Tiếp tục học! 🚀
                        </Button>
                    </motion.div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

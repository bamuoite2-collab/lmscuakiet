import { Card, CardContent } from '@/components/ui/card';
import { useSeasonalEvents } from '@/hooks/useSeasonalEvents';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function EventBanner() {
    const { activeEvents, loadingEvents } = useSeasonalEvents();

    if (loadingEvents || !activeEvents || activeEvents.length === 0) {
        return null;
    }

    const mainEvent = activeEvents[0]; // Show first active event

    const daysRemaining = Math.ceil(
        (new Date(mainEvent.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const theme = mainEvent.theme_config || {};
    const primaryColor = theme.primaryColor || '#ff0000';
    const secondaryColor = theme.secondaryColor || '#ffaa00';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
            >
                <Card
                    className="relative overflow-hidden border-2"
                    style={{
                        borderColor: primaryColor,
                        background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)`
                    }}
                >
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-10">
                        {mainEvent.event_type === 'tet' && (
                            <>
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute text-4xl"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`
                                        }}
                                        animate={{
                                            y: [0, -20, 0],
                                            rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            delay: i * 0.2,
                                            repeat: Infinity
                                        }}
                                    >
                                        🏮
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </div>

                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            {/* Event Info */}
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="text-6xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {mainEvent.icon}
                                </motion.div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="h-4 w-4" style={{ color: primaryColor }} />
                                        <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: primaryColor }}>
                                            Sự Kiện Đặc Biệt
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-1">{mainEvent.name}</h2>
                                    <p className="text-sm text-muted-foreground">{mainEvent.description}</p>

                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Còn {daysRemaining} ngày</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="h-4 w-4" style={{ color: secondaryColor }} />
                                            <span>{mainEvent.bonus_xp_multiplier}x XP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    asChild
                                    size="lg"
                                    className="gap-2"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                        color: '#fff'
                                    }}
                                >
                                    <Link to={`/events/${mainEvent.id}`}>
                                        Xem Chi Tiết
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>

                    {/* Bottom glow effect */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{
                            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`
                        }}
                    />
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}

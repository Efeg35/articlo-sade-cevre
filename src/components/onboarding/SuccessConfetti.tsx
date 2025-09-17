import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { trackOnboardingEvent } from '@/stores/onboardingStoreZustand';

interface SuccessConfettiProps {
    isActive: boolean;
    onComplete?: () => void;
    message?: string;
    duration?: number;
    confettiConfig?: {
        particleCount?: number;
        spread?: number;
        colors?: string[];
        shapes?: ('square' | 'circle')[];
    };
}

export const SuccessConfetti: React.FC<SuccessConfettiProps> = ({
    isActive,
    onComplete,
    message = "Tebrikler! 🎉",
    duration = 3000,
    confettiConfig = {}
}) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const defaultConfig = {
        particleCount: 80, // Reduced for professional feel
        spread: 60, // More controlled spread
        colors: [
            '#22C58B', // Professional Green
            '#1FAB73', // Darker Green
            '#FFD166', // Professional Gold
            '#60A5FA', // Subtle Blue
        ],
        shapes: ['square', 'circle'] as ('square' | 'circle')[],
        ...confettiConfig
    };

    useEffect(() => {
        if (isActive) {
            setShowConfetti(true);
            setShowMessage(true);

            // Track confetti celebration
            trackOnboardingEvent('success_celebration', {
                message,
                duration,
                timestamp: new Date().toISOString()
            });

            // Auto-hide confetti after duration
            const confettiTimer = setTimeout(() => {
                setShowConfetti(false);
            }, duration);

            // Hide message a bit earlier
            const messageTimer = setTimeout(() => {
                setShowMessage(false);
                onComplete?.();
            }, duration - 500);

            return () => {
                clearTimeout(confettiTimer);
                clearTimeout(messageTimer);
            };
        }
    }, [isActive, duration, message, onComplete]);

    return (
        <AnimatePresence>
            {isActive && (
                <div className="fixed inset-0 pointer-events-none z-[100]">
                    {/* Confetti Effect */}
                    {showConfetti && (
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            numberOfPieces={defaultConfig.particleCount}
                            recycle={false}
                            gravity={0.4} // Slightly faster fall for professional feel
                            colors={defaultConfig.colors}
                            drawShape={(ctx) => {
                                // Custom shapes
                                const shapes = defaultConfig.shapes;
                                const shape = shapes[Math.floor(Math.random() * shapes.length)];

                                if (shape === 'circle') {
                                    ctx.beginPath();
                                    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
                                    ctx.fill();
                                } else {
                                    // Square/rectangle
                                    ctx.fillRect(-6, -6, 12, 12);
                                }
                            }}
                            style={{ zIndex: 1000 }}
                        />
                    )}

                    {/* Success Message Overlay */}
                    <AnimatePresence>
                        {showMessage && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                    y: 50
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.8,
                                    y: -30
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25
                                }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <div className="bg-gradient-to-br from-[#22C58B]/95 to-[#1FAB73]/85 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-[#22C58B]/20">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: [0.9, 1.05, 1] }}
                                        transition={{
                                            duration: 0.5,
                                            times: [0, 0.5, 1],
                                            ease: "easeOut"
                                        }}
                                        className="text-center"
                                    >
                                        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                                            {message}
                                        </h3>

                                        {/* Sparkle animations around text */}
                                        <div className="relative">
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0,
                                                        rotate: 0
                                                    }}
                                                    animate={{
                                                        opacity: [0, 0.6, 0],
                                                        scale: [0, 1.2, 0],
                                                        rotate: [0, 90, 180]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        delay: i * 0.3,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute w-3 h-3 text-white/60"
                                                    style={{
                                                        left: `${20 + i * 12}%`,
                                                        top: `${-20 + (i % 2) * 40}%`,
                                                        transform: `rotate(${i * 60}deg)`
                                                    }}
                                                >
                                                    ✨
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Radial Success Pulse */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{
                                    scale: 0,
                                    opacity: 0.8
                                }}
                                animate={{
                                    scale: [0, 4, 6],
                                    opacity: [0.8, 0.3, 0]
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-24 h-24 bg-gradient-radial from-[#22C58B]/30 via-[#22C58B]/15 to-transparent rounded-full" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessConfetti;
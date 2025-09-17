import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield, Warning, Eye } from 'phosphor-react';
import { monochromeTheme, getTypographyStyles, getHeadingStyles, getBodyStyles, slideUp, fadeIn, hoverScale } from './theme';

interface FeatureRiskDetectionScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

export const FeatureRiskDetectionScreen: React.FC<FeatureRiskDetectionScreenProps> = ({ onNext, onPrevious }) => {
    return (
        <div
            className="flex flex-col w-full h-full min-h-screen"
            style={{
                backgroundColor: monochromeTheme.background,
                color: monochromeTheme.text.primary,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Progress Indicator - 4 step (3/4) */}
            <div className="flex-shrink-0 px-6 pt-8 pb-6">
                <div className="flex items-center justify-center gap-3">
                    {[1, 2, 3, 4].map((step) => (
                        <motion.div
                            key={step}
                            initial={{ scale: 0.8, opacity: 0.3 }}
                            animate={{
                                scale: step <= 3 ? 1 : 0.8,
                                opacity: step <= 3 ? 1 : 0.3
                            }}
                            transition={{ duration: 0.3, delay: step * 0.1 }}
                            className="h-2 rounded-full"
                            style={{
                                width: step <= 3 ? '2rem' : '0.5rem',
                                backgroundColor: step <= 3 ? monochromeTheme.primary : monochromeTheme.gray[200]
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
                {/* Visual: Shield with Risk Indicators */}
                <motion.div
                    {...fadeIn}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center justify-center mb-12 relative"
                >
                    <div className="relative">
                        {/* Main Shield Icon */}
                        <motion.div
                            {...slideUp}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="relative z-10"
                        >
                            <div
                                className="w-24 h-28 rounded-t-full rounded-b-lg border-2 flex items-center justify-center relative"
                                style={{
                                    borderColor: monochromeTheme.primary,
                                    backgroundColor: monochromeTheme.surface.primary
                                }}
                            >
                                {/* Shield icon */}
                                <Shield
                                    className="w-12 h-12"
                                    style={{ color: monochromeTheme.primary }}
                                    weight="regular"
                                />

                                {/* Risk warning indicators inside shield */}
                                {[
                                    { x: '25%', y: '30%', delay: 0.8 },
                                    { x: '65%', y: '45%', delay: 1.0 },
                                    { x: '40%', y: '65%', delay: 1.2 },
                                ].map((position, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: position.delay }}
                                        className="absolute w-4 h-4 rounded-full border flex items-center justify-center"
                                        style={{
                                            left: position.x,
                                            top: position.y,
                                            backgroundColor: monochromeTheme.gray[300],
                                            borderColor: monochromeTheme.gray[200]
                                        }}
                                    >
                                        <Warning
                                            className="w-2.5 h-2.5"
                                            style={{ color: monochromeTheme.gray[100] }}
                                            weight="fill"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Scanning Effect */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{
                                opacity: [0, 0.3, 0],
                                scaleX: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1.5,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-t-full rounded-b-lg border-2 -m-1"
                            style={{
                                borderColor: monochromeTheme.primary,
                                backgroundColor: 'transparent'
                            }}
                        />

                        {/* Detection Eye - positioned outside */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.4 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full border flex items-center justify-center"
                            style={{
                                backgroundColor: monochromeTheme.primary,
                                borderColor: monochromeTheme.background
                            }}
                        >
                            <Eye
                                className="w-4 h-4"
                                style={{ color: monochromeTheme.background }}
                                weight="fill"
                            />
                        </motion.div>

                        {/* Floating risk indicators around shield */}
                        {[
                            { x: -30, y: -10, delay: 1.6 },
                            { x: 35, y: 15, delay: 1.8 },
                            { x: -25, y: 40, delay: 2.0 },
                        ].map((position, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 0.8, 1],
                                    opacity: [0, 0.6, 0.3, 0.6]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: position.delay,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-6 h-6 rounded-full border flex items-center justify-center"
                                style={{
                                    left: `calc(50% + ${position.x}px)`,
                                    top: `calc(50% + ${position.y}px)`,
                                    backgroundColor: monochromeTheme.surface.secondary,
                                    borderColor: monochromeTheme.border.primary
                                }}
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: monochromeTheme.text.secondary }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    {...slideUp}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="text-center mb-6"
                    style={{
                        ...getHeadingStyles('h2'),
                        color: monochromeTheme.text.primary
                    }}
                >
                    Gizli Riskleri Keşfedin
                </motion.h1>

                {/* Description */}
                <motion.p
                    {...slideUp}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="text-center px-4 mb-12 max-w-md"
                    style={{
                        ...getBodyStyles('large'),
                        color: monochromeTheme.text.secondary
                    }}
                >
                    Belgenizdeki potansiyel riskleri, aleyhinize olabilecek maddeleri ve dikkat etmeniz gereken noktaları sizin için tespit edip raporluyoruz.
                </motion.p>
            </div>

            {/* Navigation Footer */}
            <div className="flex-shrink-0 px-6 pb-8 pt-4">
                <div className="flex items-center justify-between">
                    {/* Back Button */}
                    <motion.div {...hoverScale}>
                        <Button
                            onClick={onPrevious}
                            variant="outline"
                            className="flex items-center gap-2 px-6 py-3 rounded-full border"
                            style={{
                                backgroundColor: monochromeTheme.button.outline.background,
                                color: monochromeTheme.button.outline.text,
                                borderColor: monochromeTheme.button.outline.border,
                                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                                fontWeight: 600,
                                letterSpacing: '0.025em'
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" weight="regular" />
                            Geri
                        </Button>
                    </motion.div>

                    {/* Next Button */}
                    <motion.div {...hoverScale}>
                        <Button
                            onClick={onNext}
                            className="flex items-center gap-2 px-8 py-3 rounded-full"
                            style={{
                                backgroundColor: monochromeTheme.button.primary.background,
                                color: monochromeTheme.button.primary.text,
                                borderColor: monochromeTheme.button.primary.border,
                                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                                fontWeight: 600,
                                letterSpacing: '0.025em',
                                boxShadow: monochromeTheme.shadow.sm
                            }}
                        >
                            İleri
                            <ArrowRight className="w-4 h-4" weight="regular" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FeatureRiskDetectionScreen;
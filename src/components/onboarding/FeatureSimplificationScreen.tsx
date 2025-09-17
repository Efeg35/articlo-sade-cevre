import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, FileText, ArrowFatRight } from 'phosphor-react';
import { monochromeTheme, getTypographyStyles, getHeadingStyles, getBodyStyles, slideUp, fadeIn, hoverScale } from './theme';

interface FeatureSimplificationScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

export const FeatureSimplificationScreen: React.FC<FeatureSimplificationScreenProps> = ({ onNext, onPrevious }) => {
    return (
        <div
            className="flex flex-col w-full h-full min-h-screen"
            style={{
                backgroundColor: monochromeTheme.background,
                color: monochromeTheme.text.primary,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Progress Indicator - 4 step (2/4) */}
            <div className="flex-shrink-0 px-6 pt-8 pb-6">
                <div className="flex items-center justify-center gap-3">
                    {[1, 2, 3, 4].map((step) => (
                        <motion.div
                            key={step}
                            initial={{ scale: 0.8, opacity: 0.3 }}
                            animate={{
                                scale: step <= 2 ? 1 : 0.8,
                                opacity: step <= 2 ? 1 : 0.3
                            }}
                            transition={{ duration: 0.3, delay: step * 0.1 }}
                            className="h-2 rounded-full"
                            style={{
                                width: step <= 2 ? '2rem' : '0.5rem',
                                backgroundColor: step <= 2 ? monochromeTheme.primary : monochromeTheme.gray[200]
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
                {/* Visual: Document Transformation */}
                <motion.div
                    {...fadeIn}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center justify-center mb-12 w-full max-w-sm"
                >
                    <div className="relative flex items-center justify-between w-full">
                        {/* Complex Document - Left */}
                        <motion.div
                            {...slideUp}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-24 rounded-lg border-2 p-3 mb-2"
                                style={{
                                    borderColor: monochromeTheme.border.primary,
                                    backgroundColor: monochromeTheme.surface.primary
                                }}
                            >
                                {/* Complex content lines */}
                                <div className="space-y-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((line) => (
                                        <div
                                            key={line}
                                            className="rounded"
                                            style={{
                                                height: '2px',
                                                backgroundColor: monochromeTheme.text.secondary,
                                                width: `${Math.random() * 30 + 60}%`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <FileText
                                className="w-6 h-6"
                                style={{ color: monochromeTheme.text.secondary }}
                                weight="regular"
                            />
                        </motion.div>

                        {/* Arrow */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="mx-6"
                        >
                            <ArrowFatRight
                                className="w-8 h-8"
                                style={{ color: monochromeTheme.primary }}
                                weight="fill"
                            />
                        </motion.div>

                        {/* Simplified Document - Right */}
                        <motion.div
                            {...slideUp}
                            transition={{ duration: 0.5, delay: 1.0 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-24 rounded-lg border-2 p-3 mb-2"
                                style={{
                                    borderColor: monochromeTheme.primary,
                                    backgroundColor: monochromeTheme.surface.primary
                                }}
                            >
                                {/* Simplified content - 3 clean lines */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map((line) => (
                                        <div
                                            key={line}
                                            className="rounded"
                                            style={{
                                                height: '3px',
                                                backgroundColor: monochromeTheme.primary,
                                                width: '100%'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <FileText
                                className="w-6 h-6"
                                style={{ color: monochromeTheme.primary }}
                                weight="fill"
                            />
                        </motion.div>
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
                    Anlaşılmaz Metinlere Son
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
                    Yapay zeka destekli teknolojimiz, en yoğun hukuki jargonu bile herkesin anlayabileceği sade bir dille yeniden yazar.
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

export default FeatureSimplificationScreen;
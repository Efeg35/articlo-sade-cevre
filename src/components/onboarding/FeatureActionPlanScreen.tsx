import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, ListChecks } from 'phosphor-react';
import { monochromeTheme, getTypographyStyles, getHeadingStyles, getBodyStyles, slideUp, fadeIn, hoverScale } from './theme';

interface FeatureActionPlanScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

export const FeatureActionPlanScreen: React.FC<FeatureActionPlanScreenProps> = ({ onNext, onPrevious }) => {
    return (
        <div
            className="flex flex-col w-full h-full min-h-screen"
            style={{
                backgroundColor: monochromeTheme.background,
                color: monochromeTheme.text.primary,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Progress Indicator - 4 step (4/4) */}
            <div className="flex-shrink-0 px-6 pt-8 pb-6">
                <div className="flex items-center justify-center gap-3">
                    {[1, 2, 3, 4].map((step) => (
                        <motion.div
                            key={step}
                            initial={{ scale: 0.8, opacity: 0.3 }}
                            animate={{
                                scale: 1,
                                opacity: 1
                            }}
                            transition={{ duration: 0.3, delay: step * 0.1 }}
                            className="h-2 rounded-full"
                            style={{
                                width: '2rem',
                                backgroundColor: monochromeTheme.primary
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
                {/* Visual: Flow Chart */}
                <motion.div
                    {...fadeIn}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center justify-center mb-12 w-full max-w-lg"
                >
                    <div className="relative flex items-center justify-between w-full">
                        {/* Step 1: Analyze */}
                        <motion.div
                            {...slideUp}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-16 rounded-lg border-2 flex flex-col items-center justify-center p-2 mb-2"
                                style={{
                                    borderColor: monochromeTheme.border.primary,
                                    backgroundColor: monochromeTheme.surface.primary
                                }}
                            >
                                <div
                                    className="w-3 h-3 rounded-full mb-1"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                                <div className="space-y-1">
                                    <div
                                        className="h-0.5 rounded"
                                        style={{
                                            backgroundColor: monochromeTheme.text.secondary,
                                            width: '12px'
                                        }}
                                    />
                                    <div
                                        className="h-0.5 rounded"
                                        style={{
                                            backgroundColor: monochromeTheme.text.secondary,
                                            width: '16px'
                                        }}
                                    />
                                </div>
                            </div>
                            <span
                                className="text-xs font-medium"
                                style={{ color: monochromeTheme.text.secondary }}
                            >
                                Analiz
                            </span>
                        </motion.div>

                        {/* Arrow 1 */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                            className="mx-4"
                        >
                            <ArrowRight
                                className="w-6 h-6"
                                style={{ color: monochromeTheme.primary }}
                                weight="regular"
                            />
                        </motion.div>

                        {/* Step 2: Plan */}
                        <motion.div
                            {...slideUp}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-16 rounded-lg border-2 flex flex-col items-center justify-center p-2 mb-2"
                                style={{
                                    borderColor: monochromeTheme.border.primary,
                                    backgroundColor: monochromeTheme.surface.primary
                                }}
                            >
                                <ListChecks
                                    className="w-6 h-6 mb-1"
                                    style={{ color: monochromeTheme.primary }}
                                    weight="regular"
                                />
                                <div className="flex gap-1">
                                    {[1, 2, 3].map((dot) => (
                                        <div
                                            key={dot}
                                            className="w-1 h-1 rounded-full"
                                            style={{ backgroundColor: monochromeTheme.text.secondary }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span
                                className="text-xs font-medium"
                                style={{ color: monochromeTheme.text.secondary }}
                            >
                                Plan
                            </span>
                        </motion.div>

                        {/* Arrow 2 */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 1.0 }}
                            className="mx-4"
                        >
                            <ArrowRight
                                className="w-6 h-6"
                                style={{ color: monochromeTheme.primary }}
                                weight="regular"
                            />
                        </motion.div>

                        {/* Step 3: Action */}
                        <motion.div
                            {...slideUp}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-16 rounded-lg border-2 flex flex-col items-center justify-center p-2 mb-2"
                                style={{
                                    borderColor: monochromeTheme.primary,
                                    backgroundColor: monochromeTheme.surface.primary
                                }}
                            >
                                <CheckCircle
                                    className="w-6 h-6 mb-1"
                                    style={{ color: monochromeTheme.primary }}
                                    weight="fill"
                                />
                                <div className="flex gap-1">
                                    {[1, 2, 3].map((dot) => (
                                        <div
                                            key={dot}
                                            className="w-1 h-1 rounded-full"
                                            style={{ backgroundColor: monochromeTheme.primary }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span
                                className="text-xs font-medium"
                                style={{ color: monochromeTheme.primary }}
                            >
                                Aksiyon
                            </span>
                        </motion.div>
                    </div>

                    {/* Connecting flow line at the bottom */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.2, delay: 1.2 }}
                        className="absolute bottom-0 h-0.5 rounded origin-left"
                        style={{
                            backgroundColor: monochromeTheme.border.primary,
                            width: '90%',
                            left: '5%'
                        }}
                    />
                </motion.div>

                {/* Title */}
                <motion.h1
                    {...slideUp}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="text-center mb-6"
                    style={{
                        ...getHeadingStyles('h2'),
                        color: monochromeTheme.text.primary
                    }}
                >
                    Ne Yapacağınızı Bilin
                </motion.h1>

                {/* Description */}
                <motion.p
                    {...slideUp}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="text-center px-4 mb-12 max-w-md"
                    style={{
                        ...getBodyStyles('large'),
                        color: monochromeTheme.text.secondary
                    }}
                >
                    Sadece analiz etmekle kalmıyor, size özel atmanız gereken somut adımları ve eylem planını da sunuyoruz.
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

                    {/* Survey Button - Final Action */}
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
                            Ankete Başla
                            <ArrowRight className="w-4 h-4" weight="regular" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FeatureActionPlanScreen;
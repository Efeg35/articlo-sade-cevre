import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, CheckCircle, MagnifyingGlass, Lightbulb } from 'phosphor-react';
import { monochromeTheme, fadeIn, slideUp, hoverScale } from './theme';

interface WelcomeScreenProps {
    onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
    return (
        <div
            className="flex flex-col w-full h-full min-h-screen overflow-y-auto relative"
            style={{
                backgroundColor: monochromeTheme.background,
                color: monochromeTheme.text.primary
            }}
        >
            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-6 py-8">
                {/* Professional Hero Illustration */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-center mb-8"
                >
                    <div className="relative w-80 h-64">
                        {/* Abstract Human Character - Artiklo Rehberi */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute right-8 top-8 w-20 h-20 z-20"
                        >
                            {/* Modern Abstract Human Figure - Slack/Asana Style */}
                            <div className="relative w-full h-full">
                                {/* Head - Professional subtle movement */}
                                <motion.div
                                    animate={{
                                        y: [0, -1, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                                {/* Body */}
                                <div
                                    className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-10 rounded-lg"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                                {/* Arms - Subtle professional gesture */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, 0]
                                    }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-8 right-2 w-1.5 h-6 rounded-full transform rotate-45"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                                <div
                                    className="absolute top-8 left-2 w-1.5 h-6 rounded-full transform -rotate-12"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                                {/* Legs */}
                                <div
                                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 rounded-full"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                                <div
                                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 rounded-full"
                                    style={{ backgroundColor: monochromeTheme.primary }}
                                />
                            </div>
                        </motion.div>

                        {/* Professional Document Stack - Flat Design */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="absolute left-0 top-0 w-40 h-52"
                        >
                            {/* Stack of Documents - Clean, Flat Design */}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.8 + i * 0.1
                                    }}
                                    className="absolute rounded-lg shadow-sm"
                                    style={{
                                        backgroundColor: monochromeTheme.surface.primary,
                                        border: `2px solid ${monochromeTheme.border.primary}`,
                                        width: '140px',
                                        height: '180px',
                                        left: `${i * 3}px`,
                                        top: `${i * -4}px`,
                                        zIndex: 5 - i,
                                        transform: `rotate(${i * 2 - 4}deg)`
                                    }}
                                >
                                    {/* Document Header */}
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText
                                                className="w-4 h-4"
                                                weight="regular"
                                                style={{ color: monochromeTheme.text.secondary }}
                                            />
                                            <div
                                                className="h-2 rounded w-16"
                                                style={{ backgroundColor: monochromeTheme.gray[200] }}
                                            />
                                        </div>

                                        {/* Document Content Lines - Professional */}
                                        <div className="space-y-2">
                                            <div className="h-1.5 rounded w-full" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                            <div className="h-1.5 rounded w-5/6" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                            <div className="h-1.5 rounded w-full" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                            <div className="h-1.5 rounded w-4/6" style={{ backgroundColor: monochromeTheme.gray[100] }} />
                                            <div className="h-1.5 rounded w-full" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                            <div className="h-1.5 rounded w-3/6" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                            <div className="h-1.5 rounded w-full" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                            <div className="h-1.5 rounded w-5/6" style={{ backgroundColor: monochromeTheme.gray[200] }} />
                                        </div>
                                    </div>

                                    {/* Complexity Indicators for documents */}
                                    {i < 2 && (
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: monochromeTheme.text.secondary }} />
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: monochromeTheme.gray[100] }} />
                                        </div>
                                    )}
                                    {i === 2 && (
                                        <div className="absolute top-2 right-2">
                                            <MagnifyingGlass
                                                className="w-3 h-3"
                                                weight="regular"
                                                style={{ color: monochromeTheme.text.secondary }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Transformation Arrow - Professional */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30"
                        >
                            <motion.div
                                animate={{
                                    x: [0, 2, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg"
                                style={{ backgroundColor: monochromeTheme.primary }}
                            >
                                <ArrowRight className="w-4 h-4" weight="bold" style={{ color: monochromeTheme.background }} />
                            </motion.div>
                        </motion.div>

                        {/* Simplified Result Document - Professional */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.4 }}
                            className="absolute right-0 top-16 w-28 h-36 rounded-lg shadow-lg z-10"
                            style={{
                                backgroundColor: monochromeTheme.surface.primary,
                                border: `2px solid ${monochromeTheme.primary}`
                            }}
                        >
                            {/* Success Header */}
                            <div className="p-2">
                                <div className="flex items-center gap-1 mb-2">
                                    <Lightbulb className="w-3 h-3" weight="fill" style={{ color: monochromeTheme.primary }} />
                                    <div className="h-1.5 rounded w-12" style={{ backgroundColor: monochromeTheme.primary }} />
                                </div>

                                {/* Clean, Simplified Content */}
                                <div className="space-y-1.5">
                                    <div className="h-1 rounded w-full" style={{ backgroundColor: `${monochromeTheme.primary}40` }} />
                                    <div className="h-1 rounded w-5/6" style={{ backgroundColor: `${monochromeTheme.primary}40` }} />
                                    <div className="h-1 rounded w-full" style={{ backgroundColor: `${monochromeTheme.primary}40` }} />
                                    <div className="h-1 rounded w-4/6" style={{ backgroundColor: `${monochromeTheme.primary}40` }} />
                                    <div className="h-1 rounded w-full" style={{ backgroundColor: `${monochromeTheme.primary}40` }} />
                                </div>
                            </div>

                            {/* Success Indicator */}
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: monochromeTheme.primary }} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Professional Typography */}
                <motion.h1
                    {...slideUp}
                    transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                    className="text-3xl font-bold text-center mb-6"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: monochromeTheme.text.primary
                    }}
                >
                    Karmaşık belgelerle vedalaşın!
                </motion.h1>

                <motion.p
                    {...slideUp}
                    transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
                    className="text-lg leading-relaxed text-center px-4 mb-12"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        color: monochromeTheme.text.secondary
                    }}
                >
                    Artiklo, en anlaşılmaz hukuki metinleri bile sizin için saniyeler içinde basit ve net bir hale getirir.
                </motion.p>

                {/* Professional CTA Button */}
                <motion.div
                    {...slideUp}
                    transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                    className="flex justify-center"
                >
                    <motion.div {...hoverScale}>
                        <Button
                            onClick={onNext}
                            className="font-bold px-12 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 w-80 max-w-full flex items-center justify-center gap-3"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                backgroundColor: monochromeTheme.button.primary.background,
                                color: monochromeTheme.button.primary.text,
                                boxShadow: monochromeTheme.shadow.lg
                            }}
                        >
                            <span>Hadi Başlayalım!</span>
                            <motion.div
                                animate={{ x: [0, 2, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ArrowRight className="w-5 h-5" weight="bold" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
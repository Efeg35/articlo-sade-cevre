import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SimpleWelcomeScreenProps {
    onNext: () => void;
}

export const SimpleWelcomeScreen: React.FC<SimpleWelcomeScreenProps> = ({ onNext }) => {
    console.log('[SimpleWelcomeScreen] Rendering');

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-[#121826] to-[#1a1f3a] text-white">
            {/* Progress Bar */}
            <div className="flex-shrink-0 flex items-center justify-center pt-6 pb-4">
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                                scale: index === 0 ? 1.2 : 1,
                                opacity: index === 0 ? 1 : 0.3,
                                backgroundColor: index === 0 ? '#D4A056' : '#4A5568'
                            }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="w-1.5 h-1.5 rounded-full"
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center px-8">
                <h1 className="text-4xl font-bold mb-6">Artiklo'ya Hoş Geldiniz</h1>
                <p className="text-lg mb-8 text-gray-200">
                    Hukuki belgelerinizi kolayca analiz edin
                </p>

                <Button
                    onClick={() => {
                        console.log('[SimpleWelcomeScreen] Button clicked');
                        onNext();
                    }}
                    size="lg"
                    className="bg-[#D4A056] hover:bg-[#D4A056]/90 text-white font-semibold px-8 py-4 rounded-lg"
                >
                    Başlayalım
                </Button>
            </div>
        </div>
    );
};

export default SimpleWelcomeScreen;
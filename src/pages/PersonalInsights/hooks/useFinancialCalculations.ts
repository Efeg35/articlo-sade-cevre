import { useMemo } from 'react';
import { Document } from '../types';

export function useFinancialCalculations() {
    const calculateFinancials = useMemo(() => (docs: Document[]) => {
        // Finansal hesaplamalar
        const risksPreventedValue = Math.floor(docs.length * 0.4) * 2500; // %40'ında yüksek risk, risk başına 2500₺
        const lawyerCostSavings = docs.length * 800; // Belge başına 800₺ avukat danışmanlık ücreti
        const totalSavings = risksPreventedValue + lawyerCostSavings;
        const avgSavingsPerDocument = docs.length > 0 ? totalSavings / docs.length : 0;

        // Detaylı finansal analiz (belge türüne göre tasarruf)
        const financialBreakdown = [
            {
                documentType: 'Kira Sözleşmeleri',
                savings: Math.floor(docs.length * 0.3) * 1200,
                count: Math.floor(docs.length * 0.3)
            },
            {
                documentType: 'İcra Belgeleri',
                savings: Math.floor(docs.length * 0.25) * 1800,
                count: Math.floor(docs.length * 0.25)
            },
            {
                documentType: 'İş Sözleşmeleri',
                savings: Math.floor(docs.length * 0.2) * 900,
                count: Math.floor(docs.length * 0.2)
            },
            {
                documentType: 'Mahkeme Belgeleri',
                savings: Math.floor(docs.length * 0.15) * 2200,
                count: Math.floor(docs.length * 0.15)
            },
            {
                documentType: 'Diğer Belgeler',
                savings: Math.floor(docs.length * 0.1) * 600,
                count: Math.floor(docs.length * 0.1)
            }
        ].filter(item => item.count > 0);

        return {
            totalSavings,
            risksPreventedValue,
            lawyerCostSavings,
            avgSavingsPerDocument,
            financialBreakdown
        };
    }, []);

    return { calculateFinancials };
}
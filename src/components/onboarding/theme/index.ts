/**
 * Monokrom Theme Sistemi - Ana Export
 *
 * Yeni onboarding tasarımı için tüm theme elementlerinin
 * merkezi export noktası
 */

// Import all theme elements first
import {
    monochromeTheme,
    monochromeThemeCSSVars,
    getTextColor,
    getSurfaceColor,
    getBorderColor,
    getButtonColors
} from './colors';

import {
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    letterSpacing,
    typography,
    getTypographyStyles,
    getHeadingStyles,
    getBodyStyles,
    getButtonStyles,
    typographyClasses
} from './typography';

import {
    duration,
    easing,
    animationPresets,
    getAnimation,
    cssAnimations,
    // Individual animation exports
    fadeIn,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    scaleIn,
    hoverScale,
    hoverLift,
    progressFill,
    staggerChildren,
    staggerItem,
    modalOverlay,
    modalContent,
    pageTransition,
    subtlePulse,
    loadingDots
} from './animations';

// Re-export everything
export {
    // Colors
    monochromeTheme,
    monochromeThemeCSSVars,
    getTextColor,
    getSurfaceColor,
    getBorderColor,
    getButtonColors,
    // Typography
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    letterSpacing,
    typography,
    getTypographyStyles,
    getHeadingStyles,
    getBodyStyles,
    getButtonStyles,
    typographyClasses,
    // Animations
    duration,
    easing,
    animationPresets,
    getAnimation,
    cssAnimations,
    fadeIn,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    scaleIn,
    hoverScale,
    hoverLift,
    progressFill,
    staggerChildren,
    staggerItem,
    modalOverlay,
    modalContent,
    pageTransition,
    subtlePulse,
    loadingDots
};

// Combined theme object
export const monochromeOnboardingTheme = {
    colors: monochromeTheme,
    typography,
    animations: animationPresets,
} as const;

// Theme type definitions
export type MonochromeTheme = typeof monochromeTheme;
export type Typography = typeof typography;
export type AnimationPresets = typeof animationPresets;

// Helper hooks için types
export interface ThemeContextType {
    theme: typeof monochromeOnboardingTheme;
    isDark?: boolean;
}

// CSS Variables injection helper
export const injectThemeVariables = () => {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;

        // Inject color variables
        Object.entries(monochromeThemeCSSVars).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Inject font family
        root.style.setProperty('--font-primary', fontFamily.primary.join(', '));
        root.style.setProperty('--font-mono', fontFamily.mono.join(', '));
    }
};

// Utility functions
export const createThemeClasses = () => ({
    // Background classes
    bgPrimary: `bg-[${monochromeTheme.background}]`,
    bgSecondary: `bg-[${monochromeTheme.surface.secondary}]`,
    bgElevated: `bg-[${monochromeTheme.surface.elevated}]`,

    // Text classes  
    textPrimary: `text-[${monochromeTheme.text.primary}]`,
    textSecondary: `text-[${monochromeTheme.text.secondary}]`,
    textDisabled: `text-[${monochromeTheme.text.disabled}]`,

    // Border classes
    borderPrimary: `border-[${monochromeTheme.border.primary}]`,
    borderSecondary: `border-[${monochromeTheme.border.secondary}]`,
    borderFocus: `border-[${monochromeTheme.border.focus}]`,

    // Button classes
    btnPrimary: `bg-[${monochromeTheme.button.primary.background}] text-[${monochromeTheme.button.primary.text}] border-[${monochromeTheme.button.primary.border}]`,
    btnSecondary: `bg-[${monochromeTheme.button.secondary.background}] text-[${monochromeTheme.button.secondary.text}] border-[${monochromeTheme.button.secondary.border}]`,
    btnOutline: `bg-[${monochromeTheme.button.outline.background}] text-[${monochromeTheme.button.outline.text}] border-[${monochromeTheme.button.outline.border}]`,
    btnGhost: `bg-[${monochromeTheme.button.ghost.background}] text-[${monochromeTheme.button.ghost.text}] border-[${monochromeTheme.button.ghost.border}]`,
});

// Animation helper
export const withAnimation = (animationName: keyof typeof animationPresets) => {
    return animationPresets[animationName];
};

// Responsive breakpoints (mobile-first)
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// Z-index scale
export const zIndex = {
    base: 1,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    toast: 70,
    overlay: 80,
    max: 999,
} as const;

// Spacing scale (consistent with Tailwind)
export const spacing = {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
} as const;

export default monochromeOnboardingTheme;
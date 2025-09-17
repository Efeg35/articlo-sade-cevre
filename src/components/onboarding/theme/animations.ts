/**
 * Minimal Animation Sistemi
 * 
 * Monokrom tasarım için subtle ve professional animasyon presets.
 * Daha az dikkat çekici, performans odaklı animasyonlar.
 */

// Animation Durations (ms)
export const duration = {
    fast: 150,        // Çok hızlı geçişler
    normal: 250,      // Normal geçişler  
    slow: 350,        // Yavaş geçişler
    slower: 500,      // En yavaş geçişler
} as const;

// Easing Functions (Professional)
export const easing = {
    linear: 'linear',
    easeOut: [0.25, 0.46, 0.45, 0.94],         // Smooth deceleration
    easeIn: [0.55, 0.06, 0.68, 0.19],          // Smooth acceleration  
    easeInOut: [0.65, 0.05, 0.36, 1],          // Smooth both ways
    spring: [0.68, -0.55, 0.265, 1.55],        // Subtle spring
} as const;

// Framer Motion Animation Variants
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

export const slideUp = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        y: -10
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

export const slideDown = {
    initial: {
        opacity: 0,
        y: -20
    },
    animate: {
        opacity: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        y: 10
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

export const slideLeft = {
    initial: {
        opacity: 0,
        x: 30
    },
    animate: {
        opacity: 1,
        x: 0
    },
    exit: {
        opacity: 0,
        x: -30
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

export const slideRight = {
    initial: {
        opacity: 0,
        x: -30
    },
    animate: {
        opacity: 1,
        x: 0
    },
    exit: {
        opacity: 0,
        x: 30
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

export const scaleIn = {
    initial: {
        opacity: 0,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        scale: 1
    },
    exit: {
        opacity: 0,
        scale: 0.95
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

// Subtle Hover Animations (minimal movement)
export const hoverScale = {
    whileHover: {
        scale: 1.02,
        transition: {
            duration: duration.fast / 1000,
            ease: easing.easeOut
        }
    },
    whileTap: {
        scale: 0.98,
        transition: {
            duration: duration.fast / 1000,
            ease: easing.easeIn
        }
    }
};

export const hoverLift = {
    whileHover: {
        y: -2,
        transition: {
            duration: duration.fast / 1000,
            ease: easing.easeOut
        }
    },
    whileTap: {
        y: 0,
        transition: {
            duration: duration.fast / 1000,
            ease: easing.easeIn
        }
    }
};

// Progress Animation
export const progressFill = {
    initial: {
        scaleX: 0,
        originX: 0
    },
    animate: (progress: number) => ({
        scaleX: progress / 100,
        transition: {
            duration: duration.slow / 1000,
            ease: easing.easeOut
        }
    })
};

// Stagger Children Animation (for lists)
export const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerItem = {
    initial: {
        opacity: 0,
        y: 10
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal / 1000,
            ease: easing.easeOut
        }
    }
};

// Modal/Overlay Animations
export const modalOverlay = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
        duration: duration.fast / 1000
    }
};

export const modalContent = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

// Page Transition Animations (for onboarding screens)
export const pageTransition = {
    initial: {
        opacity: 0,
        x: 20
    },
    animate: {
        opacity: 1,
        x: 0
    },
    exit: {
        opacity: 0,
        x: -20
    },
    transition: {
        duration: duration.normal / 1000,
        ease: easing.easeOut
    }
};

// Pulse Animation (subtle için)
export const subtlePulse = {
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Loading Animation (minimal)
export const loadingDots = {
    animate: {
        opacity: [0.4, 1, 0.4],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Animation Presets Collection
export const animationPresets = {
    // Entry animations
    fadeIn,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    scaleIn,

    // Interaction animations
    hoverScale,
    hoverLift,

    // Complex animations
    progressFill,
    staggerChildren,
    staggerItem,

    // Modal animations
    modalOverlay,
    modalContent,

    // Page transitions
    pageTransition,

    // Special animations
    subtlePulse,
    loadingDots,
} as const;

// Helper function to get animation by name
export const getAnimation = (name: keyof typeof animationPresets) => {
    return animationPresets[name];
};

// CSS Animation Classes (for non-Framer Motion use)
export const cssAnimations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0; 
      transform: scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn ${duration.normal}ms ${easing.easeOut};
  }
  
  .animate-slideUp {
    animation: slideUp ${duration.normal}ms ${easing.easeOut};
  }
  
  .animate-scaleIn {
    animation: scaleIn ${duration.normal}ms ${easing.easeOut};
  }
`;

export default animationPresets;
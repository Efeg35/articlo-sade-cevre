import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

const MobileOnboarding = () => {
  const navigate = useNavigate();

  console.log('[MobileOnboarding] Component mounting - ULTRA SIMPLE ONBOARDING TEST');

  const handleOnboardingComplete = () => {
    console.log('[MobileOnboarding] Ultra simple onboarding completed');
    navigate('/dashboard', { replace: true });
  };

  console.log('[MobileOnboarding] Rendering ULTRA SIMPLE OnboardingFlow');
  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default MobileOnboarding;
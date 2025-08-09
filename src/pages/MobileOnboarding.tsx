import SimpleMobileOnboarding from '@/components/SimpleMobileOnboarding';

const MobileOnboarding = () => {
  return <SimpleMobileOnboarding open={true} onFinish={() => window.history.back()} />;
};

export default MobileOnboarding;
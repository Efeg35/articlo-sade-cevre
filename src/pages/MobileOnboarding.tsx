import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck2, FileText, Sparkles, UploadCloud } from 'lucide-react';

const MobileOnboarding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <UploadCloud className="w-10 h-10 text-primary" />,
      title: 'Upload',
      description: 'Securely upload your documents in PDF, DOCX, or image format.',
    },
    {
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      title: 'Simplify',
      description: 'Let our AI translate complex texts into simple and understandable language for you.',
    },
    {
      icon: <FileCheck2 className="w-10 h-10 text-primary" />,
      title: 'Understand & Create',
      description: 'Get summaries, extract action plans, and even create new document drafts with a single click.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6 pt-12">
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <FileText className="w-20 h-20 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Artiklo</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Understand complex documents and create the new documents you need in seconds.
          </p>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-left">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer CTA Button */}
      <footer className="w-full max-w-md mx-auto pb-4">
        <Button size="lg" className="w-full text-lg" onClick={() => navigate('/dashboard')}>
          Let's Get Started
        </Button>
      </footer>
    </div>
  );
};

export default MobileOnboarding; 
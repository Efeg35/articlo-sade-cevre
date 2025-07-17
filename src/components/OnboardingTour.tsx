import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OnboardingTourProps {
  open: boolean;
  onFinish: () => void;
}

const steps = [
  {
    title: "Karmaşık belgenizi yükleyin",
    description: "PDF, Word veya fotoğraf formatındaki hukuki belgenizi platforma yükleyin."
  },
  {
    title: "Tek tıkla saniyeler içinde anlayın",
    description: "Gelişmiş AI teknolojimiz belgenizi analiz eder ve önemli noktaları tespit eder."
  },
  {
    title: "Tüm belgelerinize arşivden ulaşın",
    description: "Sadeleştirdiğiniz tüm dokümanlar arşivde saklanır, istediğiniz zaman erişebilirsiniz."
  },
  {
    title: "Gizlilik ve güvenlik önceliğimizdir",
    description: "Belgeleriniz ve bilgileriniz asla 3. kişilerle paylaşılmaz."
  }
];

export default function OnboardingTour({ open, onFinish }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };
  const handleFinish = () => {
    onFinish();
    setStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Hoş Geldiniz!</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <div className="text-2xl font-bold mb-2">{steps[step].title}</div>
          <div className="text-muted-foreground mb-4">{steps[step].description}</div>
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-primary" : "bg-muted"}`}></span>
            ))}
          </div>
        </div>
        <DialogFooter>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} className="w-full">İleri</Button>
          ) : (
            <Button onClick={handleFinish} className="w-full">Bitir</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
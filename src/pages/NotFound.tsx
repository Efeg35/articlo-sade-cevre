import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <div className="max-w-md w-full">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-muted-foreground mb-8">
          Sayfa Bulunamadı
        </h2>
        <p className="text-muted-foreground mb-10">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Button asChild size="lg">
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

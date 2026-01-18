import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LicensePlateReader } from "@/components/LicensePlateReader";
import { Camera, FileImage, Zap, Sparkles } from 'lucide-react';
import { AnimatedButton } from "@/components/ui/animated-components";

interface PlateReaderButtonProps {
  onPlateDetected: (plateData: any, customerData?: any) => void;
  className?: string;
}

export function PlateReaderButton({ onPlateDetected, className = "" }: PlateReaderButtonProps) {
  const [showReader, setShowReader] = useState(false);

  const handlePlateDetected = (plateData: any, customerData?: any) => {
    onPlateDetected(plateData, customerData);
    setShowReader(false);
  };

  return (
    <>
      <AnimatedButton
        onClick={() => setShowReader(true)}
        variant="primary"
        size="md"
        animation="glow"
        className={className}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Camera className="h-5 w-5" />
            <Zap className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
          </div>
          <span className="font-bold text-sm">قراءة اللوحة</span>
          <Badge className="bg-white/20 text-white text-xs px-2 py-0.5 border-0">
            AI
          </Badge>
        </div>
      </AnimatedButton>

      <Dialog open={showReader} onOpenChange={setShowReader}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden glass-effect">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl animate-fade-in-down">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white animate-glow-pulse">
                <Camera className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                قارئ لوحات  الكافية بالذكاء الاصطناعي
              </span>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-shimmer">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 animate-fade-in-up">
            <LicensePlateReader 
              onPlateDetected={handlePlateDetected}
              autoStart={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
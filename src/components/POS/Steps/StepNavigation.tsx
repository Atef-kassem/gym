import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  canProceed: boolean;
  nextLabel?: string;
  showCancel?: boolean;
  isMobile?: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onCancel,
  canProceed,
  nextLabel = "التالي",
  showCancel = true,
  isMobile = false
}: StepNavigationProps) {
  const getNextButtonText = () => {
    switch (currentStep) {
      case 1: return "اختيار الخدمات";
      case 2: return "مراجعة والدفع";
      case 3: return "إتمام الطلب";
      default: return nextLabel;
    }
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="safe-area-inset-bottom">
          <div className="flex items-center justify-between p-4 gap-3">
            {/* Cancel Button */}
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 max-w-[80px] h-12 flex flex-col items-center justify-center gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="text-xs">إلغاء</span>
            </Button>

            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 1}
              className="flex-1 max-w-[80px] h-12 flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="text-xs">السابق</span>
            </Button>

            {/* Next/Complete Button */}
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className={`flex-1 h-12 flex items-center justify-center gap-2 font-medium text-sm px-6 ${
                currentStep === totalSteps 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-primary hover:bg-primary/90 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in`}
            >
              <span className="truncate">{getNextButtonText()}</span>
              {currentStep < totalSteps && <ChevronLeft className="h-4 w-4 flex-shrink-0" />}
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 pb-3">
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep
                      ? 'bg-primary w-8'
                      : i + 1 < currentStep
                      ? 'bg-green-500 w-4'
                      : 'bg-gray-300 w-4'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-t bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
        )}
        {showCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-muted-foreground"
          >
            إلغاء
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i + 1 === currentStep
                ? 'bg-primary'
                : i + 1 < currentStep
                ? 'bg-green-500'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div>
        {currentStep < totalSteps ? (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            {nextLabel}
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-green-600 hover:bg-green-700"
          >
            إتمام الطلب
          </Button>
        )}
      </div>
    </div>
  );
}
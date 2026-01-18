import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

interface TestSuccessButtonProps {
  onTestSuccess: () => void;
}

export const TestSuccessButton: React.FC<TestSuccessButtonProps> = ({ onTestSuccess }) => {
  return (
    <Button
      onClick={onTestSuccess}
      variant="outline"
      className="bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
    >
      <TestTube className="h-4 w-4 mr-2" />
      اختبار شاشة النجاح
    </Button>
  );
};
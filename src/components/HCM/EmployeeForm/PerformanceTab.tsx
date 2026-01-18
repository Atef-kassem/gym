import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Award, Target, BookOpen } from "lucide-react";

interface PerformanceTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PerformanceTab = ({ formData, setFormData }: PerformanceTabProps) => {
  const handlePerformanceChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      performance: { ...formData.performance, [field]: value }
    });
  };

  const handleTrainingChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      training: { ...formData.training, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* التقييم الحالي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            التقييم الحالي
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lastEvaluationDate">تاريخ آخر تقييم</Label>
            <Input
              id="lastEvaluationDate"
              type="date"
              value={formData.performance?.lastEvaluationDate || ""}
              onChange={(e) => handlePerformanceChange("lastEvaluationDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overallRating">التقييم العام</Label>
            <Select value={formData.performance?.overallRating || ""} onValueChange={(value) => handlePerformanceChange("overallRating", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ممتاز">ممتاز (90-100%)</SelectItem>
                <SelectItem value="جيد جداً">جيد جداً (80-89%)</SelectItem>
                <SelectItem value="جيد">جيد (70-79%)</SelectItem>
                <SelectItem value="مقبول">مقبول (60-69%)</SelectItem>
                <SelectItem value="ضعيف">ضعيف (أقل من 60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="performanceScore">النقاط العددية</Label>
            <Input
              id="performanceScore"
              type="number"
              min="0"
              max="100"
              value={formData.performance?.score || ""}
              onChange={(e) => handlePerformanceChange("score", e.target.value)}
              placeholder="85"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextEvaluationDate">تاريخ التقييم القادم</Label>
            <Input
              id="nextEvaluationDate"
              type="date"
              value={formData.performance?.nextEvaluationDate || ""}
              onChange={(e) => handlePerformanceChange("nextEvaluationDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* نقاط القوة والتحسن */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            نقاط القوة ومجالات التحسن
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">نقاط القوة</Label>
            <Textarea
              id="strengths"
              value={formData.performance?.strengths || ""}
              onChange={(e) => handlePerformanceChange("strengths", e.target.value)}
              placeholder="اذكر نقاط القوة الرئيسية للموظف..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvementAreas">مجالات التحسن</Label>
            <Textarea
              id="improvementAreas"
              value={formData.performance?.improvementAreas || ""}
              onChange={(e) => handlePerformanceChange("improvementAreas", e.target.value)}
              placeholder="اذكر المجالات التي تحتاج إلى تحسن..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">الأهداف للفترة القادمة</Label>
            <Textarea
              id="goals"
              value={formData.performance?.goals || ""}
              onChange={(e) => handlePerformanceChange("goals", e.target.value)}
              placeholder="اذكر الأهداف المحددة للموظف..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* المكافآت والعقوبات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            المكافآت والعقوبات
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalRewards">إجمالي المكافآت (هذا العام)</Label>
            <Input
              id="totalRewards"
              type="number"
              value={formData.performance?.totalRewards || ""}
              onChange={(e) => handlePerformanceChange("totalRewards", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastRewardDate">تاريخ آخر مكافأة</Label>
            <Input
              id="lastRewardDate"
              type="date"
              value={formData.performance?.lastRewardDate || ""}
              onChange={(e) => handlePerformanceChange("lastRewardDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPenalties">إجمالي العقوبات</Label>
            <Input
              id="totalPenalties"
              type="number"
              value={formData.performance?.totalPenalties || ""}
              onChange={(e) => handlePerformanceChange("totalPenalties", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastPenaltyDate">تاريخ آخر عقوبة</Label>
            <Input
              id="lastPenaltyDate"
              type="date"
              value={formData.performance?.lastPenaltyDate || ""}
              onChange={(e) => handlePerformanceChange("lastPenaltyDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* التدريب والتطوير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            التدريب والتطوير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completedTrainings">الدورات المكتملة (هذا العام)</Label>
              <Input
                id="completedTrainings"
                type="number"
                value={formData.training?.completedCourses || ""}
                onChange={(e) => handleTrainingChange("completedCourses", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainingHours">إجمالي ساعات التدريب</Label>
              <Input
                id="trainingHours"
                type="number"
                value={formData.training?.totalHours || ""}
                onChange={(e) => handleTrainingChange("totalHours", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendedTraining">التدريب المُوصى به</Label>
            <Textarea
              id="recommendedTraining"
              value={formData.training?.recommendedCourses || ""}
              onChange={(e) => handleTrainingChange("recommendedCourses", e.target.value)}
              placeholder="اذكر الدورات التدريبية المُوصى بها للموظف..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">الشهادات المهنية</Label>
            <Textarea
              id="certifications"
              value={formData.training?.certifications || ""}
              onChange={(e) => handleTrainingChange("certifications", e.target.value)}
              placeholder="اذكر الشهادات المهنية الحاصل عليها..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* ملاحظات التقييم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            ملاحظات عامة على الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="performanceNotes">ملاحظات المقيم</Label>
            <Textarea
              id="performanceNotes"
              value={formData.performance?.notes || ""}
              onChange={(e) => handlePerformanceChange("notes", e.target.value)}
              placeholder="أي ملاحظات إضافية حول أداء الموظف..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;
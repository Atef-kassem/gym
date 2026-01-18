import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Bot, 
  Smile, 
  Frown, 
  Meh, 
  Heart,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";

interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  trend: 'up' | 'down' | 'stable';
  averageScore: number;
}

interface SmartRecommendation {
  id: string;
  type: 'service_improvement' | 'customer_retention' | 'marketing';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

const mockSentimentData: SentimentAnalysis = {
  positive: 72,
  neutral: 20,
  negative: 8,
  trend: 'up',
  averageScore: 4.3
};

const smartRecommendations: SmartRecommendation[] = [
  {
    id: '1',
    type: 'service_improvement',
    title: 'تحسين وقت الخدمة',
    description: 'تشير البيانات إلى أن تقليل وقت الانتظار بـ 15% سيزيد رضا العملاء بنسبة 25%',
    priority: 'high',
    estimatedImpact: '+25% رضا العملاء'
  },
  {
    id: '2',
    type: 'customer_retention',
    title: 'برنامج استعادة العملاء',
    description: 'تحديد 45 عميل معرض لخطر المغادرة ومقترحات للاحتفاظ بهم',
    priority: 'high',
    estimatedImpact: '+15% معدل الاحتفاظ'
  },
  {
    id: '3',
    type: 'marketing',
    title: 'تخصيص الحملات التسويقية',
    description: 'تقسيم العملاء إلى 6 مجموعات لحملات أكثر فعالية',
    priority: 'medium',
    estimatedImpact: '+40% معدل التفاعل'
  }
];

const getSentimentIcon = (type: 'positive' | 'neutral' | 'negative') => {
  switch (type) {
    case 'positive':
      return <Smile className="w-5 h-5 text-green-500" />;
    case 'neutral':
      return <Meh className="w-5 h-5 text-yellow-500" />;
    case 'negative':
      return <Frown className="w-5 h-5 text-red-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function AISentimentAnalysis() {
  const [sentimentData, setSentimentData] = useState(mockSentimentData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runSentimentAnalysis = () => {
    setIsAnalyzing(true);
    // محاكاة تحليل المشاعر
    setTimeout(() => {
      setIsAnalyzing(false);
      // تحديث البيانات مع تغييرات طفيفة
      setSentimentData(prev => ({
        ...prev,
        positive: Math.max(60, Math.min(85, prev.positive + (Math.random() - 0.5) * 10)),
        neutral: Math.max(10, Math.min(30, prev.neutral + (Math.random() - 0.5) * 8)),
        negative: Math.max(5, Math.min(20, prev.negative + (Math.random() - 0.5) * 6)),
        averageScore: Math.max(3.5, Math.min(5, prev.averageScore + (Math.random() - 0.5) * 0.3))
      }));
    }, 2000);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50/50 to-blue-50/50 border-l-4 border-l-green-500 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-green-600 animate-pulse" />
          تحليل المشاعر الذكي
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            AI+
          </Badge>
        </CardTitle>
        <CardDescription>
          تحليل ذكي لمشاعر العملاء من التقييمات والتعليقات
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          
          {/* Sentiment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                {getSentimentIcon('positive')}
                <span className="font-medium text-green-800">إيجابي</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{Math.round(sentimentData.positive)}%</div>
              <Progress value={sentimentData.positive} className="h-2 mt-2 bg-green-100" />
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                {getSentimentIcon('neutral')}
                <span className="font-medium text-yellow-800">محايد</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{Math.round(sentimentData.neutral)}%</div>
              <Progress value={sentimentData.neutral} className="h-2 mt-2 bg-yellow-100" />
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                {getSentimentIcon('negative')}
                <span className="font-medium text-red-800">سلبي</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{Math.round(sentimentData.negative)}%</div>
              <Progress value={sentimentData.negative} className="h-2 mt-2 bg-red-100" />
            </div>
          </div>

          {/* Overall Score */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-800">النتيجة الإجمالية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {sentimentData.averageScore.toFixed(1)}/5
                </span>
                {sentimentData.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : sentimentData.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              توصيات ذكية لتحسين رضا العملاء
            </h4>
            
            {smartRecommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className="p-3 border rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-300 bg-white/70 backdrop-blur-sm animate-scale-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {recommendation.title}
                      </h5>
                      <Badge className={`text-xs ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority === 'high' ? 'عالي' : 
                         recommendation.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {recommendation.description}
                    </p>
                    <div className="text-xs font-medium text-green-600">
                      التأثير المتوقع: {recommendation.estimatedImpact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={runSentimentAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Bot className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'جاري تحليل المشاعر...' : 'تحديث تحليل المشاعر'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
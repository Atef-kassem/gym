import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  borderColor: string;
  bgColor: string;
}

const recentReviews: Review[] = [
  {
    id: 1,
    name: "أحمد محمد",
    rating: 5,
    comment: "خدمة ممتازة وسرعة في الإنجاز",
    borderColor: "border-l-green-500",
    bgColor: "hover:bg-green-50/30"
  },
  {
    id: 2,
    name: "فاطمة سالم",
    rating: 4,
    comment: "جودة عالية لكن يمكن تحسين وقت الانتظار",
    borderColor: "border-l-blue-500",
    bgColor: "hover:bg-blue-50/30"
  }
];

export function CustomerSatisfactionSection() {
  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star 
        key={star} 
        className={`h-4 w-4 hover:scale-125 transition-transform duration-200 ${
          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`} 
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50/50 to-white border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-500 animate-pulse" />
          تقييمات العملاء الأخيرة
        </CardTitle>
        <CardDescription>آخر التقييمات والملاحظات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReviews.map((review, index) => (
            <div 
              key={review.id}
              className={`border-l-4 ${review.borderColor} pl-4 ${review.bgColor} p-3 rounded transition-all duration-200 hover:scale-105 animate-scale-in`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm font-medium">{review.name}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
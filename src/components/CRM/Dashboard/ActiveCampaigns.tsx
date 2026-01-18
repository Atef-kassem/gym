import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'scheduled';
  customers: number;
  responses: number;
  endDate: string;
}

const activeCampaigns: Campaign[] = [
  { id: 1, name: "عرض نهاية الأسبوع", status: "active", customers: 450, responses: 78, endDate: "2024-01-30" },
  { id: 2, name: "خصم العملاء الجدد", status: "scheduled", customers: 200, responses: 0, endDate: "2024-02-15" },
  { id: 3, name: "برنامج الولاء الشتوي", status: "active", customers: 1200, responses: 234, endDate: "2024-02-28" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">نشط</Badge>;
    case "scheduled":
      return <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">مجدول</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function ActiveCampaigns() {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500 animate-pulse" />
          الحملات التسويقية النشطة
        </CardTitle>
        <CardDescription>متابعة وإدارة الحملات التسويقية الحالية</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeCampaigns.map((campaign, index) => (
            <div 
              key={campaign.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate('/crm/campaigns')}
            >
              <div>
                <h4 className="font-medium group-hover:text-purple-600 transition-colors">{campaign.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {campaign.customers} عميل مستهدف • ينتهي في {campaign.endDate}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center group-hover:scale-105 transition-transform duration-200">
                  <p className="text-sm font-medium">{campaign.responses}</p>
                  <p className="text-xs text-muted-foreground">استجابة</p>
                </div>
                <div className="group-hover:scale-110 transition-transform duration-200">
                  {getStatusBadge(campaign.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare,
  Users,
  TrendingUp,
  BarChart3,
  Settings,
  Link,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  Repeat,
  ExternalLink
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  followers: number;
  engagement: number;
  lastPost: string;
  color: string;
}

export function SocialMediaIntegration() {
  const { toast } = useToast();
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "facebook",
      name: "فيسبوك",
      icon: Facebook,
      connected: true,
      followers: 12500,
      engagement: 4.2,
      lastPost: "منذ ساعتين",
      color: "border-blue-500"
    },
    {
      id: "instagram",
      name: "انستقرام",
      icon: Instagram,
      connected: true,
      followers: 8300,
      engagement: 6.8,
      lastPost: "منذ 4 ساعات",
      color: "border-pink-500"
    },
    {
      id: "twitter",
      name: "تويتر",
      icon: Twitter,
      connected: false,
      followers: 0,
      engagement: 0,
      lastPost: "غير متصل",
      color: "border-blue-400"
    },
    {
      id: "linkedin",
      name: "لينكدان",
      icon: Linkedin,
      connected: false,
      followers: 0,
      engagement: 0,
      lastPost: "غير متصل",
      color: "border-blue-700"
    },
    {
      id: "youtube",
      name: "يوتيوب",
      icon: Youtube,
      connected: true,
      followers: 2100,
      engagement: 8.5,
      lastPost: "منذ يومين",
      color: "border-red-500"
    }
  ]);

  const [socialPosts] = useState([
    {
      id: 1,
      platform: "facebook",
      content: "عرض خاص على خدمات    الكافية! خصم 25% لفترة محدودة 🚗✨",
      likes: 156,
      comments: 23,
      shares: 8,
      views: 2340,
      date: "2024-01-20"
    },
    {
      id: 2,
      platform: "instagram",
      content: "صور من خدماتنا المميزة 📸 # _سيارات #جودة_عالية",
      likes: 234,
      comments: 45,
      shares: 12,
      views: 3200,
      date: "2024-01-19"
    },
    {
      id: 3,
      platform: "youtube",
      content: "فيديو: كيفية الحفاظ على نظافة سيارتك 🎥",
      likes: 89,
      comments: 15,
      shares: 6,
      views: 1500,
      date: "2024-01-18"
    }
  ]);

  const handleConnectPlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: !platform.connected }
        : platform
    ));
    
    const platform = platforms.find(p => p.id === platformId);
    toast({
      title: platform?.connected ? "تم قطع الاتصال" : "تم الربط بنجاح",
      description: `تم ${platform?.connected ? "قطع الاتصال مع" : "ربط"} ${platform?.name}`,
    });
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return MessageSquare;
    return platform.icon;
  };

  const getPlatformColor = (platformId: string) => {
    switch (platformId) {
      case "facebook": return "text-blue-600";
      case "instagram": return "text-pink-600";
      case "twitter": return "text-blue-400";
      case "linkedin": return "text-blue-700";
      case "youtube": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.id} className={`hover:shadow-lg transition-all border-l-4 ${platform.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${getPlatformColor(platform.id)}`} />
                  <CardTitle className="text-base">{platform.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {platform.connected && <CheckCircle className="w-4 h-4 text-green-500" />}
                  <Switch
                    checked={platform.connected}
                    onCheckedChange={() => handleConnectPlatform(platform.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {platform.connected ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">المتابعين</span>
                      <span className="font-semibold">{platform.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">معدل التفاعل</span>
                      <span className="font-semibold">{platform.engagement}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">آخر منشور</span>
                      <span className="text-sm">{platform.lastPost}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      إدارة الحساب
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">غير متصل</p>
                    <Button size="sm" className="mt-2" onClick={() => handleConnectPlatform(platform.id)}>
                      <Link className="w-3 h-3 mr-1" />
                      ربط الحساب
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="posts">المنشورات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المتابعين</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platforms.reduce((sum, p) => sum + p.followers, 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">عبر جميع المنصات</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معدل التفاعل</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.8%</div>
                <p className="text-xs text-muted-foreground">متوسط التفاعل</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المنشورات النشطة</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialPosts.length}</div>
                <p className="text-xs text-muted-foreground">منشور هذا الشهر</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
                <Eye className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialPosts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">مشاهدة هذا الشهر</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="space-y-4">
            {socialPosts.map((post) => {
              const Icon = getPlatformIcon(post.platform);
              return (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${getPlatformColor(post.platform)} mt-1`} />
                      <div className="flex-1">
                        <p className="text-sm mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            <span>{post.shares}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أداء المنصات</CardTitle>
                <CardDescription>مقارنة معدلات التفاعل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platforms.filter(p => p.connected).map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <platform.icon className={`w-4 h-4 ${getPlatformColor(platform.id)}`} />
                        <span className="text-sm">{platform.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                            style={{ width: `${(platform.engagement / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{platform.engagement}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">نمو المتابعين</CardTitle>
                <CardDescription>الزيادة في عدد المتابعين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">سيتم عرض تحليلات مفصلة قريباً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
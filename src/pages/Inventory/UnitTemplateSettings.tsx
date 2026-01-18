import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UnitConversion {
  id: string;
  unitName: string;
  unitSymbol: string;
  conversionFactor: number;
  largerUnitName: string;
  largerUnitSymbol: string;
}

interface UnitTemplate {
  id: string;
  templateName: string;
  baseUnit: string;
  baseUnitSymbol: string;
  conversions: UnitConversion[];
  createdAt: string;
  updatedAt: string;
}

export default function UnitTemplateSettings() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UnitTemplate | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [baseUnit, setBaseUnit] = useState("");
  const [baseUnitSymbol, setBaseUnitSymbol] = useState("");
  const [conversions, setConversions] = useState<UnitConversion[]>([]);
  const [currentConversion, setCurrentConversion] = useState({
    unitName: "",
    unitSymbol: "",
    conversionFactor: 1,
    largerUnitName: "",
    largerUnitSymbol: ""
  });

  // Mock data
  const [templates, setTemplates] = useState<UnitTemplate[]>([
    {
      id: "1",
      templateName: "قالب التغليف الصغير",
      baseUnit: "حبة",
      baseUnitSymbol: "PCS",
      conversions: [
        {
          id: "1",
          unitName: "حبة",
          unitSymbol: "PCS",
          conversionFactor: 12,
          largerUnitName: "درزن",
          largerUnitSymbol: "DZ"
        },
        {
          id: "2",
          unitName: "درزن",
          unitSymbol: "DZ",
          conversionFactor: 8,
          largerUnitName: "كرتون",
          largerUnitSymbol: "CTN"
        }
      ],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      templateName: "قالب الأوزان",
      baseUnit: "جرام",
      baseUnitSymbol: "G",
      conversions: [
        {
          id: "3",
          unitName: "جرام",
          unitSymbol: "G",
          conversionFactor: 1000,
          largerUnitName: "كيلوجرام",
          largerUnitSymbol: "KG"
        }
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12"
    }
  ]);

  const resetForm = () => {
    setTemplateName("");
    setBaseUnit("");
    setBaseUnitSymbol("");
    setConversions([]);
    setCurrentConversion({
      unitName: "",
      unitSymbol: "",
      conversionFactor: 1,
      largerUnitName: "",
      largerUnitSymbol: ""
    });
    setEditingTemplate(null);
  };

  const handleAddConversion = () => {
    if (!currentConversion.unitName || !currentConversion.largerUnitName || currentConversion.conversionFactor < 1) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول والتأكد من أن معامل التحويل أكبر من أو يساوي 1"
      });
      return;
    }

    const newConversion: UnitConversion = {
      id: Date.now().toString(),
      ...currentConversion
    };

    setConversions([...conversions, newConversion]);
    setCurrentConversion({
      unitName: "",
      unitSymbol: "",
      conversionFactor: 1,
      largerUnitName: "",
      largerUnitSymbol: ""
    });
  };

  const handleRemoveConversion = (id: string) => {
    setConversions(conversions.filter(conv => conv.id !== id));
  };

  const handleSaveTemplate = () => {
    if (!templateName || !baseUnit || !baseUnitSymbol) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول الأساسية"
      });
      return;
    }

    const newTemplate: UnitTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      templateName,
      baseUnit,
      baseUnitSymbol,
      conversions,
      createdAt: editingTemplate?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? newTemplate : t));
      toast({
        title: "تم التحديث",
        description: "تم تحديث قالب الوحدة بنجاح"
      });
    } else {
      setTemplates([...templates, newTemplate]);
      toast({
        title: "تم الحفظ",
        description: "تم إضافة قالب الوحدة بنجاح"
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditTemplate = (template: UnitTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.templateName);
    setBaseUnit(template.baseUnit);
    setBaseUnitSymbol(template.baseUnitSymbol);
    setConversions(template.conversions);
    setIsDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: "تم الحذف",
      description: "تم حذف قالب الوحدة بنجاح"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إعدادات قوالب الوحدات</h1>
          <p className="text-muted-foreground">إدارة قوالب تحويل وحدات القياس للمنتجات</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              أضف قالب الوحدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "تعديل قالب الوحدة" : "إضافة قالب وحدة جديد"}
              </DialogTitle>
              <DialogDescription>
                قم بتعريف العلاقة بين الوحدات المختلفة للمنتج مع معاملات التحويل
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Template Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات القالب الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">اسم القالب</Label>
                    <Input
                      id="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="مثال: قالب التغليف الصغير"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseUnit">الوحدة الأساسية</Label>
                    <Input
                      id="baseUnit"
                      value={baseUnit}
                      onChange={(e) => setBaseUnit(e.target.value)}
                      placeholder="مثال: حبة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseUnitSymbol">رمز الوحدة الأساسية</Label>
                    <Input
                      id="baseUnitSymbol"
                      value={baseUnitSymbol}
                      onChange={(e) => setBaseUnitSymbol(e.target.value)}
                      placeholder="مثال: PCS"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Add Conversion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إضافة طبقة تحويل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitName">اسم الوحدة</Label>
                      <Input
                        id="unitName"
                        value={currentConversion.unitName}
                        onChange={(e) => setCurrentConversion({...currentConversion, unitName: e.target.value})}
                        placeholder="مثال: حبة"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitSymbol">رمز الوحدة</Label>
                      <Input
                        id="unitSymbol"
                        value={currentConversion.unitSymbol}
                        onChange={(e) => setCurrentConversion({...currentConversion, unitSymbol: e.target.value})}
                        placeholder="مثال: PCS"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conversionFactor">معامل التحويل</Label>
                      <Input
                        id="conversionFactor"
                        type="number"
                        min="1"
                        value={currentConversion.conversionFactor}
                        onChange={(e) => setCurrentConversion({...currentConversion, conversionFactor: parseInt(e.target.value) || 1})}
                        placeholder="12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="largerUnitName">الوحدة الأكبر</Label>
                      <Input
                        id="largerUnitName"
                        value={currentConversion.largerUnitName}
                        onChange={(e) => setCurrentConversion({...currentConversion, largerUnitName: e.target.value})}
                        placeholder="مثال: درزن"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="largerUnitSymbol">رمز الوحدة الأكبر</Label>
                      <Input
                        id="largerUnitSymbol"
                        value={currentConversion.largerUnitSymbol}
                        onChange={(e) => setCurrentConversion({...currentConversion, largerUnitSymbol: e.target.value})}
                        placeholder="مثال: DZ"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddConversion} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    أضف الوحدة
                  </Button>
                </CardContent>
              </Card>

              {/* Conversions Table */}
              {conversions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">طبقات التحويل المضافة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">#</TableHead>
                          <TableHead className="text-right">اسم الوحدة</TableHead>
                          <TableHead className="text-right">الرمز</TableHead>
                          <TableHead className="text-right">معامل التحويل</TableHead>
                          <TableHead className="text-right">الوحدة الأكبر</TableHead>
                          <TableHead className="text-right">رمز الوحدة الأكبر</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conversions.map((conversion, index) => (
                          <TableRow key={conversion.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{conversion.unitName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{conversion.unitSymbol}</Badge>
                            </TableCell>
                            <TableCell>{conversion.conversionFactor}</TableCell>
                            <TableCell>{conversion.largerUnitName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{conversion.largerUnitSymbol}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveConversion(conversion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveTemplate}>
                  {editingTemplate ? "تحديث" : "حفظ"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            قوالب الوحدات المعرفة
          </CardTitle>
          <CardDescription>
            جميع قوالب تحويل الوحدات المتاحة في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم القالب</TableHead>
                <TableHead className="text-right">الوحدة الأساسية</TableHead>
                <TableHead className="text-right">طبقات التحويل</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">آخر تعديل</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.templateName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{template.baseUnit}</span>
                      <Badge variant="outline">{template.baseUnitSymbol}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.conversions.map((conv, index) => (
                        <div key={conv.id} className="flex items-center gap-1 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {conv.unitSymbol}
                          </Badge>
                          <span>→</span>
                          <Badge variant="secondary" className="text-xs">
                            {conv.largerUnitSymbol}
                          </Badge>
                          <span className="text-muted-foreground">({conv.conversionFactor})</span>
                          {index < template.conversions.length - 1 && <span className="mx-1">|</span>}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{template.createdAt}</TableCell>
                  <TableCell>{template.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
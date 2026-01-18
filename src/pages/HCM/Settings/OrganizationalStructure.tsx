import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Plus, Edit, Trash2, Users, MapPin, ArrowLeft, TreePine, List, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Position,
  Handle,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface OrganizationalUnit {
  id: string;
  name: string;
  nameEn: string;
  type: 'company' | 'branch' | 'department' | 'section';
  parentId?: string;
  code: string;
  manager: string;
  location: string;
  employeeCount: number;
  status: 'active' | 'inactive';
  [key: string]: any;
}

// مكون عقدة مخصص للهيكل التنظيمي
const OrganizationalNode = ({ data }: { data: any }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      company: 'bg-blue-500',
      branch: 'bg-green-500', 
      department: 'bg-yellow-500',
      section: 'bg-purple-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      company: '🏢',
      branch: '🏪',
      department: '📂',
      section: '📄'
    };
    return icons[type as keyof typeof icons] || '📁';
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg min-w-[200px] p-3">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getTypeColor(data.type)} text-white text-lg mb-2`}>
          {getTypeIcon(data.type)}
        </div>
        
        <div className="font-bold text-sm text-gray-800 mb-1">{data.name}</div>
        <div className="text-xs text-gray-500 mb-2">{data.nameEn}</div>
        
        <div className="space-y-1">
          <div className="text-xs bg-gray-100 rounded px-2 py-1">
            {data.code}
          </div>
          <div className="text-xs text-gray-600">
            👤 {data.manager}
          </div>
          <div className="text-xs text-gray-600">
            📍 {data.location}
          </div>
          <div className="text-xs text-blue-600 font-medium">
            👥 {data.employeeCount} موظف
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

// أنواع العقد المخصصة
const nodeTypes = {
  organizational: OrganizationalNode,
};

const OrganizationalStructure = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [units, setUnits] = useState<OrganizationalUnit[]>([
    {
      id: "1",
      name: "الشركة الرئيسية",
      nameEn: "Main Company",
      type: "company",
      code: "MC001",
      manager: "أحمد محمد",
      location: "الرياض",
      employeeCount: 150,
      status: "active"
    },
    {
      id: "2",
      name: "فرع الرياض",
      nameEn: "Riyadh Branch",
      type: "branch",
      parentId: "1",
      code: "RB001",
      manager: "سالم أحمد",
      location: "الرياض - حي الملز",
      employeeCount: 45,
      status: "active"
    },
    {
      id: "3",
      name: "فرع جدة",
      nameEn: "Jeddah Branch",
      type: "branch",
      parentId: "1",
      code: "JB001",
      manager: "خالد حسن",
      location: "جدة - حي الروضة",
      employeeCount: 38,
      status: "active"
    },
    {
      id: "4",
      name: "قسم الموارد البشرية",
      nameEn: "HR Department",
      type: "department",
      parentId: "2",
      code: "HR001",
      manager: "فاطمة علي",
      location: "الطابق الثاني",
      employeeCount: 8,
      status: "active"
    },
    {
      id: "5",
      name: "قسم المحاسبة",
      nameEn: "Accounting Department",
      type: "department",
      parentId: "2",
      code: "AC001",
      manager: "محمد عبدالله",
      location: "الطابق الأول",
      employeeCount: 12,
      status: "active"
    },
    {
      id: "6",
      name: "شعبة التوظيف",
      nameEn: "Recruitment Section",
      type: "section",
      parentId: "4",
      code: "RC001",
      manager: "نورا أحمد",
      location: "مكتب 201",
      employeeCount: 3,
      status: "active"
    }
  ]);

  const [currentView, setCurrentView] = useState<'tree' | 'table'>('tree');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrganizationalUnit | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    nameEn: string;
    type: 'company' | 'branch' | 'department' | 'section';
    parentId: string;
    code: string;
    manager: string;
    location: string;
  }>({
    name: "",
    nameEn: "",
    type: "department",
    parentId: "",
    code: "",
    manager: "",
    location: ""
  });

  // إنشاء العقد والحواف للشجرة
  const { nodes: treeNodes, edges: treeEdges } = useMemo(() => {
    const filteredUnits = units.filter(unit => {
      const matchesSearch = searchTerm === '' || 
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = selectedLevel === 'all' || unit.type === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // حساب المواقع للعقد
    const levelCounts = { company: 0, branch: 0, department: 0, section: 0 };
    const nodePositions = new Map();
    
    // ترتيب الوحدات حسب التسلسل الهرمي
    const sortedUnits = [...filteredUnits].sort((a, b) => {
      const typeOrder = { company: 0, branch: 1, department: 2, section: 3 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
    
    sortedUnits.forEach((unit, index) => {
      const level = { company: 0, branch: 1, department: 2, section: 3 }[unit.type];
      const x = (levelCounts[unit.type] * 300) + (level * 50);
      const y = level * 200;
      
      nodePositions.set(unit.id, { x, y });
      levelCounts[unit.type]++;
      
      nodes.push({
        id: unit.id,
        type: 'organizational',
        position: { x, y },
        data: unit,
      });
      
      // إضافة الحواف للوحدات التابعة
      if (unit.parentId && filteredUnits.find(u => u.id === unit.parentId)) {
        edges.push({
          id: `e${unit.parentId}-${unit.id}`,
          source: unit.parentId,
          target: unit.id,
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#64748b',
          },
        });
      }
    });
    
    return { nodes, edges };
  }, [units, selectedLevel, searchTerm]);

  const [nodes, setNodes, onNodesChange] = useNodesState(treeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(treeEdges);

  // تحديث العقد والحواف عند تغيير البيانات
  useMemo(() => {
    setNodes(treeNodes);
    setEdges(treeEdges);
  }, [treeNodes, treeEdges, setNodes, setEdges]);

  const handleSave = () => {
    if (editingUnit) {
      setUnits(units.map(unit => 
        unit.id === editingUnit.id 
          ? { ...unit, ...formData, employeeCount: unit.employeeCount, status: unit.status }
          : unit
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث الوحدة التنظيمية بنجاح"
      });
    } else {
      const newUnit: OrganizationalUnit = {
        id: Date.now().toString(),
        ...formData,
        employeeCount: 0,
        status: "active"
      };
      setUnits([...units, newUnit]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة الوحدة التنظيمية بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingUnit(null);
    setFormData({
      name: "",
      nameEn: "",
      type: "department",
      parentId: "",
      code: "",
      manager: "",
      location: ""
    });
  };

  const handleEdit = (unit: OrganizationalUnit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      nameEn: unit.nameEn,
      type: unit.type,
      parentId: unit.parentId || "",
      code: unit.code,
      manager: unit.manager,
      location: unit.location
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const hasChildren = units.some(unit => unit.parentId === id);
    if (hasChildren) {
      toast({
        title: "لا يمكن الحذف",
        description: "لا يمكن حذف وحدة تحتوي على وحدات فرعية",
        variant: "destructive"
      });
      return;
    }
    
    setUnits(units.filter(unit => unit.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الوحدة التنظيمية بنجاح"
    });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      company: "شركة",
      branch: "فرع",
      department: "قسم",
      section: "شعبة"
    };
    return types[type as keyof typeof types];
  };

  const getParentUnits = () => {
    return units.filter(unit => unit.type !== 'section');
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = searchTerm === '' || 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || unit.type === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/hcm/settings')}
            className="ml-2"
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            رجوع للإعدادات
          </Button>
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">الهيكل التنظيمي</h1>
            <p className="text-muted-foreground">إدارة الإدارات والفروع والأقسام بعرض شجري متطور</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUnit(null);
              setFormData({
                name: "",
                nameEn: "",
                type: "department",
                parentId: "",
                code: "",
                manager: "",
                location: ""
              });
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة وحدة تنظيمية
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? "تعديل الوحدة التنظيمية" : "إضافة وحدة تنظيمية جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة للوحدة التنظيمية
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم (عربي)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم الوحدة"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">الاسم (إنجليزي)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    placeholder="Unit Name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">النوع</Label>
                  <Select value={formData.type} onValueChange={(value: 'company' | 'branch' | 'department' | 'section') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">شركة</SelectItem>
                      <SelectItem value="branch">فرع</SelectItem>
                      <SelectItem value="department">قسم</SelectItem>
                      <SelectItem value="section">شعبة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="code">الكود</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="مثل: HR001"
                  />
                </div>
              </div>

              {formData.type !== 'company' && (
                <div>
                  <Label htmlFor="parent">الوحدة الرئيسية</Label>
                  <Select value={formData.parentId} onValueChange={(value) => setFormData({...formData, parentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوحدة الرئيسية" />
                    </SelectTrigger>
                    <SelectContent>
                      {getParentUnits().map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="manager">المدير المسؤول</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  placeholder="اسم المدير"
                />
              </div>

              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="موقع الوحدة"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingUnit ? "تحديث" : "إضافة"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* شريط الأدوات والفلاتر */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>عرض الهيكل التنظيمي</CardTitle>
              <CardDescription>تصفح الهيكل التنظيمي بطرق متنوعة مع إمكانيات الفلترة المتقدمة</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={currentView === 'tree' ? 'default' : 'outline'} 
                onClick={() => setCurrentView('tree')}
                size="sm"
              >
                <TreePine className="h-4 w-4 ml-1" />
                عرض شجري
              </Button>
              <Button 
                variant={currentView === 'table' ? 'default' : 'outline'} 
                onClick={() => setCurrentView('table')}
                size="sm"
              >
                <List className="h-4 w-4 ml-1" />
                عرض جدولي
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الوحدات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="min-w-[200px]">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="company">الشركات فقط</SelectItem>
                  <SelectItem value="branch">الفروع فقط</SelectItem>
                  <SelectItem value="department">الأقسام فقط</SelectItem>
                  <SelectItem value="section">الشعب فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentView === 'tree' ? (
            <div className="h-[600px] border rounded-lg bg-gray-50">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                attributionPosition="bottom-left"
                className="bg-gradient-to-br from-blue-50 to-indigo-50"
              >
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكود</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المدير</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>عدد الموظفين</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{unit.name}</div>
                          <div className="text-sm text-muted-foreground">{unit.nameEn}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(unit.type)}</Badge>
                      </TableCell>
                      <TableCell>{unit.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {unit.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {unit.employeeCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={unit.status === 'active' ? 'default' : 'secondary'}>
                          {unit.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(unit)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(unit.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUnits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        لا توجد وحدات تطابق معايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{units.filter(u => u.type === 'company').length}</div>
                <div className="text-sm text-muted-foreground">الشركات</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{units.filter(u => u.type === 'branch').length}</div>
                <div className="text-sm text-muted-foreground">الفروع</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Building className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{units.filter(u => u.type === 'department').length}</div>
                <div className="text-sm text-muted-foreground">الأقسام</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{units.reduce((sum, u) => sum + u.employeeCount, 0)}</div>
                <div className="text-sm text-muted-foreground">إجمالي الموظفين</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationalStructure;
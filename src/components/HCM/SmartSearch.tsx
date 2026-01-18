import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, User, Briefcase, MapPin, Calendar, Star, Sparkles } from "lucide-react";

interface SmartSearchProps {
  employees: any[];
  onEmployeeSelect: (employee: any) => void;
}

const SmartSearch = ({ employees, onEmployeeSelect }: SmartSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [smartFilters, setSmartFilters] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm) {
      // Smart search with AI-like capabilities
      const results = employees.filter(employee => {
        const searchLower = searchTerm.toLowerCase();
        return (
          employee.name.toLowerCase().includes(searchLower) ||
          employee.empId.toLowerCase().includes(searchLower) ||
          employee.position.toLowerCase().includes(searchLower) ||
          employee.department.toLowerCase().includes(searchLower) ||
          employee.phone.includes(searchTerm) ||
          employee.email.toLowerCase().includes(searchLower) ||
          employee.nationality.toLowerCase().includes(searchLower) ||
          employee.status.toLowerCase().includes(searchLower)
        );
      });
      
      setFilteredEmployees(results);
      
      // Generate smart suggestions
      const newSuggestions = generateSmartSuggestions(searchTerm, employees);
      setSuggestions(newSuggestions);
    } else {
      setFilteredEmployees(employees);
      setSuggestions([]);
    }
  }, [searchTerm, employees]);

  const generateSmartSuggestions = (term: string, data: any[]) => {
    const suggestions = [];
    const termLower = term.toLowerCase();
    
    // Department suggestions
    const departments = [...new Set(data.map(emp => emp.department))];
    const matchingDepts = departments.filter(dept => 
      dept.toLowerCase().includes(termLower)
    );
    suggestions.push(...matchingDepts.map(dept => `قسم: ${dept}`));
    
    // Position suggestions
    const positions = [...new Set(data.map(emp => emp.position))];
    const matchingPositions = positions.filter(pos => 
      pos.toLowerCase().includes(termLower)
    );
    suggestions.push(...matchingPositions.map(pos => `منصب: ${pos}`));
    
    // Status suggestions
    if (termLower.includes('نشط') || termLower.includes('active')) {
      suggestions.push('الموظفين النشطين');
    }
    if (termLower.includes('ناقص') || termLower.includes('incomplete')) {
      suggestions.push('الملفات الناقصة');
    }
    
    return suggestions.slice(0, 5);
  };

  const applySmartFilter = (filter: string) => {
    setSmartFilters(prev => [...prev, filter]);
    
    let filtered = employees;
    
    if (filter.startsWith('قسم:')) {
      const dept = filter.replace('قسم:', '').trim();
      filtered = employees.filter(emp => emp.department === dept);
    } else if (filter.startsWith('منصب:')) {
      const position = filter.replace('منصب:', '').trim();
      filtered = employees.filter(emp => emp.position === position);
    } else if (filter === 'الموظفين النشطين') {
      filtered = employees.filter(emp => emp.status === 'نشط');
    } else if (filter === 'الملفات الناقصة') {
      filtered = employees.filter(emp => emp.fileStatus === 'ناقص');
    }
    
    setFilteredEmployees(filtered);
    setSearchTerm(filter);
    setSuggestions([]);
  };

  const clearFilters = () => {
    setSmartFilters([]);
    setSearchTerm("");
    setFilteredEmployees(employees);
    setSuggestions([]);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">البحث الذكي</h3>
              <p className="text-sm text-slate-600">البحث المدعوم بالذكاء الاصطناعي في ملفات الموظفين</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن موظف، قسم، منصب، أو أي معلومة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                مسح
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {smartFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {smartFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {filter}
                </Badge>
              ))}
            </div>
          )}

          {/* Smart Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                اقتراحات ذكية
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applySmartFilter(suggestion)}
                    className="text-xs hover:bg-blue-50 hover:border-blue-300"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <div className="text-lg font-bold text-blue-600">{filteredEmployees.length}</div>
              <div className="text-xs text-slate-600">نتائج البحث</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <div className="text-lg font-bold text-green-600">
                {filteredEmployees.filter(emp => emp.fileStatus === 'مكتمل').length}
              </div>
              <div className="text-xs text-slate-600">ملفات مكتملة</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg border">
              <div className="text-lg font-bold text-orange-600">
                {filteredEmployees.filter(emp => emp.fileStatus === 'ناقص').length}
              </div>
              <div className="text-xs text-slate-600">ملفات ناقصة</div>
            </div>
          </div>

          {/* Search Results Preview */}
          {searchTerm && filteredEmployees.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <p className="text-sm font-medium text-slate-700">النتائج ({filteredEmployees.length})</p>
              {filteredEmployees.slice(0, 5).map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => onEmployeeSelect(employee)}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900">{employee.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {employee.empId}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {employee.position}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {employee.department}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      className={
                        employee.fileStatus === 'مكتمل' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {employee.fileStatus}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Star className="w-3 h-3 fill-current" />
                      {employee.completionPercentage}%
                    </div>
                  </div>
                </div>
              ))}
              {filteredEmployees.length > 5 && (
                <p className="text-xs text-slate-500 text-center">
                  و {filteredEmployees.length - 5} نتيجة أخرى...
                </p>
              )}
            </div>
          )}

          {/* No Results */}
          {searchTerm && filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">لم يتم العثور على أي نتائج</p>
              <p className="text-sm text-slate-500">جرب تعديل كلمات البحث أو استخدم الاقتراحات</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSearch;
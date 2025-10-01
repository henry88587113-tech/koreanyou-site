import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Class, User } from '@/api/entities';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function AdminClassesPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClass, setEditingClass] = useState({
    title: '',
    level: '초급',
    date: '',
    start_time: '',
    end_time: '',
    teacher: '',
    capacity: 20,
    zoom_link: '',
    visible: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        loadClasses();
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [navigate]);

  const loadClasses = async () => {
    try {
      const classData = await Class.list('-date', 100);
      setClasses(classData);
    } catch (error) {
      console.error("클래스 로딩 실패:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingClass.id) {
        await Class.update(editingClass.id, editingClass);
      } else {
        await Class.create(editingClass);
      }
      setIsEditing(false);
      setEditingClass({
        title: '',
        level: '초급',
        date: '',
        start_time: '',
        end_time: '',
        teacher: '',
        capacity: 20,
        zoom_link: '',
        visible: true
      });
      loadClasses();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await Class.delete(id);
        loadClasses();
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">수업 관리</h1>
        <p className="text-gray-600 mt-2">한국어 수업을 개설하고 관리합니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{isEditing ? '수업 수정' : '새 수업 개설'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">수업명</Label>
              <Input
                id="title"
                value={editingClass.title}
                onChange={(e) => setEditingClass({...editingClass, title: e.target.value})}
                placeholder="예: 기초 한국어 회화"
              />
            </div>

            <div>
              <Label htmlFor="level">레벨</Label>
              <Select value={editingClass.level} onValueChange={(value) => setEditingClass({...editingClass, level: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="초급">초급</SelectItem>
                  <SelectItem value="중급">중급</SelectItem>
                  <SelectItem value="고급">고급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">수업 날짜</Label>
              <Input
                id="date"
                type="date"
                value={editingClass.date}
                onChange={(e) => setEditingClass({...editingClass, date: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">시작 시간</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={editingClass.start_time}
                  onChange={(e) => setEditingClass({...editingClass, start_time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_time">종료 시간</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={editingClass.end_time}
                  onChange={(e) => setEditingClass({...editingClass, end_time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="teacher">담당 강사</Label>
              <Input
                id="teacher"
                value={editingClass.teacher}
                onChange={(e) => setEditingClass({...editingClass, teacher: e.target.value})}
                placeholder="강사 이름"
              />
            </div>

            <div>
              <Label htmlFor="capacity">정원</Label>
              <Input
                id="capacity"
                type="number"
                value={editingClass.capacity}
                onChange={(e) => setEditingClass({...editingClass, capacity: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <Label htmlFor="zoom_link">Zoom 링크</Label>
              <Input
                id="zoom_link"
                value={editingClass.zoom_link}
                onChange={(e) => setEditingClass({...editingClass, zoom_link: e.target.value})}
                placeholder="https://zoom.us/j/..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? '수정' : '개설'}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditingClass({
                    title: '',
                    level: '초급',
                    date: '',
                    start_time: '',
                    end_time: '',
                    teacher: '',
                    capacity: 20,
                    zoom_link: '',
                    visible: true
                  });
                }}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Classes List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>개설된 수업 목록</CardTitle>
              <Button onClick={() => {
                setIsEditing(false);
                setEditingClass({
                  title: '',
                  level: '초급',
                  date: '',
                  start_time: '',
                  end_time: '',
                  teacher: '',
                  capacity: 20,
                  zoom_link: '',
                  visible: true
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                새 수업
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>수업명</TableHead>
                    <TableHead>레벨</TableHead>
                    <TableHead>날짜/시간</TableHead>
                    <TableHead>강사</TableHead>
                    <TableHead>정원</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.title}</TableCell>
                      <TableCell>{cls.level}</TableCell>
                      <TableCell>
                        {cls.date}<br />
                        <span className="text-sm text-gray-500">
                          {cls.start_time} - {cls.end_time}
                        </span>
                      </TableCell>
                      <TableCell>{cls.teacher}</TableCell>
                      <TableCell>{cls.capacity}명</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
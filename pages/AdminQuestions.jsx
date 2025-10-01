import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Question, User } from '@/api/entities';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    level: 'L1',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    tags: [],
    difficulty: 1,
    is_active: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        loadQuestions();
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [navigate]);

  const loadQuestions = async () => {
    try {
      const data = await Question.list('-created_date', 200);
      setQuestions(data);
    } catch (error) {
      console.error("문항 로딩 실패:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer || formData.options.some(opt => !opt.trim())) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (!formData.options.includes(formData.answer)) {
      alert('정답이 보기 중 하나와 일치해야 합니다.');
      return;
    }

    try {
      if (editingQuestion) {
        await Question.update(editingQuestion.id, formData);
      } else {
        await Question.create(formData);
      }
      
      setShowForm(false);
      setEditingQuestion(null);
      resetForm();
      loadQuestions();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await Question.delete(id);
        loadQuestions();
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      level: question.level,
      question: question.question,
      options: [...question.options],
      answer: question.answer,
      explanation: question.explanation || '',
      tags: question.tags || [],
      difficulty: question.difficulty || 1,
      is_active: question.is_active ?? true
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      level: 'L1',
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      tags: [],
      difficulty: 1,
      is_active: true
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
    resetForm();
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const levelNames = {
    'L1': '초보자 1',
    'L2': '초보자 2',
    'L3': '초급 1',
    'L4': '초급 2',
    'L5': '중급 1'
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">문항 관리</h1>
          <div className="flex gap-2">
            <Link to={createPageUrl("AdminPostList")}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                관리자 홈
              </Button>
            </Link>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              새 문항 추가
            </Button>
          </div>
        </div>
      </header>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingQuestion ? '문항 수정' : '새 문항 추가'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>레벨</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(levelNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{key}: {name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>난이도 (1-5)</Label>
                  <Select value={formData.difficulty.toString()} onValueChange={(value) => setFormData({...formData, difficulty: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <Label htmlFor="is_active">활성화</Label>
                </div>
              </div>

              <div>
                <Label>문항 내용 *</Label>
                <Textarea 
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="문항 내용을 입력하세요"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>보기 (4개) *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.options.map((option, index) => (
                    <div key={index}>
                      <Input 
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`보기 ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>정답 *</Label>
                <Select value={formData.answer} onValueChange={(value) => setFormData({...formData, answer: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="정답을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.options.filter(opt => opt.trim()).map((option, index) => (
                      <SelectItem key={index} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>해설 (선택)</Label>
                <Textarea 
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  placeholder="간단한 해설을 입력하세요"
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingQuestion ? '수정' : '저장'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>문항 목록 ({questions.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>레벨</TableHead>
                  <TableHead>문항</TableHead>
                  <TableHead>정답</TableHead>
                  <TableHead>난이도</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Badge variant="outline">{question.level}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate">{question.question}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{question.answer}</div>
                    </TableCell>
                    <TableCell>⭐ {question.difficulty}</TableCell>
                    <TableCell>
                      {question.is_active ? (
                        <Badge className="bg-green-100 text-green-800">활성</Badge>
                      ) : (
                        <Badge variant="secondary">비활성</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(question)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(question.id)}>
                          <Trash2 className="w-4 h-4" />
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
  );
}
import React, { useState, useEffect } from 'react';
import { Achievement as AchievementEntity } from '@/api/entities';
import { User } from '@/api/entities';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Award, Loader2, Save, X, ArrowLeft } from 'lucide-react';

const AchievementForm = ({ achievement, onSave, onCancel }) => {
    const [formData, setFormData] = useState(achievement || {
        type: 'TOPIK',
        certification_images: [''],
        student_name: '',
        country: '',
        study_period: '',
        description: '',
        achievement_detail: '',
        is_visible: true,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(achievement || {
            type: 'TOPIK',
            certification_images: [''],
            student_name: '',
            country: '',
            study_period: '',
            description: '',
            achievement_detail: '',
            is_visible: true,
        });
    }, [achievement]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.certification_images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, certification_images: newImages }));
    };

    const addImage = () => {
        if (formData.certification_images.length < 5) {
            setFormData(prev => ({ 
                ...prev, 
                certification_images: [...prev.certification_images, ''] 
            }));
        }
    };

    const removeImage = (index) => {
        if (formData.certification_images.length > 1) {
            const newImages = formData.certification_images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, certification_images: newImages }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validImages = formData.certification_images.filter(img => img.trim());
        if (validImages.length === 0) {
            alert('최소 1개의 인증 이미지는 필수입니다.');
            return;
        }

        setIsSaving(true);
        try {
            const dataToSave = {
                ...formData,
                certification_images: validImages
            };
            await onSave(dataToSave);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{achievement ? '인증 수정' : '새 인증 추가'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="type">인증 타입 *</Label>
                        <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TOPIK">TOPIK</SelectItem>
                                <SelectItem value="대학합격">대학합격</SelectItem>
                                <SelectItem value="기타">기타</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>인증 이미지 * (최소 1개, 최대 5개)</Label>
                        <div className="space-y-4">
                            {formData.certification_images.map((image, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                                    <div className="flex-1">
                                        <Input
                                            type="url"
                                            placeholder="이미지 URL 입력"
                                            value={image}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                        />
                                    </div>
                                    {image && (
                                        <img
                                            src={image}
                                            alt={`인증서 ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/64?text=Error';
                                            }}
                                        />
                                    )}
                                    {formData.certification_images.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {formData.certification_images.length < 5 && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={addImage}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    이미지 추가
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="student_name">학생명</Label>
                            <Input
                                id="student_name"
                                value={formData.student_name}
                                onChange={e => handleChange('student_name', e.target.value)}
                                placeholder="예: 김한국"
                            />
                        </div>
                        <div>
                            <Label htmlFor="country">국가</Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={e => handleChange('country', e.target.value)}
                                placeholder="예: 미얀마"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="study_period">수업 기간</Label>
                            <Input
                                id="study_period"
                                value={formData.study_period}
                                onChange={e => handleChange('study_period', e.target.value)}
                                placeholder="예: 2024.03-2024.08"
                            />
                        </div>
                        <div>
                            <Label htmlFor="achievement_detail">성과 상세</Label>
                            <Input
                                id="achievement_detail"
                                value={formData.achievement_detail}
                                onChange={e => handleChange('achievement_detail', e.target.value)}
                                placeholder="예: TOPIK 5급, 서울대 합격"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">추가 설명</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={e => handleChange('description', e.target.value)}
                            placeholder="성과에 대한 추가 설명을 입력하세요"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={formData.is_visible}
                            onCheckedChange={val => handleChange('is_visible', val)}
                        />
                        <Label>공개</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            저장
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            취소
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default function AdminAchievementsPage() {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                const user = await User.me();
                if (user?.role !== 'admin') {
                    navigate(createPageUrl('Home'));
                    return;
                }
                await loadAchievements();
            } catch (error) {
                console.error("Failed to load data or user not authorized:", error);
                navigate(createPageUrl('Home'));
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthAndLoadData();
    }, [navigate]);

    const loadAchievements = async () => {
        try {
            const data = await AchievementEntity.list('-created_date', 100);
            setAchievements(data);
        } catch (error) {
            console.error("Failed to load achievements:", error);
        }
    };

    const handleSave = async (achievementData) => {
        try {
            if (editingAchievement) {
                await AchievementEntity.update(editingAchievement.id, achievementData);
            } else {
                await AchievementEntity.create(achievementData);
            }
            await loadAchievements();
            setShowForm(false);
            setEditingAchievement(null);
        } catch (error) {
            console.error("Failed to save achievement:", error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const handleEdit = (achievement) => {
        setEditingAchievement(achievement);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                await AchievementEntity.delete(id);
                await loadAchievements();
            } catch (error) {
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAchievement(null);
    };

    const getTypeBadge = (type) => {
        const colors = {
            'TOPIK': 'bg-blue-500',
            '대학합격': 'bg-green-500',
            '기타': 'bg-purple-500'
        };
        return <Badge className={colors[type]}>{type}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">학습 성과 인증 관리</h1>
                        <p className="text-gray-600 mt-1">TOPIK 성적, 대학 합격증 등 학생들의 성과를 관리합니다.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to={createPageUrl("AdminPostList")}>
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                관리자 홈
                            </Button>
                        </Link>
                        <Button 
                            onClick={() => setShowForm(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            새 인증 추가
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                {showForm && (
                    <AchievementForm
                        achievement={editingAchievement}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => (
                        <Card key={achievement.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-600" />
                                    {getTypeBadge(achievement.type)}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(achievement)}>
                                        수정
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDelete(achievement.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {achievement.certification_images?.[0] && (
                                    <img
                                        src={achievement.certification_images[0]}
                                        alt="인증서"
                                        className="w-full h-32 object-cover rounded-md mb-3"
                                    />
                                )}
                                <div className="space-y-2">
                                    {achievement.student_name && (
                                        <p><strong>학생:</strong> {achievement.student_name} {achievement.country && `(${achievement.country})`}</p>
                                    )}
                                    {achievement.achievement_detail && (
                                        <p><strong>성과:</strong> {achievement.achievement_detail}</p>
                                    )}
                                    {achievement.study_period && (
                                        <p><strong>수업기간:</strong> {achievement.study_period}</p>
                                    )}
                                    {achievement.description && (
                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                    )}
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                    <span>이미지 {achievement.certification_images?.length || 0}개</span>
                                    <Badge variant={achievement.is_visible ? "default" : "secondary"}>
                                        {achievement.is_visible ? "공개" : "비공개"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {achievements.length === 0 && !showForm && (
                    <div className="text-center py-12">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">등록된 학습 성과가 없습니다.</p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            첫 번째 성과 추가하기
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
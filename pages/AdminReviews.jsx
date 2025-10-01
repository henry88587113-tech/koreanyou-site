
import React, { useState, useEffect } from 'react';
import { Testimonial as TestimonialEntity } from '@/api/entities';
import { User } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge'; // Added Badge import
import { Plus, Trash2, Video, FileText, Loader2, Save } from 'lucide-react';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const ReviewForm = ({ review, onSave, onCancel }) => {
    const [formData, setFormData] = useState(review || {
        type: 'text',
        youtube_url: '',
        content: '',
        author: '',
        author_detail: '',
        is_visible: true,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(review || {
            type: 'text',
            youtube_url: '',
            content: '',
            author: '',
            author_detail: '',
            is_visible: true,
        });
    }, [review]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
        }
    };
    
    const youtubeId = getYouTubeId(formData.youtube_url);

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{review ? '후기 수정' : '새 후기 추가'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label>후기 타입 *</Label>
                        <RadioGroup value={formData.type} onValueChange={(val) => handleChange('type', val)} className="flex gap-4 mt-2">
                            <Label htmlFor="type-text" className="flex items-center gap-2 cursor-pointer p-3 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                                <RadioGroupItem value="text" id="type-text" /> <FileText className="w-4 h-4 mr-1"/> 텍스트
                            </Label>
                            <Label htmlFor="type-video" className="flex items-center gap-2 cursor-pointer p-3 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                                <RadioGroupItem value="video" id="type-video" /><Video className="w-4 h-4 mr-1"/> 동영상
                            </Label>
                        </RadioGroup>
                    </div>

                    {formData.type === 'video' ? (
                        <div>
                            <Label htmlFor="youtube_url">유튜브 링크 *</Label>
                            <Input id="youtube_url" value={formData.youtube_url} onChange={e => handleChange('youtube_url', e.target.value)} required />
                            {youtubeId && <iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="mt-2 rounded-md w-full aspect-video" allowFullScreen></iframe>}
                        </div>
                    ) : (
                        <div>
                            <Label htmlFor="content">본문 *</Label>
                            <Textarea id="content" value={formData.content} onChange={e => handleChange('content', e.target.value)} required rows={4} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="author">작성자 이름</Label>
                            <Input id="author" value={formData.author} onChange={e => handleChange('author', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="author_detail">국가/레벨</Label>
                            <Input id="author_detail" value={formData.author_detail} onChange={e => handleChange('author_detail', e.target.value)} placeholder="예: 인도네시아 / 중급" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Switch id="is_visible" checked={formData.is_visible} onCheckedChange={val => handleChange('is_visible', val)} />
                            <Label htmlFor="is_visible">{formData.is_visible ? "공개" : "비공개"}</Label>
                        </div>
                        <div className="flex gap-2">
                            {review && <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>}
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
                                저장
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};


export default function AdminReviewsPage() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);

    const loadReviews = async () => {
        setIsLoading(true);
        try {
            const data = await TestimonialEntity.list('-created_date', 100);
            setReviews(data);
        } catch (error) {
            console.error("Failed to load reviews", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const checkAuthAndLoad = async () => {
            try {
                const user = await User.me();
                if (user?.role !== 'admin') {
                    navigate(createPageUrl('Home'));
                    return;
                }
                loadReviews();
            } catch {
                navigate(createPageUrl('Home'));
            }
        };
        checkAuthAndLoad();
    }, [navigate]);

    const handleSave = async (data) => {
        if (data.id) {
            const { id, ...updateData } = data;
            await TestimonialEntity.update(id, updateData);
        } else {
            await TestimonialEntity.create(data);
        }
        setEditingReview(null);
        loadReviews();
    };

    const handleDelete = async (id) => {
        if (window.confirm("정말 이 후기를 삭제하시겠습니까?")) {
            await TestimonialEntity.delete(id);
            loadReviews();
        }
    };
    
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">학습자 후기 관리</h1>

            <ReviewForm
                review={editingReview}
                onSave={handleSave}
                onCancel={() => setEditingReview(null)}
            />
            
            <h2 className="text-2xl font-semibold mb-6 mt-12">후기 목록</h2>
            {isLoading ? (
                <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map(review => {
                        const youtubeId = review.type === 'video' ? getYouTubeId(review.youtube_url) : null;
                        return (
                            <Card key={review.id} className="flex flex-col">
                                <CardContent className="p-6 flex-grow">
                                    {review.type === 'video' && youtubeId ? (
                                        <iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="rounded-md w-full aspect-video mb-4" allowFullScreen></iframe>
                                    ) : (
                                        <p className="mb-4 text-gray-700 bg-gray-100 p-4 rounded-md">{review.content}</p>
                                    )}
                                    <div className="font-semibold">{review.author || '익명'}</div>
                                    <div className="text-sm text-gray-500">{review.author_detail}</div>
                                </CardContent>
                                <div className="border-t p-4 flex justify-between items-center">
                                    <Badge variant={review.is_visible ? 'default' : 'secondary'}>{review.is_visible ? '공개' : '비공개'}</Badge>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditingReview(review)}>수정</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}><Trash2 className="w-4 h-4"/></Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

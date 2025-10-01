import React, { useState, useEffect } from 'react';
import { Testimonial as TestimonialEntity } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Video, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await TestimonialEntity.filter({ is_visible: true }, '-created_date');
                setReviews(data);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">학습자 후기</h1>
                    <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
                        전 세계 학습자들이 직접 남긴 생생한 경험담을 확인해보세요.
                    </p>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {isLoading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map(review => {
                            const youtubeId = review.type === 'video' ? getYouTubeId(review.youtube_url) : null;
                            return (
                                <Card key={review.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    {review.type === 'video' && youtubeId ? (
                                        <div className="relative aspect-video">
                                             <iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
                                        </div>
                                    ) : null}
                                    <CardContent className="p-6">
                                        {review.type === 'text' && (
                                            <blockquote className="border-l-4 border-blue-500 pl-4 mb-4">
                                                <p className="text-gray-700 italic">{review.content}</p>
                                            </blockquote>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-gray-900">{review.author || '익명'}</p>
                                                {review.author_detail && <p className="text-sm text-gray-500">{review.author_detail}</p>}
                                            </div>
                                            <Badge variant="outline" className="flex items-center gap-2">
                                                {review.type === 'video' ? <Video className="w-4 h-4"/> : <FileText className="w-4 h-4"/>}
                                                {review.type === 'video' ? '영상' : '텍스트'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
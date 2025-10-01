import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import PostCard from '@/components/posts/PostCard';

const IMPACT_CATEGORIES = [
    "학습자 후기",
    "설문결과 하이라이트",
    "실제 학습 성과 인증",
    "활동 사례"
];

export default function ImpactPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                // Use the $in operator to fetch posts from multiple categories
                const fetchedPosts = await News.filter(
                    { category: { $in: IMPACT_CATEGORIES }, status: 'published' },
                    '-publish_at',
                    100
                );
                setPosts(fetchedPosts);
            } catch (error) {
                console.error(`Failed to fetch posts:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="pt-24 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">임팩트</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        코리언클릭이 만들어가는 긍정적인 변화와 성과들을 확인하세요.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">게시물이 없습니다.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
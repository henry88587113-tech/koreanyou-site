import React, { useState, useEffect } from 'react';
import { News as NewsEntity } from '@/api/entities';
import PostCard from '@/components/posts/PostCard';
import { Loader2 } from 'lucide-react';

export default function NewsPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const fetchedPosts = await NewsEntity.filter(
                    { category: "공지", status: 'published' },
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
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">공지사항</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        코리언클릭의 중요한 공지사항을 확인하세요.
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
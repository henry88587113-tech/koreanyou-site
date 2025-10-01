import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function PostCard({ post }) {
    return (
        <Link to={createPageUrl(`NewsDetail?id=${post.id}`)} className="block group">
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                {post.thumbnail_url ? (
                    <img 
                        src={post.thumbnail_url} 
                        alt={post.title || '게시물 썸네일'} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                        }}
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.pin && <Badge className="bg-red-500 text-white">중요</Badge>}
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                        {post.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <p className="text-sm text-gray-600 flex-grow mb-4">
                        {post.summary || post.excerpt || ''}
                    </p>
                    <div className="text-xs text-gray-500 flex justify-between items-center">
                        <span>
                            {format(new Date(post.publish_at || post.created_date), 'yyyy년 MM월 dd일')}
                        </span>
                        <span className="flex items-center gap-1 group-hover:text-blue-600">
                            더보기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/>
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
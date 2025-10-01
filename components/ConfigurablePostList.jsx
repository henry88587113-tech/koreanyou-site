
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, User, Calendar, Tag as TagIcon, ArrowRight, ExternalLink, Loader2, Play } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const IconMap = {
    user: User,
    calendar: Calendar,
    tag: TagIcon,
};

const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1] && match[1].length === 11) {
            return match[1];
        }
    }
    return null;
};

function PostCard({ post, config, currentPageName }) {
    const [likes, setLikes] = useState(post.likes_count || 0);
    const [comments, setComments] = useState(post.comments_count || 0);
    const [isLiked, setIsLiked] = useState(false);

    const display = config.display || {};
    const style = config.style || {};
    const isHorizontal = style.cardLayout === 'horizontal';

    const processTemplate = (template) => {
        if (!template || typeof template !== 'string') return template;
        
        // Replace {{field}} or {{metadata.field}} patterns
        return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
            const parts = expression.split('||').map(p => p.trim());
            let fieldPath = parts[0];
            const fallback = parts.length > 1 ? parts[1].replace(/['"]/g, '') : '';
            
            // Handle nested paths like metadata.chart_image_url
            const pathParts = fieldPath.split('.');
            let value = post;
            for (const part of pathParts) {
                if (value && typeof value === 'object' && value.hasOwnProperty(part)) {
                    value = value[part];
                } else {
                    value = undefined; // Mark as undefined if path cannot be resolved
                    break;
                }
            }
            
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
            return fallback;
        });
    };

    // 썸네일 처리 - 우선순위: thumbnail_url > metadata.chart_image_url > YouTube thumbnail > display.thumbnail.fallback
    let thumbnailUrl = post.thumbnail_url;
    
    // 2. Try metadata.chart_image_url if thumbnail_url is not present
    if (!thumbnailUrl && post.metadata && post.metadata.chart_image_url) {
        thumbnailUrl = post.metadata.chart_image_url;
    }

    // 3. Try YouTube thumbnail if still no thumbnail and youtube_url is present
    if (!thumbnailUrl && post.youtube_url) {
        const videoId = getYouTubeId(post.youtube_url);
        if (videoId) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
    }

    // 4. Finally, use the configured fallback template if still no thumbnail
    if (!thumbnailUrl && display.thumbnail?.fallback) {
        const fallback = processTemplate(display.thumbnail.fallback);
        // Ensure the processed fallback is a valid, non-empty string
        if (fallback && typeof fallback === 'string' && fallback.trim() !== '' && fallback.trim() !== 'undefined') {
            thumbnailUrl = fallback;
        }
    }

    const hasVideo = !!post.youtube_url && !!getYouTubeId(post.youtube_url);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLikes(isLiked ? Math.max(0, likes - 1) : likes + 1);
        setIsLiked(!isLiked);
    };

    const renderCardContent = () => (
        <div className={cn(
            "bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl",
            isHorizontal ? "flex" : "flex-col", 
            "h-full group"
        )}>
            {/* 썸네일 */}
            {display.thumbnail && thumbnailUrl && (
                <div className={cn("relative overflow-hidden", isHorizontal ? "w-1/3" : "w-full h-48")}>
                    <img 
                        src={thumbnailUrl}
                        alt={post.title || '썸네일'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            const videoId = getYouTubeId(post.youtube_url);
                            if (videoId) {
                                const fallbacks = [
                                    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                                    `https://img.youtube.com/vi/${videoId}/default.jpg`
                                ];
                                const currentIndex = fallbacks.indexOf(e.target.src);
                                if (currentIndex >= 0 && currentIndex < fallbacks.length - 1) {
                                    e.target.src = fallbacks[currentIndex + 1];
                                } else {
                                    e.target.src = 'https://via.placeholder.com/400x225?text=No+Image';
                                }
                            } else {
                                e.target.src = 'https://via.placeholder.com/400x225?text=No+Image';
                            }
                        }}
                    />
                    {hasVideo && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                            <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white ml-1"/>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="p-4 flex flex-col flex-grow">
                {/* 메타 정보 */}
                {display.meta && display.meta.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-xs text-gray-500">
                        {display.meta.map((metaItem, index) => {
                            if (typeof metaItem === 'object') {
                                const Icon = IconMap[metaItem.icon];
                                if (metaItem.type === 'text') {
                                    const value = processTemplate(metaItem.value);
                                    if (!value) return null;
                                    return (
                                        <span key={index} className="flex items-center gap-1">
                                            {Icon && <Icon className="w-3 h-3" />}
                                            {value}
                                        </span>
                                    );
                                }
                                if (metaItem.type === 'date') {
                                    // Ensure post.publish_at or post.created_date exists and is a valid date
                                    const dateString = post.publish_at || post.created_date;
                                    if (!dateString) return null;
                                    const date = new Date(dateString);
                                    if (isNaN(date.getTime())) return null; // Check for invalid date

                                    const dateFormat = (metaItem.format || 'YYYY.MM.DD').replace('YYYY', 'yyyy').replace('DD', 'dd');
                                    return (
                                        <span key={index} className="flex items-center gap-1">
                                            {Icon && <Icon className="w-3 h-3" />}
                                            {format(date, dateFormat)}
                                        </span>
                                    );
                                }
                                if (metaItem.type === 'badge') {
                                    const value = processTemplate(metaItem.value); // Use processTemplate for badge values
                                    if (!value) return null;
                                    return <Badge key={index} variant="secondary" className="text-xs">{value}</Badge>;
                                }
                            }
                            return null;
                        })}
                    </div>
                )}

                {/* 제목 */}
                {display.title && (
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                        style={{ fontSize: style.titleFontSize || '18px' }}>
                        {post.title}
                    </h3>
                )}

                {/* 요약 */}
                {display.excerpt && post.summary && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow"
                       style={{ fontSize: style.excerptFontSize || '14px' }}>
                        {post.summary.substring(0, config.excerptLength || 100)}
                        {post.summary.length > (config.excerptLength || 100) && '...'}
                    </p>
                )}

                {/* 액션 버튼들 */}
                {display.actions && (
                    <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-2 border-t">
                        <div className="flex items-center gap-3">
                            {display.actions.map((action, index) => {
                                if (action.type === 'like') {
                                    return (
                                        <button 
                                            key={index}
                                            onClick={handleLike}
                                            className={cn(
                                                "flex items-center gap-1 text-sm transition-colors",
                                                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                                            )}
                                        >
                                            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                            {action.label && <span>{action.label}</span>}
                                            {likes > 0 && <span className="font-medium">{likes}</span>}
                                        </button>
                                    );
                                }
                                if (action.type === 'comment') {
                                    return (
                                        <div key={index} className="flex items-center gap-1 text-gray-500 text-sm">
                                            <MessageCircle className="w-4 h-4" />
                                            {action.label && <span>{action.label}</span>}
                                            <span className="font-medium">{comments}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            {display.actions.map((action, index) => {
                                if (action.type === 'link') {
                                    const targetPage = action.target === 'detail' ? 'NewsDetail' : action.target;
                                    return (
                                        <Link key={index} to={createPageUrl(`${targetPage}?id=${post.id}`)} onClick={e => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                {action.label}
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                    );
                                }
                                if (action.type === 'externalLink') {
                                    const url = processTemplate(action.url);
                                    if (!url) return null; // Don't render if URL template resolves to nothing
                                    return (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm">
                                                {action.label}
                                                <ExternalLink className="w-3 h-3 ml-1" />
                                            </Button>
                                        </a>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const targetPage = display.actions?.find(a => a.type === 'link')?.target || 'NewsDetail';
    const linkTo = targetPage === 'detail' ? `NewsDetail?id=${post.id}` : `${targetPage}?id=${post.id}`;

    return (
        <Link to={createPageUrl(linkTo)} className="block">
            {renderCardContent()}
        </Link>
    );
}

export default function ConfigurablePostList({ config }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const orderBy = config.order?.dir === 'asc' ? config.order.by : `-${config.order?.by || 'created_date'}`;
                const limit = config.limit || 50;
                
                const fetchedPosts = await News.filter(
                    { category: config.source, status: 'public' },
                    orderBy,
                    limit
                );
                
                setPosts(fetchedPosts);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError('게시물을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [config.source, config.order, config.limit]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                {error}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-16">
                <p>아직 게시물이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "grid gap-6",
            config.layout === 'list' || config.style?.cardLayout === 'horizontal'
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    config={config}
                />
            ))}
        </div>
    );
}

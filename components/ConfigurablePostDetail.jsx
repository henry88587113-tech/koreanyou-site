
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News, Comment, Like } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Calendar, User as UserIcon, Tag, Loader2, AlertCircle, ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const IconMap = {
    user: UserIcon,
    calendar: Calendar,
    tag: Tag,
    'arrow-left': ArrowLeft,
    'file-text': FileText,
    'link': ExternalLink,
};

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function ConfigurablePostDetail({ postId, config, currentPageName }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isSubmittingLike, setIsSubmittingLike] = useState(false);

    const processTemplate = (template, postData) => {
        if (!template || typeof template !== 'string') return template;
        
        return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
            // Handle multiple fallback fields with ||
            const fallbackCandidates = expression.split('||').map(p => p.trim());
            
            for (const candidate of fallbackCandidates) {
                let resolvedValue = undefined;

                // Check if the candidate is a literal string (e.g., 'My Fallback Text')
                if (candidate.startsWith("'") && candidate.endsWith("'")) {
                    resolvedValue = candidate.substring(1, candidate.length - 1);
                } else {
                    // Otherwise, treat it as a field path
                    const pathParts = candidate.split('.');
                    let value = postData;
                    for (const part of pathParts) {
                        if (value && typeof value === 'object' && value.hasOwnProperty(part)) {
                            value = value[part];
                        } else {
                            value = undefined; // Path not found or intermediate value is not an object
                            break;
                        }
                    }
                    resolvedValue = value;
                }
                
                // If a valid (non-null, non-undefined, non-empty) value is found, return it
                if (resolvedValue !== undefined && resolvedValue !== null && resolvedValue !== '') {
                    return resolvedValue;
                }
            }
            
            // No valid value found in any fallback
            return '';
        });
    };

    const evaluateCondition = (condition, postData) => {
        if (!condition) return true;
        const result = processTemplate(condition, postData);
        // A condition is considered true if its resolved value is not empty, 'undefined' string, or null/false-like.
        return result && result !== 'undefined' && result !== '';
    };

    useEffect(() => {
        const loadData = async () => {
            if (!postId) {
                setError('게시물 ID가 필요합니다.');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const [currentUser, currentPost] = await Promise.all([
                    User.me().catch(() => null),
                    News.get(postId)
                ]);

                setUser(currentUser);
                
                if (!currentPost) {
                    setError('게시물을 찾을 수 없습니다.');
                    setLoading(false);
                    return;
                }

                setPost(currentPost);
                setLikes(currentPost.likes_count || 0);

                if (currentUser) {
                    const userLikes = await Like.filter({ post_id: postId, user_email: currentUser.email });
                    setIsLiked(userLikes.length > 0);
                }

                const postComments = await Comment.filter({ post_id: postId }, '-created_date');
                setComments(postComments);
            } catch (error) {
                console.error('Failed to load post:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [postId]);

    const handleLike = async () => {
        if (!config.display.actions?.find(a => a.type === 'like')) return;
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (isSubmittingLike) return;

        setIsSubmittingLike(true);
        try {
            let newLikesCount = likes;
            if (isLiked) {
                const userLikes = await Like.filter({ post_id: postId, user_email: user.email });
                if (userLikes.length > 0) {
                    await Like.delete(userLikes[0].id);
                }
                newLikesCount = Math.max(0, likes - 1);
                setIsLiked(false);
            } else {
                await Like.create({ post_id: postId, user_email: user.email });
                newLikesCount = likes + 1;
                setIsLiked(true);
            }
            setLikes(newLikesCount);
            await News.update(postId, { likes_count: newLikesCount });
        } catch (error) {
            console.error('Failed to toggle like:', error);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmittingLike(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !config.comment?.enabled) return;
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        setIsSubmittingComment(true);
        try {
            const newCommentData = {
                post_id: postId,
                user_email: user.email,
                user_name: user.full_name || '익명',
                content: newComment.trim()
            };
            
            const createdComment = await Comment.create(newCommentData);
            setComments(prev => [createdComment, ...prev]);
            setNewComment('');
            
            const newCommentsCount = comments.length + 1; 
            await News.update(postId, { comments_count: newCommentsCount });
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert('댓글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <p className="text-lg text-gray-600">{error}</p>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    const youtubeId = getYouTubeId(processTemplate(config.video?.url, post));

    return (
        <article className="bg-white min-h-screen" style={{ maxWidth: config.style?.contentMaxWidth || '800px', margin: '0 auto' }}>
            {config.backLink && (
                <header className="pt-24 pb-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link to={createPageUrl(config.backLink.href)}>
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                {config.backLink.label}
                            </Button>
                        </Link>
                    </div>
                </header>
            )}

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Title */}
                {config.display.title && (
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4"
                        style={{ fontSize: config.style?.titleFontSize }}>
                        {post.title}
                    </h1>
                )}

                {/* Meta */}
                {config.display.meta && Array.isArray(config.display.meta) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm text-gray-500 border-b pb-4">
                        {config.display.meta.map((metaItem, index) => {
                            if (typeof metaItem === 'object') {
                                const Icon = IconMap[metaItem.icon];
                                if (metaItem.type === 'text') {
                                    const value = processTemplate(metaItem.value, post);
                                    if (!value) return null;
                                    return (
                                        <span key={index} className="flex items-center gap-1.5">
                                            {Icon && <Icon className="w-4 h-4" />}
                                            {value}
                                        </span>
                                    );
                                }
                                if (metaItem.type === 'date') {
                                    const dateFormat = (metaItem.format || 'YYYY.MM.DD').replace('YYYY', 'yyyy').replace('DD', 'dd');
                                    return (
                                        <span key={index} className="flex items-center gap-1.5">
                                            {Icon && <Icon className="w-4 h-4" />}
                                            {format(new Date(post.publish_at || post.created_date), dateFormat)}
                                        </span>
                                    );
                                }
                                if (metaItem.type === 'badge') {
                                    const value = processTemplate(metaItem.value, post);
                                    if (!value) return null;
                                    return <Badge key={index} variant="secondary">{value}</Badge>;
                                }
                            }
                            return null;
                        })}
                    </div>
                )}

                {/* 📝 본문 - 가장 먼저! */}
                {config.display.content && (
                    <div className="prose prose-lg max-w-none mb-12" style={{ lineHeight: config.style?.lineHeight }}>
                        <ReactMarkdown>
                            {post.body_md || post.body || ''}
                        </ReactMarkdown>
                    </div>
                )}

                {/* 🎥 YouTube Video - Enhanced */}
                {config.video?.provider === 'youtube' && youtubeId && (
                    <div className="mb-8">
                        <div className="aspect-video">
                            <iframe
                                className="w-full h-full rounded-lg shadow-lg"
                                src={`https://www.youtube.com/embed/${youtubeId}?${config.video?.params || 'rel=0&modestbranding=1&playsinline=1&cc_load_policy=1'}`}
                                title={post.title || 'YouTube video'}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading={config.video?.lazy ? 'lazy' : 'eager'}
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* 📸 Attachments - Config 기반 이미지 */}
                {config.display.attachments && Array.isArray(config.display.attachments) && (
                    <div className="mb-8 space-y-6">
                        {config.display.attachments.map((attachment, index) => {
                            if (attachment.if && !evaluateCondition(attachment.if, post)) {
                                return null;
                            }

                            if (attachment.type === 'image') {
                                const imageSrc = processTemplate(attachment.src, post);
                                if (!imageSrc || imageSrc === 'undefined') return null;
                                
                                return (
                                    <figure key={index} className="my-6">
                                        <img 
                                            src={imageSrc}
                                            alt={attachment.alt || post.title || '첨부 이미지'}
                                            className="w-full h-auto object-cover rounded-lg shadow-lg"
                                            style={{ maxWidth: attachment.maxWidth || '100%', margin: '0 auto', display: 'block' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        {attachment.caption && (
                                            <figcaption className="mt-3 text-center text-sm text-gray-600">
                                                {processTemplate(attachment.caption, post)}
                                            </figcaption>
                                        )}
                                    </figure>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}

                {/* 🖼️ Image URLs - 이미지 URL 목록 자동 표시 */}
                {post.image_urls && Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
                    <div className="mb-8 space-y-6">
                        {post.image_urls.map((imageUrl, index) => {
                            if (!imageUrl) return null;
                            return (
                                <figure key={index} className="my-6">
                                    <img 
                                        src={imageUrl}
                                        alt={`${post.title} - 이미지 ${index + 1}`}
                                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                                        style={{ maxWidth: '960px', margin: '0 auto', display: 'block' }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </figure>
                            );
                        })}
                    </div>
                )}

                {/* 📄 Embed PDF */}
                {config.embed && config.embed.provider === 'iframe' && processTemplate(config.embed.src, post) && (
                    <section className="mb-12">
                        {config.embed.title && (
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {config.embed.title}
                            </h3>
                        )}
                        <div 
                            className="w-full overflow-hidden"
                            style={{
                                height: `${config.embed.height || 600}px`,
                                borderRadius: config.embed.style?.borderRadius || '8px',
                                boxShadow: config.embed.style?.shadow === 'md' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                            }}
                        >
                            <iframe
                                src={processTemplate(config.embed.src, post)}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                                title={config.embed.title || 'Embedded content'}
                                loading="lazy"
                            />
                        </div>
                    </section>
                )}

                {config.display.actions && (
                    <section className="border-t pt-8">
                        <div className="flex items-center justify-center gap-6 mb-8">
                            {config.display.actions.map((action, index) => {
                                if (action.type === 'like') {
                                    return (
                                        <Button 
                                            key={index}
                                            variant="outline" 
                                            size="lg" 
                                            onClick={handleLike} 
                                            disabled={isSubmittingLike}
                                            className={`transition-colors ${isLiked ? 'bg-red-50 text-red-600 border-red-300' : ''}`}
                                        >
                                            <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`}/>
                                            {action.label} {likes}
                                        </Button>
                                    );
                                }
                                if (action.type === 'comment') {
                                    return (
                                        <div key={index} className="flex items-center text-lg text-gray-600">
                                            <MessageCircle className="w-5 h-5 mr-2"/>
                                            {action.label} {comments.length}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {config.comment?.enabled && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>
                                    <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
                                        <Textarea 
                                            placeholder={user ? "따뜻한 댓글을 남겨주세요..." : "로그인이 필요합니다."}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            disabled={!user || isSubmittingComment}
                                            className="flex-1"
                                        />
                                        <Button type="submit" disabled={!user || isSubmittingComment || !newComment.trim()}>
                                          {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin"/> : "작성"}
                                        </Button>
                                    </form>
                                    
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {comments.map(comment => (
                                            <div key={comment.id} className="text-sm p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="font-bold text-gray-900">{comment.user_name}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {format(new Date(comment.created_date), 'yyyy.MM.dd HH:mm')}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                            </div>
                                        ))}
                                        {comments.length === 0 && (
                                            <p className="text-center text-gray-500 py-8">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </section>
                )}

                {config.cta && config.cta.length > 0 && (
                    <section className="mt-16 bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            함께 성장하는 한국어 학습
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                            {config.cta.map((cta, index) => {
                                // Evaluate condition
                                if (cta.if && !evaluateCondition(cta.if, post)) {
                                    return null;
                                }

                                const href = processTemplate(cta.href, post);
                                
                                // Skip if href is empty after processing
                                if (!href || href === 'undefined') {
                                    return null;
                                }
                                
                                const isPrimary = cta.style === 'primary';
                                const CtaIcon = IconMap[cta.icon];
                                
                                if (cta.type === 'external') {
                                    return (
                                        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
                                            <Button 
                                                size="lg" 
                                                variant="outline"
                                                className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 font-semibold px-6 py-5 shadow-md hover:shadow-lg transition-all"
                                            >
                                                {CtaIcon && <CtaIcon className="w-5 h-5 mr-2" />}
                                                {cta.label}
                                            </Button>
                                        </a>
                                    );
                                }
                                
                                return (
                                    <Link key={index} to={createPageUrl(href)}>
                                        <Button 
                                            size="lg" 
                                            className={isPrimary 
                                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                                : "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 font-semibold px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
                                            }
                                        >
                                            {CtaIcon && <CtaIcon className="w-5 h-5 mr-2" />}
                                            {cta.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>
        </article>
    );
}

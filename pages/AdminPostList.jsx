
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News as NewsEntity, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import PostEditorPanel from '@/components/admin/PostEditorPanel';
import { Plus, Search, Trash2, Edit, Copy, Loader2, LayoutGrid, List, FilePlus, Pin, Upload } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
    "학습자 후기", "설문결과 하이라이트", "실제 학습 성과 인증",
    "활동 사례", "기관 소개", "공지", "소식", "기타"
];

export default function AdminPostListPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'all',
        status: 'all',
        validation: 'all'
    });
    const [sortBy, setSortBy] = useState('-created_date');
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [view, setView] = useState('table');
    const [editingPost, setEditingPost] = useState(null);

    const loadPosts = useCallback(async () => {
        try {
            const allPosts = await NewsEntity.list(sortBy, 500);
            setPosts(allPosts);
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    }, [sortBy]);

    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                const user = await User.me();
                if (user?.role !== 'admin') {
                    navigate(createPageUrl('Home'));
                    return;
                }
                await loadPosts();
            } catch (error) {
                navigate(createPageUrl('Home'));
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthAndLoadData();
    }, [navigate, sortBy, loadPosts]);

    const filteredPosts = posts.filter(post => {
        // 통합 검색 (제목, 요약, 태그)
        const searchMatch = searchTerm === '' || [
            post.title || '',
            post.summary || '',
            ...(post.tags || [])
        ].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

        const categoryMatch = filters.category === 'all' || post.category === filters.category;
        const statusMatch = filters.status === 'all' || post.status === filters.status;

        // 검증 상태 필터
        const validationMatch = filters.validation === 'all' ||
            (filters.validation === 'normal' && post.validation_status === 'safe') ||
            (filters.validation === 'needs_check' && ['warn', 'error'].includes(post.validation_status));

        return searchMatch && categoryMatch && statusMatch && validationMatch;
    }).sort((a, b) => {
        // 상단고정 우선 정렬
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        // 나머지 정렬
        switch (sortBy) {
            case 'title':
                return (a.title || '').localeCompare(b.title || '');
            case '-title':
                return (b.title || '').localeCompare(a.title || '');
            case 'publish_date':
                return new Date(a.publish_date || a.created_date) - new Date(b.publish_date || b.created_date);
            case '-publish_date':
                return new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date);
            default: // -created_date
                return new Date(b.created_date) - new Date(a.created_date);
        }
    });

    const handleBulkAction = async (action) => {
        if (selectedPosts.length === 0) return;

        const confirmMessage = {
            'delete': `${selectedPosts.length}개 게시물을 정말 삭제하시겠습니까?`,
            'publish': `${selectedPosts.length}개 게시물을 공개하시겠습니까?`,
            'draft': `${selectedPosts.length}개 게시물을 초안으로 변경하시겠습니까?`
        };

        if (!window.confirm(confirmMessage[action])) return;

        try {
            const updates = selectedPosts.map(id => {
                const post = posts.find(p => p.id === id);
                if (action === 'delete') return NewsEntity.delete(id);
                if (action === 'publish') return NewsEntity.update(id, { ...post, status: 'public' });
                if (action === 'draft') return NewsEntity.update(id, { ...post, status: 'draft' });
                return Promise.resolve();
            });
            await Promise.all(updates);

            await loadPosts();
            setSelectedPosts([]);
        } catch (error) {
            alert("작업 중 오류가 발생했습니다.");
        }
    };

    const handleSelectAll = (checked) => {
        setSelectedPosts(checked ? filteredPosts.map(p => p.id) : []);
    };

    const handleSelectPost = (id, checked) => {
        setSelectedPosts(prev => checked ? [...prev, id] : prev.filter(pid => pid !== id));
    };

    const handleDuplicate = async (post) => {
        if (!window.confirm(`"${post.title}" 게시물을 복제하시겠습니까?`)) return;

        try {
            const duplicateData = {
                ...post,
                title: `${post.title} (복사본)`,
                slug: `${post.slug}-copy-${Date.now()}`,
                status: 'draft',
                is_pinned: false,
                publish_date: null
            };
            delete duplicateData.id;
            delete duplicateData.created_date;
            delete duplicateData.updated_date;
            delete duplicateData.created_by;

            await NewsEntity.create(duplicateData);
            await loadPosts();
        } catch (error) {
            alert('복제 중 오류가 발생했습니다.');
        }
    };

    const statusBadge = (status) => {
        switch(status) {
            case 'public': return <Badge className="bg-green-500 text-white">공개</Badge>;
            case 'draft': return <Badge variant="secondary">초안</Badge>;
            default: return <Badge variant="destructive">알 수 없음</Badge>;
        }
    };

    const validationBadge = (status) => {
        switch(status) {
            case 'safe': return <Badge className="bg-green-100 text-green-800">🟢 정상</Badge>;
            case 'warn': return <Badge className="bg-yellow-100 text-yellow-800">🟡 점검필요</Badge>;
            case 'error': return <Badge className="bg-red-100 text-red-800">🔴 오류</Badge>;
            default: return <Badge variant="outline">미검증</Badge>;
        }
    };

    const handleSave = (updatedPost) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );

    const renderTable = () => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                onCheckedChange={handleSelectAll}
                                checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                            />
                        </TableHead>
                        <TableHead className="w-[100px]">썸네일</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead className="w-[120px]">카테고리</TableHead>
                        <TableHead className="w-[100px]">상태</TableHead>
                        <TableHead className="w-[100px]">검증</TableHead>
                        <TableHead className="w-[120px]">공개일</TableHead>
                        <TableHead className="w-[120px] text-right">관리</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPosts.map(post => (
                        <TableRow
                            key={post.id}
                            onClick={() => setEditingPost(post)}
                            className="cursor-pointer hover:bg-gray-50"
                        >
                            <TableCell onClick={e => e.stopPropagation()}>
                                <Checkbox
                                    onCheckedChange={(c) => handleSelectPost(post.id, c)}
                                    checked={selectedPosts.includes(post.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="relative w-20 h-12">
                                    {post.is_pinned && (
                                        <Pin className="absolute -top-1 -left-1 w-3 h-3 text-red-500 z-10" />
                                    )}
                                    {(post.thumbnail_url || post.image_url) ? (
                                        <img
                                            src={post.thumbnail_url || post.image_url}
                                            alt={post.title || '썸네일'}
                                            className="w-full h-full object-cover rounded border"
                                            onError={(e) => {
                                                console.log('이미지 로드 실패:', e.target.src);
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/80x48?text=Error&bg=f3f4f6&color=9ca3af';
                                            }}
                                            onLoad={(e) => {
                                                console.log('이미지 로드 성공:', e.target.src);
                                                e.target.style.borderColor = '#10b981';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 rounded border flex items-center justify-center">
                                            <span className="text-xs text-gray-500">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium text-sm">
                                    {post.is_pinned && <Pin className="inline w-3 h-3 mr-1 text-red-500" />}
                                    {post.title}
                                </div>
                                {post.summary && (
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                        {post.summary.substring(0, 60)}...
                                    </div>
                                )}
                                {/* 디버깅용 - 썸네일 URL 표시 */}
                                {(post.thumbnail_url || post.image_url) && (
                                    <div className="text-xs text-blue-500 mt-1 truncate">
                                        🖼️ {(post.thumbnail_url || post.image_url).substring(0, 40)}...
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{post.category}</span>
                            </TableCell>
                            <TableCell>
                                {statusBadge(post.status)}
                            </TableCell>
                            <TableCell>
                                {validationBadge(post.validation_status)}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {post.publish_date
                                        ? format(new Date(post.publish_date), 'yyyy-MM-dd')
                                        : format(new Date(post.created_date), 'yyyy-MM-dd')
                                    }
                                </div>
                            </TableCell>
                            <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-end gap-1">
                                    <Link to={createPageUrl(`AdminCMS?id=${post.id}`)}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDuplicate(post)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-700"
                                        onClick={() => handleBulkAction('delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    const renderCards = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPosts.map(post => (
                <Card key={post.id} onClick={() => setEditingPost(post)} className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                        {post.is_pinned && (
                            <Pin className="absolute top-2 right-2 w-4 h-4 text-red-500 z-10 bg-white rounded-full p-0.5" />
                        )}
                        <img
                            src={post.thumbnail_url || post.image_url || 'https://via.placeholder.com/300x150?text=No+Image'}
                            alt={post.title || '썸네일'}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x150?text=Image+Error';
                            }}
                        />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold line-clamp-2">{post.title}</CardTitle>
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                            <span>{post.category}</span>
                            <span>{format(new Date(post.created_date), 'yy-MM-dd')}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex gap-2 pt-0">
                        {statusBadge(post.status)}
                        {validationBadge(post.validation_status)}
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">콘텐츠 목록</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={view === 'table' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setView('table')}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === 'cards' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setView('cards')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>

                        <Link to={createPageUrl("AdminGroupWrite")}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2"/>
                                일괄 글쓰기
                            </Button>
                        </Link>
                        <Link to={createPageUrl("AdminCMS")}>
                            <Button variant="outline">
                                <FilePlus className="w-4 h-4 mr-2"/>
                                새 글 (1개)
                            </Button>
                        </Link>
                        <Link to={createPageUrl("AdminBulkUpload")}>
                            <Button>
                                <Upload className="w-4 h-4 mr-2"/>
                                일괄 업로드
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="bg-white rounded-lg shadow-md p-6">
                {/* 상단 필터 */}
                <div className="space-y-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* 통합 검색 */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="제목, 요약, 태그로 검색..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* 카테고리 필터 */}
                        <Select
                            value={filters.category}
                            onValueChange={(v) => setFilters({...filters, category: v})}
                        >
                            <SelectTrigger className="w-full lg:w-[180px]">
                                <SelectValue placeholder="카테고리" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 카테고리</SelectItem>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* 상태 필터 */}
                        <Select
                            value={filters.status}
                            onValueChange={(v) => setFilters({...filters, status: v})}
                        >
                            <SelectTrigger className="w-full lg:w-[140px]">
                                <SelectValue placeholder="상태" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 상태</SelectItem>
                                <SelectItem value="public">공개</SelectItem>
                                <SelectItem value="draft">초안</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* 검증 필터 */}
                        <Select
                            value={filters.validation}
                            onValueChange={(v) => setFilters({...filters, validation: v})}
                        >
                            <SelectTrigger className="w-full lg:w-[140px]">
                                <SelectValue placeholder="검증상태" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="normal">정상</SelectItem>
                                <SelectItem value="needs_check">점검필요</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* 정렬 */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full lg:w-[140px]">
                                <SelectValue placeholder="정렬" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-created_date">최신순</SelectItem>
                                <SelectItem value="-publish_date">공개일순</SelectItem>
                                <SelectItem value="title">제목순</SelectItem>
                                <SelectItem value="-title">제목역순</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 대량 작업 버튼 */}
                    {selectedPosts.length > 0 && (
                        <div className="flex gap-2 p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-700 mr-4">
                                {selectedPosts.length}개 선택됨
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBulkAction('publish')}
                            >
                                공개
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBulkAction('draft')}
                            >
                                초안
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleBulkAction('delete')}
                            >
                                <Trash2 className="w-4 h-4 mr-1"/>
                                삭제
                            </Button>
                        </div>
                    )}
                </div>

                {/* 게시물 목록 */}
                {filteredPosts.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">결과가 없습니다.</p>
                ) : (
                    view === 'table' ? renderTable() : renderCards()
                )}

                {/* 통계 정보 */}
                <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex justify-between">
                    <span>총 {posts.length}개 중 {filteredPosts.length}개 표시</span>
                    <span>선택: {selectedPosts.length}개</span>
                </div>
            </main>

            {/* 편집 패널 */}
            <Sheet open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
                <SheetContent className="w-full sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>콘텐츠 편집</SheetTitle>
                    </SheetHeader>
                    {editingPost && (
                        <PostEditorPanel
                            post={editingPost}
                            onSave={handleSave}
                            onClose={() => setEditingPost(null)}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

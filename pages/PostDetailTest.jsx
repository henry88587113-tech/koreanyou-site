import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ConfigurablePostDetail from '@/components/ConfigurablePostDetail';

const detailConfig = {
  "type": "post-detail",
  "source": "학습자 후기", // 구체적인 카테고리를 명시하여 테스트
  "display": {
    "title": true,
    "meta": ["category", "date", "author"],
    "content": true,
    "actions": [
      { "type": "like", "label": "좋아요 ❤️" },
      { "type": "comment", "label": "댓글 달기 💬" }
    ]
  },
  "comment": {
    "enabled": true,
    "provider": "base44",
    "loginRequired": true
  },
  "style": {
    "contentMaxWidth": "720px",
    "titleFontSize": "28px",
    "lineHeight": "1.7"
  }
};

export default function PostDetailTestPage({ currentPageName }) {
    const [searchParams] = useSearchParams();
    const postId = searchParams.get('id');

    if (!postId) {
        return <div className="p-8 text-center text-red-500">게시물 ID가 필요합니다. URL에 ?id=... 를 추가해주세요.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center">Post Detail Test Page</h1>
                <p className="text-center text-gray-500">이 페이지는 '학습자 후기' 카테고리의 게시물만 표시합니다.</p>
            </header>
            <main className="max-w-4xl mx-auto px-4 bg-white rounded-lg shadow-md py-8">
                <ConfigurablePostDetail postId={postId} config={detailConfig} currentPageName={currentPageName} />
            </main>
        </div>
    );
}
import React from 'react';
import ConfigurablePostList from '@/components/ConfigurablePostList';

const blogConfig = {
  "type": "post-list",
  "source": ["소식", "기타"], // 이제 배열도 지원합니다.
  "layout": "card",
  "display": {
    "title": true,
    "excerpt": true,
    "thumbnail": true,
    "meta": ["category", "date"],
    "actions": [
      {
        "type": "link",
        "label": "자세히 보기",
        "target": "detail"
      }
    ]
  },
  "excerptLength": 100,
  "style": {
    "cardLayout": "vertical", // 세로 카드 레이아웃으로 변경
    "gap": "24px"
  }
};


export default function BlogPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="pt-24 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">블로그</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        코리언클릭의 새로운 소식과 다양한 이야기들을 만나보세요.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <ConfigurablePostList config={blogConfig} />
                </div>
            </main>
        </div>
    );
}
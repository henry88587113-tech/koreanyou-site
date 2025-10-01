import React from 'react';
import ConfigurablePostList from '@/components/ConfigurablePostList';

const postListConfig = {
  "type": "post-list",
  "source": "학습자 후기",
  "layout": "card",
  "display": {
    "title": true,
    "excerpt": true,
    "thumbnail": true,
    "meta": ["category", "date"],
    "actions": [
      {
        "type": "like",
        "label": "좋아요"
      },
      {
        "type": "link",
        "label": "자세히 보기",
        "target": "detail"
      }
    ]
  },
  "excerptLength": 80,
  "style": {
    "cardLayout": "horizontal",
    "titleFontSize": "18px",
    "excerptFontSize": "14px",
    "gap": "16px"
  }
};

export default function PostWidgetTestPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">동적 포스트 위젯 테스트</h1>
          <p className="mt-2 text-gray-600">아래 목록은 제공된 JSON 설정을 기반으로 렌더링됩니다.</p>
        </header>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ConfigurablePostList config={postListConfig} />
        </div>

        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">사용된 JSON 설정</h2>
            <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
                <code>{JSON.stringify(postListConfig, null, 2)}</code>
            </pre>
        </div>
      </div>
    </div>
  );
}
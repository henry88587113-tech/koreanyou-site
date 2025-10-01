import React from 'react';
import ConfigurablePostList from '@/components/ConfigurablePostList';

const achievementsConfig = {
  "type": "post-list",
  "source": "실제 학습 성과 인증",
  "layout": "card",

  "display": {
    "title": true,
    "excerpt": true,

    "thumbnail": {
      "field": "thumbnail_url",
      "fallback": "{{youtube_url && ('https://img.youtube.com/vi/' + (youtube_url.match(/(?:v=|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/)?.[1] || '') + '/hqdefault.jpg')}}"
    },

    "meta": [
      { "type": "text", "icon": "user", "value": "{{author || '관리자'}}" },
      { "type": "date", "format": "YYYY.MM.DD" }
    ],

    "actions": [
      { "type": "like", "label": "좋아요 ❤️" },
      { "type": "link", "label": "자세히 보기", "target": "AchievementDetail" }  // AchievementDetail 페이지로 링크 수정
    ]
  },

  "order": { "by": "publish_at", "dir": "desc" },
  "limit": 50,

  "excerptLength": 80,
  "style": {
    "cardLayout": "vertical",
    "titleFontSize": "18px",
    "excerptFontSize": "14px",
    "gap": "12px"
  }
};

export default function AchievementsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">학습 성과 인증</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            코리언클릭 학습자들의 실제 학습 성과와 인증 현황을 확인하세요.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ConfigurablePostList config={achievementsConfig} />
      </main>
    </div>
  );
}
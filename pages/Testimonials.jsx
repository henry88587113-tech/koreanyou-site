import React, { useState, useEffect } from 'react';
import ConfigurablePostList from '@/components/ConfigurablePostList';
import { Loader2 } from 'lucide-react';

const testimonialsConfig = {
  "type": "post-list",
  "source": "학습자 후기",
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
      { "type": "like", "label": "" },
      { "type": "comment", "label": "" },
      { "type": "link", "label": "자세히 보기", "target": "TestimonialDetail" }
    ]
  },

  "order": { "by": "publish_at", "dir": "desc" },
  "limit": 50,

  "excerptLength": 100,
  "style": {
    "cardLayout": "vertical",
    "titleFontSize": "18px",
    "excerptFontSize": "14px",
    "gap": "12px"
  }
};

export default function TestimonialsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="pt-24 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">학습자 후기</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        코리언클릭과 함께한 전 세계 학습자들의 생생한 이야기를 확인하세요.
                    </p>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <ConfigurablePostList config={testimonialsConfig} />
            </main>
        </div>
    );
}
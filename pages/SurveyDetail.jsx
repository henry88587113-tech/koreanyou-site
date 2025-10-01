
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ConfigurablePostDetail from '@/components/ConfigurablePostDetail';

const surveyConfig = {
  "type": "post-detail",
  "source": "설문결과 하이라이트",
  "backLink": { 
    "label": "목록으로", 
    "icon": "arrow-left", 
    "href": "Surveys" 
  },
  "display": {
    "title": true,
    "meta": [
      { "type": "text", "icon": "user", "value": "{{author || '관리자'}}" },
      { "type": "date", "format": "YYYY.MM.DD" },
      { "type": "badge", "value": "설문결과 하이라이트" }
    ],
    "content": true,
    "attachments": [
      { 
        "type": "image", 
        "src": "{{metadata.chart_image_url || thumbnail_url}}", 
        "alt": "설문 결과 차트", 
        "maxWidth": "960px",
        "caption": "{{metadata.survey_title}}",
        "if": "{{metadata.chart_image_url || thumbnail_url}}"
      }
    ],
    "actions": [
      { "type": "like", "label": "좋아요 ❤️" },
      { "type": "comment", "label": "댓글 달기 💬" }
    ]
  },
  "video": {
    "provider": "youtube",
    "url": "{{youtube_url}}",
    "privacyMode": true,
    "lazy": true,
    "params": "rel=0&modestbranding=1&playsinline=1&cc_load_policy=1" // Added params as per instruction
  },
  "embed": {
    "title": "📊 설문 원문 보기 (PDF)",
    "provider": "iframe",
    "src": "{{metadata.pdf_url}}",
    "height": 900,
    "style": {
      "borderRadius": "16px",
      "shadow": "md"
    }
  },
  "cta": [
    { 
      "label": "PDF 원문 보기", 
      "type": "external", 
      "href": "{{metadata.pdf_url}}", 
      "icon": "file-text",
      "if": "{{metadata.pdf_url}}"
    },
    { 
      "label": "전체 리포트", 
      "type": "external", 
      "href": "{{metadata.report_url}}", 
      "icon": "link",
      "if": "{{metadata.report_url}}"
    },
    { 
      "label": "수업 신청", 
      "type": "link", 
      "href": "Programs", 
      "style": "primary" 
    },
    { 
      "label": "후원하기", 
      "type": "link", 
      "href": "Donate" 
    }
  ],
  "comment": {
    "enabled": true,
    "provider": "base44",
    "loginRequired": true
  },
  "style": {
    "contentMaxWidth": "900px",
    "titleFontSize": "22px",
    "lineHeight": "1.6"
  }
};

export default function SurveyDetailPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  return (
    <ConfigurablePostDetail 
      postId={postId} 
      config={surveyConfig} 
      currentPageName="SurveyDetail" 
    />
  );
}

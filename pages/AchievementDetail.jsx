
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ConfigurablePostDetail from '@/components/ConfigurablePostDetail';

const achievementConfig = {
  "type": "post-detail",
  "source": "실제 학습 성과 인증",
  "backLink": {
    "label": "목록으로",
    "icon": "arrow-left",
    "href": "Achievements"
  },
  "display": {
    "title": true,
    "meta": [
      { "type": "text", "icon": "user", "value": "{{metadata.student_name || '학생'}}" },
      { "type": "date", "format": "YYYY.MM.DD" },
      { "type": "badge", "value": "{{metadata.certificate_type || '성과 인증'}}" }
    ],
    "content": true,
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
    "params": "rel=0&modestbranding=1&playsinline=1&cc_load_policy=1"
  },
  "cta": [
    { "label": "수업 신청", "type": "link", "href": "Programs", "style": "primary" },
    { "label": "후원하기", "type": "link", "href": "Donate" },
    { "label": "자원봉사 참여", "type": "link", "href": "Volunteer" }
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

export default function AchievementDetailPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  return (
    <ConfigurablePostDetail
      postId={postId}
      config={achievementConfig}
      currentPageName="AchievementDetail"
    />
  );
}

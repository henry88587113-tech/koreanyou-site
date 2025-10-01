
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ConfigurablePostDetail from '@/components/ConfigurablePostDetail';

const testimonialConfig = {
  "type": "post-detail",
  "source": "학습자 후기",
  "backLink": {
    "label": "목록으로",
    "icon": "arrow-left",
    "href": "Testimonials"
  },
  "display": {
    "title": true,
    "meta": [
      { "type": "text", "icon": "user", "value": "{{metadata.testimonial_author || author || '익명'}}" },
      { "type": "date", "format": "YYYY.MM.DD" },
      { "type": "badge", "value": "{{metadata.testimonial_country || '학습자 후기'}}" }
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
  "comment": {
    "enabled": true,
    "provider": "base44",
    "loginRequired": true
  },
  "cta": [
    { "label": "수업 신청", "type": "link", "href": "Programs", "style": "primary" },
    { "label": "후원하기", "type": "link", "href": "Donate" },
    { "label": "자원봉사 참여", "type": "link", "href": "Volunteer" }
  ],
  "style": {
    "contentMaxWidth": "900px",
    "titleFontSize": "22px",
    "lineHeight": "1.6"
  }
};

export default function TestimonialDetailPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  return (
    <ConfigurablePostDetail 
      postId={postId} 
      config={testimonialConfig} 
      currentPageName="TestimonialDetail" 
    />
  );
}

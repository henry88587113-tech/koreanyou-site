
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News as NewsEntity, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Save, Trash2, Eye, FileUp, List, ArrowLeft,
  Upload, CheckCircle, AlertCircle, Clock, X, Image as ImageIcon,
  Youtube, Tag as TagIcon, Plus, Calendar, FileText // Added FileText import
} from 'lucide-react';
import { format } from 'date-fns';
// import ReactQuill from 'react-quill'; // Removed as per changes to use Markdown
// import 'react-quill/dist/quill.snow.css'; // Removed as per changes to use Markdown

const CATEGORIES = [
  "기관 소개", "학습자 후기", "설문결과 하이라이트", "실제 학습 성과 인증",
  "활동 사례", "공지", "소식", "기타"
];

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function AdminCMSPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  const [post, setPost] = useState({
    category: '',
    title: '',
    summary: '',
    thumbnail_url: '',
    image_urls: [],
    youtube_url: '',
    tags: [],
    status: 'draft',
    publish_at: '',
    body_md: '', // Renamed from 'body' to 'body_md' for Markdown content
    related_links: [],
    metadata: {} // New field to hold category-specific data
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }

        if (postId) {
          const fetchedPost = await NewsEntity.get(postId);

          // Construct the new state, prioritizing new fields and falling back to legacy
          const newPostState = {
            category: fetchedPost.category || '',
            title: fetchedPost.title || '',
            summary: fetchedPost.summary || fetchedPost.excerpt || '',
            thumbnail_url: fetchedPost.thumbnail_url || fetchedPost.image_url || '',
            image_urls: fetchedPost.image_urls || fetchedPost.content_images || fetchedPost.gallery_images || [],
            youtube_url: fetchedPost.youtube_url || '',
            tags: fetchedPost.tags || [],
            status: fetchedPost.status || 'draft',
            publish_at: fetchedPost.publish_at ? format(new Date(fetchedPost.publish_at), "yyyy-MM-dd'T'HH:mm") : '',
            body_md: fetchedPost.body_md || fetchedPost.body || fetchedPost.content || '', // Use body_md, fallback to body/content
            related_links: fetchedPost.related_links || [],
            metadata: fetchedPost.metadata || {}, // Use existing metadata if present
          };

          // Populate metadata based on fetched category and existing (possibly legacy) fields if metadata was not present
          if (!fetchedPost.metadata) {
            switch (newPostState.category) {
              case '기관 소개': // Previously '임팩트'
                newPostState.metadata.impact_metrics = fetchedPost.impact_metrics || fetchedPost.indicators || [];
                break;
              case '학습자 후기': // Previously '학습자후기'
                newPostState.metadata.testimonial_type = fetchedPost.testimonial_type || 'text';
                newPostState.metadata.testimonial_author = fetchedPost.testimonial_author || '';
                newPostState.metadata.testimonial_country = fetchedPost.testimonial_country || '';
                newPostState.metadata.testimonial_level = fetchedPost.testimonial_level || '';
                // Add new fields for '학습자 후기' template, migrating from top-level if they somehow existed before metadata refactor
                newPostState.metadata.start_year = fetchedPost.start_year || '';
                newPostState.metadata.achievement = fetchedPost.achievement || '';
                break;
              case '설문결과 하이라이트':
                newPostState.metadata.survey_title = fetchedPost.survey_title || '';
                newPostState.metadata.satisfaction_rate = fetchedPost.satisfaction_rate || '';
                newPostState.metadata.recommendation_rate = fetchedPost.recommendation_rate || '';
                newPostState.metadata.attendance_rate = fetchedPost.attendance_rate || '';
                newPostState.metadata.key_findings = fetchedPost.key_findings || '';
                newPostState.metadata.chart_image_url = fetchedPost.chart_image_url || '';
                newPostState.metadata.pdf_url = fetchedPost.pdf_url || '';
                newPostState.metadata.metrics = fetchedPost.metrics || fetchedPost.indicators || [];
                newPostState.metadata.report_url = fetchedPost.report_url || fetchedPost.original_report_url || '';
                break;
              case '실제 학습 성과 인증': // Previously '성과 인증'
                newPostState.metadata.certificate_type = fetchedPost.certificate_type || 'TOPIK';
                newPostState.metadata.student_name = fetchedPost.student_name || '';
                newPostState.metadata.country = fetchedPost.country || '';
                newPostState.metadata.course_period = fetchedPost.course_period || '';
                break;
              case '활동 사례': // Previously '활동사례'
                newPostState.metadata.event_date = fetchedPost.event_date || '';
                newPostState.metadata.place = fetchedPost.place || fetchedPost.location || '';
                // Add new fields for '활동 사례' template, migrating from top-level if they somehow existed before metadata refactor
                newPostState.metadata.activity_title = fetchedPost.activity_title || '';
                newPostState.metadata.purpose = fetchedPost.purpose || '';
                newPostState.metadata.target = fetchedPost.target || '';
                newPostState.metadata.participants = fetchedPost.participants || '';
                newPostState.metadata.satisfaction = fetchedPost.satisfaction || '';
                newPostState.metadata.certificates = fetchedPost.certificates || '';
                break;
              case '공지': // Previously '공지/소식'
                newPostState.metadata.notice_type = fetchedPost.notice_type || fetchedPost.announcement_type || '일반';
                newPostState.metadata.pin = fetchedPost.pin || fetchedPost.is_pinned || false;
                break;
              default:
                // For other categories, if there are existing top-level metadata-like fields,
                // they won't be moved to metadata here, but will be ignored on save or explicitly handled later.
                break;
            }
          }

          setPost(newPostState);
        }
      } catch (error) {
        console.error("Failed to load data or user not authorized:", error);
        navigate(createPageUrl('Home'));
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndLoadData();
  }, [postId, navigate]);

  const handleInputChange = (field, value) => {
    setPost(prev => ({ ...prev, [field]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleMetadataChange = (field, value) => {
    setPost(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleGenerateTestimonialTemplate = () => {
    const {
      testimonial_author,
      testimonial_country,
      start_year,
      achievement
    } = post.metadata;

    if (!testimonial_author || !testimonial_country || !start_year || !achievement) {
      alert('템플릿을 사용하려면 작성자명, 국가, 학습 시작 연도, 주요 성과를 모두 입력해야 합니다.');
      return;
    }

    const newTitle = `${testimonial_author} 학생의 한국어 학습 이야기 (${testimonial_country})`;
    const newSummary = `${testimonial_author} 학생은 ${testimonial_country} 출신으로 20${start_year}년부터 코리언클릭 국제교육원에서 한국어를 배우기 시작했습니다. 꾸준한 학습 끝에 ${achievement}의 목표를 달성했습니다.`;

    const templateBody = `**학습자:** ${testimonial_author} (${testimonial_country})
**학습 시작:** 20${start_year}.[월] / 수업 형태: [예: Zoom 초급반, 주 2회]

${testimonial_author} 학생은 알파벳부터 시작해 [기간] 동안 꾸준히 참여했습니다.
최근에는 **자기소개/가벼운 일상 대화/숫자·시간 표현**을 스스로 말할 수 있게 되었고,
수업 후 과제 제출률은 **[예: 92%]**, 주당 학습 시간은 **[예: 평균 3시간]** 입니다.

### 성과 하이라이트
- 발음/받침 훈련: **[예: ㅅ/ㅆ 구분 정확도 85% → 95%]**
- 어휘: **[예: 누적 300단어 달성]**
- 말하기: **[예: 1분 자기소개 영상 촬영 완료]**
- 목표: **${achievement}**

${testimonial_author} 학생의 다음 도전을 함께 응원해주세요.
→ **[수업 신청](/apply)** ｜ **[후원하기](/donate)** ｜ **[자원봉사 참여](/volunteer)**`;

    const newTags = [testimonial_author, testimonial_country, '후기', '코리언클릭'].filter(Boolean);

    setPost(prev => ({
      ...prev,
      title: newTitle,
      summary: newSummary,
      body_md: templateBody, // Added body_md update
      tags: Array.from(new Set([...(prev.tags || []), ...newTags])), // Ensure unique tags
      status: 'public'
    }));
  };

  const handleGenerateSurveyTemplate = () => {
    const survey_title = post.metadata.survey_title || '';
    const satisfaction_rate = post.metadata.satisfaction_rate || '';
    const recommendation_rate = post.metadata.recommendation_rate || '';
    const attendance_rate = post.metadata.attendance_rate || '';
    const key_findings = post.metadata.key_findings || '';
    const chart_image_url = post.metadata.chart_image_url || '';

    if (!survey_title || !satisfaction_rate || !recommendation_rate || !attendance_rate) {
      alert('템플릿을 사용하려면 설문 제목, 전체 만족도, 추천 의향, 평균 출석률을 모두 입력해야 합니다.');
      return;
    }

    // 현재 년월 가져오기
    const now = new Date();
    const period = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;

    const newTitle = `${survey_title} 설문 요약 (기간: ${period})`;
    const newSummary = `${survey_title} 참여자들의 만족도는 ${satisfaction_rate}, 추천 의향은 ${recommendation_rate}를 기록했습니다. 학습자들의 실제 경험과 피드백을 확인해보세요.`;
    
    const templateBody = `### 설문 결과와 하이라이트 📊

**기간:** ${period} | **대상:** ${survey_title} 참여자

- 전체 만족도: **${satisfaction_rate}**
- 추천 의향: **${recommendation_rate}**
- 평균 출석률: **${attendance_rate}**

${key_findings || '학생들은 AI 발음 교정 기능과 메타버스 환경에서의 실전 대화 연습에 높은 만족도를 보였습니다. 특히 실시간 피드백과 개인 맞춤형 학습 경로가 도움이 되었다는 의견이 많았습니다.'}

${chart_image_url ? `![만족도 차트](${chart_image_url} "설문 결과 차트")` : '![만족도 차트 요약](https://YOUR_PUBLIC_IMAGE_URL "설문 결과 요약 차트")'}

---

#### 데이터 출처 & 방법
- **수집 방식:** 온라인 설문(구글폼), 자발적 참여
- **기간:** ${period}.01–${period}.15
- **표본:** 응답자, 중복 응답 제거, 익명 처리
- **사용 목적:** 프로그램 품질 개선 및 투명한 공개

> 차트는 이해를 돕기 위한 요약으로, 자세한 항목과 코멘트는 본문에서 확인할 수 있습니다.

---

**함께 성장하는 한국어 학습**

→ [수업 신청](${createPageUrl('Programs')}) · [후원하기](${createPageUrl('Donate')}) · [자원봉사 참여](${createPageUrl('Volunteer')})`;

    const newTags = [survey_title, '설문결과', '만족도', period, '코리언클릭'].filter(Boolean);

    setPost(prev => ({
      ...prev,
      title: newTitle,
      summary: newSummary,
      body_md: templateBody,
      tags: Array.from(new Set([...(prev.tags || []), ...newTags])),
      status: 'public'
    }));

    alert('✅ 템플릿이 적용되었습니다!\n\n다음 단계:\n1. 차트 이미지 URL을 "이미지 URL 목록"에 추가하세요\n2. 본문의 주요 발견사항을 수정하세요\n3. 필요시 추가 내용을 작성하세요');
  };

  const handleGenerateAchievementTemplate = () => {
    const certificate_type = post.metadata.certificate_type || 'TOPIK';
    const student_name = post.metadata.student_name || '';
    const country = post.metadata.country || '';
    const course_period = post.metadata.course_period || '';

    if (!student_name || !country) {
      alert('템플릿을 사용하려면 학생명과 국가를 모두 입력해야 합니다.');
      return;
    }

    // 현재 년도 가져오기
    const now = new Date();
    const year = now.getFullYear();

    const newTitle = `${student_name} 학생 ${certificate_type} 합격 (${country})`;
    const newSummary = `${country} 출신 ${student_name} 학생이 코리언클릭 국제교육원에서 한국어를 배우며 ${certificate_type} 시험에 합격했습니다.`;
    
    const templateBody = `### 학습 성과 인증 🏆

**학생명:** ${student_name} (${country})
**인증 종류:** ${certificate_type}
${course_period ? `**수업 기간:** ${course_period}` : '**수업 기간:** [입력해주세요]'}

${student_name} 학생은 ${country} 출신으로 코리언클릭 국제교육원에서 꾸준히 한국어를 학습했습니다.

체계적인 학습과 끊임없는 노력 끝에 **${certificate_type}**에 성공적으로 합격했습니다.

---

#### 인증서 이미지
(아래에 자동으로 표시됩니다 - "이미지 URL 목록"에 인증서 사진을 추가해주세요)

---

### 최근 합격 현황 📊
**기간:** ${year-1}–${year}  |  **합격자:** [예: 18명]  |  **평균 급수:** [예: TOPIK II 4급]  |  **참여국가:** [예: 6개국]

(EN) Highlights: [18 passes], avg **TOPIK II Lv.4**, learners from [6 countries].

---

**함께 성장하는 한국어 학습**

→ [수업 신청](${createPageUrl('Programs')}) · [후원하기](${createPageUrl('Donate')}) · [자원봉사 참여](${createPageUrl('Volunteer')})`;

    const newTags = [student_name, country, certificate_type, '합격', '성과인증', '코리언클릭'].filter(Boolean);

    setPost(prev => ({
      ...prev,
      title: newTitle,
      summary: newSummary,
      body_md: templateBody,
      tags: Array.from(new Set([...(prev.tags || []), ...newTags])),
      status: 'public'
    }));

    alert('✅ 템플릿이 적용되었습니다!\n\n다음 단계:\n1. 인증서 이미지를 "이미지 URL 목록"에 추가하세요\n2. 본문의 세부 내용을 수정하세요\n3. 최근 합격 현황 통계를 업데이트하세요');
  };

  const handleGenerateActivityTemplate = () => {
    const activity_title = post.metadata.activity_title || '';
    const purpose = post.metadata.purpose || '';
    const target = post.metadata.target || '';
    const event_date = post.metadata.event_date || '';
    const place = post.metadata.place || '';
    const participants = post.metadata.participants || '';
    const satisfaction = post.metadata.satisfaction || '';
    const certificates = post.metadata.certificates || '';

    if (!activity_title || !purpose || !target) {
      alert('템플릿을 사용하려면 활동명, 목적, 대상을 모두 입력해야 합니다.');
      return;
    }

    const newTitle = `${activity_title} - 활동 사례`;
    const newSummary = `${activity_title}을(를) 통해 ${target}에게 실질적인 교육과 기회를 제공했습니다.`;
    
    const templateBody = `### ${activity_title} 🎯

**목적:** ${purpose}

**대상:** ${target}  |  **기간/장소:** ${event_date && place ? `${event_date}, ${place}` : '[입력해주세요]'}

**결과(요약)**
${participants ? `- 수료 인원: **${participants}**` : '- 수료 인원: **[예: 12명]**'}
${satisfaction ? `- 만족도: **${satisfaction}**` : '- 만족도: **[예: 94%]**'}
${certificates ? `- 인증/수료증 발급: **${certificates}**` : '- 인증/수료증 발급: **[예: 12건]**'}

(EN) Key outcomes: [${participants || '12'} participants], satisfaction [${satisfaction || '94%'}], [${certificates || '12'} certificates issued].

---

#### 활동 사진
(아래에 자동으로 표시됩니다 - "이미지 URL 목록"에 활동 사진을 추가해주세요)

---

**함께 성장하는 교육 프로그램**

→ [수업 신청](${createPageUrl('Programs')}) · [후원하기](${createPageUrl('Donate')}) · [자원봉사 참여](${createPageUrl('Volunteer')})`;

    const newTags = [activity_title, '활동사례', '교육', '코리언클릭'].filter(Boolean);

    setPost(prev => ({
      ...prev,
      title: newTitle,
      summary: newSummary,
      body_md: templateBody,
      tags: Array.from(new Set([...(prev.tags || []), ...newTags])),
      status: 'public'
    }));

    alert('✅ 템플릿이 적용되었습니다!\n\n다음 단계:\n1. 활동 사진을 "이미지 URL 목록"에 추가하세요\n2. 본문의 세부 내용을 수정하세요\n3. 필요시 추가 설명을 작성하세요');
  };

  const youtubeId = getYouTubeId(post.youtube_url);

  // Tag handlers
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace('#', '');
      if (newTag && !post.tags.includes(newTag) && post.tags.length < 10) {
        setPost(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPost(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // Image handlers
  const addImage = () => {
    if (newImageUrl.trim() && post.image_urls.length < 20) {
      setPost(prev => ({ ...prev, image_urls: [...prev.image_urls, newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setPost(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  // Metrics handlers (for impact_metrics and metrics within metadata)
  const addMetric = (type) => {
    const field = type === 'impact' ? 'impact_metrics' : 'metrics';
    const maxCount = type === 'impact' ? 10 : 15;

    setPost(prev => {
      const currentMetrics = prev.metadata[field] || [];
      if (currentMetrics.length < maxCount) {
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            [field]: [...currentMetrics, { label: '', value: '', description: '' }]
          }
        };
      }
      return prev;
    });
  };

  const updateMetric = (type, index, field, value) => {
    const arrayField = type === 'impact' ? 'impact_metrics' : 'metrics';
    setPost(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [arrayField]: (prev.metadata[arrayField] || []).map((metric, i) =>
          i === index ? { ...metric, [field]: value } : metric
        )
      }
    }));
  };

  const removeMetric = (type, index) => {
    const field = type === 'impact' ? 'impact_metrics' : 'metrics';
    setPost(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: (prev.metadata[field] || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Related links handlers
  const addRelatedLink = () => {
    if (post.related_links.length < 10) {
      setPost(prev => ({
        ...prev,
        related_links: [...prev.related_links, { title: '', url: '', description: '' }]
      }));
    }
  };

  const updateRelatedLink = (index, field, value) => {
    setPost(prev => ({
      ...prev,
      related_links: prev.related_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeRelatedLink = (index) => {
    setPost(prev => ({
      ...prev,
      related_links: prev.related_links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title || !post.category) {
      alert('제목과 카테고리는 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('draft');

    try {
      const dataToSave = {
        category: post.category,
        title: post.title,
        summary: post.summary,
        thumbnail_url: post.thumbnail_url,
        image_urls: post.image_urls,
        youtube_url: post.youtube_url,
        tags: post.tags,
        status: post.status,
        publish_at: post.publish_at ? new Date(post.publish_at).toISOString() : null,
        body_md: post.body_md, // Using body_md
        related_links: post.related_links,
        metadata: post.metadata, // Sending metadata object
        slug: post.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-'),
      };

      if (postId) {
        await NewsEntity.update(postId, dataToSave);
      } else {
        await NewsEntity.create(dataToSave);
      }

      setSubmitStatus('success');
      if (!postId) {
        setTimeout(() => navigate(createPageUrl('AdminPostList')), 1500);
      }
    } catch (error) {
      console.error("Submit failed:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (postId && window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await NewsEntity.delete(postId);
        navigate(createPageUrl('AdminPostList'));
      } catch (error) {
        alert('삭제 실패');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  const StatusIndicator = () => {
    if (isSubmitting) return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />저장 중</Badge>;
    if (submitStatus === 'success') return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />저장 완료</Badge>;
    if (submitStatus === 'error') return <Badge className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" />오류 발생</Badge>;
    return null;
  };

  // Render different fields based on category
  const renderCategorySpecificFields = () => {
    switch (post.category) {
      case '기관 소개':
        return (
          <Card className="bg-blue-50/50">
            <CardHeader><CardTitle>기관 소개 지표</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {(post.metadata.impact_metrics || []).map((metric, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">지표 {index + 1}</span>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeMetric('impact', index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="라벨"
                      value={metric.label}
                      onChange={(e) => updateMetric('impact', index, 'label', e.target.value)}
                    />
                    <Input
                      placeholder="값"
                      value={metric.value}
                      onChange={(e) => updateMetric('impact', index, 'value', e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="설명"
                    value={metric.description}
                    onChange={(e) => updateMetric('impact', index, 'description', e.target.value)}
                    />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addMetric('impact')} className="w-full">
                <Plus className="w-4 h-4 mr-2" />지표 추가
              </Button>
            </CardContent>
          </Card>
        );

      case '학습자 후기':
        return (
          <Card className="bg-green-50/50">
            <CardHeader><CardTitle>후기 정보</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>후기 타입</Label>
                <RadioGroup value={post.metadata.testimonial_type || 'text'} onValueChange={(val) => handleMetadataChange('testimonial_type', val)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">텍스트</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video">동영상</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testimonial_author">작성자명 *</Label>
                  <Input id="testimonial_author" value={post.metadata.testimonial_author || ''} onChange={(e) => handleMetadataChange('testimonial_author', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="testimonial_country">국가 *</Label>
                  <Input id="testimonial_country" value={post.metadata.testimonial_country || ''} onChange={(e) => handleMetadataChange('testimonial_country', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="start_year">학습 시작 연도(YY) *</Label>
                  <Input id="start_year" placeholder="예: 22" value={post.metadata.start_year || ''} onChange={(e) => handleMetadataChange('start_year', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="achievement">주요 성과 *</Label>
                  <Input id="achievement" placeholder="예: TOPIK 5급 합격" value={post.metadata.achievement || ''} onChange={(e) => handleMetadataChange('achievement', e.target.value)} />
                </div>
              </div>
              <Button type="button" onClick={handleGenerateTestimonialTemplate} className="w-full">
                템플릿으로 제목/요약/본문 자동 완성
              </Button>
            </CardContent>
          </Card>
        );

      case '설문결과 하이라이트':
        return (
          <Card className="bg-purple-50/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>설문결과 정보</span>
                <Button
                  type="button"
                  onClick={handleGenerateSurveyTemplate}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  ✨ 템플릿 자동 생성
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">💡 사용 팁:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>필수 항목을 모두 입력한 후 "템플릿 자동 생성" 버튼을 클릭하세요</li>
                  <li>제목, 요약, 본문이 자동으로 채워집니다</li>
                  <li>차트 이미지가 있으면 본문에 자동 삽입됩니다</li>
                  <li>생성 후 본문을 수정하여 개인화하세요</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="survey_title">설문 제목 * (예: 메타버스 한국어 수업)</Label>
                <Input
                  id="survey_title"
                  placeholder="예: 메타버스 한국어 수업, Zoom 초급반 2월"
                  value={post.metadata.survey_title || ''}
                  onChange={(e) => handleMetadataChange('survey_title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="satisfaction_rate">전체 만족도 *</Label>
                  <Input
                    id="satisfaction_rate"
                    placeholder="예: 94%"
                    value={post.metadata.satisfaction_rate || ''}
                    onChange={(e) => handleMetadataChange('satisfaction_rate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recommendation_rate">추천 의향 *</Label>
                  <Input
                    id="recommendation_rate"
                    placeholder="예: 96%"
                    value={post.metadata.recommendation_rate || ''}
                    onChange={(e) => handleMetadataChange('recommendation_rate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="attendance_rate">평균 출석률 *</Label>
                  <Input
                    id="attendance_rate"
                    placeholder="예: 89%"
                    value={post.metadata.attendance_rate || ''}
                    onChange={(e) => handleMetadataChange('attendance_rate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="key_findings">주요 발견사항 (선택)</Label>
                <Textarea
                  id="key_findings"
                  placeholder="학생들이 실제로 어떤 점이 도움이 되었는지 3~4문장으로 서술해 주세요. 예: '학생들은 AI 발음 교정 기능이 특히 유용했다고 응답했습니다. 메타버스 환경에서의 실전 대화 연습도 높은 만족도를 보였습니다.'"
                  value={post.metadata.key_findings || ''}
                  onChange={(e) => handleMetadataChange('key_findings', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chart_image_url">차트 이미지 URL</Label>
                  <Input
                    id="chart_image_url"
                    placeholder="https://..."
                    value={post.metadata.chart_image_url || ''}
                    onChange={(e) => handleMetadataChange('chart_image_url', e.target.value)}
                  />
                  {post.metadata.chart_image_url && (
                    <img
                      src={post.metadata.chart_image_url}
                      alt="차트"
                      className="mt-2 w-full max-w-sm rounded border"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="pdf_url">PDF URL</Label>
                  <Input
                    id="pdf_url"
                    placeholder="https://..."
                    value={post.metadata.pdf_url || ''}
                    onChange={(e) => handleMetadataChange('pdf_url', e.target.value)}
                  />
                  {post.metadata.pdf_url && (
                    <a
                      href={post.metadata.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      PDF 미리보기
                    </a>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="report_url">원문 리포트 URL (선택)</Label>
                <Input
                  id="report_url"
                  placeholder="https://..."
                  value={post.metadata.report_url || ''}
                  onChange={(e) => handleMetadataChange('report_url', e.target.value)}
                />
              </div>

              <div>
                <Label>수치 지표 (선택 - 추가 지표가 필요한 경우)</Label>
                <div className="space-y-4">
                  {(post.metadata.metrics || []).map((metric, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">지표 {index + 1}</span>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeMetric('metrics', index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="라벨"
                          value={metric.label}
                          onChange={(e) => updateMetric('metrics', index, 'label', e.target.value)}
                        />
                        <Input
                          placeholder="값"
                          value={metric.value}
                          onChange={(e) => updateMetric('metrics', index, 'value', e.target.value)}
                        />
                      </div>
                      <Input
                        placeholder="설명"
                        value={metric.description}
                        onChange={(e) => updateMetric('metrics', index, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addMetric('metrics')} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />지표 추가
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case '실제 학습 성과 인증':
        return (
          <Card className="bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>인증 정보</span>
                <Button 
                  type="button" 
                  onClick={handleGenerateAchievementTemplate} 
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  ✨ 템플릿 자동 생성
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">💡 사용 팁:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>학생명과 국가를 입력한 후 "템플릿 자동 생성" 버튼을 클릭하세요</li>
                  <li>제목, 요약, 본문이 자동으로 채워집니다</li>
                  <li>인증서 이미지는 "이미지 URL 목록"에 추가하세요</li>
                  <li>최근 합격 현황 통계를 업데이트하세요</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="certificate_type">인증 타입</Label>
                <Select value={post.metadata.certificate_type || 'TOPIK'} onValueChange={(val) => handleMetadataChange('certificate_type', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOPIK">TOPIK</SelectItem>
                    <SelectItem value="대학합격">대학합격</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="student_name">학생명 *</Label>
                  <Input id="student_name" value={post.metadata.student_name || ''} onChange={(e) => handleMetadataChange('student_name', e.target.value)} placeholder="예: 김한국" />
                </div>
                <div>
                  <Label htmlFor="country">국가 *</Label>
                  <Input id="country" value={post.metadata.country || ''} onChange={(e) => handleMetadataChange('country', e.target.value)} placeholder="예: 미얀마" />
                </div>
                <div>
                  <Label htmlFor="course_period">수업 기간</Label>
                  <Input id="course_period" value={post.metadata.course_period || ''} onChange={(e) => handleMetadataChange('course_period', e.target.value)} placeholder="예: 2024.03-2024.08" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case '활동 사례':
        return (
          <Card className="bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>활동 정보</span>
                <Button 
                  type="button" 
                  onClick={handleGenerateActivityTemplate} 
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  ✨ 템플릿 자동 생성
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">💡 사용 팁:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>활동명, 목적, 대상을 입력한 후 "템플릿 자동 생성" 클릭</li>
                  <li>제목, 요약, 본문이 자동으로 채워집니다</li>
                  <li>활동 사진을 "이미지 URL 목록"에 추가하세요</li>
                  <li>결과 통계를 업데이트하세요</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="activity_title">활동명 *</Label>
                <Input 
                  id="activity_title" 
                  placeholder="예: 코리언클릭 펫파크 과정 교육"
                  value={post.metadata.activity_title || ''} 
                  onChange={(e) => handleMetadataChange('activity_title', e.target.value)} 
                />
              </div>

              <div>
                <Label htmlFor="purpose">목적 *</Label>
                <Textarea
                  id="purpose"
                  placeholder="예: 해외 청년이 반려동물 산업/돌봄 영역에서 안전하고 지속가능하게 일할 수 있도록 기초 역량을 교육합니다."
                  value={post.metadata.purpose || ''}
                  onChange={(e) => handleMetadataChange('purpose', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="target">대상 *</Label>
                <Input 
                  id="target" 
                  placeholder="예: 한국/해외 청년(초보자)"
                  value={post.metadata.target || ''} 
                  onChange={(e) => handleMetadataChange('target', e.target.value)} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">진행 기간</Label>
                  <Input 
                    id="event_date" 
                    placeholder="예: 2025.08~09"
                    value={post.metadata.event_date || ''} 
                    onChange={(e) => handleMetadataChange('event_date', e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="place">장소</Label>
                  <Input 
                    id="place" 
                    placeholder="예: 성남"
                    value={post.metadata.place || ''} 
                    onChange={(e) => handleMetadataChange('place', e.target.value)} 
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3">결과 통계 (선택)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="participants">수료 인원</Label>
                    <Input 
                      id="participants" 
                      placeholder="예: 12명"
                      value={post.metadata.participants || ''} 
                      onChange={(e) => handleMetadataChange('participants', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="satisfaction">만족도</Label>
                    <Input 
                      id="satisfaction" 
                      placeholder="예: 94%"
                      value={post.metadata.satisfaction || ''} 
                      onChange={(e) => handleMetadataChange('satisfaction', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificates">인증서 발급</Label>
                    <Input 
                      id="certificates" 
                      placeholder="예: 12건"
                      value={post.metadata.certificates || ''} 
                      onChange={(e) => handleMetadataChange('certificates', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case '공지':
        return (
          <Card className="bg-orange-50/50">
            <CardHeader><CardTitle>공지 설정</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <Label htmlFor="notice_type">공지 타입</Label>
                  <Select value={post.metadata.notice_type} onValueChange={(val) => handleMetadataChange('notice_type', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반">일반</SelectItem>
                      <SelectItem value="점검">점검</SelectItem>
                      <SelectItem value="업데이트">업데이트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="pin"
                    checked={post.metadata.pin}
                    onCheckedChange={(checked) => handleMetadataChange('pin', checked)}
                  />
                  <Label htmlFor="pin" className="cursor-pointer">상단 고정</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("AdminPostList")}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">콘텐츠 작성/편집</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>콘텐츠 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="제목을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select value={post.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 요약 */}
              <div>
                <Label htmlFor="summary">요약</Label>
                <Textarea
                  id="summary"
                  value={post.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="콘텐츠 요약을 입력하세요"
                  rows={3}
                />
              </div>

              {/* 썸네일 */}
              <div>
                <Label htmlFor="thumbnail_url">썸네일 이미지</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  value={post.thumbnail_url}
                  onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {post.thumbnail_url && (
                  <img
                    src={post.thumbnail_url}
                    alt="썸네일 미리보기"
                    className="mt-3 w-full max-w-md h-48 object-cover rounded-lg border bg-gray-100"
                    onError={(e) => {
                      e.currentTarget.onerror = null; // prevent infinite loop
                      e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Image+Not+Found';
                    }}
                  />
                )}
              </div>

              {/* 이미지 목록 */}
              <div>
                <Label>이미지 목록 ({post.image_urls.length}/20)</Label>
                <div className="p-3 border rounded-lg bg-gray-50/50">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                    {post.image_urls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={url}
                          alt={`이미지 ${index + 1}`}
                          className="w-full h-full object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/150?text=X';
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {post.image_urls.length < 20 && (
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="새 이미지 URL 입력"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addImage} disabled={!newImageUrl.trim()}>
                        <Plus className="w-4 h-4" />
                        추가
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* 유튜브 */}
              <div>
                <Label htmlFor="youtube_url">유튜브 링크</Label>
                <Input
                  id="youtube_url"
                  type="url"
                  value={post.youtube_url}
                  onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {youtubeId && (
                    <div className="mt-3 aspect-video w-full max-w-md">
                        <iframe
                            className="w-full h-full rounded-lg shadow-md"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
              </div>

              {/* 카테고리별 특수 필드 */}
              {renderCategorySpecificFields()}

              {/* 본문 - 마크다운으로 변경 */}
              <div>
                <Label>본문 (마크다운)</Label>
                <Textarea
                  value={post.body_md}
                  onChange={(e) => handleInputChange('body_md', e.target.value)}
                  placeholder="마크다운 형식으로 본문을 작성하세요..."
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  마크다운 문법을 사용할 수 있습니다. # 제목, **굵게**, *기울임*, [링크](URL), ![이미지](URL) 등
                </p>
              </div>

              {/* 관련 링크 */}
              <div className="mt-12">
                <Label>관련 링크 ({post.related_links.length}/10)</Label>
                <div className="space-y-4">
                  {post.related_links.map((link, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">링크 {index + 1}</span>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeRelatedLink(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="제목"
                          value={link.title}
                          onChange={(e) => updateRelatedLink(index, 'title', e.target.value)}
                        />
                        <Input
                          type="url"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateRelatedLink(index, 'url', e.target.value)}
                        />
                      </div>
                      <Input
                        placeholder="설명"
                        value={link.description}
                        onChange={(e) => updateRelatedLink(index, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRelatedLink} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />관련 링크 추가
                  </Button>
                </div>
              </div>

              {/* 태그 */}
              <div>
                <Label>태그 ({post.tags.length}/10)</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[50px] bg-white">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="태그 입력 후 엔터 또는 콤마"
                    className="border-none shadow-none flex-1 min-w-[200px] bg-transparent focus-visible:ring-0"
                    disabled={post.tags.length >= 10}
                  />
                </div>
              </div>

              {/* 상태 및 발행 설정 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>공개 상태</Label>
                  <RadioGroup
                    value={post.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">초안</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">공개</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="publish_at">예약 발행 일시</Label>
                  <Input
                    id="publish_at"
                    type="datetime-local"
                    value={post.publish_at}
                    onChange={(e) => handleInputChange('publish_at', e.target.value)}
                  />
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none">
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      저장하기
                    </>
                  )}
                </Button>

                {postId && (
                  <Button type="button" variant="destructive" onClick={handleDelete} className="flex-1 md:flex-none">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

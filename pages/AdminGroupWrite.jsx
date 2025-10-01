
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { News as NewsEntity, Partner as PartnerEntity, Metric as MetricEntity, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BatchItemCard from '@/components/admin/BatchWriter';
import { Plus, Save, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const getYouTubeId = (url = '') => {
  if (!url) return '';
  try {
    let m = url.match(/youtu\.be\/([A-Za-z0-9_\-]+)/);
    if (m && m[1]) return m[1];
    m = url.match(/[?&]v=([A-Za-z0-9_\-]+)/);
    if (m && m[1]) return m[1];
    m = url.match(/\/embed\/([A-Za-z0-9_\-]+)/);
    if (m && m[1]) return m[1];
    return '';
  } catch (e) { return ''; }
};

const getYouTubeThumb = (videoId) => {
  if (!videoId) return { primary: '', fallback: '' };
  return {
    primary: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    fallback: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
};

const schemas = {
  news: {
    entity: NewsEntity,
    label: "콘텐츠",
    fields: [
      {
        name: 'title',
        label: '제목',
        type: 'text',
        required: true,
        placeholder: '제목을 입력하세요 (2~80자)',
        minLength: 2,
        maxLength: 80
      },
      {
        name: 'summary',
        label: '요약',
        type: 'textarea',
        placeholder: '콘텐츠 요약을 입력하세요 (40~250자, 2~3문장 권장)',
        minLength: 40,
        maxLength: 250,
        rows: 3
      },
      {
        name: 'category',
        label: '카테고리',
        type: 'select',
        required: true,
        options: [
          "학습자 후기", "설문결과 하이라이트", "실제 학습 성과 인증",
          "활동 사례", "기관 소개", "공지", "소식", "기타"
        ]
      },
      {
        name: 'status',
        label: '상태',
        type: 'select',
        default: 'draft',
        options: [
          { value: 'draft', label: '초안' },
          { value: 'public', label: '공개' }
        ]
      },
      {
        name: 'thumbnail_url',
        label: '썸네일 URL',
        type: 'url',
        preview: 'image',
        placeholder: 'https://example.com/image.jpg'
      },
      {
        name: 'youtube_url',
        label: '유튜브 URL',
        type: 'youtube',
        placeholder: 'https://www.youtube.com/watch?v=...'
      },
      {
        name: 'image_urls',
        label: '이미지 URL 목록',
        type: 'url_array',
        placeholder: 'https://example.com/image.jpg'
      },
      {
        name: 'body_md',
        label: '본문 (마크다운)',
        type: 'markdown',
        placeholder: '마크다운 형식으로 본문을 작성하세요...',
        rows: 6
      },
      {
        name: 'tags',
        label: '태그',
        type: 'tags',
        placeholder: '태그1, 태그2, 태그3 (쉼표로 구분)'
      }
    ],
  },
  partners: {
    entity: PartnerEntity,
    label: "파트너",
    fields: [
      { name: 'name', label: '기관명', type: 'text', required: true, unique: true },
      { name: 'logo_url', label: '로고', type: 'url', required: true, preview: 'image' },
      { name: 'link_url', type: 'url', label: '웹사이트' },
      { name: 'visible', label: '노출', type: 'toggle', default: true, labels: ['숨김', '노출'] },
    ],
  },
  metrics: {
    entity: MetricEntity,
    label: "지표",
    fields: [
      { name: 'name', label: '지표명', type: 'text', required: true, unique: true, placeholder: '예: 총 학습자 수' },
      { name: 'value', label: '값', type: 'text', required: true, placeholder: '예: 10,000+' },
      { name: 'unit', label: '단위', type: 'text', placeholder: '예: 명, %' },
      { name: 'description', label: '설명', type: 'textarea', placeholder: '지표에 대한 간략한 설명' },
      { name: 'visible', label: '노출', type: 'toggle', default: true, labels: ['숨김', '노출'] },
    ],
  },
};

export default function AdminGroupWritePage() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState('news');
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // New state for validation errors

  const currentSchema = schemas[selectedGroup];

  const handleAddItem = useCallback(() => {
    const newItem = { id: crypto.randomUUID() };
    const schema = schemas[selectedGroup];
    schema.fields.forEach(field => {
      if (field.default !== undefined) {
        newItem[field.name] = field.default;
      } else if (field.type === 'url_array') {
        newItem[field.name] = [];
      } else if (field.type === 'tags') {
        newItem[field.name] = ''; // Tags start as a string input
      }
    });
    setItems(prev => [...prev, newItem]);
    setErrors({}); // Clear errors when adding new item to avoid stale error messages
  }, [selectedGroup]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user?.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        handleAddItem();
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [navigate, handleAddItem]);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setItems([]);
    setErrors({}); // Clear errors on group change
    setTimeout(() => {
      const newItem = { id: crypto.randomUUID() };
      const schema = schemas[group];
      schema.fields.forEach(field => {
        if (field.default !== undefined) {
          newItem[field.name] = field.default;
        } else if (field.type === 'url_array') {
          newItem[field.name] = [];
        } else if (field.type === 'tags') {
          newItem[field.name] = ''; // Tags start as a string input
        }
      });
      setItems([newItem]);
    }, 100);
  };

  const handleUpdateItem = (id, updatedItem) => {
    setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    // Optionally clear errors for the updated item if it's now valid
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[id]) {
        delete newErrors[id];
      }
      return newErrors;
    });
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[id]) {
        delete newErrors[id];
      }
      return newErrors;
    });
  };

  const handleDuplicateItem = (id) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (itemToDuplicate) {
      setItems(prev => [...prev, { ...itemToDuplicate, id: crypto.randomUUID() }]);
      setErrors({}); // Clear errors when adding new item to avoid stale error messages
    }
  };

  const handleSubmitAll = async () => {
    if (items.length === 0) {
      alert('⚠️ 등록할 항목이 없습니다.');
      return;
    }
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    const validationErrors = {};
    const itemsToCreate = [];
    const uniqueIdentifiers = new Set(); // For uniqueness check within the batch (slugs or names)

    // Regex for URL validation
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    // Regex for YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/i;

    for (const item of items) {
      const itemErrors = {};
      const processedItemData = { ...item }; // Start with a copy of the item data
      delete processedItemData.id; // Remove the local 'id' property before sending to backend
      
      // 자동 썸네일 생성 로직 (저장 시 최종 확인)
      if (selectedGroup === 'news' && !processedItemData.thumbnail_url && processedItemData.youtube_url) {
        const videoId = getYouTubeId(processedItemData.youtube_url);
        if (videoId) {
            const thumbs = getYouTubeThumb(videoId);
            processedItemData.thumbnail_url = thumbs.primary;
        }
      }

      for (const field of currentSchema.fields) {
        let value = processedItemData[field.name];

        // 1. Required field validation
        if (field.required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
          itemErrors[field.name] = `${field.label}은(는) 필수 입력 항목입니다.`;
          continue; // Move to next field if required is not met
        }

        // Only validate if value is not empty for non-required fields (and it's not null/undefined)
        if (value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '')) {
          // 2. Min/Max Length validation for strings
          if (typeof value === 'string') {
            if (field.minLength && value.length < field.minLength) {
              itemErrors[field.name] = `${field.label}은(는) 최소 ${field.minLength}자 이상이어야 합니다.`;
            }
            if (field.maxLength && value.length > field.maxLength) {
              itemErrors[field.name] = `${field.label}은(는) 최대 ${field.maxLength}자 이하여야 합니다.`;
            }
          }

          // 3. Type-specific validation and processing
          if (field.type === 'url' && typeof value === 'string' && value.trim() !== '') {
            if (!urlRegex.test(value)) {
              itemErrors[field.name] = `${field.label}의 URL 형식이 올바르지 않습니다.`;
            }
          } else if (field.type === 'youtube' && typeof value === 'string' && value.trim() !== '') {
            if (!youtubeRegex.test(value)) {
              itemErrors[field.name] = `${field.label}의 YouTube URL 형식이 올바르지 않습니다.`;
            }
          } else if (field.type === 'url_array' && Array.isArray(value) && value.length > 0) {
            const invalidUrls = value.filter(url => typeof url === 'string' && url.trim() !== '' && !urlRegex.test(url));
            if (invalidUrls.length > 0) {
              itemErrors[field.name] = `${field.label}에 올바르지 않은 URL 형식이 포함되어 있습니다.`;
            }
          }
          // Removed the previous 'else if (field.type === 'tags')' block from here.
        }

        // 4. Tags 특별 처리 - 무조건 배열로 변환
        if (field.type === 'tags') {
          const tagsValue = processedItemData[field.name]; // Use the current value in processedItemData
          if (typeof tagsValue === 'string') {
            // 문자열을 배열로 변환
            processedItemData[field.name] = tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag);
          } else if (!Array.isArray(tagsValue)) {
            // 배열이 아닌 경우 빈 배열로 설정 (예: null, undefined)
            processedItemData[field.name] = [];
          }
        }
      } // End of for (const field of currentSchema.fields) loop

      // 5. 모든 필드 처리 후 빈 tags를 빈 배열로 보장
      if (selectedGroup === 'news') {
        if (!processedItemData.tags || (typeof processedItemData.tags === 'string' && processedItemData.tags.trim() === '')) {
          processedItemData.tags = [];
        }
      }

      // 6. Group-specific processing and uniqueness check within the batch
      let uniqueIdentifierKey = null; // The value used for uniqueness check
      let identifierFieldName = null; // The field name to associate error with

      if (selectedGroup === 'news') {
        const title = item.title;
        let generatedSlug = '';
        if (title && typeof title === 'string') {
          generatedSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-');
        }

        if (!generatedSlug) {
          // If title is missing or results in an empty slug, use a unique ID as fallback
          processedItemData.slug = crypto.randomUUID();
        } else {
          processedItemData.slug = generatedSlug;
        }
        uniqueIdentifierKey = processedItemData.slug;
        identifierFieldName = 'title'; // Highlight the title field for uniqueness error
      } else if (selectedGroup === 'partners' || selectedGroup === 'metrics') {
        const name = item.name;
        if (name && typeof name === 'string' && name.trim() !== '') {
          uniqueIdentifierKey = name.trim();
          identifierFieldName = 'name';
        }
      }

      if (uniqueIdentifierKey) {
        if (uniqueIdentifiers.has(uniqueIdentifierKey)) {
          itemErrors[identifierFieldName] = `이미 존재하는 ${currentSchema.label} 이름/슬러그입니다. (현재 목록 내 중복)`;
        } else {
          uniqueIdentifiers.add(uniqueIdentifierKey);
        }
      }

      // If there are errors for this item, add them to the global validationErrors
      if (Object.keys(itemErrors).length > 0) {
        validationErrors[item.id] = itemErrors;
      } else {
        itemsToCreate.push(processedItemData);
      }
    } // End of for (const item of items) loop

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('❌ 입력 양식에 오류가 있습니다. 각 항목을 확인해주세요.');
      setIsSubmitting(false);
      return;
    }

    if (itemsToCreate.length === 0) {
      alert('⚠️ 유효한 항목이 없어 등록할 내용이 없습니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { entity } = currentSchema;
      await entity.bulkCreate(itemsToCreate);
      alert(`✅ ${itemsToCreate.length}개 항목이 성공적으로 등록되었습니다.`);
      setItems([]);
      handleAddItem(); // Add one empty item after successful submission
      setErrors({}); // Clear errors
    } catch (error) {
      console.error('Submission error:', error);
      alert(`❌ 등록 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('🗑 모든 입력 내용을 초기화하시겠습니까?')) {
      setItems([]);
      setErrors({}); // Clear errors on reset
      handleAddItem();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📑 일괄 글쓰기 관리자</h1>
            <p className="text-gray-600 mt-1">그룹별로 여러 게시글을 한 번에 작성할 수 있습니다.</p>
          </div>
          <Link to={createPageUrl("AdminPostList")}>
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />목록으로</Button>
          </Link>
        </div>
      </header>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>1. 그룹 선택</CardTitle>
            <div className="text-sm text-gray-600">{items.length}개 항목</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={selectedGroup} onValueChange={handleGroupChange}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">🗞 콘텐츠</SelectItem>
                <SelectItem value="partners">🤝 파트너</SelectItem>
                <SelectItem value="metrics">📈 지표</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">2. {currentSchema.label} 입력</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <BatchItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  fields={currentSchema.fields}
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  onDuplicate={handleDuplicateItem}
                  allItems={items}
                  errors={errors[item.id]} // Pass specific errors for this item
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <Button onClick={handleAddItem} variant="outline">
              <Plus className="w-4 h-4 mr-2" />항목 추가
            </Button>
            <Button
              onClick={handleSubmitAll}
              disabled={isSubmitting || items.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              ✅ {items.length}개 전체 저장
            </Button>
            <Button onClick={handleReset} variant="destructive" disabled={items.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />🗑 전체 초기화
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

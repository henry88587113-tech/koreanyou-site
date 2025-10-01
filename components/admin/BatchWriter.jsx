
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Copy, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const ImageWithFallback = ({ primarySrc, fallbackSrc, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(primarySrc);

    useEffect(() => {
        setImgSrc(primarySrc);
    }, [primarySrc]);

    const handleError = () => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            setImgSrc('https://via.placeholder.com/160x90?text=Error');
        }
    };

    return imgSrc ? <img src={imgSrc} onError={handleError} alt={alt} {...props} /> : null;
};


const BatchItemCard = ({ item, index, fields, onUpdate, onDelete, onDuplicate, allItems }) => {
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  useEffect(() => {
    const validate = () => {
      const newErrors = {};
      const newWarnings = {};

      // Title validation
      if (!item.title?.trim()) newErrors.title = '제목은 필수입니다.';
      else if (item.title.length < 2 || item.title.length > 80) {
        newErrors.title = '제목은 2~80자 사이여야 합니다.';
      }

      // Category validation
      if (!item.category) newErrors.category = '카테고리는 필수입니다.';

      // Summary length warning
      if (item.summary && (item.summary.length < 40 || item.summary.length > 250)) {
        newWarnings.summary = '요약은 40~250자 내외를 권장합니다.';
      }

      // URL Validations
      const isYouTubeUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
      if (item.youtube_url && !isYouTubeUrl(item.youtube_url)) {
        newErrors.youtube_url = '유효한 유튜브 URL(youtube.com, youtu.be)이 아닙니다.';
      }
      
      const isValidHttpUrl = (url) => {
        try {
          new URL(url);
          return url.startsWith('http');
        } catch { return false; }
      };

      if (item.thumbnail_url && !isValidHttpUrl(item.thumbnail_url)) {
        newErrors.thumbnail_url = '유효한 URL 형식이 아닙니다.';
      }

      const imageUrlErrors = {};
      (item.image_urls || []).forEach((url, i) => {
        if (url && !isValidHttpUrl(url)) {
          imageUrlErrors[i] = '유효한 URL 형식이 아닙니다.';
        }
      });
      if (Object.keys(imageUrlErrors).length > 0) newErrors.image_urls = imageUrlErrors;
      
      // Duplicate check (within the batch)
      if (item.title && item.category) {
        const isDuplicate = allItems.some(otherItem => 
          otherItem.id !== item.id && 
          otherItem.title === item.title && 
          otherItem.category === item.category
        );
        if (isDuplicate) {
          newWarnings.title = '현재 배치 내에 동일한 제목과 카테고리의 항목이 존재합니다.';
        }
      }

      setErrors(newErrors);
      setWarnings(newWarnings);
    };
    validate();
  }, [item, allItems]);


  const handleFieldChange = (fieldName, value) => {
    onUpdate(item.id, { ...item, [fieldName]: value });
  };
  
  const handleYoutubeUrlChange = (url) => {
    const videoId = getYouTubeId(url);
    const updatedItem = { ...item, youtube_url: url };
    
    if (videoId && !item.thumbnail_url) {
      const thumbs = getYouTubeThumb(videoId);
      updatedItem.thumbnail_url = thumbs.primary;
    }
    onUpdate(item.id, updatedItem);
  };

  const handleArrayAdd = (fieldName) => {
    const currentArray = item[fieldName] || [];
    handleFieldChange(fieldName, [...currentArray, '']);
  };

  const handleArrayUpdate = (fieldName, index, value) => {
    const currentArray = item[fieldName] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    handleFieldChange(fieldName, newArray);
  };

  const handleArrayRemove = (fieldName, index) => {
    const newArray = (item[fieldName] || []).filter((_, i) => i !== index);
    handleFieldChange(fieldName, newArray);
  };

  const getStatusBadge = (status) => {
    if (status === 'published') return <Badge className="bg-green-500">공개</Badge>;
    return <Badge variant="secondary">초안</Badge>;
  };
  
  const youtubeId = getYouTubeId(item.youtube_url);
  const youtubeThumbs = getYouTubeThumb(youtubeId);

  return (
    <Card className={cn(
      "w-full max-w-md transition-all hover:shadow-lg",
      Object.keys(errors).length > 0 ? "border-red-400" : "border-gray-200",
      Object.keys(warnings).length > 0 && Object.keys(errors).length === 0 ? "border-yellow-400" : ""
    )}>
      <style>{`
        .thumb-preview img {
          width: 160px; height: 90px; object-fit: cover; border-radius: 8px; border:1px solid #eee; margin-top:6px;
        }
        .images-preview img { width: 80px; height: 80px; object-fit: cover; border:1px solid #eee; margin:6px 6px 0 0; border-radius:6px; }
        .youtube-preview {
          width: 160px; height: 90px; border-radius: 8px; margin-top: 6px; overflow: hidden;
        }
      `}</style>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold truncate pr-2">
          {index + 1}. {item.title || '새 항목'}
        </CardTitle>
        <div className="flex-shrink-0 flex items-center gap-1">
          {item.status && getStatusBadge(item.status)}
          <Button variant="ghost" size="icon" onClick={() => onDuplicate(item.id)} className="w-6 h-6">
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="w-6 h-6">
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(field => (
          <div key={field.name}>
            <Label className="text-xs font-semibold">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>

            {field.type === 'text' && <Input placeholder={field.placeholder} value={item[field.name] || ''} onChange={(e) => handleFieldChange(field.name, e.target.value)} className="text-sm" maxLength={field.maxLength} />}
            {field.type === 'textarea' && <Textarea placeholder={field.placeholder} value={item[field.name] || ''} onChange={(e) => handleFieldChange(field.name, e.target.value)} rows={field.rows || 2} className="text-sm" maxLength={field.maxLength} />}
            {field.type === 'markdown' && <Textarea placeholder={field.placeholder} value={item[field.name] || ''} onChange={(e) => handleFieldChange(field.name, e.target.value)} rows={field.rows || 4} className="text-sm font-mono" />}
            
            {field.type === 'url' && (
              <div>
                <Input type="url" placeholder={field.placeholder || "https://..."} value={item[field.name] || ''} onChange={(e) => handleFieldChange(field.name, e.target.value)} className="text-sm" />
                {item[field.name] && ( // Only show if URL exists
                  <div className="thumb-preview">
                    <ImageWithFallback 
                      primarySrc={item[field.name]}
                      alt="썸네일 미리보기"
                    />
                  </div>
                )}
              </div>
            )}
            
            {field.type === 'youtube' && (
              <div>
                <Input type="url" placeholder={field.placeholder} value={item.youtube_url || ''} onChange={(e) => handleYoutubeUrlChange(e.target.value)} className="text-sm" />
                {youtubeId && ( // If YouTube ID is found, show iframe
                  <div className="youtube-preview">
                    <iframe
                      width="160"
                      height="90"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube 미리보기"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: '8px' }}
                    ></iframe>
                  </div>
                )}
                {!youtubeId && youtubeThumbs.primary && ( // If no YouTube ID, but thumbnail URL is available, show thumbnail
                  <div className="thumb-preview">
                    <ImageWithFallback 
                      primarySrc={youtubeThumbs.primary}
                      fallbackSrc={youtubeThumbs.fallback}
                      alt="유튜브 썸네일 미리보기"
                    />
                  </div>
                )}
              </div>
            )}

            {field.type === 'url_array' && (
              <div>
                {(item[field.name] || []).length > 0 && ( // Only show if there are items in the array
                  <div className="images-preview flex flex-wrap mb-3">
                    {(item[field.name] || []).map((url, urlIndex) => (
                      url && (
                        <ImageWithFallback 
                          key={urlIndex} 
                          primarySrc={url} 
                          alt={`이미지 ${urlIndex + 1}`} 
                        />
                      )
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  {(item[field.name] || []).map((url, urlIndex) => (
                    <div key={urlIndex}>
                      <div className="flex gap-2 items-center">
                        <Input type="url" placeholder={field.placeholder} value={url} onChange={(e) => handleArrayUpdate(field.name, urlIndex, e.target.value)} className="text-sm flex-1" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleArrayRemove(field.name, urlIndex)} className="w-8 h-8"><X className="w-3 h-3" /></Button>
                      </div>
                      {errors.image_urls?.[urlIndex] && <p className="text-red-500 text-xs mt-1">{errors.image_urls[urlIndex]}</p>}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => handleArrayAdd(field.name)} className="w-full"><Plus className="w-3 h-3 mr-1" />이미지 링크 추가</Button>
                </div>
              </div>
            )}
            
            {field.type === 'tags' && (
               <div>
                <Input
                  placeholder={field.placeholder}
                  value={Array.isArray(item[field.name]) ? item[field.name].join(', ') : (item[field.name] || '')}
                  onChange={(e) => handleFieldChange(field.name, e.target.value.split(',').map(tag => tag.trim()))}
                  className="text-sm"
                />
                {Array.isArray(item[field.name]) && item[field.name].length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item[field.name].filter(tag => tag).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {field.type === 'select' && (
              <Select value={item[field.name]} onValueChange={(val) => handleFieldChange(field.name, val)}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="선택" /></SelectTrigger>
                <SelectContent>
                  {field.options.map(opt => {
                    const value = typeof opt === 'string' ? opt : opt.value;
                    const label = typeof opt === 'string' ? opt : opt.label;
                    return <SelectItem key={value} value={value}>{label}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            )}

            {field.type === 'toggle' && (
              <div className="flex items-center gap-2">
                <span className="text-xs">{field.labels ? field.labels[0] : '숨김'}</span>
                <Switch checked={item[field.name]} onCheckedChange={(checked) => handleFieldChange(field.name, checked)} />
                <span className="text-xs">{field.labels ? field.labels[1] : '노출'}</span>
              </div>
            )}

            {/* Error and Warning Messages */}
            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
            {warnings[field.name] && <p className="text-yellow-600 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {warnings[field.name]}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BatchItemCard;

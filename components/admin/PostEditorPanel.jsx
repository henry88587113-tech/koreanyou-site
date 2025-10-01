import React, { useState, useEffect, useMemo } from 'react';
import { News as NewsEntity } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Loader2, X, Plus, Trash2 } from 'lucide-react';
import { debounce } from 'lodash';

const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function PostEditorPanel({ post, onSave, onClose }) {
  const [editedPost, setEditedPost] = useState(post);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const debouncedSave = useMemo(
    () => debounce(async (p) => {
      setIsSaving(true);
      await NewsEntity.update(p.id, p);
      onSave(p);
      setIsSaving(false);
    }, 3000),
    [onSave]
  );

  useEffect(() => {
    if (editedPost && editedPost.id) {
      debouncedSave(editedPost);
    }
    return () => debouncedSave.cancel();
  }, [editedPost, debouncedSave]);

  const handleChange = (field, value) => {
    setEditedPost(prev => ({ ...prev, [field]: value }));
  };
  
  // Tag handlers
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !editedPost.tags?.includes(newTag)) {
        handleChange('tags', [...(editedPost.tags || []), newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    handleChange('tags', editedPost.tags.filter(t => t !== tag));
  };
  
  // Checklist handlers
  const handleChecklistChange = (index, field, value) => {
    const newChecklists = [...(editedPost.checklists || [])];
    newChecklists[index][field] = value;
    handleChange('checklists', newChecklists);
  };
  
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = { text: newChecklistItem.trim(), checked: false };
      handleChange('checklists', [...(editedPost.checklists || []), newItem]);
      setNewChecklistItem('');
    }
  };
  
  const removeChecklistItem = (index) => {
    const newChecklists = [...(editedPost.checklists || [])];
    newChecklists.splice(index, 1);
    handleChange('checklists', newChecklists);
  };

  if (!editedPost) return null;

  const youtubeId = getYouTubeId(editedPost.youtube_url);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input id="title" value={editedPost.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">썸네일 URL</Label>
        <Input id="image_url" value={editedPost.image_url || ''} onChange={(e) => handleChange('image_url', e.target.value)} />
        {editedPost.image_url && <img src={editedPost.image_url} alt="썸네일 미리보기" className="mt-2 rounded-md border object-cover w-full aspect-video" />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube_url">유튜브 URL</Label>
        <Input id="youtube_url" value={editedPost.youtube_url || ''} onChange={(e) => handleChange('youtube_url', e.target.value)} />
        {youtubeId && <iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="mt-2 rounded-md border w-full aspect-video" allowFullScreen></iframe>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">요약문</Label>
        <Textarea id="excerpt" value={editedPost.excerpt || ''} onChange={(e) => handleChange('excerpt', e.target.value)} />
      </div>
      
      <div className="space-y-2">
        <Label>본문</Label>
        <ReactQuill theme="snow" value={editedPost.content || ''} onChange={(value) => handleChange('content', value)} style={{ minHeight: '200px' }} />
      </div>

      <div className="space-y-2">
        <Label>태그</Label>
        <div className="flex flex-wrap gap-2 border p-2 rounded-md">
          {(editedPost.tags || []).map(tag => (
            <Badge key={tag} variant="secondary">{tag} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)}/></Badge>
          ))}
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="태그 추가..." className="flex-1 border-none shadow-none"/>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>체크리스트</Label>
        {(editedPost.checklists || []).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox checked={item.checked} onCheckedChange={(checked) => handleChecklistChange(index, 'checked', checked)} />
            <Input value={item.text} onChange={(e) => handleChecklistChange(index, 'text', e.target.value)} className="flex-1" />
            <Button variant="ghost" size="icon" onClick={() => removeChecklistItem(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newChecklistItem} onChange={e => setNewChecklistItem(e.target.value)} placeholder="새 항목 추가..."/>
          <Button onClick={addChecklistItem}><Plus className="w-4 h-4"/></Button>
        </div>
      </div>

      <div className="flex justify-end">
        {isSaving ? <Loader2 className="animate-spin" /> : <Save className="text-gray-500" />}
      </div>
    </div>
  );
}
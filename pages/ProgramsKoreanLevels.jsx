
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Application } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Send, CheckCircle } from 'lucide-react';

const koreanLevels = [
  { value: 'beginner', label: '초급 (Beginner)' },
  { value: 'intermediate', label: '중급 (Intermediate)' },
  { value: 'advanced', label: '고급 (Advanced)' }
];

const countries = [
  'USA', 'Canada', 'UK', 'Australia', 'Japan', 'China', 'Vietnam', 'Thailand', 
  'Indonesia', 'Malaysia', 'Philippines', 'Singapore', 'India', 'Pakistan', 'Bangladesh',
  'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'Russia', 'Germany', 'France', 'Spain', 'Italy'
];

export default function ProgramsKoreanLevelsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    email: '',
    whatsapp: '',
    korean_level: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await Application.create({
        type: 'korean_class',
        ...formData
      });
      
      // 신청 완료 후 감사 페이지로 이동 (분석 및 전환 추적 스크립트 추가)
      navigate(createPageUrl("ThankYou?type=class_signup_complete"));
    } catch (error) {
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false); // Make sure to reset isSubmitting on error
    } finally {
      // Removed setIsSubmitting(false) from finally block to keep it only on error or success to prevent button flickering
      // if (error is not handled by alert)
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">수업 신청 폼</h1>
          <p className="mt-4 text-xl text-gray-600">
            전문 한국어 수업에 참여하고 싶으신가요? 아래 정보를 입력해주세요.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              신청 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="성함을 입력해주세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">거주 국가 *</Label>
                <Select value={formData.country} onValueChange={(value) => handleChange('country', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="거주하고 계신 국가를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="이메일 주소를 입력해주세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp 번호</Label>
                <Input
                  id="whatsapp"
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="국가번호 포함 (예: +82-10-1234-5678)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="korean_level">한국어 수준</Label>
                <Select value={formData.korean_level} onValueChange={(value) => handleChange('korean_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="현재 한국어 수준을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {koreanLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">추가 메시지</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="학습 목표나 궁금한 점을 알려주세요 (선택사항)"
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>처리 중...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    신청 완료
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-6 text-center">
              ※ 제출된 정보는 문의 응대 목적에 한하여 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">신청 후 안내사항</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 신청 후 24시간 내에 확인 메일을 보내드립니다</li>
                <li>• 레벨 테스트 일정을 개별적으로 안내해드립니다</li>
                <li>• 모든 수업은 100% 무료로 제공됩니다</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

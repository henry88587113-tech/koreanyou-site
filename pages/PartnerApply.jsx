
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Application } from '@/api/entities';
import { ArrowLeft, Building, Handshake, Cloud, Banknote, Download } from 'lucide-react';

const partnershipTypes = [
  { 
    title: "교육 협력", 
    description: "한국어 및 문화 교육 공동 운영", 
    icon: Building, 
    color: "blue" 
  },
  { 
    title: "기술 협력", 
    description: "AI/클라우드/플랫폼 지원", 
    icon: Cloud, 
    color: "purple" 
  },
  { 
    title: "재정 협력", 
    description: "프로그램 운영을 위한 기금 후원", 
    icon: Banknote, 
    color: "green" 
  },
];

export default function PartnerApplyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    partnershipType: '',
    introduction: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Application.create({
        type: 'partner',
        organization_name: formData.organizationName,
        name: formData.contactName,
        email: formData.email,
        partnership_type: formData.partnershipType,
        message: formData.introduction
      });
      
      navigate(createPageUrl("ThankYou"));
    } catch (error) {
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Participate")}>
            <Button variant="outline" className="mb-4 text-white border-white hover:bg-white hover:text-green-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> 참여하기로 돌아가기
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">파트너로 함께하세요</h1>
            <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
              기관·기업·단체의 협력으로 더 큰 임팩트를 만듭니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">파트너십 유형</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card key={type.title} className={`border-t-4 border-${type.color}-500 shadow-md`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 bg-${type.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${type.color}-600`} />
                      </div>
                      <CardTitle>{type.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">파트너 신청서</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="organizationName">기관명 *</Label>
                  <Input id="organizationName" value={formData.organizationName} onChange={(e) => handleChange('organizationName', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="contactName">담당자 이름 *</Label>
                  <Input id="contactName" value={formData.contactName} onChange={(e) => handleChange('contactName', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">담당자 이메일 *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                </div>
                <div>
                  <Label>협력 분야 *</Label>
                  <Select value={formData.partnershipType} onValueChange={(value) => handleChange('partnershipType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="협력 분야를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">교육 협력</SelectItem>
                      <SelectItem value="technology">기술 협력</SelectItem>
                      <SelectItem value="finance">재정 협력</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="introduction">기관 소개 및 제안 내용 *</Label>
                  <Textarea id="introduction" value={formData.introduction} onChange={(e) => handleChange('introduction', e.target.value)} rows={5} required />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-3" disabled={isSubmitting}>
                  {isSubmitting ? '제출 중...' : '제출하기'}
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                ※ 제출된 정보는 문의 응대 목적에 한하여 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-bold mb-4">더 자세한 정보가 필요하신가요?</h3>
          <p className="text-gray-600 mb-6">
            파트너십에 대한 상세한 내용이 담긴 안내문을 확인해보세요.
          </p>
          <a href="/partner/guide.pdf" download>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              파트너십 안내문 다운로드
            </Button>
          </a>
        </section>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Application } from '@/api/entities';
import { ArrowLeft, Users, PenTool, Calendar, Heart } from 'lucide-react';

const volunteerAreas = [
  { 
    title: "한국어 수업 보조", 
    description: "수업 진행을 돕고 학습자들과 교류", 
    icon: Users, 
    color: "blue" 
  },
  { 
    title: "콘텐츠 제작", 
    description: "교재, 영상, 블로그 콘텐츠 제작", 
    icon: PenTool, 
    color: "green" 
  },
  { 
    title: "이벤트 운영", 
    description: "온라인/오프라인 행사 진행 지원", 
    icon: Calendar, 
    color: "purple" 
  },
];

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    volunteer_area: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Application.create({
        type: 'volunteer',
        name: formData.name,
        email: formData.email,
        volunteer_role: formData.volunteer_area,
        message: formData.motivation
      });
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', volunteer_area: '', motivation: '' });
    } catch (error) {
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">신청이 완료되었습니다!</h2>
            <p className="text-gray-600 mb-6">
              봉사 신청서를 검토한 후 이메일로 연락드리겠습니다.
            </p>
            <Link to={createPageUrl("Participate")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                참여하기 페이지로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="pt-24 pb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Participate")}>
            <Button variant="outline" className="mb-4 text-white border-white hover:bg-white hover:text-blue-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> 참여하기로 돌아가기
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">함께하는 봉사</h1>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              AI·교육·문화 활동에서 자원봉사자로 참여하세요.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Volunteer Areas */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">봉사 분야</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {volunteerAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.title} className={`border-t-4 border-${area.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 bg-${area.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${area.color}-600`} />
                      </div>
                      <CardTitle>{area.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{area.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Application Form */}
        <section>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">봉사 신청서</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>가능 분야 *</Label>
                  <Select value={formData.volunteer_area} onValueChange={(value) => handleChange('volunteer_area', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="봉사 분야를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="program_support">한국어 수업 보조</SelectItem>
                      <SelectItem value="design">콘텐츠 제작</SelectItem>
                      <SelectItem value="other">이벤트 운영</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="motivation">지원 동기 *</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleChange('motivation', e.target.value)}
                    placeholder="봉사 활동에 참여하고 싶은 이유를 자유롭게 작성해주세요."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '신청 중...' : '신청하기'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Additional Info */}
        <section className="text-center bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-bold mb-4">봉사 활동 안내</h3>
          <p className="text-gray-600 mb-4">
            자원봉사 활동은 온라인으로 진행되며, 개인의 가능한 시간에 맞춰 참여할 수 있습니다.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>• 온라인 활동</span>
            <span>• 유연한 시간</span>
            <span>• 활동 인증서 제공</span>
          </div>
        </section>
      </main>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    alert('문의가 접수되었습니다.');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">문의하기</h1>
          <p className="mt-4 text-xl text-gray-600">파트너십 제안, 후원, 기타 문의사항을 남겨주세요.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>문의 양식</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input placeholder="성함" required />
                <Input type="email" placeholder="이메일" required />
                <Input placeholder="소속 (선택)" />
                <Textarea placeholder="문의 내용" required rows={6} />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  제출하기
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>연락처 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <a href="mailto:info@koreanclick.org" className="hover:underline">info@koreanclick.org</a>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <span>+82-2-1234-5678</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <span>서울특별시 강남구 테헤란로</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <div>
              <h3 className="text-xl font-semibold mb-4">소셜 미디어</h3>
              <div className="flex space-x-4">
                {/* Add social media links here */}
                <a href="#" className="text-gray-500 hover:text-blue-600">Facebook</a>
                <a href="#" className="text-gray-500 hover:text-blue-600">Instagram</a>
                <a href="#" className="text-gray-500 hover:text-blue-600">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
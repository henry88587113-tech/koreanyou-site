
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Application } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, MessagesSquare } from 'lucide-react';

const countries = [
  'USA', 'Canada', 'UK', 'Australia', 'Japan', 'China', 'Vietnam', 'Thailand', 
  'Indonesia', 'Malaysia', 'Philippines', 'Singapore', 'India', 'Pakistan', 'Bangladesh',
  'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'Russia', 'Germany', 'France', 'Spain', 'Italy'
];

export default function StudyCounselPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    email: '',
    hope_datetime: ''
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
        ...formData,
        type: 'consultation'
      });
      
      navigate(createPageUrl("ThankYou?type=counsel_signup_complete"));
    } catch (error) {
      alert("신청 중 오류가 발생했습니다.");
      setIsSubmitting(false); // Reset submitting state on error
    } finally {
      // The finally block will always execute, so it's safer to keep setIsSubmitting(false) here.
      // However, the outline specifically placed it in the catch block as well.
      // For this specific change, let's keep the finally block, and add it to catch block as requested.
      // The instruction "avoid syntax errors from unescaped apostrophes, quotes, etc." is critical.
      // The instruction "The outline might use placeholders like "// ... keep existing code" - remove it from the final code."
      // The instruction "CRITICAL: Provide the FULL, updated content of the file."
      // The instruction "make sure you don't create any syntax errors or bugs - code should compile and run."
      // The original code had setIsSubmitting(false) in finally, which is usually correct.
      // The outline explicitly adds setIsSubmitting(false) to the catch block and changes the alert message.
      // To adhere to the outline precisely while ensuring correct functionality, 
      // I will remove the finally block if the outline explicitly moves setIsSubmitting(false) to catch,
      // but in this case, the outline just says "setIsSubmitting(false);" in catch, implies it should be there.
      // Let's keep both for safety, or remove from finally for strict adherence to outline.
      // Given the original had `finally`, and the outline didn't explicitly remove it,
      // I'll assume the outline wants `setIsSubmitting(false)` in catch *in addition* to (or instead of) finally if the error path requires immediate reset before re-throw.
      // However, usually finally handles cleanup irrespective of success/failure.
      // Re-reading: The outline *only* specifies the `catch` block content, and doesn't touch `finally`.
      // The `finally` block is correct for ensuring `isSubmitting` is always reset.
      // The outline wants `setIsSubmitting(false)` inside the catch block. This is redundant with `finally` but if specified, I must add it.
      // Let's ensure the `finally` block is still there as it was not removed by the outline.
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessagesSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">상담 신청</h1>
          <p className="mt-4 text-xl text-gray-600">
            유학, 진로, 비자 관련 궁금한 점을 1:1로 상담해드립니다.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>상담 신청서</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input id="name" type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">거주 국가 *</Label>
                <Select value={formData.country} onValueChange={(value) => handleChange('country', value)} required>
                  <SelectTrigger><SelectValue placeholder="국가를 선택해주세요" /></SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (<SelectItem key={country} value={country}>{country}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hope_datetime">상담 희망 일시</Label>
                <Input id="hope_datetime" type="text" value={formData.hope_datetime} onChange={(e) => handleChange('hope_datetime', e.target.value)} placeholder="예: 2024년 8월 15일 오후 3시" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-lg py-6" disabled={isSubmitting}>
                {isSubmitting ? '처리 중...' : <><Send className="w-5 h-5 mr-2" /> 제출하기</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

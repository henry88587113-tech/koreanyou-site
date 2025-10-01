
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, CreditCard, Calendar, Target, ArrowLeft } from 'lucide-react';

const donationMethods = [
  { 
    title: "1회성 기부", 
    description: "한 번의 기부로 한국어 학습을 지원합니다.", 
    icon: Heart, 
    color: "red",
    value: "one-time"
  },
  { 
    title: "정기 기부", 
    description: "매월 자동 기부로 꾸준한 지원이 가능합니다.", 
    icon: Calendar, 
    color: "blue",
    value: "monthly"
  },
  { 
    title: "특별 프로젝트", 
    description: "청소년 캠프, 유학 지원 등 특정 프로젝트 지정 기부", 
    icon: Target, 
    color: "green",
    value: "project"
  },
];

const presetAmounts = [10000, 30000, 50000, 100000];

export default function DonatePage() {
  const navigate = useNavigate();
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleDonation = (e) => {
    e.preventDefault();
    // 실제 결제 처리 시뮬레이션
    const finalAmount = amount || customAmount;
    
    if (!finalAmount || !donorInfo.name || !donorInfo.email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 기부 완료 페이지로 리다이렉트
    navigate(createPageUrl("ThankYou"));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="pt-24 pb-12 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Participate")}>
            <Button variant="outline" className="mb-4 text-white border-white hover:bg-white hover:text-red-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> 참여하기로 돌아가기
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">함께하는 기부</h1>
            <p className="mt-4 text-xl text-red-100 max-w-3xl mx-auto">
              당신의 작은 도움이 전 세계 학습자들에게 큰 희망이 됩니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Donation Methods */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">기부 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.value} className={`border-t-4 border-${method.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 bg-${method.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${method.color}-600`} />
                      </div>
                      <CardTitle>{method.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{method.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Donation Usage Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6">후원금 사용 안내</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">여러분의 후원은 다음과 같은 교육 기회 확장에 투명하게 사용됩니다.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>운영·교육 인프라</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>온라인 수업 서버/화상 회의 도구, 메타버스 교실 유지</li>
                  <li>AI 발음·문장 교정 도구 라이선스 제공</li>
                  <li>학습관리시스템(LMS)·보안/접근성 개선</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>학습자 직접 지원</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>데이터 요금/교재/시험 응시료 소액 장학</li>
                  <li>우수 학습자 멘토링·현지 봉사자 교육</li>
                  <li>취업·유학 준비용 포트폴리오 코칭</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 text-blue-900 text-sm p-4 text-center">
            <strong>투명성 약속:</strong>
            <span className="ml-1">분기별 재정 요약과 성과 리포트를 공개합니다. → 
              <Link to={createPageUrl("Impact")} className="underline font-semibold hover:text-blue-700">최신 리포트 보기</Link>
            </span>
          </div>
        </section>

        {/* Donation Widget */}
        <section>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <CreditCard className="w-6 h-6" />
                기부하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonation} className="space-y-6">
                {/* Donation Type */}
                <div>
                  <Label className="text-base font-semibold">기부 유형</Label>
                  <RadioGroup value={donationType} onValueChange={setDonationType} className="mt-2">
                    {donationMethods.map((method) => (
                      <div key={method.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <Label htmlFor={method.value}>{method.title}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-semibold">기부 금액</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2 mb-4">
                    {presetAmounts.map((presetAmount) => (
                      <Button
                        key={presetAmount}
                        type="button"
                        variant={amount === presetAmount.toString() ? "default" : "outline"}
                        onClick={() => {
                          setAmount(presetAmount.toString());
                          setCustomAmount('');
                        }}
                        className="h-12"
                      >
                        {presetAmount.toLocaleString()}원
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="직접 입력 (원)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('');
                    }}
                  />
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">성함 *</Label>
                    <Input
                      id="name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">응원 메시지 (선택)</Label>
                    <Input
                      id="message"
                      value={donorInfo.message}
                      onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                      placeholder="학습자들에게 전달할 메시지를 남겨주세요"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                  <Heart className="w-5 h-5 mr-2" />
                  {(amount || customAmount) ? `${(amount || customAmount).toLocaleString()}원 기부하기` : '기부하기'}
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                ※ 제출된 정보는 문의 응대 목적에 한하여 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Trust Information */}
        <section className="text-center bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-bold mb-4">안전한 기부</h3>
          <p className="text-gray-600 mb-4">
            모든 기부금은 투명하게 관리되며, 정기적으로 사용 내역을 공개합니다.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>• SSL 암호화</span>
            <span>• 개인정보 보호</span>
            <span>• 투명한 회계</span>
          </div>
        </section>
      </main>
    </div>
  );
}

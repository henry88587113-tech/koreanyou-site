
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Building2, ShieldCheck, Handshake, ArrowRight, BookOpen, DollarSign } from 'lucide-react';

const orgLinks = [
  { title: "조직", description: "운영진, 강사진, 조력자 공개", link: "AboutOrganization", icon: Building2, color: "blue" },
  { title: "법인등록·인증", description: "공식 등록 단체로 검증", link: "AboutLegal", icon: ShieldCheck, color: "green" },
  { title: "재정 투명성", description: "공식 자료 기반 수입·지출 내역 공개", link: "AboutLegal", icon: DollarSign, color: "purple" }
];

const newCoreValues = [
    { emoji: "📖", title: "언어로 여는 기회", color: "#DDEBFF" },
    { emoji: "🤖", title: "AI 기반 혁신", color: "#E9E0FF" },
    { emoji: "🔍", title: "투명성과 신뢰", color: "#E0FFF2" },
    { emoji: "🌍", title: "글로벌 연대", color: "#FFE9D6" },
];

const missionPoints = [
    "무료 한국어 및 AI 학습 제공",
    "어려운 환경 속 청년 유학·취업 지원",
    "디지털 교육 도구와 메타버스 활용",
    "미래 직업교육(뷰티·테크·언어)으로 확장"
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <header className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">코리언클릭 국제교육원</h1>
          <div className="mt-8 max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed">
            <p>
              비영리 국제교육 단체 코리언클릭은 AI와 언어 교육을 결합하여 전 세계 청년들의 한국어 학습, 유학, 취업, 국제교류를 지원합니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* CEO Message */}
        <section className="rounded-lg p-8 md:p-12" style={{backgroundColor: '#EAF4FF'}}>
          <h2 className="text-3xl font-bold text-center mb-12">💬 대표자 메시지</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <img
              src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/KakaoTalk_20250910_010620587_01.jpg"
              alt="대표 이미지"
              className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white" />

            <div className="text-center md:text-left">
              <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                <p className="">안녕하세요, 코리언클릭 국제교육원을 운영하는 강성헌입니다.</p>
                <p>우리는 언어와 교육을 통해 더 많은 배움의 기회를 제공할 수 있습니다.</p>
                <p>더 많은 청년들이 한국어와 미래 교육을 통해 새로운 삶과 사회적 성장을 이룰 수 있도록 보장하고 함께 동행하겠습니다.</p>
              </div>
              <p className="font-bold text-gray-900 mt-6">강성헌 대표</p>
              <p className="text-sm text-gray-500">코리언클릭 국제교육원</p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Vision */}
            <div className="bg-white rounded-lg p-8 shadow-lg h-full">
                <h2 className="text-3xl font-bold text-center mb-8">🌐 비전 (Vision)</h2>
                <Card className="border-blue-500 border-2">
                    <CardContent className="p-6">
                    <ul className="space-y-3 text-md text-gray-700">
                        <li className="flex items-start font-bold text-blue-700 text-lg">✅ "언어와 교육을 통해 기회의 문을 연다"</li>
                        <li className="flex items-start">✅ 전 세계 어디서든 가능한 교육</li>
                        <li className="flex items-start">✅ AI 기반 맞춤 학습 및 유학·취업 지원</li>
                        <li className="flex items-start">✅ 글로벌 연대와 미래 직업 역량 강화</li>
                    </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-lg p-8 shadow-lg h-full">
                <h2 className="text-3xl font-bold text-center mb-8">🎯 미션 (Mission)</h2>
                <Card className="border-green-500 border-2">
                    <CardContent className="p-6">
                    <ul className="space-y-4 text-md text-gray-700">
                        {missionPoints.map((point, i) => (
                        <li key={i} className="flex items-start">
                            ✅ {point}
                        </li>
                        ))}
                    </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
          
        {/* Core Values */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">핵심 가치 (Core Values)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newCoreValues.map((value) => {
                return (
                    <Card key={value.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-8">
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                          style={{ backgroundColor: value.color }}
                        >
                            <span className="text-4xl">{value.emoji}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                        </CardContent>
                    </Card>
                );
            })}
          </div>
        </section>

        {/* Trust & Transparency */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">투명성과 신뢰성 (Trust & Transparency)</h2>
          <p className="text-center text-gray-600 mb-12">운영과 재정을 투명하게 공개합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {orgLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link to={createPageUrl(item.link)} key={item.title} className="group block">
                  <Card className={`h-full border-t-4 border-${item.color}-500 hover:shadow-xl transition-shadow duration-300`}>
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-10 h-10 mx-auto mb-4 text-${item.color}-600`} />
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4 h-12">{item.description}</p>
                      <div className="text-blue-600 font-semibold group-hover:underline flex items-center justify-center">
                        자세히 보기 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>);
            })}
          </div>
        </section>
        
        {/* CTA */}
        <section 
          className="text-center rounded-lg p-12"
          style={{ background: 'linear-gradient(to right, #FDFBFB, #EBEDEE)' }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">지금, 함께하는 순간 배움의 기회가 열립니다.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Programs")}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold">
                <BookOpen className="w-5 h-5 mr-2" />
                교육 프로그램 보기
              </Button>
            </Link>
            <Link to={createPageUrl("Donate")}>
               <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                후원하기
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>);
}

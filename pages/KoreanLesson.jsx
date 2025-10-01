
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PenTool, Book, GraduationCap, ArrowRight, MessageSquare, Clock, Video, Users, FileText, Award, DollarSign, Shield, CheckSquare, Mail, UserCheck, Presentation } from 'lucide-react';

const levels = [
  { title: "Beginner (초급)", description: "한글 읽기/쓰기, 기본 회화, 기초 문법", icon: PenTool, color: "blue" },
  { title: "Intermediate (중급)", description: "문장 확장, 주제별 회화, 실전 문법", icon: Book, color: "green" },
  { title: "Advanced (고급)", description: "뉴스/에세이 토론, 고급 어휘/작문", icon: GraduationCap, color: "purple" },
];

const operatingInfo = [
    { icon: Clock, label: "시간/빈도", text: "주1회 회당 90분(한국시간기준)" },
    { icon: Users, label: "정원", text: "반별 20명 내외(선착순)" },
    { icon: Award, label: "평가출석", text: "간단퀴즈,과제+출석 70% 이상 시 수료" },
    { icon: Video, label: "플랫폼", text: "Zoom (링크는 승인된 신청자에게만 이메일로 제공)" },
    { icon: FileText, label: "커리큘럼", text: "AI 한국어 게임(문장/시제) → ZEP 메타 수업 → Zoom 복습" },
    { icon: DollarSign, label: "비용", text: "전 과정 무료(비영리 교육 프로그램)" },
];

const applicationSteps = [
    { icon: CheckSquare, title: "레벨 테스트 (3–5분)", description: "나에게 맞는 권장 반을 자동으로 안내받습니다." },
    { icon: FileText, title: "수업 신청서 작성", description: "이름, 국가, 연락처, 희망 시간을 제출합니다." },
    { icon: Mail, title: "승인·배정 안내", description: "심사 후 이메일로 Zoom 링크를 발송해 드립니다." },
    { icon: UserCheck, title: "오리엔테이션 참여", description: "출석, 과제 안내 후 정규 수업을 시작합니다." },
];

const policyInfo = [
    { title: "녹화/배포 금지", description: "수업은 원칙적으로 녹화하지 않으며, 홍보용 캡처는 사전 동의 시에만 사용합니다." },
    { title: "개인정보 처리", description: "신청 시 수집한 정보는 수업 운영과 연락 외의 목적으로 사용하지 않습니다. (보관 1년 후 파기)" },
    { title: "안전/신고", description: "온라인 상의 차별·혐오 발언은 금지되며, 위반 시 수업 참여가 제한될 수 있습니다." },
    { title: "접근성", description: "청각/시각 지원이 필요한 경우 신청서에 기재해 주세요. 가능한 범위 내 조정합니다." },
];

const faqItems = [
  {
    question: "정말 전액 무료인가요?",
    answer: "네. 코리언클릭 국제교육원에서 비영리 목적으로 운영하는 무료 수업입니다."
  },
  {
    question: "한국어 실력이 아주 초급이어도 되나요?",
    answer: "네. AI 레벨 테스트 결과에 따라 초급·중급·고급 수준에 맞는 반으로 배정해 드립니다."
  },
  {
    question: "출석 요건이 있나요?",
    answer: "네. 전체 수업의 70% 이상 출석 시 수료증이 발급됩니다."
  },
  {
    question: "수업 영상은 녹화되나요?",
    answer: "아니요. 학습자 보호를 위해 수업은 녹화하지 않습니다. 홍보용 사진/영상은 별도 동의자에 한해 익명 처리 후 사용합니다."
  }
];

export default function KoreanLessonPage() {
  React.useEffect(() => {
    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(faqStructuredData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <header className="relative pt-32 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Zoom 한국어 실시간 수업</h1>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            코리언클릭 국제교육원이 비영리 목적으로 제공하는 무료 한국어 수업입니다. 초급·중급·고급 레벨별 실시간 수업과 AI·메타버스 연계 학습을 제공합니다.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Representative Image */}
        <section>
          <figure role="group" aria-label="Zoom 한국어 강좌 대표 이미지" className="text-center">
            <img 
              src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/923%202025-09-22%20222106.png" 
              alt="Zoom으로 진행되는 무료 한국어 수업 안내 이미지" 
              className="max-w-full rounded-lg mx-auto shadow-lg"
            />
            <figcaption className="text-gray-600 text-sm mt-2">
              AI·메타버스 기반 무료 한국어 수업(Zoom 실시간)
            </figcaption>
          </figure>
        </section>

        {/* Levels Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">레벨별 수업</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => {
              const Icon = level.icon;
              return (
                <Card key={level.title} className={`border-t-4 border-${level.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 bg-${level.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${level.color}-600`} />
                      </div>
                      <CardTitle>{level.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{level.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">* 수업은 무료이며, 정원 제한·출석 기준이 적용됩니다.</p>
        </section>

        {/* 수업 운영 방식 Section */}
        <section className="bg-gray-50 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">수업 운영 방식</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {operatingInfo.map(item => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} className="flex items-start gap-4">
                            <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-gray-800">{item.label}</h3>
                                <p className="text-gray-600">{item.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 신청 절차 Section */}
        <section>
            <h2 className="text-3xl font-bold text-center mb-12">신청 절차</h2>
            <div className="max-w-2xl mx-auto space-y-8">
                {applicationSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.title} className="flex items-center gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl">{index + 1}</div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("KoreanLevelTest")}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">레벨 테스트로 이동</Button>
                </Link>
                <Link to={createPageUrl("Programs")}>
                    <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">무료 수업 신청하기</Button>
                </Link>
            </div>
        </section>

        {/* Testimonials Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">수강 후기</h2>
          <Card className="max-w-3xl mx-auto bg-slate-50 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <blockquote className="text-lg italic text-gray-700 mb-4">
                    "체계적인 커리큘럼과 선생님의 열정적인 강의 덕분에 한국어 실력이 정말 많이 늘었어요. 온라인이지만 실제 수업처럼 생생해서 좋았습니다."
                  </blockquote>
                  <p className="font-semibold text-right">- Jhon D. (미국)</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-right">*학습자 동의를 받아 게시했습니다.</p>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">자주 묻는 질문</h2>
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
        
        {/* 학습자 보호 Section */}
        <section className="bg-gray-50 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3"><Shield className="w-8 h-8"/>학습자 보호 및 개인정보 안내</h2>
            <div className="max-w-3xl mx-auto space-y-6">
                {policyInfo.map(item => (
                    <div key={item.title}>
                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
            <Card className="bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden shadow-lg">
                <CardContent className="p-10">
                    <h2 className="text-3xl font-bold mb-4">한국어를 배우고 싶다면 지금 무료로 신청하세요!</h2>
                    <Link to={createPageUrl("Programs")}>
                        <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg px-10 py-6">
                            무료 수업 신청하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </section>
      </main>
    </div>
  );
}

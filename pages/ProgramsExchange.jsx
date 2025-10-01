
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Palette, Users, ArrowRight, FileText, Mail, ShieldCheck, CheckSquare, Handshake } from 'lucide-react';

const activities = [
  {
    title: "언어 파트너",
    description: "외국인 학습자와 1:1 대화 연습",
    icon: MessageCircle,
    color: "green"
  },
  {
    title: "문화 교류",
    description: "전통·현대 문화 공유 세션",
    icon: Palette,
    color: "teal"
  },
  {
    title: "온라인 이벤트",
    description: "정기적인 글로벌 온라인 모임",
    icon: Users,
    color: "sky"
  },
];

const applicationSteps = [
  {
    icon: FileText,
    text: "온라인 신청서 제출 (기본정보/수준/가능시간)",
  },
  {
    icon: Mail,
    text: "확인 메일 발송 (48시간 이내)",
  },
  {
    icon: CheckSquare,
    text: "선발 안내 및 오리엔테이션 공지",
  },
  {
    icon: ShieldCheck,
    text: "참여 서약서·개인정보/사진(영상) 동의 후 참여 확정",
  },
];

const faqItems = [
  {
    question: "정말 전액 무료인가요?",
    answer: "네. 비영리 목적의 무료 프로그램입니다."
  },
  {
    question: "한국어 실력이 아주 초급이어도 되나요?",
    answer: "네. 초·중·고급 레벨 반이 있어 수준에 맞춰 배정됩니다."
  },
  {
    question: "출석 요건이 있나요?",
    answer: "회차의 70% 이상 참여 시 수료입니다."
  },
  {
    question: "사진/영상은 반드시 동의해야 하나요?",
    answer: "아니요. 동의하지 않아도 참여 가능합니다.(익명 처리 기본)"
  }
];

export default function ProgramsExchangePage() {
  // Removed useState and useEffect for partners as the data is now hardcoded.
  
  const handleScrollToApply = (e) => {
    e.preventDefault();
    document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add JSON-LD structured data for FAQ
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

    // Cleanup function to remove the script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <header className="relative pt-24 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">글로벌 문화교류 영어캠프</h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto">
            전 세계 학생들이 AI플랫폼을 통해 함께 배우고 성장하는 글로벌 영어캠프입니다. ZOOM·ZEP을 활용한 실시간 수업으로 영어회화와 문화이해 능력을 향상시켜요.
          </p>
          <div className="mt-6 text-indigo-200 font-semibold text-lg space-y-1">
            <p>✅ 대상: 만 15~24세</p>
            <p>✅ 방식: 온라인 실시간 (ZOOM+ZEP)</p>
            <p>✅ 참가비: 무료</p>
          </div>
          <div className="mt-8">
            <Button size="lg" onClick={handleScrollToApply} className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-10 py-6">
              무료로 신청하기
            </Button>
          </div>
           <p className="mt-4 text-sm text-indigo-200">
            ※ 신청 시 개인정보는 내부 교육 목적 외에 사용되지 않습니다.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Purpose and Target Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">목적과 대상</h2>
          <Card className="border-green-200 border-2 bg-green-50/50">
            <CardContent className="p-8">
              <ul className="space-y-4 text-gray-700 text-lg">
                <li><b className="text-gray-900">목적:</b> 말하기 중심의 한국어 실전 연습과 글로벌 협업 경험 제공</li>
                <li><b className="text-gray-900">대상:</b> 한국어 학습을 시작했거나(초·중급) 말하기를 강화하고 싶은 15–29세 청년</li>
                <li><b className="text-gray-900">우선선발:</b> 저소득/취약계층, 교육 접근성이 낮은 지역 거주자, 비영리단체 추천자</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Operating Information Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">운영 정보</h2>
          <Card className="border-blue-200 border-2 bg-blue-50/50 mb-8">
            <CardContent className="p-8">
              <ul className="space-y-4 text-gray-700 text-lg">
                <li><b className="text-gray-900">기간:</b> 4주(주 1~2회, 회차당 60~90분)</li>
                <li><b className="text-gray-900">형태:</b> 온라인(ZOOM 실시간 + ZEP 메타버스 실습)</li>
                <li><b className="text-gray-900">참가비:</b> 전액 무료(비영리 목적)</li>
                <li><b className="text-gray-900">언어:</b> 한국어(필요 시 영어 보조)</li>
                <li><b className="text-gray-900">선발 기준:</b> 참여 의지, 출석 가능 시간, 팀 협업 태도</li>
              </ul>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-bold mb-6">샘플 주간 일정</h3>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">회차</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>활동</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">1주차</TableCell>
                  <TableCell>오리엔테이션 & 파트너 매칭</TableCell>
                  <TableCell>자기소개·기초 회화, 아이스브레이킹</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2주차</TableCell>
                  <TableCell>AI 문장 만들기 & 말하기 퀴즈</TableCell>
                  <TableCell>시제·어휘 게임, 팀 대화 미션</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">3주차</TableCell>
                  <TableCell>메타버스 문화 체험</TableCell>
                  <TableCell>ZEP 한국어 타운 미션 수행</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">4주차</TableCell>
                  <TableCell>국제교류 최종 발표</TableCell>
                  <TableCell>팀별 미니 발표 & 피드백</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Activities Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">교류 활동</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card key={activity.title} className={`border-t-4 border-${activity.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 bg-${activity.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${activity.color}-600`} />
                      </div>
                      <CardTitle>{activity.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{activity.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Performance Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">성과</h2>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                <div>
                  <div className="text-3xl font-bold text-green-600">1,200명+</div>
                  <div className="text-gray-700 mt-1">누적 참가자</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-gray-700 mt-1">프로그램 수료율</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600">15개국</div>
                  <div className="text-gray-700 mt-1">참여국</div>
                </div>
              </div>
              <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-700 text-center">
                "파트너와 매주 한국어로 발표하면서 자신감이 정말 올랐어요."
                <footer className="text-sm text-gray-500 mt-2">— 미얀마, 초급</footer>
              </blockquote>
            </CardContent>
          </Card>
          <p className="text-xs text-gray-500 text-center mt-2">
            * 통계 출처: 2021~2024년 참가자 만족도 설문 및 내부 데이터 기준
          </p>
        </section>

        {/* Image Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">문화 교류의 현장</h2>
          <div className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
             <img
              src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/34545345.png"
              alt="Zoom을 통한 글로벌 문화교류 현장"
              loading="lazy"
              className="w-full h-auto object-cover"
              style={{pointerEvents: 'none'}} 
            />
          </div>
        </section>

        {/* Application Process Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">신청 절차</h2>
          <div className="space-y-8">
            {applicationSteps.map((step, index) => {
              return (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-2xl">
                    {index + 1}
                  </div>
                  <div className="pt-2">
                    <p className="text-lg text-gray-800 font-medium">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Partner Organizations Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">협력 파트너 (MOU)</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            아래 기관과 정식 MOU를 체결하고 국제교류·한국어 프로그램을 공동 운영합니다.
          </p>

          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 list-none p-0 m-0 mou-partners">
            {[
              { name: "대구과학대학교", meta: "MOU: 2024-11", logo: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-24%20000651.png", link: "#" },
              { name: "고려직업전문학교", meta: "MOU: 2024-12", logo: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-24%20000741.png", link: "#" },
              { name: "분당판교청소년수련관", meta: "협력", logo: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/9242025-09-24%20002456.png", link: "#" },
              { name: "With The World", meta: "협력", logo: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-24%20001920.png", link: "#" }, 
              { name: "한국천사운동중앙회", meta: "협력", logo: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-23%20234950.png", link: "#" },
              { name: "한국장애인문화협회(하남)", meta: "협력", logo: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-23%20235213.png", link: "#" },
            ].map(partner => (
              <li key={partner.name}>
                <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-4 min-h-[140px] text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default">
                  <img src={partner.logo} alt={`${partner.name} 로고`} loading="lazy" className="max-w-[150px] max-h-[46px] object-contain" style={{pointerEvents: 'none'}} />
                  <span className="mt-2.5 text-sm font-semibold text-gray-800">{partner.name}</span>
                  <span className="mt-0.5 text-xs text-gray-500">{partner.meta}</span>
                </div>
              </li>
            ))}
          </ul>
           <p className="mt-3 text-xs text-gray-500 text-center">
            * 로고·명칭은 각 기관의 가이드에 따르며, 원문 공문·보도자료 링크로 검증 가능합니다.
          </p>
        </section>

        {/* Supporters Section */}
        <section className="max-w-5xl mx-auto mt-16 text-center bg-gray-50 py-12 px-4 rounded-xl">
          <h2 className="text-3xl font-bold mb-3">지원 프로그램 및 디지털 혜택</h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            코리언클릭 국제교육원은 Google for Nonprofits, AWS, TechSoup, Microsoft Philanthropies 등 글로벌 비영리 지원 프로그램의 혜택을 받아 AI·클라우드·보안·광고 기술을 활용한 무료 학습 환경을 제공합니다.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/Google_for_Nonprofits_logo.svg" alt="Google for Nonprofits" loading="lazy" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300" style={{pointerEvents: 'none'}} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" loading="lazy" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300" style={{pointerEvents: 'none'}} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Microsoft_logo_%282012%29.svg" alt="Microsoft" loading="lazy" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300" style={{pointerEvents: 'none'}} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/TechSoup_Global_Logo.png" alt="TechSoup" loading="lazy" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300" style={{pointerEvents: 'none'}} />
          </div>
          <p className="text-xs text-gray-500 mt-6">
            * 표기된 로고와 상표는 각 소유자의 자산이며, 본 안내는 비영리 프로그램 수혜 사실을 알리기 위한 목적입니다.
          </p>
        </section>

        {/* Safety and Protection Section */}
        <section className="max-w-4xl mx-auto">
          <Card className="border-gray-200 bg-gray-50/80">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                안전과 보호
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <b className="text-gray-900">미성년자 보호:</b> 모든 실시간 수업은 인증된 운영진이 동시 참여합니다.
                </li>
                <li>
                  <b className="text-gray-900">개인정보:</b> 신청 정보는 교육 운영 목적으로만 사용되며, 캠프 종료 후 안전하게 파기합니다.
                </li>
                <li>
                  <b className="text-gray-900">사진·영상 동의:</b> 홍보용 사진/영상은 별도 동의자에 한해 익명 처리하여 사용합니다.
                </li>
                <li>
                  <b className="text-gray-900">행동강령:</b> 혐오/차별/괴롭힘은 금지되며, 위반 시 즉시 퇴실 조치됩니다.
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                자세한 내용은 '신뢰와 투명성' 페이지의{' '}
                <Link to={createPageUrl("AboutLegal")} className="text-blue-600 hover:underline">
                  운영정책
                </Link>
                을 확인하세요.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm mt-4">
                <li>모든 개인정보는 <a href="/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">개인정보처리방침</a>에 따라 관리되며, 목적 달성 후 즉시 파기됩니다.</li>
                <li>취소·변경 시 이메일/SMS로 안내되며, 교육비는 없습니다.</li>
                <li>만 14세 미만은 보호자(법정대리인) 동의가 필요합니다.</li>
              </ul>
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

        {/* CTA Section */}
        <section id="apply-section" className="text-center">
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden shadow-lg">
                <CardContent className="p-10">
                    <h2 className="text-3xl font-bold mb-4">글로벌 친구들과 교류를 시작해보세요!</h2>
                    <Link to={createPageUrl("Participate")}>
                        <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg px-10 py-6">
                            무료로 신청하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </section>

        {/* Donation and Partnership Inquiry Section */}
        <section className="max-w-4xl mx-auto mt-16">
            <Card className="border-teal-200 bg-teal-50/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
                        <Handshake className="w-6 h-6 text-teal-700" />
                        후원 및 협력 문의
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-700 mb-4">비영리 교육 프로젝트에 후원·협력하실 분은 아래로 문의해주세요.</p>
                    <div className="space-y-2 text-gray-800 font-medium">
                        <p>📧 이메일: <a href="mailto:koreanyou@koreanyou.net" className="text-blue-600 hover:underline">koreanyou@koreanyou.net</a></p>
                        <p>📞 전화: <a href="tel:+821033378858" className="text-blue-600 hover:underline">+82-10-3337-8858</a></p>
                    </div>
                    <p className="text-xs text-gray-500 mt-6">* 본 기관은 Google for Nonprofits 공식 인증 비영리단체입니다.</p>
                </CardContent>
            </Card>
        </section>

        {/* Project Notice */}
        <div className="text-center text-sm text-gray-600 space-y-2 mt-8">
          <p>🧠 본 프로젝트는 Google for Nonprofits, AWS, Microsoft Philanthropies, TechSoup 지원을 통해 운영됩니다.</p>
          <p>💡 이 페이지는 비영리 목적의 교육 프로그램 홍보용으로 제작되었습니다.</p>
          <p>🔒 모든 참가자의 개인정보는 보호됩니다.</p>
        </div>
      </main>
    </div>
  );
}

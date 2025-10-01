
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Users, UserCheck, Heart, Globe, BookOpen, FileText } from 'lucide-react';

const roles = [
  { 
    title: "운영위원회(자문위원)", 
    description: "단체의 방향성 자문, 투명한 운영 관리", 
    icon: UserCheck, 
    color: "green" 
  },
  { 
    title: "운영진 (Volunteer Operators)", 
    description: "프로그램 기획·운영, 플랫폼 관리 및 메타버스 시스템 운영", 
    icon: Users, 
    color: "blue" 
  },
  { 
    title: "자원봉사자 (Volunteers)", 
    description: "행사·교육 지원, 국제교류 활동 보조", 
    icon: Heart, 
    color: "purple" 
  },
  { 
    title: "글로벌 파트너 (Global Partners)", 
    description: "국제 협력 및 교육 네트워크 확장", 
    icon: Globe, 
    color: "orange" 
  },
];

export default function AboutOrganizationPage() {
  // handleReportClick and handleRegulationClick are removed as they are no longer needed
  // The regulation link is now a direct <a> tag, and the report link is removed.

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("About")}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> 소개 페이지로 돌아가기
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">조직 운영 구조</h1>
          <p className="mt-4 text-xl text-gray-600">
            KoreanClick은 전 세계 청년들을 지원하기 위해 전원이 자원봉사로 참여하며, 운영은 철저한 투명성과 책임성을 기반으로 이루어집니다. 모든 후원금은 100% 교육 프로그램과 국제교류 활동에만 사용됩니다.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Organization Image */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <img 
              src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/KakaoTalk_20241026_154404166_02.jpg"
              alt="조직 이미지"
              className="w-full h-auto object-cover rounded-md mb-6"
            />
            <p className="text-lg text-gray-700">
              전문성과 열정을 바탕으로 한 체계적인 조직 운영을 통해 최고의 교육 서비스를 제공합니다.
            </p>
          </div>
        </section>

        {/* Roles Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">주요 역할과 운영 원칙</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              KoreanClick International의 모든 활동은 자원봉사 기반으로 운영되며, 운영위원회, 운영진, 자원봉사자, 글로벌 파트너가 각자의 책임 아래 투명하게 역할을 수행합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map(role => {
              const Icon = role.icon;
              return (
                <Card key={role.title} className={`border-t-4 border-${role.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col`}>
                  <CardHeader>
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 bg-${role.color}-100 rounded-lg mb-4`}>
                         <Icon className={`w-8 h-8 text-${role.color}-600`} />
                      </div>
                      <CardTitle className="text-lg font-bold">{role.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center flex-grow">
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Organization Report Section */}
        <section className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">조직 운영 투명성</h2>
          <p className="text-lg text-gray-600 mb-6">
            운영위원회 및 운영진은 정관과 내부 규정에 따라 투명하게 운영됩니다. 모든 후원금은 교육 프로그램 및 국제교류 활동에만 사용됩니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500"
              title="추후 공개 예정"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M7 7h10M7 12h10M7 17h6" />
              </svg>
              <span>조직 운영 보고서 (추후 공개 예정)</span>
            </button>
            <a
              href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d53e9bb842964c517b179e/d28dac810_.pdf"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="조직 운영 규정(PDF 보기)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M7 7h10M7 12h10M7 17h6" />
              </svg>
              <span>조직 운영 규정(PDF 보기)</span>
            </a>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white p-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">우리의 교육 프로그램을 확인해보세요</h2>
          <Link to={createPageUrl("Programs")}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="w-5 h-5 mr-2" /> 프로그램 보러가기
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

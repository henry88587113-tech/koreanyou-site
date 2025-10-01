import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, BookOpen, ChevronRight, Mail } from 'lucide-react';

const actions = [
  {
    title: "교육 신청",
    description: "무료 수업으로 새로운 배움을 시작하세요.",
    link: "KoreanLesson",
    icon: BookOpen,
    color: "blue"
  },
  {
    title: "후원하기",
    description: "청년들의 유학·취업 기회를 후원으로 지원해주세요.",
    link: "Donate",
    icon: Heart,
    color: "red"
  },
  {
    title: "자원봉사 참여",
    description: "튜터·번역·운영 등 다양한 봉사로 함께하세요.",
    link: "Volunteer",
    icon: Users,
    color: "green"
  }
];

const ActionCard = ({ action }) => {
  const Icon = action.icon;
  return (
    <Link to={createPageUrl(action.link)} className="group block">
      <Card className={`h-full border-t-4 border-${action.color}-500 hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={`text-xl font-bold text-gray-800`}>{action.title}</CardTitle>
          <div className={`p-2 bg-${action.color}-100 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${action.color}-600`} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{action.description}</p>
          <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:underline">
            자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function ParticipatePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">함께 만드는 더 큰 미래</h1>
          <p className="mt-4 text-xl text-gray-600">여러분의 참여가 세상을 바꾸는 큰 힘이 됩니다.</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Participation Methods */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">참여 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actions.map((action) => (
              <ActionCard key={action.title} action={action} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="text-center bg-white rounded-lg p-8 shadow-md">
          <div className="flex justify-center mb-4">
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">뉴스레터 구독</h2>
          <p className="text-gray-600 mb-6">
            KoreanClick의 최신 소식과 성과를 이메일로 받아보세요
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="이메일 주소를 입력하세요"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Link to={createPageUrl("ThankYou")}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                구독하기
              </button>
            </Link>
          </div>
        </section>

        {/* Partner Registration CTA */}
        <section className="text-center bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">파트너 기관이 되어주세요</h2>
          <p className="text-green-100 mb-6">
            교육, 기술, 재정 협력으로 더 큰 임팩트를 만들어가요
          </p>
          <Link to={createPageUrl("PartnerApply")}>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors">
              파트너 등록 신청
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, FileStack, MessagesSquare, ChevronRight } from 'lucide-react';

const guides = [
  {
    title: "TOPIK/EPS 시험",
    description: "준비 가이드와 팁",
    link: "StudyTopik",
    icon: ClipboardCheck,
    color: "blue"
  },
  {
    title: "비자·서류",
    description: "절차 및 서식 안내",
    link: "StudyVisa",
    icon: FileStack,
    color: "green"
  },
  {
    title: "상담 신청",
    description: "1:1 상담 예약",
    link: "StudyCounsel",
    icon: MessagesSquare,
    color: "purple"
  }
];

const GuideCard = ({ guide }) => {
  const Icon = guide.icon;
  return (
    <Link to={createPageUrl(guide.link)} className="group block">
      <Card className={`h-full border-t-4 border-${guide.color}-500 hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={`text-xl font-bold text-gray-800`}>{guide.title}</CardTitle>
          <div className={`p-2 bg-${guide.color}-100 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${guide.color}-600`} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{guide.description}</p>
          <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:underline">
            자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function StudyAbroadPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">유학·진로 지원</h1>
          <p className="mt-4 text-xl text-gray-600">여러분의 성공적인 한국 유학과 진로 설정을 돕습니다.</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <GuideCard key={guide.title} guide={guide} />
          ))}
        </div>
      </main>
    </div>
  );
}
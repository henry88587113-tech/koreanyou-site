import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Globe, Heart, School } from 'lucide-react';

const educationalPartners = [
  {
    name: "대구과학대학교",
    description: "한국어·문화 교육 및 지역 청소년 연계 교육 협력",
    type: "MOU",
    date: "2024-11",
    icon: School,
  },
  {
    name: "고려직업전문학교",
    description: "국제학생 대상 한국어·진로 교육 협력",
    type: "MOU",
    date: "2024-12",
    icon: School,
  },
];

const youthFacilities = [
  {
    name: "분당판교청소년수련관",
    description: "청소년 국제교류 협력 및 지역 청소년 글로벌 역량 강화",
    type: "MOU",
    date: "2021-11",
    icon: Users,
  },
];

const internationalOrgs = [
  {
    name: "With The World Inc. (일본)",
    description: "국제교류 및 공동수업 운영을 통한 한일 청소년 교육 협력",
    type: "MOU",
    date: "2023-08",
    icon: Globe,
  },
];

const domesticNPOs = [
  {
    name: "한국천사운동중앙회",
    description: "취약계층 청소년 교육 및 생활 지원 협력",
    type: "MOU",
    date: "2023-01",
    icon: Heart,
  },
  {
    name: "한국장애인문화협회(하남지부)",
    description: "장애인 대상 문화예술 교육 및 접근성 개선 협력",
    type: "MOU",
    date: "2024-03",
    icon: Heart,
  },
];

const PartnerCard = ({ partner }) => {
  const Icon = partner.icon;
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-blue-600" />
          <CardTitle className="text-xl">{partner.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{partner.description}</p>
        <div className="flex gap-4 text-sm">
          <Badge variant="outline">협약형태: {partner.type}</Badge>
          <Badge variant="outline">체결일: {partner.date}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};


export default function PartnersMOUPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("About")}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> 소개 페이지로 돌아가기
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">기관 협약(MOU) 현황</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              KoreanClick International은 다양한 기관들과의 협약을 통해 청소년·국제교육·문화교류 프로젝트를 공동 운영하고 있습니다. 모든 협약(MOU)은 상호 비영리의 목적하에 체결되었으며, 협약서 사본은 요청 시 열람이 가능합니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="education" className="py-2.5">교육기관·대학</TabsTrigger>
            <TabsTrigger value="youth" className="py-2.5">지자체·청소년시설</TabsTrigger>
            <TabsTrigger value="international" className="py-2.5">국제교류단체</TabsTrigger>
            <TabsTrigger value="npo" className="py-2.5">국내 비영리단체</TabsTrigger>
          </TabsList>
          
          <TabsContent value="education" className="mt-8 space-y-6">
            {educationalPartners.map(partner => <PartnerCard key={partner.name} partner={partner} />)}
          </TabsContent>
          
          <TabsContent value="youth" className="mt-8 space-y-6">
            {youthFacilities.map(partner => <PartnerCard key={partner.name} partner={partner} />)}
          </TabsContent>

          <TabsContent value="international" className="mt-8 space-y-6">
            {internationalOrgs.map(partner => <PartnerCard key={partner.name} partner={partner} />)}
          </TabsContent>

          <TabsContent value="npo" className="mt-8 space-y-6">
            {domesticNPOs.map(partner => <PartnerCard key={partner.name} partner={partner} />)}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
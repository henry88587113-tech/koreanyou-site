import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, CheckCircle, Clock, Users, Building, Globe, Gamepad2, Heart, School } from 'lucide-react';

const npoPrograms = [
  {
    name: "🌐 비영리 단체를 위한 Google",
    status: "완료",
    statusColor: "bg-green-100 text-green-800",
    statusEmoji: "🟩",
    icon: CheckCircle,
    iconColor: "text-green-600",
    description: "비영리단체 공식 인증을 받아 Google Workspace, YouTube, Drive 등의 도구를 교육, 국제교류, 공익 홍보에 활용하고 있습니다. 또한 Google Ad Grants를 통해 한국어 교육 및 문화교류 프로젝트 홍보를 진행 중입니다."
  },
  {
    name: "🎨 비영리 단체를 위한 Canva",
    status: "완료",
    statusColor: "bg-green-100 text-green-800",
    statusEmoji: "🟩",
    icon: CheckCircle,
    iconColor: "text-green-600",
    description: "비영리단체로 공식 승인받아 Canva의 모든 디자인 기능을 무료로 사용하고 있습니다. 교육 교재 제작, 홍보물 디자인, 영상 콘텐츠 등 다양한 비영리 교육 활동에 활용하고 있습니다."
  },
  {
    name: "💻 비영리 단체를 위한 Microsoft",
    status: "검토 중",
    statusColor: "bg-yellow-100 text-yellow-800",
    statusEmoji: "🟨",
    icon: Clock,
    iconColor: "text-yellow-600",
    description: "비영리 전용 소프트웨어 지원 프로그램을 검토 중이며, 추후 교육·AI·협업 툴을 활용한 공동 프로젝트에 참여할 예정입니다."
  },
  {
    name: "☁️ ZEP 2.5D 기반 학습 공간",
    status: "활용 중",
    statusColor: "bg-blue-100 text-blue-800",
    statusEmoji: "🟦",
    icon: Gamepad2,
    iconColor: "text-blue-600",
    description: "ZEP 플랫폼을 활용하여 청소년 및 외국인 학습자를 위한 AI·한국어·진로·문화 체험형 메타버스 교육 프로그램을 운영하고 있습니다."
  }
];

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

export default function AboutPartnersPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">글로벌 역량 지원 프로그램</h1>
            <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
              KoreanClick International은 글로벌 기업의 비영리 지원 프로그램을 통해 교육·문화·AI 학습 및 메타버스 기반 학습 기회를 확대하고 있습니다.
            </p>
            <p className="mt-4 text-sm text-gray-500 bg-gray-100 rounded-md p-3 max-w-3xl mx-auto">
              ※ 각 기업의 로고 및 명칭은 비영리단체의 공인 프로그램 참여 및 도구 활용 현황을 표시하기 위한 것이며, 직접적인 후원이나 제휴 관계를 의미하지 않습니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Global Capacity Support Programs Section */}
        <section>
          <div className="space-y-8">
            {npoPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <Card key={program.name} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        {program.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{program.statusEmoji}</span>
                        <Badge className={program.statusColor}>승인 상태: {program.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* MOU Status Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">MOU 체결현황</h2>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              KoreanClick International은 다양한 기관들과의 협약을 통해 청소년·국제교육·문화교류 프로젝트를 공동 운영하고 있습니다.
            </p>
            <p className="mt-3 text-xs text-gray-500">
              모든 협약(MOU)은 상호 비영리 목적하에 체결되었으며, 협약서 사본은 요청 시 열람이 가능합니다.
            </p>
          </div>

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
        </section>

        {/* Call to Action */}
        <section className="bg-white rounded-lg p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold mb-3">함께 참여하고 싶으신가요?</h2>
          <p className="text-gray-600 mb-6">
            KoreanClick과 함께 교육·문화·AI·국제교류 분야의 비영리 프로젝트 협력을 제안해주세요.
            <br />
            공익 프로그램 제안이나 협약 문의는 아래 버튼을 통해 보내주세요.
          </p>
          <a href="mailto:koreanyou@koreanyou.net">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Mail className="w-4 h-4 mr-2" />
              문의하기
            </Button>
          </a>
          <p className="text-sm text-gray-600 mt-4">
            ※ 제출된 정보는 문의 응대 목적에 한하여 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.
          </p>
        </section>
      </main>
    </div>
  );
}
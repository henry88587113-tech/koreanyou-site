
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { News } from "@/api/entities";
import { Partner } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bot, Globe, Gamepad2, ArrowRight, Handshake, Brain } from "lucide-react";

const stats = [
  { value: "1,200명+", label: "참여자 (2022~2024 누적 참여자 기준)" },
  { value: "15개", label: "프로그램 (2022~2024 진행 프로그램 수)" },
  { value: "98%", label: "만족도 (참여자 만족도 설문 결과, 2023년)" },
  { value: "2,400+", label: "시간 (누적 수업/교육 운영 시간, 2022~2024)" }
];


const programCards = [
  {
    title: "한국어 수업",
    description: "레벨별 무료 수업",
    link: "KoreanLesson",
    icon: BookOpen,
    color: "blue"
  },
  {
    title: "AI 학습 도구",
    description: "발음 교정, 모의시험",
    link: "ProgramsAI",
    icon: Bot,
    color: "purple"
  },
  {
    title: "국제 교류",
    description: "문화·언어 교류",
    link: "ProgramsExchange",
    icon: Globe,
    color: "green"
  },
  {
    title: "메타버스 교육",
    description: "ZEP/3D 캠프",
    link: "ProgramsMetaverse",
    icon: Gamepad2,
    color: "orange"
  }
];


export default function Home() {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const newsData = await News.filter(
          { is_featured: true, is_published: true },
          '-created_date',
          3
        );
        setFeaturedNews(newsData);

        const partnerData = await Partner.filter({ visible: true }, 'priority', 5);
        setPartners(partnerData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  const handleSmoothNavigation = (url) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.location.href = url;
    }, 300); // 300ms delay for smooth scroll to complete before navigation
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 gradient-bg rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-snug text-center">
              기회가 부족한 전 세계 청년들에게<br />
              한국어와 미래 교육을 제공합니다
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed text-balance">
              KoreanClick International은 무료 한국어 교육, AI 학습 도구, 메타버스 프로그램을 통해 청년들의 유학·취업·국제 교류 기회를 지원합니다.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to={createPageUrl("KoreanLesson")}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <BookOpen className="w-5 h-5 mr-2" />
                  교육 신청
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link to={createPageUrl("Donate")}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Handshake className="w-5 h-5 mr-2" />
                  후원하기
                </Button>
              </Link>
            </div>

            {/* Level Test CTA */}
            <div className="mb-16">
              <button
                onClick={() => handleSmoothNavigation(createPageUrl("KoreanLevelTest"))}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Brain className="w-5 h-5 mr-2" />
                레벨 테스트로 이동
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">우리의 성과</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) =>
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              주요 프로그램
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              최신 기술과 감성적인 교육 방식을 결합한 4가지 핵심 프로그램을 통해 효과적인 한국어 학습을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programCards.map((program, index) => {
              const IconComponent = program.icon;
              const colorClass = `from-${program.color}-500 to-${program.color}-600`;

              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6 leading-relaxed h-12">
                      {program.description}
                    </p>
                    <Link to={createPageUrl(program.link)}>
                      <Button variant="ghost" className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:bg-blue-50">
                        자세히 보기
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>);

            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">파트너 기관</h2>
            <p className="mt-4 text-lg text-gray-600">
              파트너와 더 많은 학생들을 연결합니다.
            </p>
          </div>
          <div className="mt-10">
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12">
              {partners.map((partner) =>
                <a key={partner.id} href={partner.link_url} target="_blank" rel="noopener noreferrer" className="flex justify-center" title={partner.name}>
                  <img
                    className="max-h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    src={partner.logo_url}
                    alt={partner.name}
                    loading="lazy" />
                </a>
              )}
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-2">파트너 기관 모집 중입니다</p>
                <Link to={createPageUrl("PartnerApply")}>
                  <Button variant="outline">
                    <Handshake className="w-4 h-4 mr-2" />
                    문의하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);

}

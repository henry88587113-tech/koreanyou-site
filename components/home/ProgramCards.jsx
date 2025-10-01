import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Bot, Globe, Gamepad2, ArrowRight } from "lucide-react";

const programDetails = {
  korean: { title: "전문 한국어 수업", desc: "실시간 온라인 한국어 학습", icon: BookOpen, color: "blue", link: "KoreanLesson"},
  ai: { title: "AI 학습도구", desc: "발음 교정 · 문법 퀴즈", icon: Bot, color: "purple", link: "ProgramsAI"},
  exchange: { title: "글로벌 문화교류", desc: "세계 청년들과의 국제 프로젝트", icon: Globe, color: "green", link: "ProgramsExchange"},
  metaverse: { title: "메타버스 체험학습", desc: "가상공간에서 배우는 한국 문화", icon: Gamepad2, color: "orange", link: "ProgramsMetaverse"}
};


export default function ProgramCards({ programs }) {
    const programKeys = ["korean", "ai", "exchange", "metaverse"];
    
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            혁신적인 교육 프로그램
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            최신 기술과 감성적인 교육 방식을 결합한 4가지 핵심 프로그램을 통해 경쟁력 있는 한국어 학습을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programKeys.map((key) => {
            const program = programDetails[key];
            const IconComponent = program.icon;
            const colorClass = `from-${program.color}-500 to-${program.color}-600`;
            
            return (
              <Card key={key} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
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
                    {program.desc}
                  </p>
                  <Link to={createPageUrl(program.link)}>
                    <Button variant="ghost" className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:bg-blue-50">
                      자세히 보기
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
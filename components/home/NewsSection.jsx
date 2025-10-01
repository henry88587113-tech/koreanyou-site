
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function NewsSection({ news = [] }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              최신 소식
            </h2>
            <p className="text-xl text-gray-600">
              KoreanBridge의 새로운 소식과 업데이트를 확인하세요
            </p>
          </div>
          <Link to={createPageUrl("News")}>
            <Button variant="outline" className="hidden md:flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {news.length > 0 ? news.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
              {item.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={item.image_url} 
                    alt={item.title_ko}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(item.created_date), 'yyyy년 MM월 dd일')}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title_ko}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {item.content_ko?.substring(0, 100)}...
                </p>
                <Link to={createPageUrl(`NewsDetail?id=${item.id}`)}>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0">
                    자세히 보기
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )) : (
            // Default news items
            <>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">KoreanBridge News</span>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(), 'yyyy년 MM월 dd일')}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    새로운 AI 학습도구 출시
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    개인 맞춤형 학습을 위한 혁신적인 AI 기술이 적용된 새로운 학습도구를 출시했습니다...
                  </p>
                  <Link to={createPageUrl("News")}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-0">
                      자세히 보기
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">KoreanBridge News</span>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(Date.now() - 86400000), 'yyyy년 MM월 dd일')}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    글로벌 한국어 경연대회 개최
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    전 세계 한국어 학습자들이 참여하는 대규모 온라인 경연대회를 개최합니다...
                  </p>
                  <Link to={createPageUrl("News")}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-0">
                      자세히 보기
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">KoreanBridge News</span>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(Date.now() - 172800000), 'yyyy년 MM월 dd일')}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    메타버스 문화체험관 오픈
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    가상현실 기술을 활용한 한국 전통문화 체험관이 정식으로 오픈했습니다...
                  </p>
                  <Link to={createPageUrl("News")}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-0">
                      자세히 보기
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="md:hidden text-center">
          <Link to={createPageUrl("News")}>
            <Button variant="outline" className="items-center gap-2">
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

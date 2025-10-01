
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, BrainCircuit, FileText, ArrowRight, Brain } from 'lucide-react';

const features = [
  {
    title: "발음 교정",
    description: "AI 음성 인식으로 정확한 발음을 안내",
    icon: Mic,
    color: "blue"
  },
  {
    title: "맞춤 피드백",
    description: "개인 학습 진도에 따른 AI 피드백",
    icon: BrainCircuit,
    color: "purple"
  },
  {
    title: "PDF 리포트",
    description: "시험 대비 리포트 자동 생성",
    icon: FileText,
    color: "green"
  },
];

export default function ProgramsAIPage() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <header className="relative pt-32 pb-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI 기반 학습 지원</h1>
          <p className="mt-4 text-xl text-purple-100 max-w-3xl mx-auto">
            AI 음성 인식, 발음 교정, 맞춤 학습 리포트까지 제공합니다.
          </p>
          
          {/* Level Test CTA */}
          <div className="mt-8">
            <Link to={createPageUrl("KoreanLevelTest")}>
              <Button size="lg" variant="secondary" className="bg-white text-purple-700 hover:bg-purple-50 font-bold">
                <Brain className="w-5 h-5 mr-2" />
                레벨 테스트로 이동
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className={`border-t-4 border-${feature.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 bg-${feature.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Interactive Games Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">인터랙티브 게임</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            정식 게임랜드는 준비 중입니다. 현재는 AI 체험 페이지에서 샘플 게임을 먼저 즐겨보세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Game Card 1 */}
            <Card className="relative opacity-75">
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">곧 공개</Badge>
              </div>
              <CardContent className="p-0">
                <img 
                  src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/927%202025-09-27%20205033.png" 
                  alt="속담 맞추기 게임" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">속담 맞추기</h3>
                  <p className="text-gray-600 text-sm">한국 속담의 뜻을 고르는 의미 추론 게임</p>
                </div>
              </CardContent>
            </Card>

            {/* Game Card 2 */}
            <Card className="relative opacity-75">
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">곧 공개</Badge>
              </div>
              <CardContent className="p-0">
                <img 
                  src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/927%202025-09-27%20205048.png" 
                  alt="한국 음식 맞추기 게임" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">한국 음식 맞추기</h3>
                  <p className="text-gray-600 text-sm">카드 뒤집기 방식의 기억력·어휘 매칭 게임</p>
                </div>
              </CardContent>
            </Card>

            {/* Game Card 3 */}
            <Card className="relative opacity-75">
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">곧 공개</Badge>
              </div>
              <CardContent className="p-0">
                <img 
                  src="https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/927%202025-09-27%20205105.png" 
                  alt="물건 찾기 게임" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">물건 찾기</h3>
                  <p className="text-gray-600 text-sm">그림–단어 매칭으로 기초 명사 어휘 강화</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link to={createPageUrl("AIGameDemo")}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                AI 체험하러 가기 <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Video Demo Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">AI 학습도구 시연 영상</h2>
          <div className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/vifjc6uF240"
                title="AI 학습도구 시연 영상"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden shadow-lg">
                <CardContent className="p-10">
                    <h2 className="text-3xl font-bold mb-4">AI와 함께 한국어 실력을 높여보세요!</h2>
                    <Link to={createPageUrl("AIGameDemo")}>
                        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg px-10 py-6">
                            AI 도구 체험하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </section>
      </main>
    </div>
  );
}

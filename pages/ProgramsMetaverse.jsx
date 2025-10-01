
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, Gamepad2, Camera, ArrowRight } from 'lucide-react';

const environments = [
  { 
    title: "가상 교실", 
    description: "실제 수업과 유사한 가상 학습 공간", 
    icon: School, 
    color: "orange" 
  },
  { 
    title: "체험형 학습", 
    description: "게임·퀘스트 기반 한국어 학습", 
    icon: Gamepad2, 
    color: "pink" 
  },
  { 
    title: "ZEP 캠프", 
    description: "청소년·외국인 대상 메타버스 한국어 캠프", 
    icon: Camera, 
    color: "indigo" 
  },
];

export default function ProgramsMetaversePage() {
  useEffect(() => {
    document.title = "메타버스에서 배우는 한국어 | 코리언클릭 v3";
  }, []);

  return (
    <div className="bg-white min-h-screen" key="metaverse-korean-v3-final-fix">
      {/* Hero Section */}
      <header className="relative pt-32 pb-16 bg-gradient-to-r from-orange-600 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">메타버스에서 배우는 한국어</h1>
          <p className="mt-4 text-xl text-orange-100 max-w-3xl mx-auto">
            실감형 가상 공간에서 한국어와 문화를 함께 경험하세요.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Learning Environments Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">학습 환경</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {environments.map((environment) => {
              const Icon = environment.icon;
              return (
                <Card key={environment.title} className={`border-t-4 border-${environment.color}-500 shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 bg-${environment.color}-100 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${environment.color}-600`} />
                      </div>
                      <CardTitle>{environment.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{environment.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Video Demo Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">메타버스 학습 영상</h2>
          <div className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/QHgN-OmzYQE"
                title="메타버스 학습 영상"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
            <Card className="bg-gradient-to-br from-orange-50 to-pink-50 overflow-hidden shadow-lg">
                <CardContent className="p-10">
                    <h2 className="text-3xl font-bold mb-4">가상현실 속에서 한국어를 배워보세요!</h2>
                    <a href="https://zep.us/play/yPmQjn" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg px-10 py-6">
                            메타버스 캠프 참여하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </section>
      </main>
    </div>
  );
}

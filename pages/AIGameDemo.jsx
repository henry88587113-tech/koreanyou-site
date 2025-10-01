
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIGameDemoPage() {
  useEffect(() => {
    const gameModal = document.getElementById('gameModal');
    const modalContent = document.getElementById('modalContent');
    const iframe = document.getElementById('gameFrame');

    if (!gameModal || !iframe || !modalContent) return;

    window.openModal = (url, orientation) => {
      // Set orientation styles
      if (orientation === 'landscape') {
        modalContent.style.maxWidth = '720px';
        iframe.style.aspectRatio = '16 / 9';
      } else {
        modalContent.style.maxWidth = '400px';
        iframe.style.aspectRatio = '9 / 16';
      }

      iframe.src = url;
      gameModal.style.display = 'flex'; // Use flex for alignment
      document.body.style.overflow = 'hidden';
    };

    window.closeModal = () => {
      gameModal.style.display = 'none';
      iframe.src = '';
      document.body.style.overflow = '';
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        window.closeModal();
      }
    };
    
    const handleOverlayClick = (event) => {
        if (event.target === gameModal) {
            window.closeModal();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    gameModal.addEventListener('click', handleOverlayClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      gameModal.removeEventListener('click', handleOverlayClick);
      delete window.openModal;
      delete window.closeModal;
    };
  }, []);

  const games = [
    {
      title: "속담 맞추기 (고급)",
      description: "한국 속담의 뜻을 고르는 의미 추론 게임",
      url: "https://www.canva.com/design/DAGyY8nN6zs/oQ0Cj9wTTHobscy82V-otw/view?embed",
      viewUrl: "https://www.canva.com/design/DAGyY8nN6zs/oQ0Cj9wTTHobscy82V-otw/view",
      image: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/927%202025-09-27%20205033.png",
      orientation: "portrait"
    },
    {
      title: "한국 음식 맞추기 (중급)",
      description: "카드 뒤집기 방식의 기억력·어휘 매칭 게임",
      url: "https://www.canva.com/design/DAGyYrNdQho/e1kHo3kZh-cICWNAtG36dA/view?embed",
      viewUrl: "https://www.canva.com/design/DAGyYrNdQho/e1kHo3kZh-cICWNAtG36dA/view",
      image: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/927%202025-09-27%20205048.png",
      orientation: "landscape"
    },
    {
      title: "물건 찾기 (초급)",
      description: "그림–단어 매칭으로 기초 명사 어휘 강화",
      url: "https://www.canva.com/design/DAGyd19dlQQ/P6IORxmB6--rnxXuUi8_1Q/view?embed",
      viewUrl: "https://www.canva.com/design/DAGyd19dlQQ/P6IORxmB6--rnxXuUi8_1Q/view",
      image: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/927%202025-09-27%20205105.png",
      orientation: "landscape"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AI 한국어 게임 체험</h1>
          <p className="mt-4 text-xl text-gray-600">
            아래 3가지 한국어 게임을 무료로 체험해 보세요.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {games.map((game, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{game.description}</p>
                <div className="flex flex-col space-y-2">
                   <Button onClick={() => window.openModal(game.url, game.orientation)}>
                    체험 시작
                  </Button>
                  <a href={game.viewUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      새 창에서 열기 <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-10">
              <h2 className="text-2xl font-bold mb-4">자신의 레벨을 확인해보세요!</h2>
              <p className="text-gray-600 mb-6">간단한 테스트를 통해 실력을 진단하고 맞춤 수업을 추천받으세요.</p>
              <Link to={createPageUrl("KoreanLevelTest")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg px-8 py-4">
                  <Brain className="w-5 h-5 mr-2" />
                  레벨 테스트로 이동
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <div id="gameModal" style={{display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50, alignItems: 'center', justifyContent: 'center' }}>
        <div id="modalContent" style={{position: 'relative', width: '90%'}}>
          <iframe id="gameFrame" src="" style={{width: '100%', border: 'none', borderRadius: '10px'}}></iframe>
          <button onClick={() => window.closeModal()} 
                  style={{position: 'absolute', top: '-15px', right: '-15px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>×</button>
        </div>
      </div>
    </div>
  );
}

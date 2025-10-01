
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Gamepad2, Globe, Video, ArrowRight, BookOpen, Clock, Users, ExternalLink, Brain } from "lucide-react"; // Added Brain icon
import { Class, ClassApplication } from '@/api/entities';

const programCards = [
  {
    title: "AI 한국어 게임랜드",
    description: "AI 기반 문장·시제·발음 게임과 eBook으로 쉽고 재미있게 한국어를 연습합니다.",
    buttonText: "게임랜드 가기 (베타)",
    link: "ProgramsAI",
    icon: Bot,
    color: "blue",
  },
  {
    title: "메타 한국어 타운",
    description: "ZEP 메타버스에서 실제 대화 연습과 문화 교류를 진행합니다. 초급자도 쉽게 참여!",
    buttonText: "타운 바로가기",
    link: "ProgramsMetaverse",
    icon: Gamepad2,
    color: "purple"
  },
  {
    title: "국제교류 한국어 캠프",
    description: "배운 한국어로 전 세계 친구들과 온라인 교류 활동을 진행합니다.",
    buttonText: "교류 신청하기",
    link: "ProgramsExchange",
    icon: Globe,
    color: "green"
  },
  {
    title: "Zoom 한국어 강좌",
    description: "주 1~2회 실시간 수업으로 AI/메타 학습을 병행하며 강사 피드백을 제공합니다.",
    buttonText: "수업 신청하기",
    link: "KoreanLesson",
    icon: Video,
    color: "orange"
  }
];

const gamesDemos = [
  { title: "시제 퀴즈(현재/과거/미래)", link: "/demo/tense" },
  { title: "문장 만들기 퍼즐", link: "/demo/sentence" },
  { title: "발음/억양 연습", link: "/demo/pronunciation" }
];

const countries = [
  "한국", "미국", "중국", "일본", "인도네시아", "베트남", "태국", "미얀마", "필리핀", "말레이시아", 
  "싱가포르", "캄보디아", "라오스", "브루나이", "인도", "파키스탄", "방글라데시", "스리랑카",
  "사우디아라비아", "아랍에미리트", "이집트", "기타"
];

export default function ProgramsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("초급");
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    country: '',
    level: '초급',
    class_id: '',
    language_preference: '한국어'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levelFromUrl, setLevelFromUrl] = useState(null); // New state to track if level came from URL

  useEffect(() => {
    document.title = "한국어 교육 프로그램 | 코리언클릭 국제교육원";
    loadClasses();
    
    // URL 파라미터에서 레벨 정보 확인
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const autoScroll = urlParams.get('auto_scroll');
    
    if (level) {
      // Validate level to be one of "초급", "중급", "고급"
      const validLevels = ["초급", "중급", "고급"];
      if (validLevels.includes(level)) {
        setApplicationData(prev => ({ ...prev, level: level }));
        setSelectedLevel(level);
        setLevelFromUrl(level); // Set this state to indicate level came from URL
      }
    }
    
    if (autoScroll === 'true') {
      setTimeout(() => {
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }); // Changed to 'apply'
      }, 1000);
    }
  }, []);

  const loadClasses = async () => {
    try {
      const classData = await Class.filter({ visible: true }, 'date', 50);
      setClasses(classData);
    } catch (error) {
      console.error("클래스 로딩 실패:", error);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!applicationData.name || !applicationData.email || !applicationData.country || !applicationData.class_id) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await ClassApplication.create({
        ...applicationData,
        token,
        status: 'pending'
      });
      alert('신청 완료! 관리자가 승인하면 마이페이지에서 Zoom 링크가 열립니다. 이메일도 확인해 주세요.');
      setApplicationData({
        name: '',
        email: '',
        country: '',
        level: '초급',
        class_id: '',
        language_preference: '한국어'
      });
      setLevelFromUrl(null); // Reset levelFromUrl after submission
    } catch (error) {
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToApplication = (classId) => {
    setApplicationData(prev => ({ ...prev, class_id: classId }));
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }); // Changed to 'apply'
  };

  const filteredClasses = classes.filter(cls => cls.level === selectedLevel);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-white shadow-sm pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900" translate="no">
            우리가 제공하는 한국어 교육 프로그램
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto" translate="no">
            코리언클릭 국제교육원은 AI와 메타버스를 활용한 혁신적인 한국어 교육을 통해 전 세계 청년들에게 말하기 중심의 실전 회화 학습과 국제교류 기회를 제공합니다.
          </p>
          
          {/* 레벨 테스트 CTA 추가 */}
          <div className="mt-8">
            <Link to={createPageUrl("KoreanLevelTest")}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold">
                <Brain className="w-5 h-5 mr-2" />
                나의 한국어 레벨 테스트하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Core Programs Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programCards.map((program) => {
              const Icon = program.icon;
              
              return (
                <Card key={program.title} className={`border-t-4 border-${program.color}-500 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col`} translate="no">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-${program.color}-100 rounded-lg`}>
                        <Icon className={`w-8 h-8 text-${program.color}-600`} />
                      </div>
                      <CardTitle className="text-xl font-bold">{program.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600 mb-4 flex-grow">{program.description}</p>
                      {program.note && (
                        <p className="text-sm text-gray-500 mb-4 bg-gray-100 p-2 rounded">{program.note}</p>
                      )}
                    </div>
                    {/* All program cards now link to internal pages */}
                    <Link to={createPageUrl(program.link)}>
                      <Button className={`w-full bg-${program.color}-600 hover:bg-${program.color}-700`}>
                        {program.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* AI Games Demo Section */}
        <section className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">AI 게임 맛보기</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gamesDemos.map((demo, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{demo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to={demo.link}>
                    <Button variant="outline" className="w-full">
                      체험하기
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 mt-2">
                    체험용 데모 — 정식 학습은 게임랜드에서 진행됩니다.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">한국어 레벨별 시간표</h2>
          <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="초급">초급</TabsTrigger>
              <TabsTrigger value="중급">중급</TabsTrigger>
              <TabsTrigger value="고급">고급</TabsTrigger>
            </TabsList>
            
            {["초급", "중급", "고급"].map(level => (
              <TabsContent key={level} value={level} className="mt-6">
                <div className="grid gap-4">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <Card key={cls.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-grow">
                            <h3 className="font-bold text-lg">{cls.title}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>{cls.date} • {cls.start_time} - {cls.end_time}</p>
                              <p>담당: {cls.teacher} • 정원: {cls.capacity}명</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleScrollToApplication(cls.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            신청하기
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      {level} 수업이 아직 개설되지 않았습니다.
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Application Form */}
        <section id="apply" className="bg-white rounded-lg p-8 shadow-md"> {/* Changed id from apply-form to apply */}
          <h2 className="text-3xl font-bold text-center mb-8">무료 한국어 수업 신청</h2>
          <form onSubmit={handleApplicationSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="country">국가 *</Label>
                <Select value={applicationData.country} onValueChange={(value) => setApplicationData({...applicationData, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="국가를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">언어 선택</Label>
                <Select value={applicationData.language_preference} onValueChange={(value) => setApplicationData({...applicationData, language_preference: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="한국어">한국어</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="level">레벨 *</Label>
                <Select 
                  value={applicationData.level} 
                  onValueChange={(value) => !levelFromUrl && setApplicationData({...applicationData, level: value})}
                  disabled={!!levelFromUrl} // Disable if level was set by URL
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="초급">초급</SelectItem>
                    <SelectItem value="중급">중급</SelectItem>
                    <SelectItem value="고급">고급</SelectItem>
                  </SelectContent>
                </Select>
                {levelFromUrl && <p className="text-xs text-gray-500 mt-1">레벨 테스트 결과가 반영되었습니다.</p>}
              </div>
              <div>
                <Label htmlFor="class">희망 수업 *</Label>
                <Select value={applicationData.class_id} onValueChange={(value) => setApplicationData({...applicationData, class_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="수업을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.filter(cls => cls.level === applicationData.level).map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.title} - {cls.date} {cls.start_time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3" disabled={isSubmitting}>
              {isSubmitting ? '신청 중...' : '수업 신청하기'}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}

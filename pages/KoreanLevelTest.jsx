
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LevelTest, Question } from '@/api/entities';
import { CheckCircle, XCircle, BookOpen, Target, Brain, Home, Trophy } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import 'react-quill/dist/quill.snow.css';

// Function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function KoreanLevelTestPage() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    country: '',
    agreePrivacy: false,
    agreeAge: false,
    agreeMarketing: false,
    hp: '' // 허니팟
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const [testStarted, setTestStarted] = useState(false);
  
  const [currentLevel, setCurrentLevel] = useState('L1');
  const [questions, setQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: '', explanation: '' });

  const [testFinished, setTestFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const levelNames = {
    'L1': '초보자 1',
    'L2': '초보자 2', 
    'L3': '초급 1',
    'L4': '초급 2',
    'L5': '중급 1'
  };

  const currentQuestions = questions[currentLevel] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Memoize shuffled options so they don't re-shuffle on re-render
  const shuffledOptions = useMemo(() => {
    if (currentQuestion && currentQuestion.options) {
      return shuffleArray([...currentQuestion.options]);
    }
    return [];
  }, [currentQuestion]);

  const loadQuestions = useCallback(async () => {
    try {
      const allQuestions = await Question.filter({ is_active: true }, 'difficulty', 200);
      
      // Group questions by level
      const groupedQuestions = {};
      const levels = ['L1', 'L2', 'L3', 'L4', 'L5'];
      levels.forEach(level => {
        const levelQuestions = allQuestions.filter(q => q.level === level);
        groupedQuestions[level] = shuffleArray(levelQuestions).slice(0, 10); // Shuffle and take 10
      });
      
      // Check if any level has no questions or fewer than 10
      if (Object.values(groupedQuestions).some(q => q.length < 10)) {
        console.warn("일부 레벨의 문항 수가 10개 미만입니다. DB를 확인해주세요.");
        // Optional: Implement a more robust fallback here if needed, e.g., using a default set
      }

      setQuestions(groupedQuestions);
    } catch (error) {
      console.error("문항 로딩 실패:", error);
      alert("문제를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, []);

  useEffect(() => {
    document.title = "AI 한국어 레벨 테스트 | 코리언클릭 국제교육원";
    
    // 추가 SEO 메타 태그
    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('description', 'AI로 한국어 레벨을 빠르게 확인하고, 무료 수업 추천을 받아보세요. 이름/이메일만 입력하면 바로 시작됩니다.');
    
    // 캐노니컬 URL 설정
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${createPageUrl('KoreanLevelTest')}`);

    // 접근성 및 유효성 검사용 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      .sr-only { position: absolute; left: -9999px; }
      .is-invalid { border-color: #dc3545 !important; }
      .error-text { color: #dc3545; font-size: 0.875rem; margin-top: 0.375rem; }
    `;
    document.head.appendChild(style);

    loadQuestions();
  }, [loadQuestions]);

  // Form validation check effect
  useEffect(() => {
    const { name, email, agreePrivacy, agreeAge } = userData;
    const isValid =
      name.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      agreePrivacy &&
      agreeAge;
    setIsFormValid(isValid);
  }, [userData]);


  const getAgeText = () => userData.country === 'EU' ? '16' : '14';

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.trim() ? '' : '이름을 입력해 주세요.';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : '유효한 이메일을 입력해 주세요.';
      case 'agreePrivacy':
        return value ? '' : '필수 동의가 필요합니다.';
      case 'agreeAge':
        return value ? '' : `만 ${getAgeText()}세 이상 동의가 필요합니다.`;
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Clear error for the field if it's being updated and might now be valid
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleStartTest = async (e) => {
    e.preventDefault();
    
    // 허니팟 체크 (스팸 방지)
    if (userData.hp.trim() !== '') {
      console.warn("Honeypot field filled. Likely bot.");
      return; // Do not proceed if honeypot is filled
    }

    // 전체 폼 유효성 검사
    const newErrors = {};
    newErrors.name = validateField('name', userData.name);
    newErrors.email = validateField('email', userData.email);
    newErrors.agreePrivacy = validateField('agreePrivacy', userData.agreePrivacy);
    newErrors.agreeAge = validateField('agreeAge', userData.agreeAge);

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      // 첫 번째 에러 필드로 포커스 이동
      const errorFields = ['name', 'email', 'agreePrivacy', 'agreeAge'];
      const firstErrorField = errorFields.find(field => newErrors[field]);
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.getElementById(firstErrorField);
          element?.focus();
        }, 100);
      }
      alert('필수 입력 항목을 확인해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 백엔드 API 연결 (여기서는 일단 테스트 시작으로 간주)
      const payload = {
        name: userData.name.trim(),
        email: userData.email.trim(),
        country: userData.country,
        agreePrivacy: userData.agreePrivacy ? 'Y' : 'N',
        agreeAge: userData.agreeAge ? 'Y' : 'N',
        agreeMarketing: userData.agreeMarketing ? 'Y' : 'N'
      };

      console.log("Submitting user data:", payload);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // 임시 성공 처리
      setTestStarted(true);
    } catch (error) {
      console.error("테스트 시작 처리 중 오류 발생:", error);
      alert('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = async (selectedOption) => {
    if (showFeedback) return; // Prevent multiple clicks

    const isCorrect = selectedOption === currentQuestion.answer;
    const feedbackMessage = isCorrect ? '정답입니다 ✅' : '틀렸어요 ❌';
    const explanation = currentQuestion.explanation || '';
    
    setFeedback({ 
      correct: isCorrect, 
      message: feedbackMessage, 
      explanation: explanation 
    });
    setShowFeedback(true);

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    setTimeout(() => {
      setShowFeedback(false);
      
      // Last question of current level?
      if (currentQuestionIndex === currentQuestions.length - 1) {
        if (newScore >= 8) {
          // Try to advance to next level
          const levels = ['L1', 'L2', 'L3', 'L4', 'L5'];
          const currentLevelIndex = levels.indexOf(currentLevel);
          
          if (currentLevelIndex < levels.length - 1) {
            // Move to next level
            const nextLevel = levels[currentLevelIndex + 1];
            setCurrentLevel(nextLevel);
            setCurrentQuestionIndex(0);
            setScore(0); // Reset score for next level
          } else {
            // Mastered the last level
            finishTest(currentLevel, newScore);
          }
        } else {
          // Failed to pass, finish test at current level
          finishTest(currentLevel, newScore);
        }
      } else {
        // Next question in current level
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 2000); // Show feedback for 2 seconds
  };

  const finishTest = async (level, finalScore) => {
    const result = {
      level: level,
      levelName: levelNames[level],
      score: finalScore,
    };
    setFinalResult(result);
    setTestFinished(true);

    try {
      await LevelTest.create({
        user_email: userData.email,
        user_name: userData.name,
        level: result.level,           // 테스트한 레벨
        final_level: result.level,     // 최종 추천 레벨 
        score: result.score,
        completed: true
      });
    } catch (error) {
      console.error("테스트 결과 저장 실패:", error);
    }
  };

  const handleApplyClass = () => {
    const levelMapping = { 
      'L1': '초급', 
      'L2': '초급', 
      'L3': '초급', 
      'L4': '중급', 
      'L5': '중급' 
    };
    const applyLevel = levelMapping[finalResult.level] || '초급';
    navigate(createPageUrl('Programs') + `?level=${applyLevel}&auto_scroll=true`);
  };

  const handleGoHome = () => navigate(createPageUrl('Home'));

  const totalLevels = 5;
  const currentLevelNum = ['L1', 'L2', 'L3', 'L4', 'L5'].indexOf(currentLevel) + 1;
  const progress = currentQuestions.length > 0 ? (currentQuestionIndex / currentQuestions.length) * 100 : 0;
  
  // Loading state
  if (Object.keys(questions).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">문항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Initial Screen
  if (!testStarted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="pt-24 pb-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6"><Brain className="w-16 h-16 text-blue-600" /></div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AI 한국어 레벨 테스트</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">당신의 한국어 실력을 확인하고, 딱 맞는 수업을 추천 받아보세요!</p>
          </div>
        </header>
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">테스트 시작하기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleStartTest} noValidate>
                {/* 허니팟 (스팸 방지) */}
                <div className="sr-only" aria-hidden="true">
                  <Label htmlFor="hp">Leave this field empty</Label>
                  <Input
                    id="hp"
                    name="hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={userData.hp}
                    onChange={(e) => handleInputChange('hp', e.target.value)}
                  />
                </div>

                {/* 이름 */}
                <div className="space-y-2">
                  <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="이름을 입력하세요"
                    required
                    aria-required="true"
                    aria-describedby="nameHelp"
                    autoComplete="name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  <div id="nameHelp" className="text-sm text-gray-500">결과 표시 및 알림 메일에 사용됩니다.</div>
                  {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="이메일을 입력하세요"
                    required
                    aria-required="true"
                    autoComplete="email"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>

                {/* 거주 국가 */}
                <div className="space-y-2">
                  <Label htmlFor="country">거주 국가 (선택)</Label>
                  <Select value={userData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택 안함" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>선택 안함</SelectItem>
                      <SelectItem value="KR">대한민국</SelectItem>
                      <SelectItem value="EU">유럽(EEA/UK)</SelectItem>
                      <SelectItem value="US">미국</SelectItem>
                      <SelectItem value="OTHER">그 외 지역</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500">거주 지역에 따라 연령 고지 문구가 달라질 수 있어요.</div>
                </div>

                {/* 개인정보 동의 */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="agreePrivacy"
                      checked={userData.agreePrivacy}
                      onChange={(e) => handleInputChange('agreePrivacy', e.target.checked)}
                      required
                      aria-required="true"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="agreePrivacy" className="text-sm font-medium">
                        (필수) 개인정보 수집·이용에 동의합니다.
                      </Label>
                      <p className="text-xs text-gray-500">
                        목적: AI 레벨 진단 및 결과 안내 · 무료 수업 추천 / 보관: 12개월 후 파기
                      </p>
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">개인정보처리방침 전문 보기</a>
                    </div>
                  </div>
                  {errors.agreePrivacy && <div className="text-red-500 text-sm ml-6">{errors.agreePrivacy}</div>}

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="agreeAge"
                      checked={userData.agreeAge}
                      onChange={(e) => handleInputChange('agreeAge', e.target.checked)}
                      required
                      aria-required="true"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="agreeAge" className="text-sm">
                      (필수) 본인은 만 <span className="font-semibold">{getAgeText()}</span>세 이상입니다.
                    </Label>
                  </div>
                  {errors.agreeAge && <div className="text-red-500 text-sm ml-6">{errors.agreeAge}</div>}

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="agreeMarketing"
                      checked={userData.agreeMarketing}
                      onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="agreeMarketing" className="text-sm">
                      (선택) 무료 수업/이벤트 안내 이메일 수신에 동의합니다.
                    </Label>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '처리 중...' : '🔎 테스트 시작'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    data-back="true"
                    onClick={() => navigate(-1)}
                  >
                    ← 이전 페이지
                  </Button>
                </div>
              </form>

              {/* 안내 문구 */}
              <p className="text-xs text-gray-500 text-center mt-4">
                제출 시 이름/이메일을 처리하며, 12개월 보관 후 파기됩니다. 정보 삭제는 <a href="mailto:koreanyou@koreanyou.net" className="text-blue-600 hover:underline">koreanyou@koreanyou.net</a>로 요청할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Result Screen
  if (testFinished) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
              <div className="flex justify-center mb-4"><Trophy className="w-16 h-16" /></div>
              <h1 className="text-4xl font-bold">테스트 완료!</h1>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <p className="text-lg text-gray-600">수고하셨습니다, {userData.name}님!</p>
              <div className="text-2xl font-bold text-gray-800">
                당신의 한국어 레벨은 <Badge variant="default" className="text-2xl px-3 py-1 bg-green-600">{finalResult.levelName} ({finalResult.level})</Badge> 입니다.
              </div>
              <p className="text-gray-700">마지막 레벨에서 <strong>{finalResult.score} / 10</strong> 점을 획득하셨습니다.</p>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">지금 수업을 신청하시겠습니까?</h3>
                  <p className="text-gray-600 mb-6">테스트 결과에 맞는 수업으로 바로 안내해 드립니다.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleApplyClass} size="lg" className="bg-green-600 hover:bg-green-700">
                      <BookOpen className="w-5 h-5 mr-2" /> 예, 수업 신청하기
                    </Button>
                    <Button onClick={handleGoHome} size="lg" variant="outline">
                      <Home className="w-5 h-5 mr-2" /> 아니요, 홈으로
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  // No questions available for current level
  if (currentQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">현재 레벨({currentLevel})의 문항을 불러올 수 없습니다.</p>
          <Button onClick={() => navigate(createPageUrl('Home'))} className="mt-4">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // Test Screen
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Badge className="bg-blue-600 text-white">레벨 {currentLevelNum} / {totalLevels}: {levelNames[currentLevel]}</Badge>
              <h1 className="text-2xl font-bold mt-1">문제 {currentQuestionIndex + 1} / {currentQuestions.length}</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">현재 레벨 점수</div>
              <div className="text-2xl font-bold text-blue-600">{score} / {currentQuestions.length}</div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shuffledOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full text-left justify-start p-4 h-auto text-lg transition-all duration-300",
                    showFeedback && (option === currentQuestion.answer ? "bg-green-100 border-green-400 text-green-800" : "bg-red-100 border-red-400 text-red-800"),
                    showFeedback && "pointer-events-none"
                  )}
                  onClick={() => handleAnswer(option)}
                >
                  <span className="mr-4 font-bold">{"①②③④"[index]}</span>
                  {option}
                </Button>
              ))}
            </div>
            {showFeedback && (
              <div className={cn(
                "mt-6 p-4 rounded-md text-center font-bold text-lg animate-fade-in",
                feedback.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>
                <div>{feedback.message}</div>
                {feedback.explanation && (
                  <div className="mt-2 text-sm font-normal">{feedback.explanation}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

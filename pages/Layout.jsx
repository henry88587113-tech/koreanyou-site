

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Removed useNavigate
import { createPageUrl } from "@/utils";
import { Globe, Menu, X, ChevronDown, BookUser, Handshake, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User } from '@/api/entities';


const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: '영어', flag: '🇺🇸' }, // Changed 'English' to '영어'
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

const navigationItems = [
  { name: '홈', name_en: 'Home', url: 'Home' },
  {
    name: '프로그램',
    name_en: 'Programs',
    url: 'Programs',
    subItems: [
      { name: 'AI 한국어 게임랜드', name_en: 'AI Korean Gameland', url: 'ProgramsAI' },
      { name: '메타 한국어 타운', name_en: 'Meta Korean Town', url: 'ProgramsMetaverse' },
      { name: 'Zoom 한국어 수업', name_en: 'Zoom Korean Class', url: 'KoreanLesson' },
      { name: '국제교류 한국어 캠프', name_en: 'International Exchange Korean Camp', url: 'ProgramsExchange' },
      { name: '레벨 테스트', name_en: 'Level Test', url: 'KoreanLevelTest' }
    ]
  },
  {
    name: '수업신청',
    name_en: 'Apply for a class',
    url: 'Programs?auto_scroll=true',
    subItems: [
        { name: '통합 수업신청 (초·중·고급)', name_en: 'All Levels', url: 'Programs?auto_scroll=true' },
        { name: 'Zoom 수업신청', name_en: 'Zoom Class', url: 'Programs?auto_scroll=true' },
        { name: '메타 타운 신청', name_en: 'Meta Town', url: 'ProgramsMetaverse' },
        { name: '국제교류 캠프 신청', name_en: 'Exchange Camp', url: 'ProgramsExchange' }
    ]
  },
  {
    name: '소개',
    name_en: 'About Us',
    url: 'About',
    subItems: [
      { name: '기관 소개', name_en: 'Introduction', url: 'About' },
      { name: '참여 안내', name_en: 'How to participate', url: 'Participate' },
    ]
  },
  {
      name: '소식',
      name_en: 'Stories',
      url: '#',
      subItems: [
          { name: '임팩트', name_en: 'Impact', url: 'Impact' },
          { name: '학습자 후기', name_en: 'Testimonials', url: 'Testimonials' },
          { name: '설문 결과', name_en: 'Surveys', url: 'Surveys' },
          { name: '성과 인증', name_en: 'Achievements', url: 'Achievements' },
          { name: '활동 사례', name_en: 'Activities', url: 'Activities' },
          { name: '공지사항', name_en: 'Announcements', url: 'News' },
          { name: '블로그', name_en: 'Blog', url: 'Blog' },
      ]
  }
];

const seoConfig = {
  Home: {
    title: "코리언클릭 국제교육원 | 전세계 청년을 위한 무상 한국어·AI 교육",
    description: "환경적으로 어려운 전세계 청년에게 한국어·AI·메타버스 교육을 제공하고 유학·취업·국제 교류 기회를 엽니다.",
    ogImageAlt: "코리언클릭 국제교육원 대표 이미지"
  },
  About: {
    title: "소개 | 코리언클릭 국제교육원",
    description: "AI·메타버스로 전세계 청년에게 무상 한국어와 직업교육을 제공하는 국제 비영리단체."
  },
  Programs: {
    title: "한국어 교육 프로그램 | 코리언클릭 국제교육원",
    description: "AI와 메타버스로 배우는 무료 한국어 교육. 게임형 학습, 메타버스 대화, Zoom 실시간 수업, 국제교류까지 단계별로 제공합니다.",
    ogDescription: "한국어 말하기 중심의 실전 회화 학습과 국제교류 기회를 제공합니다.",
    ogImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    ogImageAlt: "한국어 교육 프로그램 이미지"
  },
  KoreanLesson: {
    title: "무료 Zoom 한국어 강좌｜AI 레벨 테스트｜코리언클릭 국제교육원",
    description: "비영리기관 코리언클릭 국제교육원은 AI·메타버스를 활용한 무료 Zoom 한국어 수업을 제공합니다. 레벨 테스트로 맞춤 반을 추천받고 바로 신청하세요.",
    ogTitle: "무료 Zoom 한국어 강좌｜AI 레벨 테스트",
    ogDescription: "AI·메타버스 기반 무료 한국어 교육. 전 세계 청년 대상 Zoom 수업 운영.",
    ogImage: "https://www.koreanyou.net/og/zoom-korean.jpg",
    canonical: "https://www.koreanyou.net/zoom-korean",
    ldJson: [
      {
        "@context":"https://schema.org",
        "@type":"EducationalOrganization",
        "name":"코리언클릭 국제교육원",
        "url":"https://www.koreanyou.net",
        "logo":"https://www.koreanyou.net/og/logo.png",
        "address": {
          "@type":"PostalAddress",
          "addressCountry":"KR",
          "addressLocality":"Goyang-si",
          "streetAddress":"지도로 10번길 61, 201-803"
        },
        "sameAs":[
          "https://www.youtube.com/@KoreanClick",
          "https://www.instagram.com/koreanyou"
        ]
      },
      {
        "@context":"https://schema.org",
        "@type":"WebPage",
        "name":"Zoom 한국어 강좌",
        "url":"https://www.koreanyou.net/zoom-korean",
        "description":"AI·메타버스 기반 무료 Zoom 한국어 수업과 레벨 테스트 제공",
        "inLanguage":"ko"
      }
    ]
  },
  KoreanLevelTest: {
    title: "AI 한국어 레벨 테스트 | 코리언클릭 국제교육원",
    description: "AI가 당신의 한국어 실력을 정확히 진단해 드립니다. 테스트를 통해 최적의 학습 과정을 추천받으세요."
  },
  AboutLegal: {
    title: "코리언클릭 국제교육원 등록증·인증현황", // Changed 'KoreanClick International' to '코리언클릭 국제교육원'
    description: "코리언클릭 국제교육원은 무료 한국어 교육과 국제교류를 운영하는 비영리단체입니다. 등록증·인증현황·재정공개를 투명하게 제공합니다.", // Changed 'KoreanClick International' to '코리언클릭 국제교육원'
    ogDescription: "등록증, TechSoup 인증, 파트너 협약, 재정 공개를 한눈에 확인할 수 있습니다.",
    ogImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    ogImageAlt: "코리언클릭 등록증 및 인증서 이미지" // Changed 'KoreanClick' to '코리언클릭'
  },
  PartnersMOU: {
    title: "파트너 인증·MOU 증빙 | 코리언클릭 국제교육원", // Changed 'KoreanClick International' to '코리언클릭 국제교육원'
    description: "코리언클릭 국제교육원 파트너 인증·MOU 증빙 페이지입니다. 협력 기관의 공식 협약서와 인증 현황을 투명하게 공개합니다.", // Changed 'KoreanClick International' to '코리언클릭 국제교육원'
    ogDescription: "국내·국제 협력 기관의 공식 협약서(PDF)와 검증 가능한 외부 링크를 제공합니다.",
    ogImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
    ogImageAlt: "파트너십 및 협약 관련 이미지"
  },
  FinancialTransparency: {
    title: "재정 공개 | 코리언클릭 국제교육원", // Changed 'KoreanClick International' to '코리언클릭 국제교육원'
    description: "모든 후원금은 100% 교육과 국제교류에 사용되며, 연간 결산보고서를 PDF로 공개합니다.",
    ogImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1200&auto=format&fit=crop",
    ogImageAlt: "재정 투명성 공개 이미지"
  },
  default: {
    title: "코리언클릭 국제교육원",
    description: "코리언클릭 국제교육원은 한국어·AI·국제교류를 통해 기회가 부족한 청년을 지원하는 비영리 교육단체입니다." // Changed 'KoreanClick International' to '코리언클릭 국제교육원'
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState('ko');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Admin check
    User.me().then(user => {
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        }
    }).catch(() => setIsAdmin(false));

    // GA4 & Google Ads script injection
    // Replace with your actual GA4 Measurement ID and Google Ads Conversion ID
    const gaId = "G-XXXXXXXXXX";
    const adsId = "AW-YYYYYYYYYY";

    const existingGaScript = document.getElementById('google-analytics-gtag-script');
    const existingGtagInitScript = document.getElementById('gtag-init-script');

    if (!existingGaScript) {
      // Load gtag.js library
      const gaScript = document.createElement('script');
      gaScript.id = 'google-analytics-gtag-script';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gaScript);
    }

    if (!existingGtagInitScript) {
      // Initialize gtag and configure IDs
      const gtagScript = document.createElement('script');
      gtagScript.id = 'gtag-init-script';
      gtagScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
        gtag('config', '${adsId}');
      `;
      document.head.appendChild(gtagScript);
    }
  }, []); // Run only once on component mount

  // Auto scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPageName]); // Run when currentPageName changes

  // SEO Update Effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pageSeo = seoConfig[currentPageName] || seoConfig.default;
    const baseUrl = window.location.origin;
    const ogUrl = pageSeo.canonical || `${baseUrl}${location.pathname}`;
    
    document.title = pageSeo.title;

    const setMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (isProperty) metaTag.setAttribute('property', name);
        else metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
      let linkTag = document.querySelector(`link[rel="${rel}"]`);
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.setAttribute('rel', rel);
        document.head.appendChild(linkTag);
      }
      linkTag.setAttribute('href', href);
    };

    setMeta('description', pageSeo.description);
    setMeta('og:title', pageSeo.ogTitle || pageSeo.title, true);
    setMeta('og:description', pageSeo.ogDescription || pageSeo.description, true);
    setMeta('og:url', ogUrl, true);
    setMeta('og:type', pageSeo.ogType || 'website', true);
    
    if (pageSeo.ogImage) setMeta('og:image', pageSeo.ogImage, true);
    if (pageSeo.ogImageAlt) setMeta('og:image:alt', pageSeo.ogImageAlt, true);
    
    setMeta('twitter:card', 'summary_large_image');
    setMeta('robots', 'index, follow');
    setLink('canonical', ogUrl);

    // JSON-LD structured data
    document.querySelectorAll('script[type="application/ld+json"]').forEach(e => e.remove());
    if (pageSeo.ldJson) {
      pageSeo.ldJson.forEach(json => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(json, null, 2);
        document.head.appendChild(script);
      });
    }

  }, [currentPageName, location.pathname]);

  const handleGoBack = () => {
    // window.goBack 함수가 존재하는지 확인 후 호출
    if (typeof window.goBack === 'function') {
      window.goBack(createPageUrl('Home'));
    } else {
      // window.goBack이 없을 경우 직접 뒤로가기 로직 실행
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // 히스토리가 없으면 홈으로 이동
        window.location.href = createPageUrl('Home');
      }
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLang) || languages[0];
  };

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          :root {
            --primary-blue: #1e40af;
            --primary-orange: #ea580c;
            --warm-gray: #f8fafc;
            --text-gray: #334155;
            --light-blue: #dbeafe;
            --light-orange: #fed7aa;
          }

          html { scroll-behavior: smooth; }

          /* 고정 헤더가 있을 때 스크롤이 상단에 딱 맞도록 여백 확보 */
          #apply { scroll-margin-top: 96px; }

          .gradient-bg {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-orange) 100%);
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .text-balance {
            text-wrap: balance;
          }
        `}
      </style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              // 내부 도메인 판별
              function isSameOrigin(url) {
                try {
                  const u = new URL(url, window.location.origin);
                  return u.origin === window.location.origin;
                } catch (e) {
                  return false;
                }
              }

              // 1) referrer가 내부사이트면 세션에 저장 (새탭/직접진입 대비)
              if (document.referrer && isSameOrigin(document.referrer)) {
                sessionStorage.setItem("lastInternalURL", document.referrer);
              }

              // 2) 뒤로가기 우선순위 실행 함수
              window.goBack = function (fallbackPath) {
                const fallback = fallbackPath || "/"; // 기본 이동 경로(원하면 '/programs' 등으로 변경)
                // (a) 히스토리 있으면 우선 사용
                if (window.history.length > 1) {
                  return window.history.back();
                }
                // (b) 저장해둔 내부 URL 있으면 사용
                const saved = sessionStorage.getItem("lastInternalURL");
                if (saved && isSameOrigin(saved)) {
                  return window.location.href = saved;
                }
                // (c) 최종 안전 경로
                window.location.href = fallback;
              };

              // 3) data-back="true" 달린 요소들 자동 바인딩 (링크/버튼 모두 지원)
              function bindBackButtons(root) {
                const nodes = (root || document).querySelectorAll("[data-back='true']");
                nodes.forEach(function (el) {
                  if (el.__backBound) return;
                  el.__backBound = true;
                  el.addEventListener("click", function (e) {
                    e.preventDefault();
                    // 필요하면 여기서 페이지별 fallback 지정 가능
                    goBack("/");
                  });
                });
              }

              // --- NEW SCROLL LOGIC ---
              const HEADER_OFFSET = 96; // 고정 헤더 높이에 맞춰 조절

              function scrollToTarget(sel) {
                const el = document.querySelector(sel);
                if (!el) return;
                const top = window.pageYOffset + el.getBoundingClientRect().top - HEADER_OFFSET;
                window.scrollTo({ top, behavior: 'smooth' });
                history.replaceState(null, '', sel); // URL 해시 업데이트 (히스토리에 추가하지 않음)
                const firstInput = el.querySelector('input, select, textarea, button');
                firstInput && firstInput.focus({ preventScroll: true }); // 입력 필드로 포커스 이동
              }

              // 4) data-scroll 속성을 가진 요소들 자동 바인딩 (부드러운 스크롤)
              function bindScrollButtons(root) {
                const nodes = (root || document).querySelectorAll("[data-scroll]");
                nodes.forEach(function (el) {
                  if (el.__scrollBound) return;
                  el.__scrollBound = true;
                  el.addEventListener("click", function (e) {
                    e.preventDefault();
                    scrollToTarget(el.getAttribute('data-scroll'));
                  });
                });
              }

              // 초기 바인딩 + SPA 환경 대비
              document.addEventListener("DOMContentLoaded", function () {
                bindBackButtons(document);
                bindScrollButtons(document);
                // URL에 해시가 있는 경우, 페이지 로드 후 해당 위치로 스크롤
                if (location.hash === '#apply') { // 예시로 '#apply'를 사용, 필요에 따라 다른 해시 추가 가능
                  requestAnimationFrame(() => scrollToTarget('#apply'));
                }
              });
              // 동적으로 추가될 수도 있을 때(선택): 약간 지연 후 재바인딩
              window.addEventListener("load", function () {
                setTimeout(function () { 
                  bindBackButtons(document); 
                  bindScrollButtons(document);
                }, 0);
              });
            })();
          `
        }}
      />

      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 glass-effect shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl text-gray-900">코리언클릭</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) =>
                item.subItems ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          item.subItems.some(si => location.pathname === createPageUrl(si.url)) || location.pathname === createPageUrl(item.url.split('?')[0])
                            ? 'text-blue-600 bg-blue-50' // Active style
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' // Inactive style
                        }`}
                      >
                        {currentLang === 'ko' ? item.name : item.name_en}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.url} asChild>
                          <Link to={createPageUrl(subItem.url)}>
                            {currentLang === 'ko' ? subItem.name : subItem.name_en}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.url)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === createPageUrl(item.url.split('?')[0])
                        ? 'text-white bg-gradient-to-r from-blue-600 to-orange-500'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {currentLang === 'ko' ? item.name : item.name_en}
                  </Link>
                )
              )}
            </nav>

            {/* CTAs, Language Selector & Mobile Menu */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="hidden md:flex">
                        <Shield className="w-4 h-4 mr-2"/>
                        관리자
                        <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild><Link to={createPageUrl("AdminPostList")}>콘텐츠 관리</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl("AdminClasses")}>수업 관리</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl("AdminApplications")}>수업 신청 관리</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl("AdminLevelTestResults")}>레벨 테스트 결과</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl("AdminReviews")}>후기 관리</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl("AdminAchievements")}>성과 인증 관리</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{getCurrentLanguage().name}</span>
                    <span className="sm:hidden">{getCurrentLanguage().flag}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => setCurrentLang(language.code)}
                      className={`flex items-center gap-3 ${
                        currentLang === language.code ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 glass-effect">
            <nav className="max-w-7xl mx-auto px-4 py-4">
              <Accordion type="single" collapsible className="w-full">
                {navigationItems.map((item) =>
                  item.subItems ? (
                    <AccordionItem value={item.name} key={item.name}>
                      <AccordionTrigger className="px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:no-underline hover:bg-blue-50">
                        {currentLang === 'ko' ? item.name : item.name_en}
                      </AccordionTrigger>
                      <AccordionContent className="pb-1">
                        <div className="pl-4 border-l-2 border-blue-200">
                          {item.subItems.map(subItem => (
                            <Link
                              key={subItem.url}
                              to={createPageUrl(subItem.url)}
                              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {currentLang === 'ko' ? subItem.name : subItem.name_en}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Link
                      key={item.url}
                      to={createPageUrl(item.url)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === createPageUrl(item.url.split('?')[0])
                          ? 'text-white bg-gradient-to-r from-blue-600 to-orange-500'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {currentLang === 'ko' ? item.name : item.name_en}
                    </Link>
                  )
                )}
                {isAdmin && (
                  <AccordionItem value="admin-menu">
                    <AccordionTrigger className="px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:no-underline hover:bg-blue-50">
                      <div className="flex items-center"><Shield className="w-4 h-4 mr-2"/>관리자 메뉴</div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <div className="pl-4 border-l-2 border-blue-200">
                        <Link to={createPageUrl("AdminPostList")} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>콘텐츠 관리</Link>
                        <Link to={createPageUrl("AdminClasses")} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>수업 관리</Link>
                        <Link to={createPageUrl("AdminApplications")} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>수업 신청 관리</Link>
                        <Link to={createPageUrl("AdminLevelTestResults")} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>레벨 테스트 결과</Link>
                        <Link to={createPageUrl("AdminReviews")} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>후기 관리</Link>
                        <Link to={createPageUrl("AdminAchievements")} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>성과 인증 관리</Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}

        {/* Back to Previous Page Link */}
        {currentPageName !== 'Home' && (
          <div className="text-center my-12">
            <button 
              onClick={handleGoBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              ← 이전 페이지로 돌아가기
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Organization Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="font-bold text-xl">코리언클릭 국제교육원</span> {/* Changed 'KoreanClick International' to '코리언클릭 국제교육원' */}
              </div>
              <p className="text-gray-300 text-sm mb-2">
                주소: 경기도 고양시 덕양구 지도로 103번길 61, 201-803
              </p>
              <p className="text-gray-300 text-sm">
                비영리단체 고유번호: 138-82-80474
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">기관 정보</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to={createPageUrl("About")} className="hover:text-white">소개</Link></li>
                <li><Link to={createPageUrl("Impact")} className="hover:text-white">임팩트</Link></li>
                <li><Link to={createPageUrl("Programs")} className="hover:text-white">프로그램</Link></li>
                <li><Link to={createPageUrl("Participate")} className="hover:text-white">참여하기</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">문의</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="mailto:koreanyou@koreanyou.net" className="hover:text-white">이메일: koreanyou@koreanyou.net</a></li>
                <li><a href="tel:+821033378858" className="hover:text-white">전화: +82-10-3337-8858</a></li>
              </ul>
            </div>

            {/* Social & Admin */}
            <div>
              <h3 className="font-semibold mb-4">소셜 미디어</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://www.facebook.com/profile.php?id=61580069860051" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></li>
                <li><a href="https://www.youtube.com/@KoreanClick" target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a></li>
                <li><a href="https://www.instagram.com/korean_click" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
                {isAdmin && (
                  <li><Link to={createPageUrl("AdminCMS")} className="hover:text-white">관리자 전용 페이지</Link></li>
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p className="mb-4">
              코리언클릭 국제교육원은 Google 비영리 프로그램에 등록된 기관으로, <br />
              전 세계 학습자들에게 AI와 메타버스를 통한 무료 교육을 제공합니다.
            </p>
            <p>&copy; 2024 코리언클릭 국제교육원. 모든 권리 보유.</p> {/* Changed 'KoreanClick International. All rights reserved.' to '코리언클릭 국제교육원. 모든 권리 보유.' */}
          </div>
        </div>
      </footer>
    </div>
  );
}


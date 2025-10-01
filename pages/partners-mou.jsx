import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ShieldCheck, Mail, ExternalLink, Loader2, CheckCircle, FileText, Eye } from 'lucide-react';
import { SendEmail } from '@/api/integrations';

// 아이콘 이름과 컴포넌트를 매핑합니다.
const iconMap = {
  ShieldCheck: ShieldCheck,
  Mail: Mail,
};

const pageConfig = {
  type: "section",
  layout: "vertical",
  blocks: [
    {
      type: "html",
      content: "<style>.partner-card .thumb{margin-bottom: 1.5rem; height:96px;background:#fff;border-radius:12px;padding:10px 14px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}.partner-card .thumb img{max-height:72px;width:auto;max-width:100%;object-fit:contain;display:block}.partner-card .thumb--empty{margin-bottom:1.5rem; height:96px;background:#f4f6f8;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#667085;font-weight:600;letter-spacing:.3px;}</style>"
    },
    {
      type: "hero",
      title: "파트너 인증·MOU 증빙",
      subtitle: "협력 기관의 공식 협약(마스킹)·인증 현황을 투명하게 공개합니다.",
      note: "개인정보(서명·연락처)는 모두 마스킹된 사본입니다. 원본은 요청 시 기관 확인 후 개별 제공됩니다."
    },
    {
      type: "callout",
      icon: "ShieldCheck",
      title: "증빙 원칙",
      body: "① 공식 문서 우선 공개 ② 개인정보(서명·연락처)는 모두 마스킹된 사본 공개 ③ 외부 검증 가능한 링크 제공 ④ 원본 요청 시 기관 확인 후 개별 제공"
    },
    {
      type: "tabs",
      tabs: [
        { id: "edu", label: "교육기관·대학" },
        { id: "public", label: "지자체·청소년시설" },
        { id: "intl", label: "국제교류단체" },
        { id: "ngo", label: "국내 비영리단체" },
        { id: "support_info", label: "지원 형태 안내" }
      ],
      content: {
        edu: {
          type: "cardGrid",
          columns: 2,
          cards: [
            {
              className: "partner-card",
              title: "대구과학대학교",
              subtitle: "대한민국 · 교육기관·대학",
              description: "한국어·문화 프로그램 및 지역 청소년 연계 교육 협력.",
              thumb_url: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-24%20000651.png",
              alt: "대구과학대학교 로고",
              badges: ["MOU: 2024-11"],
              actions: [
                { label: "협약서 보기", href: "https://drive.google.com/file/d/1e-0bsqduX2Cw_QpeGG76UUJc4_LG7ol9/preview", target: "_blank", rel: "noopener noreferrer" },
                { label: "사이트 방문", href: "https://www.tsu.ac.kr/", target: "_blank", rel: "noopener noreferrer", variant: "subtle" },
                { label: "문의 요청", href: "mailto:koreanyou@koreanyou.net?subject=%5B증빙요청%5D%20대구과학대학교%20MOU", variant: "outline" }
              ]
            },
            {
              className: "partner-card",
              title: "고려직업전문학교",
              subtitle: "대한민국 · 교육기관·대학",
              description: "국제학생 대상 한국어·진로 교육 협력.",
              thumb_url: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-24%20000741.png",
              alt: "고려직업전문학교 로고",
              badges: ["MOU: 2024-12"],
              actions: [
                { label: "협약서 보기", href: "https://drive.google.com/file/d/1NHWAu57c0LYqppCLmoUuFOsRKjtTp_65/preview", target: "_blank", rel: "noopener noreferrer" },
                { label: "사이트 방문", href: "http://www.koreait.or.kr/2017/html/index/", target: "_blank", rel: "noopener noreferrer", variant: "subtle" },
                { label: "문의 요청", href: "mailto:koreanyou@koreanyou.net?subject=%5B증빙요청%5D%20고려직업전문학교%20MOU", variant: "outline" }
              ]
            }
          ]
        },
        public: {
          type: "cardGrid",
          columns: 2,
          cards: [
            {
              className: "partner-card",
              title: "판교청소년수련관",
              subtitle: "대한민국 · 지자체·청소년시설",
              description: "청소년 국제교류 협력 및 지역 청소년 글로벌 역량 강화.",
              thumb_url: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/9242025-09-24%20002456.png",
              alt: "판교청소년수련관 로고",
              badges: ["MOU: 2021-11"],
              actions: [
                { label: "협약서 보기", href: "https://drive.google.com/file/d/1GyT30-Elm-PGqydIDwt536NwxZzY1DxV/preview", target: "_blank", rel: "noopener noreferrer" },
                { label: "사이트 방문", href: "https://www.snyouth.or.kr/fmcs/123?action=read&action-value=32b8d6dbac7ac90e48286345658a514a", target: "_blank", rel: "noopener noreferrer", variant: "subtle" },
                { label: "문의 요청", href: "mailto:koreanyou@koreanyou.net?subject=%5B증빙요청%5D%20판교청소년수련관%20MOU", variant: "outline" }
              ]
            }
          ]
        },
        intl: {
          type: "cardGrid",
          columns: 2,
          cards: [
            {
              className: "partner-card",
              title: "With The World Inc.",
              subtitle: "일본 · 국제교류단체",
              description: "국제교류 및 공동 수업 운영을 통해 한일 청소년 교육 협력.",
              thumb_url: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-24%20001920.png",
              alt: "With The World 로고",
              badges: ["MOU: 2023-08"],
              actions: [
                { label: "협약서 보기", href: "https://drive.google.com/file/d/1oD2eO1Lojn3vulodTPfoD0cE7tRCUF0Q/preview", target: "_blank", rel: "noopener noreferrer" },
                { label: "웹사이트 방문", href: "https://withtheworld.co/en/?utm_source=chatgpt.com", target: "_blank", rel: "noopener noreferrer", variant: "subtle" },
                { label: "문의 요청", href: "mailto:koreanyou@koreanyou.net?subject=%5B증빙요청%5D%20With%20The%20World%20MOU", variant: "outline" }
              ]
            }
          ]
        },
        ngo: {
          type: "cardGrid",
          columns: 2,
          cards: [
            {
              className: "partner-card",
              title: "한국천사운동중앙회",
              subtitle: "대한민국 · 비영리단체",
              description: "취약계층 청소년 교육 및 생활 지원 협력.",
              thumb_url: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-23%20234950.png",
              alt: "한국천사운동중앙회 로고",
              badges: ["MOU: 2023-01"],
              actions: [
                { label: "협약서 보기", href: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", target: "_blank", rel: "noopener noreferrer" },
                { label: "사이트 방문", href: "http://www.love1004.or.kr/", target: "_blank", rel: "noopener noreferrer", variant: "subtle" },
                { label: "문의 요청", href: "mailto:koreanyou@koreanyou.net?subject=%5B증빙요청%5D%20한국천사운동중앙회%20MOU", variant: "outline" }
              ]
            },
            {
              className: "partner-card",
              title: "한국장애인문화협회(하남지부)",
              subtitle: "대한민국 · 비영리단체",
              description: "장애인 대상 문화예술 교육 및 접근성 개선 협력.",
              thumb_url: "https://trawqkfqilpabizjshdr.supabase.co/storage/v1/object/public/images/924%202025-09-23%20235213.png",
              alt: "한국장애인문화협회 로고",
              badges: ["MOU: 2024-03"],
              actions: [
                { label: "협약서 보기", href: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", target: "_blank", rel: "noopener noreferrer" },
                { label: "사이트 방문", href: "http://www.dcah.or.kr/", target: "_blank", rel:"noopener noreferrer", variant: "subtle" },
                { label: "문의 요청", href: "mailto:koreanyou@koreanyou.net?subject=%5B증빙요청%5D%20한국장애인문화협회(하남지부)%20MOU", variant: "outline" }
              ]
            }
          ]
        },
        support_info: {
          type: "textSection",
          content: `
            <div class="bg-blue-50 rounded-lg p-6">
              <h3 class="text-lg font-bold text-blue-900 mb-3">🔍 지원 프로그램 활용 방식</h3>
              <ul class="text-blue-800 space-y-2 text-sm">
                <li>• <strong>Google for Education:</strong> 비영리단체 대상 Google Workspace 무료 제공</li>
                <li>• <strong>Microsoft Philanthropies:</strong> 자선 소프트웨어 프로그램을 통한 Office 365 지원</li>
                <li>• <strong>AWS Educate:</strong> 클라우드 크레딧 및 교육 리소스 지원</li>
                <li>• <strong>TechSoup:</strong> 비영리단체 검증 및 소프트웨어 할인 프로그램</li>
              </ul>
              <p class="text-blue-700 text-xs mt-4">
                ※ 모든 지원은 각 기업의 비영리단체 지원 정책에 따라 제공받고 있으며, 
                KoreanClick은 이를 교육 목적으로만 활용합니다.
              </p>
              <p class="text-blue-700 text-xs mt-2">
                ※ 각 기업의 로고 및 명칭은 지원 프로그램 참여 또는 협력 관계를 표시하기 위한 것이며, 직접적인 후원이나 보증을 의미하지 않습니다.
              </p>
            </div>
          `
        }
      }
    },
    { type: "divider" },
    {
      type: "popup_form",
      callout: {
        icon: "Mail",
        title: "추가 증빙 요청",
        body: "양식 제출 시 기관 확인 후 원본 또는 추가 자료를 이메일로 회신드립니다."
      },
      trigger_button: { label: "추가 증빙 요청하기", icon: "Mail" },
      title: "파트너 증빙 자료 요청",
      description: "기관 확인을 위해 필수 항목을 입력해 주세요.",
      fields: [
        { name: "orgName", label: "요청 기관명", type: "text", required: true, placeholder: "예: ○○재단 / △△대학교" },
        { name: "contactName", label: "담당자 이름", type: "text", required: true },
        { name: "contactInfo", label: "연락처(이메일 또는 전화)", type: "text", required: true },
        { name: "reason", label: "요청 사유", type: "textarea", required: true, placeholder: "예: 협력 검토 / 기관 검증 / 보조금 집행 증빙 등" },
        { name: "agreed", label: "예, 개인정보 수집·이용에 동의합니다.", type: "checkbox", required: true }
      ],
      submit_button: { label: "요청 메일 보내기" },
      on_submit: {
        action: "send_email",
        to: "koreanyou@koreanyou.net",
        subject: "[공식요청] 파트너 증빙 자료 요청",
        body_template: "[파트너 증빙 자료 요청]\n- 요청 기관명: {{orgName}}\n- 담당자 이름: {{contactName}}\n- 연락처: {{contactInfo}}\n- 요청 사유: {{reason}}\n- 개인정보 동의: {{agreed}}"
      },
      success_message: "요청이 접수되었습니다. 담당자가 1~2일 내 회신드립니다."
    }
  ]
};

// 동적 렌더링 컴포넌트들
const Hero = ({ title, subtitle, note }) => (
  <div className="text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{title}</h1>
    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    {note && <p className="mt-2 text-sm text-gray-500 max-w-3xl mx-auto">{note}</p>}
  </div>
);

const Callout = ({ icon, title, body }) => {
  const IconComponent = iconMap[icon];
  return (
    <section className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
      <div className="flex items-start gap-4">
        {IconComponent && <IconComponent className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />}
        <div>
          <h2 className="text-xl font-bold text-blue-900 mb-2">{title}</h2>
          <p className="text-blue-800">{body}</p>
        </div>
      </div>
    </section>
  );
};

const PDFModal = ({ isOpen, onClose, pdfUrl, title }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
      <DialogHeader className="p-6 pb-0">
        <DialogTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title} - 협약서
        </DialogTitle>
      </DialogHeader>
      <div className="p-6 pt-4">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh] border rounded-lg"
            title={`${title} 협약서`}
          />
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">PDF를 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

const CardGrid = ({ cards }) => {
  const [pdfModal, setPdfModal] = useState({ isOpen: false, url: '', title: '' });

  const handlePDFClick = (e, action, cardTitle) => {
    if (action.href.endsWith('.pdf') || (action.href.includes('drive.google.com/file/') && action.href.includes('/preview')) || (action.href.includes('drive.google.com/file/') && action.href.includes('/view?usp=sharing'))) {
      e.preventDefault();
      setPdfModal({ isOpen: true, url: action.href, title: cardTitle });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <Card key={index} className={`${card.className || 'partner-card'} shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col`}>
            <CardContent className="p-6 flex flex-col flex-grow">
              {card.thumb_url ? (
                <div className="thumb">
                  <img src={card.thumb_url} alt={card.alt} style={{ objectFit: card.thumb_mode || 'contain' }} />
                </div>
              ) : (
                <div className="thumb--empty">{card.title}</div>
              )}
              <div className="flex flex-col flex-grow">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                </CardHeader>
                <div className="p-0 flex-grow">
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  {card.badges?.map(badge => <Badge key={badge} variant="secondary">{badge}</Badge>)}
                </div>
                <CardFooter className="p-0 mt-4 flex flex-wrap gap-2">
                  {card.actions?.map(action => {
                      let Icon = null;
                      let clickHandler = null;
                      
                      const isPdfLink = action.href.endsWith('.pdf') || (action.href.includes('drive.google.com/file/') && (action.href.includes('/preview') || action.href.includes('/view?usp=sharing')));

                      if (action.href.startsWith('http') && !isPdfLink) {
                        Icon = ExternalLink;
                      } else if (isPdfLink) {
                        Icon = Eye;
                        clickHandler = (e) => handlePDFClick(e, action, card.title);
                      } else if (action.href.startsWith('mailto:')) {
                        Icon = Mail;
                      }
                      
                      return (
                        <a key={action.label} href={action.href} target={action.target || '_self'} rel={action.rel} onClick={clickHandler}>
                          <Button size="sm" variant={action.variant || 'outline'}>
                            {Icon && <Icon className="w-4 h-4 mr-2"/>}
                            {action.label}
                          </Button>
                        </a>
                      );
                  })}
                </CardFooter>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <PDFModal 
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ isOpen: false, url: '', title: '' })}
        pdfUrl={pdfModal.url}
        title={pdfModal.title}
      />
    </>
  );
};

const TextSection = ({ content }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

const PopupForm = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const initialFormState = config.fields.reduce((acc, field) => {
    acc[field.name] = field.type === 'checkbox' ? false : '';
    return acc;
  }, {});
  const [formState, setFormState] = useState(initialFormState);

  const handleFormChange = (field, value) => setFormState(prev => ({ ...prev, [field]: value }));
  
  const resetForm = () => {
    setFormState(initialFormState);
    setSubmitSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (config.fields.some(f => f.required && !formState[f.name])) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }
    setIsSubmitting(true);
    try {
        let body = config.on_submit.body_template;
        Object.entries(formState).forEach(([key, value]) => {
            let val = value;
            if (typeof value === 'boolean') val = value ? '예' : '아니오';
            body = body.replace(`{{${key}}}`, val);
        });

        await SendEmail({
            to: config.on_submit.to,
            subject: config.on_submit.subject,
            body: body
        });
        setSubmitSuccess(true);
        setTimeout(() => {
            setIsOpen(false);
            resetForm();
        }, 3000);
    } catch (error) {
        alert('요청 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const CalloutIcon = config.callout && iconMap[config.callout.icon];
  const TriggerIcon = config.trigger_button.icon && iconMap[config.trigger_button.icon];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetForm(); }}>
      <section className="bg-white rounded-lg p-8 shadow">
        <div className="text-center">
            {CalloutIcon && <CalloutIcon className="w-10 h-10 text-blue-600 mx-auto mb-4" />}
            <h2 className="text-2xl font-bold">{config.callout.title}</h2>
            <p className="text-gray-600 mt-2 mb-6">{config.callout.body}</p>
            <DialogTrigger asChild>
                <Button>
                    {TriggerIcon && <TriggerIcon className="w-4 h-4 mr-2" />}
                    {config.trigger_button.label}
                </Button>
            </DialogTrigger>
        </div>
      </section>

      <DialogContent className="sm:max-w-md">
         {submitSuccess ? (
            <div className="text-center p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">요청 완료</h3>
              <p className="text-gray-600">{config.success_message}</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{config.title}</DialogTitle>
                <DialogDescription>{config.description}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                {config.fields.map(field => (
                    <div key={field.name} className={field.type === 'checkbox' ? "flex items-center space-x-2" : "space-y-1"}>
                        {field.type === 'text' && <>
                            <Label htmlFor={`req-${field.name}`}>{field.label} {field.required && '*'}</Label>
                            <Input id={`req-${field.name}`} value={formState[field.name]} onChange={e => handleFormChange(field.name, e.target.value)} placeholder={field.placeholder} required={field.required}/>
                        </>}
                        {field.type === 'textarea' && <>
                            <Label htmlFor={`req-${field.name}`}>{field.label} {field.required && '*'}</Label>
                            <Textarea id={`req-${field.name}`} value={formState[field.name]} onChange={e => handleFormChange(field.name, e.target.value)} placeholder={field.placeholder} required={field.required}/>
                        </>}
                        {field.type === 'checkbox' && <>
                            <Checkbox id={`req-${field.name}`} checked={formState[field.name]} onCheckedChange={(checked) => handleFormChange(field.name, checked)} required={field.required}/>
                            <label htmlFor={`req-${field.name}`} className="text-sm font-medium">{field.label} {field.required && '*'}</label>
                        </>}
                    </div>
                ))}
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 보내는 중...</> : config.submit_button.label}
                  </Button>
                </DialogFooter>
              </form>
            </>
         )}
      </DialogContent>
    </Dialog>
  );
}

export default function PartnersMOUPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              함께 성장하는 글로벌 파트너
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              KoreanClick은 다양한 글로벌 기업의 비영리 지원 프로그램과<br />
              공식 협약(MOU) 체결 기관들과의 협력을 통해<br />
              교육 기회를 확대하고 있습니다.
            </p>
            <p className="mt-4 text-sm text-gray-500 max-w-3xl mx-auto">
              ※ 본 페이지는 지원 프로그램 활용 현황과<br />
              기관 간 협약(MOU) 정보를 투명하게 공개합니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {pageConfig.blocks.map((block, index) => {
          switch (block.type) {
            case 'html': return <div key={index} dangerouslySetInnerHTML={{ __html: block.content }} />;
            case 'hero': return null;
            case 'callout': return <Callout key={index} {...block} />;
            case 'tabs': 
              const tabsConfig = block;
              return (
                <section key={index}>
                  <Tabs defaultValue={tabsConfig.tabs[0].id}>
                    <TabsList className={`grid w-full grid-cols-2 md:grid-cols-${tabsConfig.tabs.length}`}>
                      {tabsConfig.tabs.map(tab => <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>)}
                    </TabsList>
                    {tabsConfig.tabs.map(tab => (
                      <TabsContent key={tab.id} value={tab.id} className="pt-8">
                        {tabsConfig.content[tab.id].type === 'cardGrid' && <CardGrid {...tabsConfig.content[tab.id]} />}
                        {tabsConfig.content[tab.id].type === 'textSection' && <TextSection {...tabsConfig.content[tab.id]} />}
                      </TabsContent>
                    ))}
                  </Tabs>
                </section>
              );
            case 'divider': return <hr key={index} className="border-gray-200" />;
            case 'popup_form': return <PopupForm key={index} config={block} />;
            default: return null;
          }
        })}
      </main>
    </div>
  );
}
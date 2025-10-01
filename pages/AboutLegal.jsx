
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, Mail, Phone, ExternalLink, ListChecks, DollarSign, Info, Loader2, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { SendEmail } from '@/api/integrations'; // Assuming this integration exists and works as described

const cardData = [
  {
    id: 'certificate-request',
    title: "고유번호증 / 등록증",
    description: "관할기관 발급 문서 (개인정보 마스킹).",
    button: {
      text: "원본 요청(이메일)",
      icon: Mail,
    }
  },
  {
    title: "TechSoup 단체 인증",
    description: "비영리 단체 인증 완료.",
    button: {
      text: "인증 확인(외부 링크)",
      link: "https://www.techsoup.global",
      icon: ExternalLink,
    }
  },
  {
    title: "파트너 인증 / MOU",
    description: "협력기관 인증서·협약서 증빙.",
    button: {
      text: "증빙 보기",
      link: "/partners-mou",
    }
  }
];

const principles = [
  "실명 서류만 공개하며 개인정보는 마스킹 처리합니다.",
  "원본은 합리적 목적 확인 후 이메일로 제공합니다.",
  "모든 후원·지원금은 교육·국제교류 목적에만 사용합니다."
];

const financialTable = {
  columns: ["연도", "내용", "지출/금액", "비고"],
  rows: [
    ["2021~2023", "대표 개인 사비 운영", "0원", "후원 없음"],
    ["2023", "특정 행사 협력비 수령 및 운영", "150만원", "청소년 수련관 협력"],
    ["2024", "'독도는 한글땅' 국제교류 프로그램 운영", "700만원", "후원금 전액 교육비 사용"],
    ["2025", "등록 이후 수기 기록 중", "-", "연말 요약 보고 예정"]
  ],
  footer: "※ 현재까지 후원금은 0원이며, 모든 운영비는 대표 개인 사비로 충당되었습니다. 등록 이후 후원금이 발생할 경우 100% 교육 및 국제교류에만 사용됩니다."
};

const financialStats = [
  { label: "총 수입", value: "850만 원+" },
  { label: "총 지출", value: "850만 원+" },
  { label: "잔액", value: "0원 (연도별 변동)" }
];

const infoColumns = [
  {
    title: "기본 정보 (법정정보)",
    list: [
      "고유번호: 138-82-80474",
      "설립일: 2025-05-09",
      "소재지: 경기도 고양시 덕양구 지도로 103번길 61, 201-803",
      "이메일: koreanyou@koreanyou.net",
      "전화: +82-10-3337-8858"
    ]
  },
  {
    title: "인증 현황",
    list: [
      "Google for Nonprofits 가입",
      "TechSoup 단체 인증",
      "파트너 MOU 체결"
    ]
  }
];


export default function AboutLegalPage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formState, setFormState] = useState({
      orgName: '',
      contactName: '',
      contactInfo: '',
      reason: '',
      agreed: false,
  });

  const handleFormChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const resetForm = () => {
    setFormState({ orgName: '', contactName: '', contactInfo: '', reason: '', agreed: false });
    setSubmitSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.agreed) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return;
    }
    setIsSubmitting(true);
    try {
        const body = `
          [고유번호증 원본 요청]
          - 요청 기관명: ${formState.orgName}
          - 담당자 이름: ${formState.contactName}
          - 연락처: ${formState.contactInfo}
          - 요청 사유: ${formState.reason}
          - 개인정보 동의: 예
        `;
        await SendEmail({
            to: 'koreanyou@koreanyou.net',
            subject: '[공식요청] 고유번호증 원본 요청',
            body: body
        });
        setSubmitSuccess(true);
        setTimeout(() => {
            setIsRequestDialogOpen(false);
            resetForm();
        }, 3000); // Close dialog and reset form after 3 seconds
    } catch (error) {
        console.error("Email send failed:", error);
        alert('요청 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="pt-24 pb-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("About")}>
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> 소개 페이지로 돌아가기
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ShieldCheck className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">등록증·인증현황</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              KoreanClick International은 대한민국 비영리단체로, 법적 등록증과 외부 인증 현황을 투명하게 공개합니다. 모든 운영은 대표 개인 사비로 시작되었으며, 등록 이후 발생하는 후원금은 100% 교육 및 국제교류 목적으로만 사용됩니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* CardList Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">등록증·인증 현황</h2>
          <Dialog open={isRequestDialogOpen} onOpenChange={(open) => { setIsRequestDialogOpen(open); if(!open) resetForm(); }}>
            <div className="max-w-3xl mx-auto space-y-6">
              {cardData.map((card, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
                      <p className="text-gray-600 mt-1">{card.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {card.id === 'certificate-request' ? (
                        <DialogTrigger asChild>
                          <Button>
                            {card.button.text}
                            {card.button.icon && <card.button.icon className="w-4 h-4 ml-2" />}
                          </Button>
                        </DialogTrigger>
                      ) : (
                        <a 
                          href={card.button.link} 
                          target={card.button.link && !card.button.link.startsWith('/') ? '_blank' : '_self'} 
                          rel={card.button.link && !card.button.link.startsWith('/') ? 'noopener noreferrer' : undefined} 
                        >
                          <Button>
                            {card.button.text}
                            {card.button.icon ? <card.button.icon className="w-4 h-4 ml-2" /> : (card.button.link && !card.button.link.startsWith('/') && <ExternalLink className="w-4 h-4 ml-2" />)}
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogContent className="sm:max-w-[425px]">
              {submitSuccess ? (
                <div className="text-center p-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">요청 완료</h3>
                  <p className="text-gray-600">요청이 정상적으로 접수되었습니다. 담당자가 확인 후 이메일로 회신드리겠습니다.</p>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>고유번호증 원본 요청</DialogTitle>
                    <DialogDescription>
                      개인정보 보호를 위해 고유번호증 원본은 요청 시 이메일로 개별 제공됩니다. 요청 기관 정보 확인 후 1~2일 내 회신됩니다.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                    <div className="space-y-1">
                      <Label htmlFor="orgName">요청 기관명 <span className="text-red-500">*</span></Label>
                      <Input id="orgName" value={formState.orgName} onChange={e => handleFormChange('orgName', e.target.value)} placeholder="예: 한국청소년재단" required/>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="contactName">담당자 이름 <span className="text-red-500">*</span></Label>
                      <Input id="contactName" value={formState.contactName} onChange={e => handleFormChange('contactName', e.target.value)} placeholder="담당자 실명" required/>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="contactInfo">연락처 <span className="text-red-500">*</span></Label>
                      <Input id="contactInfo" value={formState.contactInfo} onChange={e => handleFormChange('contactInfo', e.target.value)} placeholder="이메일 또는 전화번호" required/>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="reason">요청 사유 <span className="text-red-500">*</span></Label>
                      <Textarea id="reason" value={formState.reason} onChange={e => handleFormChange('reason', e.target.value)} placeholder="예: 협력 검토, 기관 검증 등" required/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="agreed" checked={formState.agreed} onCheckedChange={(checked) => handleFormChange('agreed', checked)} />
                        <label htmlFor="agreed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            예, 개인정보 수집 및 이용에 동의합니다. <span className="text-red-500">*</span>
                        </label>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 보내는 중...</> : "요청 메일 보내기"}
                      </Button>
                    </DialogFooter>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>

        {/* Callout Section */}
        <section className="bg-gray-100 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <ListChecks className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">증빙 원칙</h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {principles.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Financial Transparency Section */}
        <section className="bg-blue-50 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Info className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">투명성 안내</h2>
              <p className="text-gray-700 leading-relaxed">
                2021~2024년은 대표 개인 사비로 운영되었습니다. <strong>2025년 5월 9일 비영리단체 등록 이후부터는 100% 공익 목적(교육·국제교류)에 사용됩니다.</strong> 모든 내역은 아래 표와 PDF 원문으로 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Financial Table Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">연도별 재정 내역</h2>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      {financialTable.columns.map((column, index) => (
                        <th key={index} className="text-left p-3 font-semibold text-gray-900 bg-gray-50">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {financialTable.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-3 text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer Note */}
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="text-sm text-gray-700">{financialTable.footer}</p>
              </div>

              {/* PDF Download Button */}
              <div className="mt-6 text-center">
                <a href="/files/재무보고서.pdf" download>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                    재무 보고서 PDF 다운로드
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Financial Summary Stats */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">재정 요약</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {financialStats.map((stat, index) => (
              <Card key={index} className="text-center shadow-md">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* InfoColumns Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infoColumns.map(column => (
              <Card key={column.title} className="shadow-md">
                <CardHeader>
                  <CardTitle>{column.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    {column.list.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Document Request Section (using mailto link as before, not the popup) */}
        <section 
          className="text-center rounded-lg p-8"
          style={{ backgroundColor: '#0057FF', color: '#FFFFFF' }}
        >
          <h3 className="text-2xl font-bold mb-4">확인이 필요하신가요?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            등록증, 인증, 재정 관련 증빙이 필요하신 경우 이메일로 요청하실 수 있습니다.
          </p>
          <a 
            href="mailto:koreanyou@koreanyou.net"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors"
            style={{ textDecoration: 'none' }}
          >
            이메일로 요청하기
          </a>
        </section>
      </main>
    </div>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, DollarSign, TrendingUp, Calculator } from 'lucide-react';

const financialNotice = [
  "2025년 5월 9일 비영리단체 등록 이전: 대표 개인 사비로 운영되었습니다.",
  "2023년: 청소년수련관 행사 협력비 150만 원 수령 (전체 1,500만 원 중 일부).",
  "2024년: '독도는 한글땅' 국제교류 후원금 700만 원을 전액 프로그램 운영에 사용했습니다.",
  "2025년 5월 9일 이후: 모든 후원금과 지원금은 100% 교육·국제교류에 사용됩니다.",
  "연간 결산보고서는 PDF로 공개 예정입니다."
];

const financialTableData = [
  {
    year: "2021~2022",
    content: "대표 개인 사비 운영",
    amount: "0원",
    note: "무료 한국어 수업 및 국제교류"
  },
  {
    year: "2023",
    content: "청소년수련관 행사 협력비",
    amount: "150만 원",
    note: "전체 1,500만 원 중 일부 수령"
  },
  {
    year: "2024",
    content: "독도는 한글땅 국제교류 후원금",
    amount: "700만 원",
    note: "전액 프로그램 운영"
  },
  {
    year: "2025",
    content: "비영리 등록 이후 후원금",
    amount: "추가 예정",
    note: "연간 결산보고서 공개 예정"
  }
];

const financialSummary = [
  { label: "총 수입", value: "850만 원+", icon: TrendingUp, color: "green" },
  { label: "총 지출", value: "850만 원+", icon: Calculator, color: "blue" },
  { label: "잔액", value: "0원 (연도별 변동)", icon: DollarSign, color: "purple" }
];

export default function FinancialTransparencyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("AboutLegal")}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> 법인등록·인증으로 돌아가기
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <DollarSign className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">재정 투명성</h1>
            <p className="mt-4 text-xl text-gray-600">
              모든 재정 활동을 투명하게 공개하여 신뢰를 바탕으로 운영합니다.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Financial Notice Callout */}
        <section className="bg-blue-50 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">재정 공개 안내</h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {financialNotice.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Financial Summary Cards */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">재정 요약</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {financialSummary.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className={`text-center shadow-lg border-t-4 border-${stat.color}-500`}>
                  <CardHeader>
                    <div className={`w-12 h-12 mx-auto bg-${stat.color}-100 rounded-full flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Financial Table */}
        <section className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-8">연도별 재정 내역</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">연도</TableHead>
                    <TableHead className="font-bold">내용</TableHead>
                    <TableHead className="font-bold">지원·후원금</TableHead>
                    <TableHead className="font-bold">비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialTableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.year}</TableCell>
                      <TableCell>{row.content}</TableCell>
                      <TableCell className="font-bold text-green-600">{row.amount}</TableCell>
                      <TableCell className="text-sm text-gray-600">{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">투명한 재정 관리</h3>
          <p className="text-green-100 mb-6">
            모든 수입과 지출을 투명하게 공개하여 후원자와 참가자 모두가 신뢰할 수 있는 교육기관을 만들어갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:koreanyou@koreanyou.net?subject=재정투명성문의">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                재정 문의하기
              </Button>
            </a>
            <Link to={createPageUrl("AboutLegal")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                등록증·인증 확인
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

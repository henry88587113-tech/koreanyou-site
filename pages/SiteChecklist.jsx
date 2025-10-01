import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const checklistItems = [
  {
    id: 1,
    text: "조직/운영/등록·인증/재정 공개 페이지가 메뉴 2클릭 이내 접근 가능",
    status: "completed",
    note: "소개 > 하위메뉴로 2클릭 이내 접근 가능"
  },
  {
    id: 2,
    text: "등록 이전=사비 운영, 등록 이후=100% 공익 사용 문구 표기",
    status: "completed", 
    note: "재정 투명성 페이지에 명시됨"
  },
  {
    id: 3,
    text: "PDF 규정/서류 링크 정상 작동 및 공개 접근 가능",
    status: "pending",
    note: "현재 placeholder 링크, 실제 PDF 업로드 필요"
  },
  {
    id: 4,
    text: "광고성 배너/3rd-party 수익광고 없음",
    status: "completed",
    note: "광고 콘텐츠 없음"
  },
  {
    id: 5,
    text: "연락처·주소·고유번호 정확히 표기",
    status: "completed",
    note: "레이아웃 footer에 모든 정보 표기됨"
  },
  {
    id: 6,
    text: "이미지 alt 텍스트 반영 및 웹 접근성 충족",
    status: "completed",
    note: "모든 이미지에 적절한 alt 텍스트 적용"
  },
  {
    id: 7,
    text: "불필요한 스크립트 제거, 이미지 최적화(1200px, JPG 80~85%)",
    status: "in-progress",
    note: "현재 Unsplash 이미지 사용 중, 최적화된 이미지로 교체 필요"
  }
];

export default function SiteChecklistPage() {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const handleCheck = (id) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">완료</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">진행 중</Badge>;
      case 'pending':
        return <Badge className="bg-red-500">대기</Badge>;
      default:
        return null;
    }
  };

  const completedCount = checklistItems.filter(item => item.status === 'completed').length;
  const totalCount = checklistItems.length;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">검수 체크리스트</CardTitle>
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                진행률: {completedCount}/{totalCount} ({Math.round((completedCount/totalCount) * 100)}%)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(item.status)}
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={checkedItems.has(item.id)}
                      onCheckedChange={() => handleCheck(item.id)}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <label 
                        htmlFor={`item-${item.id}`} 
                        className={`text-sm font-medium cursor-pointer ${
                          item.status === 'completed' ? 'text-green-800' : 'text-gray-900'
                        }`}
                      >
                        {item.text}
                      </label>
                      {getStatusBadge(item.status)}
                    </div>
                    {item.note && (
                      <p className="text-xs text-gray-600 mt-1">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-4">남은 작업</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>PDF 서류 파일 업로드 및 링크 연결</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span>이미지 최적화 (1200px, JPG 80~85% 압축)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
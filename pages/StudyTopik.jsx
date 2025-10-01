import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, CheckSquare } from 'lucide-react';

const files = [
  { name: 'TOPIK 준비 체크리스트 (PDF)', url: '#' },
  { name: 'EPS-TOPIK 모의문제 (PDF)', url: '#' },
];

export default function StudyTopikPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">TOPIK/EPS 준비</h1>
          <p className="mt-4 text-xl text-gray-600">시험 준비부터 고득점 전략까지, 모든 것을 알려드립니다.</p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>시험 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p><strong>TOPIK (Test of Proficiency in Korean)</strong>은 한국어를 모국어로 하지 않는 외국인 및 재외동포를 대상으로 하는 한국어 능력 시험입니다. 한국 내 대학 입학 및 졸업, 취업 등에 널리 활용됩니다.</p>
            <p><strong>EPS-TOPIK (Employment Permit System - TOPIK)</strong>은 고용허가제를 통해 한국에서 일하고자 하는 외국인 근로자를 대상으로 하는 시험입니다. 기본적인 의사소통 능력과 산업 안전 관련 이해도를 평가합니다.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-blue-600" />
              학습 자료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map(file => (
                <div key={file.name} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                  <span className="text-lg text-gray-800">{file.name}</span>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <FileDown className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
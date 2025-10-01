import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function StudyVisaPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">비자·서류 안내</h1>
          <p className="mt-4 text-xl text-gray-600">한국 유학 및 취업에 필요한 비자 종류와 서류 절차를 안내합니다.</p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <CardHeader>
            <CardTitle>주요 비자 종류</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="d2">
                <AccordionTrigger className="text-xl font-semibold">유학 (D-2) 비자</AccordionTrigger>
                <AccordionContent className="text-lg">
                  전문대학 이상의 교육기관에서 유학하는 학생을 위한 비자입니다. 입학허가서, 재정증명서 등이 필요합니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="d4">
                <AccordionTrigger className="text-xl font-semibold">일반연수 (D-4) 비자</AccordionTrigger>
                <AccordionContent className="text-lg">
                  대학 부설 어학당 등에서 한국어 연수를 받는 경우 필요한 비자입니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="e9">
                <AccordionTrigger className="text-xl font-semibold">비전문취업 (E-9) 비자</AccordionTrigger>
                <AccordionContent className="text-lg">
                  고용허가제를 통해 제조업, 농업 등의 분야에서 일하는 외국인 근로자를 위한 비자입니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="mt-6 text-sm text-gray-500">* 위 정보는 일반적인 안내이며, 정확한 정보는 거주 국가의 대한민국 대사관/영사관을 통해 반드시 확인해야 합니다.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
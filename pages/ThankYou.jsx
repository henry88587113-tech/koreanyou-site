import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, ArrowRight } from "lucide-react";

export default function ThankYou() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const conversionType = params.get('type');

    if (typeof window !== 'undefined' && window.gtag) {
      // Send conversion to Google Ads. 
      // Replace 'CONVERSION_LABEL' with the actual label from your Google Ads account.
      window.gtag('event', 'conversion', {
          'send_to': 'AW-YYYYYYYYYY/CONVERSION_LABEL_HERE',
      });

      // Send event to GA4
      if (conversionType) {
        window.gtag('event', conversionType);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              감사합니다!
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              신청/기부가 성공적으로 접수되었습니다.
              <br/>
              곧 연락 드리겠습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to={createPageUrl("Home")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Home className="w-5 h-5 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
              
              <Link to={createPageUrl("Programs")}>
                <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                  프로그램 둘러보기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500 mt-8">
          KoreanBridge와 함께 세계를 연결하는 한국어 교육에 참여해주셔서 감사합니다
        </p>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Newsletter subscription for:", email);
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-blue-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                뉴스레터 구독
              </h3>
              
              <p className="text-lg text-gray-600 mb-8">
                최신 소식과 이벤트를 이메일로 받아보세요.
              </p>

              {isSubmitted ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                  구독 신청이 완료되었습니다! 감사합니다.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-12 text-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-6 text-lg font-semibold"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    구독하기
                  </Button>
                </form>
              )}

              <p className="text-sm text-gray-500 mt-4">
                언제든지 구독을 해지할 수 있습니다. 
                <br className="hidden sm:inline" />
                개인정보는 안전하게 보호됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
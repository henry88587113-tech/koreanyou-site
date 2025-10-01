import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';

const logos = [
  { name: 'Google for Education', url: 'https://edu.google.com/', logo: 'https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg' },
  { name: 'Microsoft Philanthropies', url: 'https://www.microsoft.com/en-us/philanthropies', logo: 'https://logos-world.net/wp-content/uploads/2021/02/Microsoft-Logo-2012-present.jpg' },
  { name: 'AWS Educate', url: 'https://aws.amazon.com/education/awseducate/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png' },
];

export default function PartnerStrip() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">함께하는 파트너</h2>
          <p className="mt-4 text-lg text-gray-600">
            파트너와 더 많은 학생들을 연결합니다.
          </p>
        </div>
        <div className="mt-10">
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12">
            {logos.map((logo) => (
              <a key={logo.name} href={logo.url} target="_blank" rel="noopener noreferrer" className="flex justify-center">
                <img
                  className="max-h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  src={logo.logo}
                  alt={logo.name}
                  loading="lazy"
                />
              </a>
            ))}
            <div className="text-center">
                <p className="text-gray-700 font-semibold mb-2">파트너 기관 모집 중입니다</p>
                <Link to={createPageUrl("Participate")}>
                    <Button variant="outline">
                        <Handshake className="w-4 h-4 mr-2" />
                        문의하기
                    </Button>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
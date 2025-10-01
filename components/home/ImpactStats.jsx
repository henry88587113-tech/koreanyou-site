import React from "react";

const stats = [
    { value: "1,200명+", label: "참여 학습자" },
    { value: "15개국", label: "활동 국가" },
    { value: "98%", label: "학습 만족도" },
    { value: "2,400+", label: "교육 지원 시간" },
];

export default function ImpactStats({ impacts }) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
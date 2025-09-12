import React, { useState } from 'react';

interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  if (totalValue === 0) {
    return (
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">{title}</h3>
            <p className="text-center text-gray-500 py-10">Tidak ada data</p>
        </div>
    );
  }

  let cumulativePercentage = 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">{title}</h3>
        <div className="flex flex-col md:flex-row items-center justify-around">
            <div className="relative w-40 h-40">
            <svg viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e6e6e6" strokeWidth="3.8" />
                {data.map((d) => {
                const percentage = (d.value / totalValue) * 100;
                const offset = cumulativePercentage;
                cumulativePercentage += percentage;
                return (
                    <circle
                    key={d.label}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={d.color}
                    strokeWidth="3.8"
                    strokeDasharray={`${percentage}, 100`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-300"
                    onMouseEnter={() => setHoveredSegment(d.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    />
                );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                    {hoveredSegment ? data.find(d => d.label === hoveredSegment)?.value : totalValue}
                </span>
                <span className="text-xs text-gray-500">
                    {hoveredSegment || 'Total'}
                </span>
            </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 text-sm">
                <ul className="space-y-1">
                {data.map((d) => (
                    <li key={d.label} className="flex items-center">
                    <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span>{d.label}: <strong>{d.value}</strong> ({totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : 0}%)</span>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    </div>
  );
};
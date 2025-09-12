import React from 'react';

interface HorizontalBarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, title }) => {
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">{title}</h3>
      {totalValue > 0 ? (
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.label}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-gray-600">{d.label}</span>
                <span className="font-semibold text-gray-800">{d.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalValue > 0 ? (d.value / totalValue) * 100 : 0}%`,
                    backgroundColor: d.color
                  }}
                  title={`${totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : 0}%`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Tidak ada data</p>
      )}
    </div>
  );
};
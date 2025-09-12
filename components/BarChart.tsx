import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  if (data.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">{title}</h3>
        <p className="text-center text-gray-500 py-10">Tidak ada data</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1); // Use 1 to avoid division by zero
  const barHeight = 30;
  const barMargin = 15;
  const leftLabelWidth = 120; 
  const rightValueWidth = 40;
  const chartWidth = 500; 
  const chartHeight = data.length * (barHeight + barMargin) - barMargin;
  const barAreaWidth = chartWidth - leftLabelWidth - rightValueWidth;

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">{title}</h3>
      <div className="overflow-x-auto">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMinYMin meet" aria-labelledby="title" role="img">
          <title id="title">{title}</title>
          {data.map((d, i) => {
            const barWidth = (d.value / maxValue) * barAreaWidth;
            const y = i * (barHeight + barMargin);
            
            const valueText = d.value.toString();
            // Estimate text width (approx. 7px per character for a small font) and add padding
            const textWidthEstimate = valueText.length * 7 + 10;
            const textFitsInside = barWidth > textWidthEstimate;

            const valueX = textFitsInside ? leftLabelWidth + barWidth - 5 : leftLabelWidth + barWidth + 5;
            const valueAnchor = textFitsInside ? 'end' : 'start';
            const valueFill = textFitsInside ? 'fill-white' : 'fill-gray-800';

            return (
              <g key={d.label} transform={`translate(0, ${y})`} className="bar-group">
                <title>{`${d.label}: ${d.value}`}</title>
                <text
                  x={leftLabelWidth - 10}
                  y={barHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-sm fill-gray-600"
                >
                  {d.label}
                </text>
                <rect
                  x={leftLabelWidth}
                  y="0"
                  width={barWidth}
                  height={barHeight}
                  fill="#3b82f6"
                  className="transition-all duration-300 hover:fill-blue-700"
                  rx="3"
                />
                <text
                  x={valueX}
                  y={barHeight / 2}
                  textAnchor={valueAnchor}
                  dominantBaseline="middle"
                  className={`text-xs font-bold ${valueFill} pointer-events-none transition-all duration-300`}
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

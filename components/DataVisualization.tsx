import React, { useState, useMemo } from 'react';
import { DataRow } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LightBulbIcon } from './Icons';

interface DataVisualizationProps {
    headers: string[];
    data: DataRow[];
}

type ChartType = 'bar' | 'line';

const DataVisualization: React.FC<DataVisualizationProps> = ({ headers, data }) => {
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [xAxisKey, setXAxisKey] = useState<string | null>(null);
    const [yAxisKey, setYAxisKey] = useState<string | null>(null);

    const numericalHeaders = useMemo(() => {
        if (data.length === 0) return [];
        return headers.filter(header =>
            data.some(row => typeof row[header] === 'number')
        );
    }, [data, headers]);

    const renderChart = () => {
        if (!xAxisKey || !yAxisKey) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary bg-brand-surface rounded-xl shadow-lg p-8">
                    <LightBulbIcon className="h-10 w-10 text-yellow-400 mb-4" />
                    <h4 className="font-semibold text-lg text-brand-text-primary mb-1">Create a Chart</h4>
                    <p>Please select an X-axis and a Y-axis from the dropdowns above to generate a visualization.</p>
                </div>
            );
        }

        const ChartComponent = chartType === 'bar' ? BarChart : LineChart;
        const ChartElement = chartType === 'bar' ? Bar : Line;

        return (
             <div className="bg-brand-surface rounded-xl shadow-lg p-6 pt-10" style={{ height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ChartComponent
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey={xAxisKey} stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #475569',
                                color: '#f8fafc'
                            }}
                        />
                        <Legend wrapperStyle={{ color: '#f8fafc' }} />
                        <ChartElement dataKey={yAxisKey} fill="#0284c7" stroke="#0284c7" />
                    </ChartComponent>
                </ResponsiveContainer>
            </div>
        );
    };

    const commonSelectClass = "w-full md:w-auto bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-brand-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition";

    return (
        <div>
            <div className="bg-brand-surface/50 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-auto">
                    <label htmlFor="chart-type" className="block text-sm font-medium text-brand-text-secondary mb-1">Chart Type</label>
                    <select id="chart-type" value={chartType} onChange={e => setChartType(e.target.value as ChartType)} className={commonSelectClass}>
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                    </select>
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="x-axis" className="block text-sm font-medium text-brand-text-secondary mb-1">X-Axis</label>
                    <select id="x-axis" value={xAxisKey ?? ''} onChange={e => setXAxisKey(e.target.value || null)} className={commonSelectClass}>
                        <option value="">Select column...</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="y-axis" className="block text-sm font-medium text-brand-text-secondary mb-1">Y-Axis (Numerical)</label>
                    <select id="y-axis" value={yAxisKey ?? ''} onChange={e => setYAxisKey(e.target.value || null)} className={commonSelectClass}>
                        <option value="">Select column...</option>
                        {numericalHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>
            {renderChart()}
        </div>
    );
};

export default DataVisualization;
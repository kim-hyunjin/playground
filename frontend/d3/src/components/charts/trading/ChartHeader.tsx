import React from 'react'
import * as d3 from 'd3'
import type { OHLCData } from './types'

interface ChartHeaderProps {
    hoverData: OHLCData | null
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ hoverData }) => {
    return (
        <div className="flex justify-between items-start mb-6 h-20">
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                    거래소 차트 (드래그 & 줌)
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    드래그로 이동, 휠로 확대/축소가 가능합니다.
                </p>
            </div>

            <div className="flex-grow flex justify-end">
                {hoverData ? (
                    <div className="flex gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs animate-in fade-in duration-200">
                        <div>
                            <span className="text-gray-400 block uppercase">
                                Date
                            </span>
                            <span className="font-bold text-slate-700">
                                {d3.timeFormat('%Y-%m-%d')(hoverData.date)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 block uppercase">
                                Open
                            </span>
                            <span className="font-bold text-slate-700">
                                {hoverData.open.toFixed(2)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 block uppercase">
                                High
                            </span>
                            <span className="font-bold text-red-500">
                                {hoverData.high.toFixed(2)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 block uppercase">
                                Low
                            </span>
                            <span className="font-bold text-blue-500">
                                {hoverData.low.toFixed(2)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 block uppercase">
                                Close
                            </span>
                            <span className="font-bold text-slate-700">
                                {hoverData.close.toFixed(2)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 block uppercase">
                                Volume
                            </span>
                            <span className="font-bold text-slate-700">
                                {hoverData.volume.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-gray-300 self-center">
                        차트에 마우스를 올려 상세 시세를 확인하세요
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChartHeader

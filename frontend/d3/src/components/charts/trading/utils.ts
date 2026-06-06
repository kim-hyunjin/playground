import type { OHLCData } from './types'

export const generateMoreData = (
    baseDate: Date,
    count: number,
    startPrice: number
): OHLCData[] => {
    let currentPrice = startPrice
    const start = new Date(baseDate)
    start.setHours(0, 0, 0, 0)

    return Array.from({ length: count }, (_, i) => {
        const open = currentPrice + (Math.random() - 0.5) * 10
        const close = open + (Math.random() - 0.5) * 15
        const high = Math.max(open, close) + Math.random() * 5
        const low = Math.min(open, close) - Math.random() * 5
        const volume = Math.floor(Math.random() * 1000) + 500
        currentPrice = close

        const date = new Date(start)
        date.setDate(date.getDate() - (i + 1))
        return { date, open, high, low, close, volume }
    }).reverse()
}

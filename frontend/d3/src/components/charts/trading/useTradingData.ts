import { useState, useRef } from 'react'
import { INITIAL_VISIBLE } from './types'
import type { OHLCData } from './types'
import { generateMoreData } from './utils'

export const useTradingData = () => {
    const [fullData, setFullData] = useState<OHLCData[]>(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return generateMoreData(today, 100, 150)
    })
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
    const [viewOffset, setViewOffset] = useState(
        () => fullData.length - INITIAL_VISIBLE
    )
    const isLoading = useRef(false)

    const loadMoreData = () => {
        if (isLoading.current) return
        isLoading.current = true

        const oldestDate = fullData[0].date
        const newData = generateMoreData(oldestDate, 30, fullData[0].open)

        setFullData((prev) => {
            const oldestTs = prev[0].date.getTime()
            const uniqueNew = newData.filter((d) => d.date.getTime() < oldestTs)

            if (uniqueNew.length > 0) {
                const addedCount = uniqueNew.length
                setViewOffset((v) => v + addedCount)
                return [...uniqueNew, ...prev]
            }
            return prev
        })

        setTimeout(() => {
            isLoading.current = false
        }, 200)
    }

    return {
        fullData,
        visibleCount,
        setVisibleCount,
        viewOffset,
        setViewOffset,
        loadMoreData,
        isLoading,
    }
}

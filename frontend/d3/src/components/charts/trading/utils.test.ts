import { describe, it, expect } from 'vitest'
import { generateMoreData } from './utils'

describe('Trading Chart Utils', () => {
    describe('generateMoreData', () => {
        it('generates the requested number of data points', () => {
            const count = 50
            const data = generateMoreData(new Date(), count, 100)
            expect(data).toHaveLength(count)
        })

        it('generates data in chronological order', () => {
            const data = generateMoreData(new Date(), 10, 100)
            for (let i = 1; i < data.length; i++) {
                expect(data[i].date.getTime()).toBeGreaterThan(
                    data[i - 1].date.getTime()
                )
            }
        })

        it('sets hours to 0 for all generated dates', () => {
            const data = generateMoreData(new Date(), 5, 100)
            data.forEach((d) => {
                expect(d.date.getHours()).toBe(0)
                expect(d.date.getMinutes()).toBe(0)
                expect(d.date.getSeconds()).toBe(0)
                expect(d.date.getMilliseconds()).toBe(0)
            })
        })

        it('ensures high is the highest and low is the lowest in each point', () => {
            const data = generateMoreData(new Date(), 20, 150)
            data.forEach((d) => {
                expect(d.high).toBeGreaterThanOrEqual(d.open)
                expect(d.high).toBeGreaterThanOrEqual(d.close)
                expect(d.low).toBeLessThanOrEqual(d.open)
                expect(d.low).toBeLessThanOrEqual(d.close)
            })
        })
    })
})

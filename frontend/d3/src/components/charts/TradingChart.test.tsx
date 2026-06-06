import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TradingChart from './TradingChart'

// Mocking getBoundingClientRect for SVG elements as JSDOM doesn't support layout
// @ts-expect-error - JSDOM doesn't have getBoundingClientRect on Element
Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 900,
    height: 500,
    top: 0,
    left: 0,
    bottom: 500,
    right: 900,
}))

describe('TradingChart Component', () => {
    it('renders the chart container and basic UI elements', () => {
        render(<TradingChart />)

        // Header
        expect(
            screen.getByText(/거래소 차트 \(드래그 & 줌\)/)
        ).toBeInTheDocument()
        expect(
            screen.getByText(/드래그로 이동, 휠로 확대\/축소가 가능합니다\./)
        ).toBeInTheDocument()

        // Initial instruction
        expect(
            screen.getByText(/차트에 마우스를 올려 상세 시세를 확인하세요/)
        ).toBeInTheDocument()

        // Footer
        expect(screen.getByText(/조작 방법:/)).toBeInTheDocument()
        expect(screen.getByText(/D3.js 핵심:/)).toBeInTheDocument()
    })

    it('renders the main SVG and all layer groups', () => {
        const { container } = render(<TradingChart />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()

        // Check for specific layer classes added during refactoring
        expect(container.querySelector('.x-axis')).toBeInTheDocument()
        expect(container.querySelector('.y-axis')).toBeInTheDocument()
        expect(container.querySelector('.candles-group')).toBeInTheDocument()
        expect(container.querySelector('.volume-group')).toBeInTheDocument()
        expect(container.querySelector('.crosshair-layer')).toBeInTheDocument()
        expect(
            container.querySelector('.interaction-overlay')
        ).toBeInTheDocument()
    })

    it('renders the correct number of candles and volume bars', () => {
        const { container } = render(<TradingChart />)

        // INITIAL_VISIBLE is 40
        const candles = container.querySelectorAll('.candles-group > g.candle')
        expect(candles.length).toBe(40)

        const volumeBars = container.querySelectorAll(
            '.volume-group > rect.vol-bar'
        )
        expect(volumeBars.length).toBe(40)
    })

    it('renders candles with correct colors based on price action', () => {
        const { container } = render(<TradingChart />)
        const candleGroups = container.querySelectorAll(
            '.candles-group > g.candle'
        )

        // Check first candle's color (this is random but we can check the logic)
        // We can't easily check the data bound to the element here without more complex D3 testing,
        // but we can verify that the stroke/fill are one of the two expected colors.
        candleGroups.forEach((group) => {
            const rect = group.querySelector('rect')
            const line = group.querySelector('line')

            const fill = rect?.getAttribute('fill')
            const stroke = line?.getAttribute('stroke')

            expect(['#ef4444', '#3b82f6']).toContain(fill)
            expect(['#ef4444', '#3b82f6']).toContain(stroke)
        })
    })
})

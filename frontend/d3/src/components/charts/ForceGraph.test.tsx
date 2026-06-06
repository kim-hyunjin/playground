import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ForceGraph from './ForceGraph'
import type { ForceNode, ForceLink } from './ForceGraph'

describe('ForceGraph Component', () => {
    it('renders the component with titles and description', () => {
        render(<ForceGraph />)

        expect(
            screen.getByText('포스 디렉티드 그래프 (Force-Directed Graph)')
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                /물리 시뮬레이션을 통해 노드 간의 관계를 시각화합니다/
            )
        ).toBeInTheDocument()
        expect(screen.getByTestId('force-graph-svg')).toBeInTheDocument()
    })

    it('renders default nodes and links', () => {
        const { container } = render(<ForceGraph />)

        // 7 default nodes
        const nodes = container.querySelectorAll('.node-item')
        expect(nodes.length).toBe(7)

        // 7 default links
        const links = container.querySelectorAll('.links-group line')
        expect(links.length).toBe(7)
    })

    it('renders custom nodes and links when provided via props', () => {
        const customNodes: ForceNode[] = [
            { id: 'A', group: 1 },
            { id: 'B', group: 1 },
            { id: 'C', group: 2 },
        ]
        const customLinks: ForceLink[] = [
            { source: 'A', target: 'B', value: 1 },
            { source: 'B', target: 'C', value: 1 },
        ]

        const { container } = render(
            <ForceGraph nodes={customNodes} links={customLinks} />
        )

        const nodes = container.querySelectorAll('.node-item')
        expect(nodes.length).toBe(3)

        const links = container.querySelectorAll('.links-group line')
        expect(links.length).toBe(2)

        expect(screen.getByText('A')).toBeInTheDocument()
        expect(screen.getByText('B')).toBeInTheDocument()
        expect(screen.getByText('C')).toBeInTheDocument()
    })

    it('updates when props change', () => {
        const { container, rerender } = render(
            <ForceGraph nodes={[]} links={[]} />
        )

        expect(container.querySelectorAll('.node-item').length).toBe(0)

        const newNodes: ForceNode[] = [{ id: 'Solo', group: 1 }]
        rerender(<ForceGraph nodes={newNodes} links={[]} />)

        expect(container.querySelectorAll('.node-item').length).toBe(1)
        expect(screen.getByText('Solo')).toBeInTheDocument()
    })
})

export interface OHLCData {
    date: Date
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export const MIN_VISIBLE = 10
export const MAX_VISIBLE = 200
export const INITIAL_VISIBLE = 40

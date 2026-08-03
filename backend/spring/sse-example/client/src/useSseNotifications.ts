import { useCallback, useEffect, useRef, useState } from 'react'

export type ConnectionStatus = 'connecting' | 'open' | 'closed'

export interface NotificationEvent {
  id: number
  type: 'connected' | 'notification'
  message: string
  sentAt: string
}

const MAX_EVENTS = 50

export function useSseNotifications() {
  const eventSourceRef = useRef<EventSource | null>(null)
  const [events, setEvents] = useState<NotificationEvent[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('closed')

  const disconnect = useCallback(() => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setStatus('closed')
  }, [])

  const connect = useCallback(() => {
    eventSourceRef.current?.close()
    setStatus('connecting')

    const eventSource = new EventSource('/api/notifications/stream')
    eventSourceRef.current = eventSource

    const receive = (event: MessageEvent<string>) => {
      const notification = JSON.parse(event.data) as NotificationEvent
      setEvents((current) => [notification, ...current].slice(0, MAX_EVENTS))
    }

    eventSource.addEventListener('connected', receive)
    eventSource.addEventListener('notification', receive)
    eventSource.onopen = () => setStatus('open')
    eventSource.onerror = () => setStatus('connecting')
  }, [])

  useEffect(() => {
    connect()
    return () => eventSourceRef.current?.close()
  }, [connect])

  const clearEvents = useCallback(() => setEvents([]), [])

  return { events, status, connect, disconnect, clearEvents }
}


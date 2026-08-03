import { FormEvent, useState } from 'react'
import { ConnectionStatus, useSseNotifications } from './useSseNotifications'

const statusLabel: Record<ConnectionStatus, string> = {
  connecting: '연결 중',
  open: '연결됨',
  closed: '연결 끊김',
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

export default function App() {
  const { events, status, connect, disconnect, clearEvents } = useSseNotifications()
  const [message, setMessage] = useState('새 주문이 접수되었습니다.')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    setIsPublishing(true)
    setPublishError('')

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      })

      if (!response.ok) {
        throw new Error(`알림 발행에 실패했습니다. (${response.status})`)
      }

      setMessage('')
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : '알림 발행에 실패했습니다.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">SERVER-SENT EVENTS LAB</p>
          <h1>Spring에서 React로,<br />한 방향의 실시간 스트림</h1>
          <p className="description">
            브라우저의 <code>EventSource</code>가 Spring Boot의 <code>SseEmitter</code>를
            구독합니다. 서버는 3초마다 이벤트를 보내며, 아래 폼으로 직접 발행할 수도 있습니다.
          </p>
        </div>

        <div className={`connection-card ${status}`}>
          <div className="connection-heading">
            <span className="status-dot" aria-hidden="true" />
            <span>{statusLabel[status]}</span>
          </div>
          <code>GET /api/notifications/stream</code>
          <div className="button-row">
            {status === 'closed' ? (
              <button type="button" className="secondary-button" onClick={connect}>다시 연결</button>
            ) : (
              <button type="button" className="secondary-button" onClick={disconnect}>연결 끊기</button>
            )}
          </div>
        </div>
      </section>

      <section className="workspace">
        <form className="publisher" onSubmit={publish}>
          <div>
            <p className="section-kicker">PUBLISH</p>
            <h2>서버 이벤트 발행</h2>
          </div>
          <label htmlFor="message">알림 메시지</label>
          <textarea
            id="message"
            value={message}
            maxLength={200}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="전송할 메시지를 입력하세요"
          />
          <div className="form-footer">
            <span>{message.length}/200</span>
            <button type="submit" className="primary-button" disabled={isPublishing || !message.trim()}>
              {isPublishing ? '발행 중…' : '이벤트 발행'}
            </button>
          </div>
          {publishError && <p className="error-message" role="alert">{publishError}</p>}
        </form>

        <section className="event-panel">
          <header className="event-header">
            <div>
              <p className="section-kicker">LIVE FEED</p>
              <h2>수신 이벤트 <span>{events.length}</span></h2>
            </div>
            <button type="button" className="text-button" onClick={clearEvents} disabled={!events.length}>
              모두 지우기
            </button>
          </header>

          <div className="event-list" aria-live="polite">
            {events.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">↯</span>
                <p>서버 이벤트를 기다리는 중입니다.</p>
              </div>
            ) : (
              events.map((event) => (
                <article className="event-item" key={event.id}>
                  <span className={`event-icon ${event.type}`}>{event.type === 'connected' ? '✓' : '↯'}</span>
                  <div>
                    <div className="event-meta">
                      <span>{event.type}</span>
                      <time dateTime={event.sentAt}>{formatTime(event.sentAt)}</time>
                    </div>
                    <p>{event.message}</p>
                  </div>
                  <code>#{event.id}</code>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}


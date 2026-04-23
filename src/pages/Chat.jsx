import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AppShell } from '../components/AppShell'
import { PageHeader } from '../components/PageHeader'
import { Alert } from '../components/Alert'
import ChatMarkdown from '../components/ChatMarkdown'
import { cn } from '../utils/cn'

function getCurrentUserId() {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return 'anonymous'
    const parsed = JSON.parse(raw)
    return typeof parsed?.email === 'string' && parsed.email.length > 0
      ? parsed.email
      : 'anonymous'
  } catch {
    return 'anonymous'
  }
}

const SUGGESTIONS = [
  {
    title: 'The three doshas',
    prompt: 'What are the three doshas in Ayurveda and how do they differ?',
  },
  {
    title: 'Afternoon slump',
    prompt: 'I feel tired every afternoon — which dosha might be imbalanced?',
  },
  {
    title: 'Vata morning routine',
    prompt: 'Suggest a simple morning routine for a Vata-dominant person.',
  },
  {
    title: 'Pitta-friendly foods',
    prompt: 'Which foods should I favor and avoid for a Pitta imbalance?',
  },
]

function Chat() {
  const userId = useMemo(() => getCurrentUserId(), [])
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: ({ body, messages }) => ({
          body: { ...body, messages, userId },
        }),
      }),
    [userId],
  )
  const { messages, sendMessage, status, stop, error } = useChat({ transport })

  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  const isStreaming = status === 'submitted' || status === 'streaming'
  const isEmpty = messages.length === 0

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, status])

  const handleSend = (text) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    sendMessage({ text: trimmed })
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend(input)
    }
  }

  const handleInputChange = (event) => {
    setInput(event.target.value)
    const el = event.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <AppShell contentClassName="flex min-h-screen flex-col">
      <PageHeader
        eyebrow="TriDosha AI"
        title="Chat"
        description="Ask about Ayurveda, doshas, routines, and lifestyle guidance."
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 lg:px-8"
      >
        <div className="mx-auto w-full max-w-3xl">
          {isEmpty ? (
            <EmptyState onPick={(prompt) => handleSend(prompt)} />
          ) : (
            <div className="space-y-5">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isStreaming &&
                messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-slate-500 shadow-sm ring-1 ring-slate-200/80">
                      <TypingDots />
                    </div>
                  </div>
                )}

              {error && (
                <Alert
                  variant="error"
                  title="Something went wrong"
                  description={
                    error.message ||
                    'The assistant could not respond. Please try again.'
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-emerald-100/60 bg-white/80 px-4 py-4 backdrop-blur-xl lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_4px_24px_-12px_rgba(16,185,129,0.25)] transition focus-within:border-emerald-400 focus-within:shadow-[0_6px_32px_-12px_rgba(16,185,129,0.35)]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message TriDosha AI…"
              disabled={isStreaming}
              className="max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <span className="block h-2.5 w-2.5 rounded-sm bg-white" />
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                aria-label="Send message"
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition',
                  'hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400',
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            TriDosha AI can make mistakes. Consult a qualified practitioner for
            medical concerns.
          </p>
        </div>
      </div>
    </AppShell>
  )
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  const text = messagePartsToText(message)

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed shadow-sm',
          isUser
            ? 'whitespace-pre-wrap rounded-br-md bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-emerald-900/10'
            : 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200/80',
        )}
      >
        {isUser ? (
          text || <span className="text-white/70">…</span>
        ) : text ? (
          <ChatMarkdown>{text}</ChatMarkdown>
        ) : (
          <span className="text-slate-400">…</span>
        )}
      </div>
    </div>
  )
}

function messagePartsToText(message) {
  if (!Array.isArray(message.parts)) return ''
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

function EmptyState({ onPick }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl text-white shadow-lg shadow-emerald-600/20"
      >
        ॐ
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
        How can I help you today?
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Ask anything about Ayurveda — doshas, daily routines, symptoms, diet,
        herbs, and more.
      </p>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.title}
            type="button"
            onClick={() => onPick(suggestion.prompt)}
            className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-white/85 px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-600/5"
          >
            <span className="text-sm font-semibold text-slate-900 transition group-hover:text-emerald-800">
              {suggestion.title}
            </span>
            <span className="mt-1 line-clamp-2 text-xs text-slate-500">
              {suggestion.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
    </span>
  )
}

export default Chat

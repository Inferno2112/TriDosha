import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Sidebar } from '../components/Sidebar'
import { Alert } from '../components/Alert'
import { cn } from '../utils/cn'

const SUGGESTIONS = [
  'What are the three doshas in Ayurveda?',
  'I feel tired in the afternoon — which dosha might be imbalanced?',
  'Suggest a simple morning routine for a Vata-dominant person.',
  'Foods to favor and avoid for Pitta imbalance?',
]

function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  const isStreaming = status === 'submitted' || status === 'streaming'

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-20 flex w-full flex-col lg:ml-64">
        <header className="border-b border-slate-200 bg-white px-6 py-4 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">AI Chat</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ask TriDosha AI about Ayurveda, doshas, routines, and lifestyle guidance.
          </p>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 lg:px-8"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 ? (
              <EmptyState onPick={(text) => handleSend(text)} />
            ) : (
              messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))
            )}

            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <Alert
                variant="error"
                title="Something went wrong"
                description={
                  error.message || 'The assistant could not respond. Please try again.'
                }
              />
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about doshas, symptoms, routines…"
                disabled={isStreaming}
                className="max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className={cn(
                    'rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition',
                    'hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  Send
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">
              TriDosha AI can make mistakes — always consult a qualified practitioner for medical concerns.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  const text = messagePartsToText(message)

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ring-1',
          isUser
            ? 'rounded-br-sm bg-emerald-600 text-white ring-emerald-700/20'
            : 'rounded-bl-sm bg-white text-slate-800 ring-slate-200',
        )}
      >
        {text || <span className="text-slate-400">…</span>}
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
    <div className="mt-8 flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        🌿
      </div>
      <h2 className="text-xl font-semibold text-slate-900">
        Welcome to TriDosha AI Chat
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Ask anything about Ayurveda — doshas, daily routines, symptoms, diet, herbs, and more.
      </p>
      <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            {suggestion}
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

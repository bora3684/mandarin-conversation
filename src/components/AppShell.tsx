import type { ReactNode } from 'react'

type Props = { children: ReactNode; onHome?: () => void; screen: string }

export default function AppShell({ children, onHome, screen }: Props) {
  return <div className={`app-shell ${screen === 'intro' ? 'intro-shell' : ''}`}>
    {screen !== 'intro' && <header className="site-header">
      <button className="wordmark" onClick={onHome} disabled={!onHome} aria-label="Go to home">Mandarin Conversation</button>
      {screen === 'level' && <span className="header-step">LEVEL 1</span>}
    </header>}
    <main>{children}</main>
    {screen !== 'intro' && <footer className="site-footer"><span>Mandarin Conversation</span><span>DESKTOP PROTOTYPE</span></footer>}
  </div>
}

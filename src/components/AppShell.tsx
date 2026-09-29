import type { ReactNode } from 'react'

type Props = { children: ReactNode; onHome?: () => void; screen: string }

export default function AppShell({ children, onHome, screen }: Props) {
  return <div className={`app-shell ${screen === 'intro' ? 'intro-shell' : ''} ${screen === 'level' ? 'level-shell' : ''}`}>
    {screen !== 'intro' && screen !== 'onboarding' && screen !== 'placement' && <header className="site-header">
      <button className="wordmark" onClick={onHome} disabled={!onHome} aria-label="Go to home"><img src="/mao-mark.svg" alt="" />mao</button>
      {screen === 'level' && <span className="header-step">LEVEL 1</span>}
    </header>}
    <main>{children}</main>
    {screen !== 'intro' && <footer className="site-footer"><span>mao</span><span>DESKTOP PROTOTYPE</span></footer>}
  </div>
}

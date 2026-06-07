'use client'

import { Navigation } from './navigation'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 lg:ml-64 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  )
}

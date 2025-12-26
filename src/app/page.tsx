import { MainCountdown } from '@/components/countdown/main-countdown'
import { MainNavigation } from '@/components/navigation/main-navigation'

export default function Home() {
  return (
    <main className="min-h-screen">
      <MainCountdown />
      <MainNavigation />
    </main>
  )
}
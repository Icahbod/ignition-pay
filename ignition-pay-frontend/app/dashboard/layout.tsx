import { AppWrapper } from '@/components/app-wrapper'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppWrapper>{children}</AppWrapper>
}

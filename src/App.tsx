import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { ProfileProvider } from './context/ProfileContext'
import { AppLayout } from './components/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { AssetsPage } from './pages/AssetsPage'
import { FamilyPage } from './pages/FamilyPage'
import { ReadinessPage } from './pages/ReadinessPage'
import { LearnPage } from './pages/LearnPage'
import { SummaryPage } from './pages/SummaryPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ProfileProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="assets" element={<AssetsPage />} />
              <Route path="family" element={<FamilyPage />} />
              <Route path="readiness" element={<ReadinessPage />} />
              <Route path="learn" element={<LearnPage />} />
              <Route path="summary" element={<SummaryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ProfileProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

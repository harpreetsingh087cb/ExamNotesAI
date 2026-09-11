import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
export const serverUrl = (import.meta.env.VITE_SERVER_URL || "http://localhost:5000").replace(/\/+$/, "")

function App() {
  const dispatch = useDispatch()
  const { userData, loading } = useSelector((state) => state.user)

  useEffect(() => {
    getCurrentUser(dispatch)
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-sm">Loading ExamNotes AI...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path='/' element={userData ? <Home/> : <Navigate to="/auth" replace/>}/>
        <Route path='/auth' element={userData ? <Navigate to="/" replace/> : <Auth/>}/>
        <Route path='/history' element={userData ? <History/> : <Navigate to="/auth" replace/>}/>
        <Route path='/notes' element={userData ? <Notes/> : <Navigate to="/auth" replace/>}/>
        <Route path='/pricing' element={userData ? <Pricing/> : <Navigate to="/auth" replace/>}/>

        <Route path='/payment-success' element={<PaymentSuccess/>}/>
        <Route path='/payment-failed' element={<PaymentFailed/>}/>
        <Route path='*' element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  )
}

export default App

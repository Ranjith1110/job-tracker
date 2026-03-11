import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import AddApplication from './pages/admin/AddApplication'
import JobApplicatonsList from './pages/admin/JobApplicatonsList'

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: 'custom-toast',
          style: {
            fontFamily: 'inherit',
          },
        }}
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />

        {/* Protected Routes */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/add-application'
          element={
            <ProtectedRoute>
              <AddApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path='/job-applications'
          element={
            <ProtectedRoute>
              <JobApplicatonsList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
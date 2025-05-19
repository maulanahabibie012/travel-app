import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DestinationsPage from './pages/DestinationsPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from './routes/ProtectedRoute';
import DestinationDetailPage from './pages/DestinationDetailPage';
//Admin
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement'
import CategoryManagement from './pages/Admin/CategoryManagement'
import ActivityManagement from './pages/Admin/ActivityManagement'
import PromoManagement from './pages/Admin/PromoManagement'
import BannerManagement from './pages/Admin/BannerManagement'
import TransactionManagement from './pages/Admin/TransactionManagement'
import TransactionDetailManag from './pages/Admin/TransactionDetailManag'
import PromoDetailManag from './pages/Admin/PromoDetailManag'
import ActivityDetailManag from './pages/Admin/ActivityDetailManag'

//user
import CartPage from './pages/CartPage'
import ProfileUserPage from '../src/pages/ProfileUserPage';
import PaymentsPage from './pages/PaymentsPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import UpdateProfile from './pages/UpdateProfile';
import PromoPage from './pages/PromoPage';

function App() {

  return (
    <>
      <AuthenticationProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileUserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <UpdateProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/activity" element={<DestinationsPage />} />
              <Route path="/promo" element={<PromoPage />} />
              <Route
                path="/activity/:categoryName"
                element={<DestinationsPage />}
              />
              <Route
                path="/activity/detail/:activityId"
                element={<DestinationDetailPage />}
              />
              <Route
                path="/payments/:transactionId"
                element={
                  <ProtectedRoute>
                    <PaymentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/:transactionId"
                element={
                  <ProtectedRoute>
                    <TransactionDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management"
                element={
                  <ProtectedRoute adminOnly>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category-management"
                element={
                  <ProtectedRoute adminOnly>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity-management"
                element={
                  <ProtectedRoute adminOnly>
                    <ActivityManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promo-management"
                element={
                  <ProtectedRoute adminOnly>
                    <PromoManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/banner-management"
                element={
                  <ProtectedRoute adminOnly>
                    <BannerManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction-management"
                element={
                  <ProtectedRoute adminOnly>
                    <TransactionManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction-management/:transactionId"
                element={
                  <ProtectedRoute adminOnly>
                    <TransactionDetailManag />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Routes>
              <Route
                path="/promo-management/:promoId"
                element={
                  <ProtectedRoute adminOnly>
                    <PromoDetailManag />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Routes>
              <Route
                path="/activity-management/:activityId"
                element={
                  <ProtectedRoute adminOnly>
                    <ActivityDetailManag />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthenticationProvider>
    </>
  )
}

export default App

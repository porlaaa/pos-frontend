import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard } from "./pages";
import Header from "./components/shared/Header";
import Sidebar from "./components/shared/Sidebar";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <div className="flex h-screen bg-[#1f1f1f] text-[#f5f5f5]">
      {isAuth && !hideHeaderRoutes.includes(location.pathname) && <Sidebar />}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {!hideHeaderRoutes.includes(location.pathname) && <Header />}
        <main className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            />
            <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoutes>
                  <Orders />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tables"
              element={
                <ProtectedRoutes>
                  <Tables />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoutes>
                  <Menu />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;

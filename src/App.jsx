import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <Toaster />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/checkout/success"
                element={<CheckoutSuccess />}
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}



// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Toaster />
//       <Navbar />
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/" element={<ProtectedRoute />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/checkout/success" element={<CheckoutSuccess />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

export default App;



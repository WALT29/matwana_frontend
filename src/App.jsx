import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SignupA from "./components/signupA";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/Protectedroute";
import CustomerDashboard from "./components/Customer/CustomerDashboard";
import CustomerService from "./components/CustomerService/CustomerServiceDashboard";
import VideoBackground from "./components/videoBackground";
import GetQuote from "./components/Getquote";
import Footer from "./components/Footer";
function App() {
  
  const [userRole,setUserRole]=useState(localStorage.getItem('role'))
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <VideoBackground/>
              <GetQuote />
              <Footer/>
            </>
            } />
          <Route path="/login" element={<Login setUserRole={setUserRole}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signupA" element={<SignupA />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                userRole={userRole}
                allowedRoles={["admin"]}
                element={<AdminDashboard />}
              />
            }
          />
          <Route
            path="/customer-service"
            element={
              <ProtectedRoute
                userRole={userRole}
                allowedRoles={["customer_service"]}
                element={<CustomerService/>}
              />
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute
                userRole={userRole}
                allowedRoles={["customer"]}
                element={<CustomerDashboard/>}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        
        <img src={logo_with_title} alt="Logo" className="mx-auto mb-6 max-h-16" />
        
        <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import activityTracker from '../../utils/activityTracker';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for message in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const messageParam = urlParams.get('message');
    if (messageParam) {
      setMessage(messageParam);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      console.log('Sending login request:', { email: formData.email, password: '***' });
      
      const res = await fetch("http://localhost:5000/apis/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      
      // Store user data, authentication state, and JWT token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.user.role || 'user');
      localStorage.setItem('token', data.token); // Store JWT token
      
      console.log('User data stored:', data.user);
      
      // Update activity tracker with user ID
      activityTracker.setUserId(data.user.id);
      
      // Track successful login
      activityTracker.track('login', {
        userRole: data.user.role,
        isAdminMode,
        loginMethod: 'email_password'
      }, { immediate: true });
      
      // Check the user role and admin mode
      console.log('User role:', data.user.role, 'Admin mode:', isAdminMode);
      
      if (isAdminMode && data.user.role !== "admin") {
        // User tried to login as admin but doesn't have admin role
        setError("Access denied. Admin privileges required.");
        
        // Track failed admin access attempt
        activityTracker.track('error_encountered', {
          errorType: 'access_denied',
          errorMessage: 'Admin privileges required',
          attemptedRole: 'admin',
          actualRole: data.user.role
        }, { immediate: true });
        
        setLoading(false);
        return;
      }
      
      // Redirect based on user role
      if (data.user && data.user.role === "admin") {
        console.log('Admin user - redirecting to admin dashboard');
        navigate("/admin");
      } else {
        console.log('Regular user - redirecting to user dashboard');
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Network error: ${err.message}. Make sure the server is running.`);
      
      // Track login error
      activityTracker.track('error_encountered', {
        errorType: 'login_error',
        errorMessage: err.message,
        email: formData.email,
        isAdminMode
      }, { immediate: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isAdminMode
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                User Login
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isAdminMode
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Admin Login
              </button>
            </div>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isAdminMode ? 'Admin Portal' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdminMode 
              ? 'Sign in to the admin dashboard' 
              : 'Sign in to your GlobeTrotter account'
            }
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isAdminMode
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Signing in...' : isAdminMode ? 'Admin Sign In' : 'Sign In'}
            </button>
          </div>

          {!isAdminMode && (
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </span>
            </div>
          )}

          {isAdminMode && (
            <div className="text-center space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Admin Access:</strong> Only authorized administrators can access the admin dashboard.
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Need admin access?{' '}
                  <Link to="/admin-signup" className="font-medium text-red-600 hover:text-red-500">
                    Register as Admin
                  </Link>
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
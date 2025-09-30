// app/page.tsx
export default function University() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">kw</h1>
          <p className="text-gray-600 mt-2">Wipe Entrepreneurs Time</p>
        </div>

        {/* Sign In Form */}
        <div className="mb-6">
          <h2 className="text-xl flex text-center justify-center font-semibold text-gray-700 mb-4">Sign In</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">User Name</h3>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Password</h3>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-4xl hover:bg-blue-700 transition duration-200">
              Sign In
            </button>
          </div>
        </div>

       

        {/* Forgot Password */}
        <div className="text-center mb-6">
          <a href="#" className="text-blue-600 hover:underline text-sm">
            Forget Password
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex justify-between text-xs text-gray-500">
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700">Terms of Service</a>
          <a href="#" className="hover:text-gray-700">Learn More About KW</a>
        </div>
      </div>
    </div>
  );
}
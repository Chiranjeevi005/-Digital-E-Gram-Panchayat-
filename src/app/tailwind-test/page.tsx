export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Tailwind CSS is Working!
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          You can see the styling applied through Tailwind classes
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 rounded-lg p-6 text-center">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Feature One</h2>
            <p className="text-gray-600">This card is styled with Tailwind CSS classes</p>
          </div>
          
          <div className="bg-green-100 rounded-lg p-6 text-center">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Feature Two</h2>
            <p className="text-gray-600">Responsive grid layout that works on all devices</p>
          </div>
          
          <div className="bg-purple-100 rounded-lg p-6 text-center">
            <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Feature Three</h2>
            <p className="text-gray-600">Beautiful color palette and consistent design</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            Primary Button
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-300 rounded-lg transition duration-300 ease-in-out">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
}
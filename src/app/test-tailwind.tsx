export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-700 text-center mb-6">
          If you can see this styled text, Tailwind CSS is working properly!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Button 1
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Button 2
          </button>
        </div>
      </div>
    </div>
  );
}
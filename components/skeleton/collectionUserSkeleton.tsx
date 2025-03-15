export default function CollectionsLoading(): React.ReactNode {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        Your Collections
      </h1>
      
      {/* Button skeleton */}
      <div className="w-48 h-12 bg-gray-800 rounded-lg animate-pulse mb-6"></div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate 4 skeleton cards */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 animate-pulse"
          >
            {/* Title skeleton */}
            <div className="h-8 bg-gray-700 rounded-md w-3/4 mb-4"></div>
            
            {/* Description skeleton - two lines */}
            <div className="h-4 bg-gray-700 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-md w-4/5 mb-4"></div>
            
            {/* Items count skeleton */}
            <div className="h-4 bg-gray-700 rounded-md w-1/3 mb-4"></div>
            
            {/* Button skeleton */}
            <div className="h-10 bg-gray-700 rounded-md w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
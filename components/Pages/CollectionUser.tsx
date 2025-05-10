import Link from "next/link";
import AddCollection from "@/components/addCollection";

interface Collection {
  createdAt: Date;
  updatedAt: Date;
  collectionId: string;
  collectionName: string;
  collectionDesc: string;
  _count: {
    collectionCodats: number;
  };
}

const CollectionsPage = ({fullCollections}:{fullCollections: Collection[]}) => {
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        Your Collections
      </h1>
      
      <AddCollection />
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {fullCollections.length === 0 ? (
          <p className="text-gray-400 text-center col-span-2">
            No collections found.
          </p>
        ) : (
          fullCollections.map((collection) => (
            <div
              key={collection.collectionId}
              className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 hover:border-white hover:shadow-glow transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {collection.collectionName}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                {collection.collectionDesc}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {collection._count?.collectionCodats} Items
              </p>
              <Link
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
                href={`/collections/${collection.collectionId}`}
              >
                View Collection
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;

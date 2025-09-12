import React from 'react';
import { Button, Image } from 'antd';
import { ShoppingCart, Tag } from 'lucide-react';

// Utility function to deduplicate merchandise
const deduplicateMerchandise = (merchandise) => {
  if (!Array.isArray(merchandise)) return [];
  
  const seen = new Set();
  return merchandise.filter(item => {
    // Create a unique key based on type and description
    const key = `${item.type}-${item.description}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const MerchandiseDisplay = ({ merchandise, onOrderClick }) => {
  // Deduplicate merchandise before displaying
  const uniqueMerchandise = deduplicateMerchandise(merchandise);
  
  if (!uniqueMerchandise || uniqueMerchandise.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Official Merchandise</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uniqueMerchandise.map((item, index) => (
          <div 
            key={`${item.type}-${index}`} 
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col">
              {/* Images Section */}
              <div className="mb-4">
                {item.images && item.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {item.images.slice(0, 4).map((imageUrl, imgIndex) => (
                      <div key={imgIndex} className="relative group">
                        <Image
                          src={imageUrl}
                          alt={`${item.type} ${imgIndex + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer"
                          onError={(e) => (e.target.src = '/default-merchandise.jpg')}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.type}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                
                {item.available && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Available</span>
                    </div>
                    <Button
                      type="primary"
                      icon={<ShoppingCart className="w-4 h-4" />}
                      onClick={() => onOrderClick(item)}
                      className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 border-blue-600 dark:border-blue-500 hover:border-blue-700 dark:hover:border-blue-600"
                    >
                      Order Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchandiseDisplay;
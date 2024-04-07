import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import './style.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    keyword: '',
    availability: false,
    brand: '',
    size: '',
    showFilters: false, // Added state for showing filters
  });

  const filterOptions = [
    { name: "idealFor", label: "Ideal For", options: ["", "Men", "Women", "Baby & Kids"] },
    { name: "occasion", label: "Occasion", options: ["", "Casual", "Formal"] },
    { name: "work", label: "Work", options: ["", "Casual", "Formal"] },
    { name: "fabric", label: "Fabric", options: ["", "Cotton", "Polyester"] },
    { name: "segment", label: "Segment", options: ["", "Men's", "Women's"] },
    { name: "suitableFor", label: "Suitable For", options: ["", "Indoor", "Outdoor"] },
    { name: "rawMaterials", label: "Raw Materials", options: ["", "Leather", "Plastic"] },
    { name: "pattern", label: "Pattern", options: ["", "Stripes", "Polka Dots"] }
  ];

  const [noProductsFound, setNoProductsFound] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products with all products
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters to products
    let filtered = products.filter(product => {
      // Apply other filters here...

      return true; // Product passes all filters
    });

    setFilteredProducts(filtered);
    setNoProductsFound(filtered.length === 0);
  }, [products, filters]);

  // Handler functions to update filters
  const handleCategoryChange = (event) => {
    setFilters({ ...filters, category: event.target.value });
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  // Toggle function to show/hide filters
  const toggleFilters = () => {
    setFilters({ ...filters, showFilters: !filters.showFilters });
  };

  // Handle filtering based on idealFor
  const handleIdealForChange = (event) => {
    const value = event.target.value;
    setFilters({ ...filters, idealFor: value });

    // Filter products based on idealFor
    let filtered = products.filter(product => {
      if (value === "") return true; // No filter applied

      // Filter products based on the selected idealFor
      if (value === "men") {
        return product.category.toLowerCase().includes("men");
      } else if (value === "women") {
        return product.category.toLowerCase().includes("women");
      } else if (value === "babyAndKids") {
        return product.category.toLowerCase().includes("baby") || product.category.toLowerCase().includes("kids");
      }
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="product-grid">
      <h1>DISCOVER OUR PRODUCTS</h1>
      <p className='description'>Explore endless possibilities with our diverse range of products, curated just for you. Discover convenience and quality in every click with our e-commerce offerings</p>
      <div className="options">
        <div className='sort-and-count'>
          <p className='product-count'>{filteredProducts.length} ITEMS</p>
          <p className='show-and-hide-filter' onClick={toggleFilters}>
            {filters.showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
          </p>
        </div> 
              <select>
                <option disabled selected>RECOMMENDED:</option>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="lowToHigh">Price: Low to High</option>
              </select>
      </div>
      <div className='sort-and-products'>
          {/* Show filters section */}
          <div className={filters.showFilters ? "filters show" : "filters"}>
          {/* Filter options */}
          <div>
          <input type="checkbox" id="customizable" name="customizable"/>
          <label for="customizable">CUSTOMIZABLE</label>
          </div>
          {filterOptions.map(({ name, label, options }) => (
            <select className='left-sort-options' key={name} name={name} value={filters[name]} onChange={handlePriceChange}>
              <option value="">{label}</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>

          {noProductsFound ? (
            <div className="no-products">
              <p>No products found with the selected filters.</p>
            </div>
          ) : (
            <div className="products-list">
              {/* Display filtered products */}
              {filteredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductGrid;

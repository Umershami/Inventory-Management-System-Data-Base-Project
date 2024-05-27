"use client";
import React, { useState, useEffect } from 'react';
import Header from './components/header';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({});
  const [alert, setAlert] = useState('');
  const [alertd, setAlertd] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  const handleDelete = async (productName) => {
    if (!productName) {
      setError('Product name is required');
      return;
    }
  
    try {
      const response = await fetch(`/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productName !== productName)
        
        );
        console.log('Product deleted successfully');
        setAlertd('Your product has been deleted');
        setSuccess(true); // Set success state to true
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
    
  
const handleQuantityUpdate = async (action, product) => {
    setLoadingaction(true);

    try {
      let newQuantity;
      if (action === 'plus') {
        newQuantity = parseInt(product.quantity) + 1;
      } else if (action === 'minus' && product.quantity > 0) {
        newQuantity = parseInt(product.quantity) - 1;
      } else {
        newQuantity = parseInt(product.quantity);
      }

      console.log('New quantity:', newQuantity); // Log the new quantity

      // Update quantity in products state
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.productName === product.productName) {
            return { ...p, quantity: newQuantity };
          }
          return p;
        })
      );

      // Update quantity in dropdown state
      setDropdown((prevDropdown) =>
        prevDropdown.map((item) => {
          if (item.productName === product.productName) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );

      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          productName: product.productName,
          initialQuantity: product.quantity,
        }),
      });

      if (!response.ok) {
        console.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoadingaction(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!productForm.productName || !productForm.quantity || !productForm.price) {
      setAlert('Please fill in all fields');
      return;
    }

    // Check if a product with the same name already exists
    const existingProduct = products.find(
      (product) => product.productName === productForm.productName
    );
    if (existingProduct) {
      setAlert('A product with the same name already exists');
      return;
    }

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log('Product added successfully');
        setAlert('Your product has been added');
        setProductForm({});

        const productListResponse = await fetch('/api/product');
        if (productListResponse.ok) {
          const data = await productListResponse.json();
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } else {
        const errorData = await response.json();
        console.error('Error adding product:', errorData.message);
        setAlert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert('An error occurred while adding the product.');
    }
  };

  const handleChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      try {
        const response = await fetch('/api/search?query=' + value);
        if (response.ok) {
          const data = await response.json();
          setDropdown(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="text-center mb-4">
        <span className={`text-red-500 ${alertd ? 'block': 'hidden'}`}>{alertd}</span>
          <span className={`text-green-500 ${alert ? 'block' : 'hidden'}`}>{alert}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Search a Product</h1>
        <div className="flex items-center mb-2">
          <input
            onBlur={() => setDropdown([])}
            onChange={onDropdownEdit}
            type="text"
            className="border border-gray-300 px-4 py-2 mr-2 w-full text-black"
            placeholder="Search..."
          />

          <select
            className="border border-gray-300 px-4 py-2 text-black"
            style={{ backgroundColor: '#2877ff', color: 'white' }}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
        </div>
        {loading && (
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="10"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;502"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dasharray"
                values="150.6 100.4;1 250"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        )}
        <div
          className="dropcontainer absolute w-[73vw] border border-gray-300 bg-gray-50 rounded-md"
          style={{ backgroundColor: 'grey' }}
        >
          {dropdown.map((item) => {
            return (
              <div
                key={item._id}
                className="container flex justify-between p-2 my-1 text-white gap-12 border-b-2"
              >
                <span className="productName">
                  {item.productName} ({item.quantity} Price of this item ₹
                  {item.price})
                </span>
                <div className="mx-5">
                  <button
                    onClick={() => handleQuantityUpdate('minus', item)}
                    disabled={loadingaction || item.quantity <= 0} // Disable if quantity is 0 or less
                    className={`subtract cursor-pointer p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      loadingaction || item.quantity <= 0
                        ? 'disabled:bg-blue-200'
                        : ''
                    }`}
                  >
                    -
                  </button>
                  <span className="quantity mx-4">{item.quantity}</span>
                  <button
                    onClick={() => {
                      console.log('Button clicked'); // Log the button click
                      handleQuantityUpdate('plus', item);
                    }}
                    disabled={loadingaction}
                    className={`add cursor-pointer p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      loadingaction ? 'disabled:bg-blue-200' : ''
                    }`}
                  >
                    +
                  </button>
                  {/* <button
  onClick={() => { // onClick event handler
    console.log('Delete btn clicked'); // Log a message when the button is clicked
    deletebtn('delete', item); // Call the deletebtn function with action 'delete' and the item object
  }}
  disabled={loading} // Disable the button when loading is true
  className="delete cursor-pointer p-2 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
>
  Delete
</button> */}

                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Add a Product</h1>
        <form>
          <div className="mb-4">
            <label className="block mb-2">Product Name:</label>
            <input
              style={{ color: 'black' }}
              value={productForm.productName || ''}
              name="productName"
              onChange={handleChange}
              type="text"
              className="border border-gray-300 px-4 py-2 w-full"
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Quantity:</label>
            <input
              style={{ color: 'black' }}
              value={productForm.quantity || ''}
              name="quantity"
              onChange={handleChange}
              type="number"
              className="border border-gray-300 px-4 py-2 w-full"
              placeholder="Enter quantity"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price:</label>
            <input
              style={{ color: 'black' }}
              value={productForm.price || ''}
              name="price"
              onChange={handleChange}
              type="number"
              className="border border-gray-300 px-4 py-2 w-full"
              placeholder="Enter price"
            />
          </div>
          <button
            onClick={addProduct}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className="container mx-auto p-4 mt-4">
        <h1 className="text-3xl font-bold mb-4">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
          {products.map((product) => (
            <tr key={product.productName}>
              <td className="border px-4 py-2">{product.productName}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">₹{product.price}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(product.productName)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}

          </tbody>
        </table>
      </div>
    </>
  );
}

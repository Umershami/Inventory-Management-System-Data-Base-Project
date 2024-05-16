"use client"
import { useEffect, useState } from "react";
import Header from "./components/header";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({});
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          console.log('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    if (!productForm.productName || !productForm.quantity || !productForm.price) {
      setAlert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        console.log('Product added successfully');
        setAlert("Your product has been added");
        setProductForm({});
      } else {
        console.log('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const onDropdownEdit = async (e) => {
    try {
      setQuery(e.target.value);
      if (!loading) {
        const response = await fetch('/api/search?query=' + query);
        if (response.ok) {
          const data = await response.json();
          setDropdown(data.products);
        } else {
          console.log('Failed to fetch products');
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className='text-green-500 text-center'>{alert}</div>
        <h1 className="text-3xl font-bold mb-4">Search a Product</h1>
        <div className="flex items-center mb-4">
          <input
            onChange={onDropdownEdit}
            type="text"
            className="border border-gray-300 px-4 py-2 mr-2 w-full text-black"
            placeholder="Search..."
          />

          <select className="border border-gray-300 px-4 py-2">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
        </div>
        {loading && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="animate-spin h-5 w-5 mr-3 inline-block">
            <circle cx="50" cy="50" fill="none" stroke="#000" strokeWidth="8" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.6944444444444444s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
          </svg>
        )}
      {dropdown.map(item => {
  return (
    <div key={item.productName} className="container flex justify-between bg-green-50 my-3">
      <span className="productName text-black">{item.productName}</span>
      <span className="quantity text-black">{item.quantity}</span>
      <span className="price text-black">{item.price}</span>
    </div>
  );
})}

      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Add a Product</h1>
        <form>
          <div className="mb-4">
            <label className="block mb-2">Product Name:</label>
            <input
              value={productForm?.productName || ""}
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
              value={productForm?.quantity || ""}
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
              value={productForm?.price || ""}
              name="price"
              onChange={handleChange}
              type="number"
              className="border border-gray-300 px-4 py-2 w-full"
              placeholder="Enter price"
            />
          </div>
          <button onClick={addProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
            {products.map(product => (
              <tr key={product.slug}>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">€{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

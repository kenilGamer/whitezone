"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  _id?: string;
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  showhome?: boolean; // Changed to optional
  stock?: number; // Added stock property
  createdAt?: string; // Added createdAt property
  updatedAt?: string; // Added updatedAt property
}

const categories = ["T-Shirts", "Hoodies", "Shirts", "Caps"];

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showhome, setShowHome] = useState(false); // Updated variable name to camelCase
  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    price: "",
    image: "",
    category: "",
    showhome: false,
    stock: 0, // Initialize stock
    createdAt: "", // Initialize createdAt
    updatedAt: "" // Initialize updatedAt
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();

      // Map `_id` to `id` for all products
      const mappedProducts = data.products.map((product: Product) => ({
        ...product,
        id: product._id, // Map `_id` to `id`
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update product
        const requestBody = { ...form, _id: editingProduct.id };
        const response = await fetch(`/api/products`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        setEditingProduct(null);
      } else {
        // Add new product
        const response = await fetch(`/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Failed to add product");
        }
      }

      setForm({ id: "", name: "", price: "", image: "", category: "", showhome: false, stock: 0, createdAt: "", updatedAt: "" });
      fetchProducts(); // Fetch the latest products
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product, id: product._id || "" }); // Map `_id` to `id`
    setForm({ ...product, id: product._id || "" }); // Map `_id` to `id`
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Invalid product ID:", id);
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      fetchProducts(); // Fetch the latest products
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Update showhome in the database
  const updateShowHome = async (id: string, showhomeValue: boolean) => {
    try {
      const response = await fetch(`/api/products/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, showhome: showhomeValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update showhome status");
      }

      fetchProducts(); // Fetch the latest products
    } catch (error) {
      console.error("Error updating showhome status:", error);
    }
  };

  return (
    <div className="h-screen bg-[#FCFFC1] overflow-hidden">
      {/* Header */}
      <header className="bg-[#FB9EC6] text-white py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>

      {/* Sidebar and Content */}
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-1/6 bg-[#FFE893] shadow-lg p-6">
          <nav>
            <h2 className="text-xl font-bold text-[#FB9EC6] mb-4">Navigation</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="/admin"
                  className="block text-[#FB9EC6] hover:text-white hover:bg-[#FBB4A5] p-2 rounded-md font-medium transition"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/products"
                  className="block text-[#FB9EC6] hover:text-white hover:bg-[#FBB4A5] p-2 rounded-md font-medium transition"
                >
                  Products
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white shadow-inner overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#FB9EC6] mb-6">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          {/* Product Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-8 bg-[#FFE893] p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-bold text-[#FB9EC6] mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6]"
                  required
                />
              </div>

              {/* Product Price */}
              <div className="flex flex-col">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Price ($)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6]"
                  required
                />
              </div>

              {/* Product Category */}
              <div className="flex flex-col">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6]"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Image */}
              <div className="flex flex-col">
                <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6]"
                />
                {form.image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Image Preview:</p>
                    <img
                      src={form.image}
                      alt="Product Preview"
                      className="w-full h-40 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 w-full bg-[#FB9EC6] text-white py-3 rounded-lg font-medium hover:bg-[#FBB4A5] transition"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>

          {/* Product List */}
          <h2 className="text-2xl font-bold text-[#FB9EC6] mb-6">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-[#FFE893] p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#FB9EC6] mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-700">Category: {product.category}</p>
                <p className="text-gray-700">Price: {product.price}</p>
                <p className="text-gray-700">Stock: {product.stock}</p> {/* Display stock */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const newShowHomeValue = !showhome;
                      setShowHome(newShowHomeValue);
                      updateShowHome(product.id, newShowHomeValue); // Update showhome in the database
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                  >
                    {showhome ? "Hide from Home" : "Show Home"}
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
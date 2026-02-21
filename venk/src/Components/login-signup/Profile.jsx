import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [url, setUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/my-products",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProducts(res.data.products);
    } catch (err) {
      console.log("Failed to fetch products", err);
    }
  };

  // ✅ UPDATE BUDGET
  const updateBudget = async (id, newBudget) => {
    try {
      await axios.put(
        `http://localhost:4000/update-budget/${id}`,
        { budget: Number(newBudget) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchProducts();
    } catch (error) {
      alert("Failed to update budget");
    }
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/delete-product/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // remove instantly from UI
      setProducts(prev => prev.filter(p => p._id !== id));

    } catch (error) {
      alert("Failed to delete product");
    }
  };

  // ✅ FETCH PROFILE
  useEffect(() => {
  if (!token) {
    window.location.href = "/login";
    return;
  }

  axios
    .get("http://localhost:4000/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setUser(res.data.user);
      fetchProducts();
    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });

  const handleClickOutside = (e) => {
    if (!e.target.closest(".profile-area")) {
      setShowMenu(false);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };

}, [token]);   // ✅ Add token here

  // ✅ ADD PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url || !budget) {
      alert("Please enter URL and Budget");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/track-product",
        {
          url,
          budget: Number(budget)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUrl("");
      setBudget("");
      fetchProducts();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">

      {/* TOP BAR */}
      <div className="top-bar">
        <h2 className="app-name">FAMAM BOT</h2>

        <div className="profile-area">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>

          <div
            className="dots"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </div>
        </div>
      </div>

      {/* USER DROPDOWN */}
      {showMenu && (
        <div className="dropdown-panel">
          <h3>{user.name}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.phone}</p>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* ADD PRODUCT */}
      <div className="add-product-section">
        <h3>Add New Product</h3>

        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="url"
            placeholder="Paste product URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter your budget price"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <button type="submit">
            Add Bot on this Product
          </button>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="items-section">
        <h3>Your Tracked Products</h3>

        {products.length === 0 && (
          <p>No products added yet</p>
        )}

        <div className="items-grid">
          {products.map((item) => (
            <div className="item-card" key={item._id}>

              <img
                src={item.image}
                alt="product"
                className="product-img"
              />

              <h4>{item.title}</h4>

              <p><strong>Current Price:</strong> ₹{item.currentPrice}</p>

              {item.isEditing ? (
                <>
                  <input
                    type="number"
                    value={item.newBudget}
                    onChange={(e) =>
                      setProducts(products.map(p =>
                        p._id === item._id
                          ? { ...p, newBudget: e.target.value }
                          : p
                      ))
                    }
                  />

                  <button
                    onClick={() =>
                      updateBudget(item._id, item.newBudget)
                    }
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Your Budget:</strong> ₹{item.budget}</p>

                  <button
                    onClick={() =>
                      setProducts(products.map(p =>
                        p._id === item._id
                          ? {
                              ...p,
                              isEditing: true,
                              newBudget: p.budget
                            }
                          : p
                      ))
                    }
                  >
                    Edit Budget
                  </button>
                </>
              )}

              <p><strong>Status:</strong> {item.status}</p>

              {/* DELETE BUTTON */}
              <button
                className="delete-btn"
                onClick={() => deleteProduct(item._id)}
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
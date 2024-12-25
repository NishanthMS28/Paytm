import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch users with search filter
  const fetchUsers = async (filter = "") => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.user); // Note: your API returns 'user' not 'users'
    } catch (err) {
      setError(err.message);
      if (response.status === 403) {
        navigate("/signin");
      }
    }
  };

  // Fetch balance
  const fetchBalance = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError(err.message);
      if (response.status === 403) {
        navigate("/signin");
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const initializeDashboard = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchBalance(), fetchUsers()]);
      } catch (err) {
        console.error("Dashboard initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchUsers(e.target.value);
  };

  // Handle money transfer
  const handleTransfer = async (toUserId) => {
    const amount = prompt("Enter amount to transfer:");
    if (!amount) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/account/transfer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: toUserId,
            amount: parseFloat(amount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Transfer failed");
      }

      // Refresh balance after transfer
      fetchBalance();
      alert("Transfer successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <nav className="bg-gray-800 shadow-8xl p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl text-white">Payments App</div>
          <div className="flex items-center gap-2">
            <span className="text-white">Hello, User</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              U
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Your Balance</h2>
          <div className="text-2xl">${balance?.toFixed(2)}</div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white p-3 rounded shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.firstName[0]}
                  </div>
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={() => handleTransfer(user._id)}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Send Money
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

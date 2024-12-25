import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/v1/user/signup", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          firstName: firstName,
          lastName: lastName,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(`Some error occurred: ${response.status}`);
      }

      localStorage.setItem("token", userData.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="bg-[#7F7F7F] flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-3/12 h-9/10 flex flex-col rounded-md bg-white shadow-2xl p-8"
      >
        <div className="flex justify-center mb-4">
          <h1 className="text-3xl font-bold">Sign Up</h1>
        </div>
        <div className="flex justify-center items-center text-center text-gray-600 mb-4 pt-0">
          Enter your information to create an account
        </div>
        <div className="font-semibold mb-1">First Name</div>
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mb-3 p-2 border rounded"
        />
        <div className="font-semibold mb-1">Last Name</div>
        <input
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mb-3 p-2 border rounded"
        />
        <div className="font-semibold mb-1">Email</div>
        <input
          type="email"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3 p-2 border rounded"
        />
        <div className="font-semibold mb-1">Password</div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-gray-950 text-white p-2 mt-4 rounded"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="../Signin" className="underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default Signup;

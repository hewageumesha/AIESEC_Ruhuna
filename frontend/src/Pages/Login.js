import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = {
            "lcp@example.com": "/dashboard/lcp",
            "lcvp@example.com": "/dashboard/lcvp",
            "teamleader@example.com": "/dashboard/tl",
            "member@example.com": "/dashboard/member",
        };

        if (users[email] && password === "password") {
            navigate(users[email]);
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div class="flex justify-center mb-6">
                    <img alt="AIESEC in Ruhuna logo, a stylized globe with interconnected lines" class="w-24 h-24" height="100" width="100" src="https://storage.googleapis.com/a1aa/image/O6Ihmlu7hPVIbvKgFUwU4KwtgLZNEXEQB4pr06rHbOo.jpg" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/forget-password" className="text-blue-500 hover:underline">
                        Forgot Password?
                    </a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

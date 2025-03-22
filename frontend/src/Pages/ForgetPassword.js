import React, { useState } from "react";

function ForgetPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Password reset link sent to " + email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Send Reset Link
                    </button>
                    
                    <div class="mt-6 text-center">
                        <a href="/login" class="text-blue-500 hover:underline">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;

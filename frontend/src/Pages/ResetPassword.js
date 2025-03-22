import React, { useState } from "react";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        alert("Password reset successful!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Reset Password
                    </button>
                </form>
                <div class="mt-6 text-center">
                    <a href="login.html" class="text-blue-500 hover:underline">Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

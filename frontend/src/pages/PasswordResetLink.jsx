import React, { useState } from "react";

const PasswordResetLink = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simple email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Form is valid - proceed with submission
    console.log("Password reset link sent to:", formData.email);
    setIsSubmitted(true);
  };

  const handleResend = () => {
    console.log("Resending password reset link to:", formData.email);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

      {!isSubmitted ? (
        <>
          <p className="mb-4 text-gray-600">
            Enter your email to receive a password reset link.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            A password reset link has been sent to <strong>{formData.email}</strong>.
            Please check your inbox.
          </p>
          <button
            onClick={handleResend}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Resend Email
          </button>
        </>
      )}
    </div>
  );
};

export default PasswordResetLink;
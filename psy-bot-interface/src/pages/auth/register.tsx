// pages/auth/register.tsx

import { NextPage } from 'next';
import { useState } from 'react';

const Register: NextPage = (): JSX.Element => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Make the API request here using the formData
      const response = await fetch('../api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        // Redirect the user to the login page after successful registration
        // (You can use Next.js router or any other navigation method here)
        // For example: router.push('/login');
      } else {
        const errorData = await response.json();
        console.log('Registration failed:', errorData);
        // Handle the registration error here (e.g., display an error message)
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      // Handle any other errors that occurred during the registration process
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="block w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

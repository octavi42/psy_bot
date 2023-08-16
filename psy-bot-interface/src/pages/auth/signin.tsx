// pages/auth/signin.tsx

import { NextPage } from 'next';

const SignIn: NextPage = (): JSX.Element => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Email"
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="block w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;

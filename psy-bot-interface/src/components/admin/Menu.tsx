import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const AdminActions: React.FC = () => {
  const router = useRouter();

  const actions = [
    { label: "Settings", route: "settings" },
    { label: "Database", route: "database" },
    { label: "Test", route: "test" },
    { label: "Account", route: "account" },
    { label: "Manage", route: "manage" },
    { label: "Billing", route: "billing" },
  ];

  const { data: session } = useSession();
  const userData = session?.user;

  const handleActionClick = (route: string) => {
    router.push(`/admin/${route}`);
  };

  const user = {
    name: userData?.name || "Admin",
    photoUrl: "data:image/jpeg;base64,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", // Replace with actual photo URL
  };

  return (
    <div className="fixed h-full p-4 border-r border-gray-300 bg-white w-1/6">
      <div className="flex items-center space-x-4 mb-6">
        <img
          className="w-10 h-10 rounded-full"
          src={user.photoUrl}
          alt={`${user.name}'s profile`}
        />
        <span className="text-lg font-semibold">{user.name}</span>
      </div>
      <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.route}
            className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 block"
            onClick={() => handleActionClick(action.route)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminActions;

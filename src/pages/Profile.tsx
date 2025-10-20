import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

export default function Profile() {
  const { token, user, setUser, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [nameUpdate, setNameUpdate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getUserProfile(token)
      .then((data) => {
        setUser(data);
        setNameUpdate(data.name || "");
      })
      .catch(() => {
        toast.error("Session expired. Logging out...");
        handleLogout();
      });
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleSave() {
    if (!token || nameUpdate === user?.name) return;

    try {
      const updated = await updateUserProfile(token, { name: nameUpdate });
      setUser(updated);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  }

  function handleCancel() {
    setNameUpdate(user?.name || "");
    setEditing(false);
  }

  if (!user) return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h1 className="text-2xl font-semibold text-white mt-4">
              {user.name || "User"}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {user.email || `ID: ${user.user}`}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Editable Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {editing ? (
                <input
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user.name || "-"}</p>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Account Type</span>
                <span className="text-sm text-gray-900 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {user.account_type}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Subscription Status</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  user.subscription_status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.subscription_status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Subscription Expires</span>
                <span className="text-sm text-gray-900">
                  {user.subscription_expires_on
                    ? new Date(user.subscription_expires_on).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={nameUpdate === user.name}
                    className={`flex-1 py-2.5 rounded-md font-medium transition-colors ${
                      nameUpdate === user.name
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2.5 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";

const STORAGE_KEY = "user_profile";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("user@email.com");
  const [avatar, setAvatar] = useState(null);

  // Load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "");
      setEmail(data.email || "user@email.com");
      setAvatar(data.avatar || null);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  // Save profile
  const saveProfile = () => {
    const profile = { name, email, avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    alert("Profile updated successfully");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      {/* Profile Picture */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Profile Picture</label>
        <div className="flex items-center gap-4">
          <img
            src={
              avatar ||
              "https://ui-avatars.com/api/?background=0D8ABC&color=fff"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Email</label>
        <input
          value={email}
          disabled
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400"
        />
      </div>

      <button
        onClick={saveProfile}
        className="bg-emerald-500 px-5 py-2 rounded-lg font-semibold text-black"
      >
        Save Changes
      </button>
    </div>
  );
}

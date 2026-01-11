import { useState } from "react";
import {
  Plus,
  Trash2,
  User,
  Mail,
  Briefcase,
  Check,
  Building,
  Wrench,
  Clock,
} from "lucide-react";
import { Input } from "../ui/Input";
import { useApplicationStore } from "../../store/useApplicationStore";

export default function ListSlide() {
  const { coFounders, addCoFounder, removeCoFounder, updateCoFounder } =
    useApplicationStore();
  const [showAddForm, setShowAddForm] = useState(false);

  // Expanded state to capture all PDF fields
  const [temp, setTemp] = useState({
    name: "",
    email: "",
    role: "",
    affiliation: "",
    skillArea: "",
    isFullTime: true,
  });

  const handleSave = () => {
    if (temp.name && temp.email) {
      // 1. Add empty placeholder via store action
      addCoFounder();

      // 2. Update the newly added item with full details
      setTimeout(() => {
        const id = useApplicationStore.getState().coFounders.slice(-1)[0]?.id;
        if (id) {
          updateCoFounder(id, temp);
        }
      }, 0);

      // 3. Reset form
      setTemp({
        name: "",
        email: "",
        role: "",
        affiliation: "",
        skillArea: "",
        isFullTime: true,
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing List */}
      <div className="grid gap-3">
        {coFounders.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{member.name}</p>
                <div className="text-xs text-gray-500 flex flex-wrap gap-2 items-center mt-1">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {member.role || "Co-Founder"}
                  </span>
                  <span>•</span>
                  <span>{member.email}</span>
                  {member.affiliation && (
                    <>
                      <span>•</span>
                      <span>{member.affiliation}</span>
                    </>
                  )}
                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded ${
                      member.isFullTime
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {member.isFullTime ? "Full-time" : "Part-time"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeCoFounder(member.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm ? (
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-900">New Co-Founder</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          {/* Row 1: Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Full Name"
              value={temp.name}
              onChange={(e) => setTemp({ ...temp, name: e.target.value })}
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              placeholder="Email"
              value={temp.email}
              onChange={(e) => setTemp({ ...temp, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          {/* Row 2: Role & Affiliation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Role (e.g. CTO)"
              value={temp.role}
              onChange={(e) => setTemp({ ...temp, role: e.target.value })}
              leftIcon={<Briefcase className="w-4 h-4" />}
            />
            <Input
              placeholder="Current Affiliation"
              value={temp.affiliation}
              onChange={(e) =>
                setTemp({ ...temp, affiliation: e.target.value })
              }
              leftIcon={<Building className="w-4 h-4" />}
            />
          </div>

          {/* Row 3: Skills & Commitment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Primary Skill Area"
              value={temp.skillArea}
              onChange={(e) => setTemp({ ...temp, skillArea: e.target.value })}
              leftIcon={<Wrench className="w-4 h-4" />}
            />

            {/* Full Time Toggle */}
            <div className="flex items-center px-4 border border-gray-300 rounded-lg bg-white h-12">
              <Clock className="w-4 h-4 text-gray-400 mr-3" />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer w-full select-none">
                <input
                  type="checkbox"
                  checked={temp.isFullTime}
                  onChange={(e) =>
                    setTemp({ ...temp, isFullTime: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                Working Full-time?
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!temp.name || !temp.email}
            className="w-full py-3 mt-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Member
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Co-Founder
        </button>
      )}
    </div>
  );
}

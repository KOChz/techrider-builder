export function MembersContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Band Members</h3>
      <p className="text-sm text-gray-600">Add and manage your band members</p>
      <button className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        + Add Member
      </button>
    </div>
  );
}

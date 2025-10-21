export function BandInfoContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Band Information</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-slate-900 font-medium mb-1">
            Band Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border placeholder-slate-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter band name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Notes
          </label>
          <textarea
            className="w-full placeholder-slate-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="This is section for notes for any technical stuff notes"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

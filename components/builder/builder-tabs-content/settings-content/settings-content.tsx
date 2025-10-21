export function SettingsContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Project Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-800">
            Make project public
          </label>
          <input type="checkbox" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

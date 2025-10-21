import StagePlanBuilder from "../stage-plan-builder/stage-plan-builder";

export function StagePlanContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Stage Plan</h3>
      <p className="text-sm text-gray-600">
        Create your stage setup and positioning
      </p>
      <StagePlanBuilder />
    </div>
  );
}

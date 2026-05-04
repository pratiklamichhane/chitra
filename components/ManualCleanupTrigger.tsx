import { Eraser } from "lucide-react";

type ManualCleanupTriggerProps = {
  hasSubject: boolean;
  onOpen: () => void;
};

export function ManualCleanupTrigger({ hasSubject, onOpen }: ManualCleanupTriggerProps) {
  return (
    <section className="fluent-card">
      <div className="section-title">
        <span>4. Manual Cleanup</span>
      </div>
      <div className="cleanup-trigger-container">
        {!hasSubject ? (
          <div className="cleanup-empty">
            <Eraser size={22} />
            <span>Remove background first</span>
          </div>
        ) : (
          <button className="cleanup-open-button" onClick={onOpen} title="Open cleanup modal">
            <Eraser size={20} />
            <span>Open Cleanup Tool</span>
          </button>
        )}
      </div>
      <p className="cleanup-helper-text">
        {hasSubject
          ? "Click to open the cleanup tool and manually remove any remaining background areas."
          : "Process your image in the Background section first."}
      </p>
    </section>
  );
}

import { Camera, Grid2X2, Sparkles } from "lucide-react";

const loadingSteps = ["Preparing studio", "Warming up canvas", "Loading local AI"];

export function StudioLoading() {
  return (
    <div className="studio-loader" role="status" aria-live="polite" aria-label="Loading Chitra Studio">
      <div className="studio-loader-panel">
        <div className="studio-loader-mark">
          <Camera size={28} />
          <span />
        </div>
        <div className="studio-loader-copy">
          <strong>Opening Chitra Studio</strong>
          <p>Setting up the print canvas, workflow tools, and private on-device processing.</p>
        </div>
        <div className="studio-loader-preview" aria-hidden="true">
          <div className="loader-sheet">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="loader-spark">
            <Sparkles size={18} />
          </div>
          <div className="loader-grid-icon">
            <Grid2X2 size={18} />
          </div>
        </div>
        <div className="studio-loader-bar">
          <span />
        </div>
        <div className="studio-loader-steps">
          {loadingSteps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

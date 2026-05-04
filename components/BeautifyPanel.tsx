import { Sparkles } from "lucide-react";

type BeautifyPanelProps = {
  enabled: boolean;
  strength: number;
  hasImage: boolean;
  onEnabledChange: (value: boolean) => void;
  onStrengthChange: (value: number) => void;
};

export function BeautifyPanel({ enabled, strength, hasImage, onEnabledChange, onStrengthChange }: BeautifyPanelProps) {
  return (
    <section className="fluent-card">
      <div className="section-title">
        <span>2. Beautify</span>
        <Sparkles size={15} />
      </div>
      <label className="switch-row">
        <span>
          <strong>Beautify face</strong>
          <small>Softens skin tones while keeping the photo local.</small>
        </span>
        <input
          type="checkbox"
          checked={enabled}
          disabled={!hasImage}
          onChange={(event) => onEnabledChange(event.target.checked)}
        />
        <i aria-hidden="true" />
      </label>
      <label className="control-row">
        <span>Strength</span>
        <strong>{strength}%</strong>
      </label>
      <input
        className="range"
        type="range"
        min={5}
        max={75}
        step={1}
        value={strength}
        disabled={!hasImage || !enabled}
        onChange={(event) => onStrengthChange(Number(event.target.value))}
      />
    </section>
  );
}

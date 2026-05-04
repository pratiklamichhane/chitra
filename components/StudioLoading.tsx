import Image from "next/image";

export function StudioLoading() {
  return (
    <div className="studio-loader" role="status" aria-live="polite" aria-label="Loading Chitra Studio">
      <div className="studio-loader-panel">
        <div className="studio-loader-mark">
          <Image src="/logo.png" width={56} height={56} alt="Chitra" priority />
        </div>
        <p className="studio-loader-label">Loading</p>
        <div className="studio-loader-bar">
          <span />
        </div>
      </div>
    </div>
  );
}

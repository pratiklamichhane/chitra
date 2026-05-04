import { ImagePlus, RefreshCw, UploadCloud } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type ImageUploaderProps = {
  fileName?: string;
  imageUrl?: string | null;
  onImage: (file: File, image: HTMLImageElement, url: string) => void;
};

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ fileName, imageUrl, onImage }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const loadFile = useCallback(
    (file?: File) => {
      if (!file || !acceptedTypes.includes(file.type)) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => onImage(file, img, url);
      img.src = url;
    },
    [onImage],
  );

  return (
    <section className="fluent-card">
      <div className="section-title">
        <span><span className="step-number">1.</span> Upload</span>
        {imageUrl ? <button className="icon-button" onClick={() => inputRef.current?.click()} title="Replace image"><RefreshCw size={15} /></button> : null}
      </div>
      <button
        className={`drop-zone ${isOver ? "drop-zone-active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsOver(false);
          loadFile(event.dataTransfer.files[0]);
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="upload-thumb" src={imageUrl} alt="Uploaded source" />
        ) : (
          <span className="empty-upload">
            <UploadCloud size={26} />
            <span>Drop JPG, PNG or WEBP</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => loadFile(event.target.files?.[0])}
      />
      <div className="mini-status">
        <ImagePlus size={14} />
        <span>{fileName || "No server upload. File stays in this browser."}</span>
      </div>
    </section>
  );
}

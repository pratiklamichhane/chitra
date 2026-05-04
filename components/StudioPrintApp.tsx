"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Expand,
  Eraser,
  ExternalLink,
  Grid2X2,
  Hand,
  Images,
  Maximize,
  Maximize2,
  Printer,
  DownloadCloud,
  FileText,
  Minus,
  Plus,
  Sparkles,
  SquareDashed,
  UploadCloud,
} from "lucide-react";
import { BeautifyPanel } from "./BeautifyPanel";
import { BackgroundProcessor } from "./BackgroundProcessor";
import { CropPanel } from "./CropPanel";
import { ExportPanel } from "./ExportPanel";
import { ImageUploader } from "./ImageUploader";
import { LayoutPanel } from "./LayoutPanel";
import { ManualCleanupModal } from "./ManualCleanupModal";
import { ManualCleanupTrigger } from "./ManualCleanupTrigger";
import { PhotoSizePanel } from "./PhotoSizePanel";
import { PreviewCanvas } from "./PreviewCanvas";
import { SheetPanel } from "./SheetPanel";
import { useSegmentation } from "@/composables/useSegmentation";
import type { BackgroundFill, CropState } from "@/composables/useCanvasRenderer";
import { beautifyCanvas, imageToCanvas } from "@/composables/useCanvasRenderer";
import { calculateLayout, type LayoutMode, type Orientation } from "@/composables/useLayoutEngine";
import { canvasToPdf, canvasToPng, printCanvas } from "@/utils/exportUtils";
import { backgroundOptions, sheetPresets } from "@/utils/presets";
import type { Unit } from "@/utils/sizeConversions";
import { formatMm, toPhysicalSize } from "@/utils/sizeConversions";

type PhotoSizeState = {
  width: number;
  height: number;
  unit: Unit;
  dpi: number;
};

const workflowSections = [
  { id: "upload", label: "Upload", icon: UploadCloud },
  { id: "beautify", label: "Beautify", icon: Sparkles },
  { id: "background", label: "Background", icon: Images },
  { id: "cleanup", label: "Cleanup", icon: Eraser },
  { id: "photo-size", label: "Photo Size", icon: SquareDashed },
  { id: "crop", label: "Crop", icon: CropIcon },
  { id: "sheet", label: "Sheet Layout", icon: Grid2X2 },
  { id: "export", label: "Export", icon: ExternalLink },
] as const;

export function StudioPrintApp() {
  const appShellRef = useRef<HTMLDivElement | null>(null);
  const controlRailRef = useRef<HTMLElement | null>(null);
  const sectionSpyFrameRef = useRef<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const [autoSubjectCanvas, setAutoSubjectCanvas] = useState<HTMLCanvasElement | null>(null);
  const [subjectCanvas, setSubjectCanvas] = useState<HTMLCanvasElement | null>(null);
  const [renderedSheet, setRenderedSheet] = useState<HTMLCanvasElement | null>(null);
  const [beforeView, setBeforeView] = useState(false);
  const [cleanupModalOpen, setCleanupModalOpen] = useState(false);
  const [beautifyEnabled, setBeautifyEnabled] = useState(false);
  const [beautifyStrength, setBeautifyStrength] = useState(35);
  const [background, setBackground] = useState("white");
  const [customColor, setCustomColor] = useState("#f5f7fa");
  const [feather, setFeather] = useState(0.6);
  const [photoSize, setPhotoSize] = useState<PhotoSizeState>({ width: 35, height: 45, unit: "mm", dpi: 300 });
  const [crop, setCrop] = useState<CropState>({ zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 });
  const [sheetId, setSheetId] = useState("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [customWidthMm, setCustomWidthMm] = useState(210);
  const [customHeightMm, setCustomHeightMm] = useState(297);
  const [marginMm, setMarginMm] = useState(8);
  const [gapMm, setGapMm] = useState(3);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("auto");
  const [fixedCount, setFixedCount] = useState(8);
  const [manualRows, setManualRows] = useState(4);
  const [manualCols, setManualCols] = useState(4);
  const [activeSection, setActiveSection] = useState<(typeof workflowSections)[number]["id"]>("upload");
  const [canvasZoom, setCanvasZoom] = useState(1);
  const { isProcessing, modelError, processingError, removeBackground } = useSegmentation();

  const physicalPhoto = useMemo(() => toPhysicalSize(photoSize), [photoSize]);

  const activeSheet = useMemo(() => {
    const preset = sheetPresets.find((item) => item.id === sheetId);
    let widthMm = preset?.widthMm ?? customWidthMm;
    let heightMm = preset?.heightMm ?? customHeightMm;
    if (orientation === "landscape" && heightMm > widthMm) {
      [widthMm, heightMm] = [heightMm, widthMm];
    }
    if (orientation === "portrait" && widthMm > heightMm) {
      [widthMm, heightMm] = [heightMm, widthMm];
    }
    return { widthMm, heightMm };
  }, [customHeightMm, customWidthMm, orientation, sheetId]);

  const layout = useMemo(
    () =>
      calculateLayout({
        sheetWidthMm: activeSheet.widthMm,
        sheetHeightMm: activeSheet.heightMm,
        photoWidthMm: physicalPhoto.widthMm,
        photoHeightMm: physicalPhoto.heightMm,
        dpi: photoSize.dpi,
        marginMm,
        gapMm,
        mode: layoutMode,
        fixedCount,
        manualRows,
        manualCols,
      }),
    [activeSheet.heightMm, activeSheet.widthMm, fixedCount, gapMm, layoutMode, manualCols, manualRows, marginMm, photoSize.dpi, physicalPhoto.heightMm, physicalPhoto.widthMm],
  );

  const fill = useMemo<BackgroundFill>(() => {
    if (background === "transparent") return { kind: "transparent", color: "transparent" };
    if (background === "custom") return { kind: "color", color: customColor };
    const option = backgroundOptions.find((item) => item.id === background);
    return { kind: "color", color: option?.value ?? "#ffffff" };
  }, [background, customColor]);

  const enhancedCanvas = useMemo(() => {
    if (!originalCanvas) return null;
    return beautifyEnabled ? beautifyCanvas(originalCanvas, beautifyStrength) : originalCanvas;
  }, [beautifyEnabled, beautifyStrength, originalCanvas]);

  const enhancedSubjectCanvas = useMemo(() => {
    if (!subjectCanvas) return null;
    return beautifyEnabled ? beautifyCanvas(subjectCanvas, beautifyStrength) : subjectCanvas;
  }, [beautifyEnabled, beautifyStrength, subjectCanvas]);

  const previewSource = beforeView ? originalCanvas : enhancedSubjectCanvas ?? enhancedCanvas;
  const canExport = Boolean(renderedSheet && previewSource);
  const canvasScaleLabel = canvasZoom === 1 ? "Fit" : `${Math.round(canvasZoom * 100)}%`;
  const canvasControlStyle = {
    "--zoom-progress": `${((canvasZoom - 0.4) / 2.6) * 100}%`,
  } as CSSProperties;

  const updateCanvasZoom = useCallback((next: number | ((current: number) => number)) => {
    setCanvasZoom((current) => {
      const value = typeof next === "function" ? next(current) : next;
      return Math.round(Math.min(3, Math.max(0.4, value)) * 100) / 100;
    });
  }, []);

  const handleImage = useCallback((file: File, image: HTMLImageElement, url: string) => {
    setFileName(file.name);
    setImageUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });
    setSourceImage(image);
    setOriginalCanvas(imageToCanvas(image));
    setAutoSubjectCanvas(null);
    setSubjectCanvas(null);
    setBeforeView(false);
    setCrop({ zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 });
  }, []);

  useEffect(() => {
    const rail = controlRailRef.current;
    if (!rail) return;

    const updateActiveSection = () => {
      sectionSpyFrameRef.current = null;
      const sections = Array.from(rail.querySelectorAll<HTMLElement>("[data-section]"));
      const railTop = rail.getBoundingClientRect().top;
      const active = sections.reduce<{ id: string; distance: number } | null>((current, section) => {
        const id = section.getAttribute("data-section");
        if (!id) return current;
        const distance = Math.abs(section.getBoundingClientRect().top - railTop - 12);
        if (!current || distance < current.distance) return { id, distance };
        return current;
      }, null);
      if (active && workflowSections.some((item) => item.id === active.id)) {
        setActiveSection(active.id as (typeof workflowSections)[number]["id"]);
      }
    };

    const scheduleUpdate = () => {
      if (sectionSpyFrameRef.current !== null) return;
      sectionSpyFrameRef.current = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    rail.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      rail.removeEventListener("scroll", scheduleUpdate);
      if (sectionSpyFrameRef.current !== null) window.cancelAnimationFrame(sectionSpyFrameRef.current);
    };
  }, []);

  const handleBeautifyEnabled = useCallback((value: boolean) => {
    setBeautifyEnabled(value);
    setBeforeView(false);
  }, []);

  const handleBeautifyStrength = useCallback((value: number) => {
    setBeautifyStrength(value);
    setBeforeView(false);
  }, []);

  const processBackground = useCallback(async () => {
    if (!originalCanvas) return;
    try {
      const result = await removeBackground(originalCanvas, feather);
      setAutoSubjectCanvas(imageToCanvas(result.subjectCanvas));
      setSubjectCanvas(result.subjectCanvas);
      setBeforeView(false);
    } catch {
      setAutoSubjectCanvas(null);
      setSubjectCanvas(null);
    }
  }, [feather, originalCanvas, removeBackground]);

  const updateManualCleanup = useCallback((canvas: HTMLCanvasElement) => {
    setSubjectCanvas(canvas);
    setBeforeView(false);
  }, []);

  const resetManualCleanup = useCallback(() => {
    if (!autoSubjectCanvas) return;
    setSubjectCanvas(imageToCanvas(autoSubjectCanvas));
    setBeforeView(false);
  }, [autoSubjectCanvas]);

  const exportPng = useCallback(() => {
    if (renderedSheet) void canvasToPng(renderedSheet);
  }, [renderedSheet]);

  const exportPdf = useCallback(() => {
    if (renderedSheet) void canvasToPdf(renderedSheet, activeSheet.widthMm, activeSheet.heightMm);
  }, [activeSheet.heightMm, activeSheet.widthMm, renderedSheet]);

  const print = useCallback(() => {
    if (renderedSheet) printCanvas(renderedSheet);
  }, [renderedSheet]);

  const scrollToSection = useCallback((id: (typeof workflowSections)[number]["id"]) => {
    setActiveSection(id);
    window.requestAnimationFrame(() => {
      const rail = controlRailRef.current;
      const section = document.getElementById(id);
      if (!rail || !section) return;
      rail.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const currentDocument = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const shell = appShellRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }) | null;
    if (document.fullscreenElement || currentDocument.webkitFullscreenElement) {
      if (document.exitFullscreen) void document.exitFullscreen();
      else void currentDocument.webkitExitFullscreen?.();
      return;
    }
    if (!shell) return;
    if (shell.requestFullscreen) void shell.requestFullscreen();
    else void shell.webkitRequestFullscreen?.();
  }, []);

  return (
    <div ref={appShellRef} className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">CH</span>
          <div>
            <strong>Chitra</strong>
            <span>Professional Photo Layout</span>
          </div>
        </div>
        <div className="topbar-status">
          <div className="topbar-actions">
            <button className="chrome-button" title="Export PNG" onClick={exportPng}>
              <DownloadCloud size={16} />
            </button>
            <button className="chrome-button" title="Export PDF" onClick={exportPdf}>
              <FileText size={16} />
            </button>
            <button className="chrome-button" title="Print" onClick={print}>
              <Printer size={16} />
            </button>
            <span className="topbar-action-sep" />
            <button className="chrome-button" title="Fullscreen" onClick={toggleFullscreen}><Maximize2 size={16} /></button>
          </div>
        </div>
      </header>

      <main className="studio-layout">
        <nav className="workflow-rail" aria-label="Workflow">
          {workflowSections.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              className={activeSection === id ? "active" : undefined}
              href={`#${id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(id);
              }}
            >
              <Icon size={id === "photo-size" || id === "sheet" ? 23 : 22} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <aside ref={controlRailRef} className="control-rail">
          <div id="upload" data-section="upload"><ImageUploader fileName={fileName} imageUrl={imageUrl} onImage={handleImage} /></div>
          <div id="beautify" data-section="beautify">
            <BeautifyPanel
              enabled={beautifyEnabled}
              strength={beautifyStrength}
              hasImage={Boolean(originalCanvas)}
              onEnabledChange={handleBeautifyEnabled}
              onStrengthChange={handleBeautifyStrength}
            />
          </div>
          <div id="background" data-section="background">
            <BackgroundProcessor
              activeBackground={background}
              customColor={customColor}
              feather={feather}
              hasImage={Boolean(sourceImage)}
              hasProcessedImage={Boolean(subjectCanvas)}
              isProcessing={isProcessing}
              beforeAfter={beforeView}
              error={processingError || modelError}
              onBackgroundChange={setBackground}
              onCustomColorChange={setCustomColor}
              onFeatherChange={setFeather}
              onProcess={processBackground}
              onToggleBeforeAfter={() => setBeforeView((value) => !value)}
            />
          </div>
          <div id="cleanup" data-section="cleanup">
            <ManualCleanupTrigger
              hasSubject={Boolean(subjectCanvas)}
              onOpen={() => setCleanupModalOpen(true)}
            />
          </div>
          <div id="photo-size" data-section="photo-size">
            <PhotoSizePanel
              {...photoSize}
              widthPx={physicalPhoto.widthPx}
              heightPx={physicalPhoto.heightPx}
              onChange={(next) => setPhotoSize((current) => ({ ...current, ...next }))}
            />
          </div>
          <div id="crop" data-section="crop"><CropPanel crop={crop} onChange={(next) => setCrop((current) => ({ ...current, ...next }))} onReset={() => setCrop({ zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 })} /></div>
          <div id="sheet" data-section="sheet">
            <SheetPanel
              sheetId={sheetId}
              orientation={orientation}
              customWidthMm={customWidthMm}
              customHeightMm={customHeightMm}
              marginMm={marginMm}
              gapMm={gapMm}
              onChange={(next) => {
                if (next.sheetId) setSheetId(next.sheetId);
                if (next.orientation) setOrientation(next.orientation);
                if (next.customWidthMm) setCustomWidthMm(next.customWidthMm);
                if (next.customHeightMm) setCustomHeightMm(next.customHeightMm);
                if (next.marginMm !== undefined) setMarginMm(next.marginMm);
                if (next.gapMm !== undefined) setGapMm(next.gapMm);
              }}
            />
          </div>
          <div data-section="sheet">
            <LayoutPanel
              mode={layoutMode}
              fixedCount={fixedCount}
              manualRows={manualRows}
              manualCols={manualCols}
              layout={layout}
              onChange={(next) => {
                if (next.mode) setLayoutMode(next.mode);
                if (next.fixedCount) setFixedCount(next.fixedCount);
                if (next.manualRows) setManualRows(next.manualRows);
                if (next.manualCols) setManualCols(next.manualCols);
              }}
            />
          </div>
          <div id="export" data-section="export"><ExportPanel canExport={canExport} onExportPng={exportPng} onExportPdf={exportPdf} onPrint={print} /></div>
        </aside>

        <PreviewCanvas
          sourceCanvas={previewSource}
          layout={layout}
          crop={crop}
          fill={fill}
          viewZoom={canvasZoom}
          onCropChange={(next) => setCrop((current) => ({ ...current, ...next }))}
          onRendered={setRenderedSheet}
          onViewZoomChange={updateCanvasZoom}
        />
      </main>

      <footer className="statusbar">
        <div className="status-metrics">
          <span>Photo {physicalPhoto.widthPx} x {physicalPhoto.heightPx}px</span>
          <span>Sheet {formatMm(activeSheet.widthMm)} x {formatMm(activeSheet.heightMm)}</span>
          <span>{layout.count} copies · {layout.cols} columns · {layout.rows} rows</span>
        </div>
        <div className="zoom-dock footer-zoom-dock" style={canvasControlStyle} aria-label="Canvas view controls">
          <button type="button" className="selected" title="Drag photo"><Hand size={17} /></button>
          <button type="button" title="Fit canvas" onClick={() => updateCanvasZoom(1)}><Expand size={17} /></button>
          <span className="dock-divider" />
          <button type="button" title="Zoom out" onClick={() => updateCanvasZoom((current) => current - 0.1)}><Minus size={17} /></button>
          <input
            className="zoom-track"
            type="range"
            min={0.4}
            max={3}
            step={0.01}
            value={canvasZoom}
            onChange={(event) => updateCanvasZoom(Number(event.target.value))}
            aria-label="Canvas zoom"
          />
          <strong>{canvasScaleLabel}</strong>
          <button type="button" title="Zoom in" onClick={() => updateCanvasZoom((current) => current + 0.1)}><Plus size={17} /></button>
          <span className="dock-divider" />
          <button type="button" title="Fill view" onClick={() => updateCanvasZoom(1.35)}><Maximize size={17} /></button>
        </div>
      </footer>

      <ManualCleanupModal
        isOpen={cleanupModalOpen}
        subjectCanvas={subjectCanvas}
        onChange={updateManualCleanup}
        onReset={resetManualCleanup}
        onClose={() => setCleanupModalOpen(false)}
      />
    </div>
  );
}

function CropIcon({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3v15h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6h15v15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

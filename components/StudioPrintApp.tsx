"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { driver, type DriveStep, type Driver } from "driver.js";
import {
  Expand,
  Eraser,
  ExternalLink,
  HelpCircle,
  Grid2X2,
  Hand,
  Images,
  Maximize,
  Maximize2,
  Printer,
  Save,
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
import { StudioLoading } from "./StudioLoading";
import { UserMenu } from "./UserMenu";
import { CustomerPhotosPanel } from "./CustomerPhotosPanel";
import { SaveCustomerModal } from "./SaveCustomerModal";
import { useSegmentation } from "@/composables/useSegmentation";
import type { CustomerPhoto } from "@/lib/auth";
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
  { id: "cloud", label: "Cloud Save", icon: UploadCloud },
  { id: "export", label: "Export", icon: ExternalLink },
] as const;

const STUDIO_TOUR_STORAGE_KEY = "chitra:studio-tour-seen";

export function StudioPrintApp() {
  const appShellRef = useRef<HTMLDivElement | null>(null);
  const controlRailRef = useRef<HTMLElement | null>(null);
  const sectionSpyFrameRef = useRef<number | null>(null);
  const tourRef = useRef<Driver | null>(null);
  const autoTourStartedRef = useRef(false);
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
  const [studioReady, setStudioReady] = useState(false);
  const [tourWelcomeOpen, setTourWelcomeOpen] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [currentImageBlob, setCurrentImageBlob] = useState<Blob | null>(null);
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

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setStudioReady(true), 850);
    return () => window.clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const updateMobileWarning = () => setShowMobileWarning(mobileQuery.matches);

    updateMobileWarning();
    mobileQuery.addEventListener("change", updateMobileWarning);
    return () => mobileQuery.removeEventListener("change", updateMobileWarning);
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
    if (!sourceImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentImageBlob(null);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(sourceImage, 0, 0);
    canvas.toBlob((blob) => setCurrentImageBlob(blob), "image/jpeg", 0.9);
  }, [sourceImage]);

  const handleSelectCustomerPhoto = useCallback(async (customer: CustomerPhoto) => {
    try {
      const res = await fetch(customer.photo_url);
      const blob = await res.blob();
      const file = new File([blob], `${customer.customer_name}.jpg`, { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const img = new window.Image();
      img.onload = () => handleImage(file, img, url);
      img.src = url;
    } catch (error) {
      console.error("Failed to load customer photo:", error);
    }
  }, [handleImage]);

  useEffect(() => {
    if (!studioReady) return;

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
  }, [studioReady]);

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

  const scrollTourTargetIntoView = useCallback((sectionId?: (typeof workflowSections)[number]["id"]) => {
    if (!sectionId) return;
    setActiveSection(sectionId);
    const rail = controlRailRef.current;
    const section = document.getElementById(sectionId);
    if (!rail || !section) return;
    rail.scrollTo({ top: section.offsetTop, behavior: "auto" });
  }, []);

  const createTourStep = useCallback(
    ({
      element,
      title,
      description,
      sectionId,
      side = "right",
      align = "start",
    }: {
      element: string;
      title: string;
      description: string;
      sectionId?: (typeof workflowSections)[number]["id"];
      side?: "top" | "right" | "bottom" | "left" | "over";
      align?: "start" | "center" | "end";
    }): DriveStep => ({
      element,
      onHighlightStarted: (_element, _step, { driver: tourDriver }) => {
        scrollTourTargetIntoView(sectionId);
        window.requestAnimationFrame(() => tourDriver.refresh());
      },
      popover: {
        title,
        description,
        side,
        align,
      },
    }),
    [scrollTourTargetIntoView],
  );

  const startStudioTour = useCallback(() => {
    if (!studioReady || typeof window === "undefined") return;

    setTourWelcomeOpen(false);
    tourRef.current?.destroy();

    const steps: DriveStep[] = [
      createTourStep({
        element: "#upload",
        sectionId: "upload",
        title: "Upload a photo",
        description: "Drop a JPG, PNG, or WEBP here. The file stays in your browser.",
      }),
      createTourStep({
        element: "#background",
        sectionId: "background",
        title: "Remove the background",
        description: "Run local background removal, then pick a solid or transparent background.",
      }),
      createTourStep({
        element: "#photo-size",
        sectionId: "photo-size",
        title: "Set photo size",
        description: "Choose the required dimensions, unit, and DPI for the final print.",
      }),
      createTourStep({
        element: "#crop",
        sectionId: "crop",
        title: "Adjust framing",
        description: "Use crop controls to center the face and fine tune the final composition.",
      }),
      createTourStep({
        element: "#sheet",
        sectionId: "sheet",
        title: "Build the sheet",
        description: "Select paper size, orientation, margins, gaps, and copy layout.",
      }),
      createTourStep({
        element: "#export",
        sectionId: "export",
        title: "Export or print",
        description: "When the preview is ready, export a PNG/PDF or send it to print.",
      }),
    ];

    const tour = driver({
      steps,
      animate: false,
      allowClose: true,
      allowKeyboardControl: true,
      disableActiveInteraction: false,
      overlayColor: "#111827",
      overlayOpacity: 0.36,
      popoverClass: "chitra-tour-popover",
      popoverOffset: 10,
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      progressText: "{{current}} of {{total}}",
      onDestroyed: () => {
        tourRef.current = null;
      },
    });

    tourRef.current = tour;
    window.localStorage.setItem(STUDIO_TOUR_STORAGE_KEY, "1");
    tour.drive();
  }, [createTourStep, studioReady]);

  const dismissTourWelcome = useCallback(() => {
    setTourWelcomeOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STUDIO_TOUR_STORAGE_KEY, "1");
    }
  }, []);

  useEffect(() => {
    if (!studioReady || autoTourStartedRef.current || typeof window === "undefined") return;
    if (window.localStorage.getItem(STUDIO_TOUR_STORAGE_KEY)) return;

    autoTourStartedRef.current = true;
    const tourTimer = window.setTimeout(() => setTourWelcomeOpen(true), 450);
    return () => window.clearTimeout(tourTimer);
  }, [studioReady]);

  useEffect(() => {
    return () => {
      tourRef.current?.destroy();
      tourRef.current = null;
    };
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

  if (!studioReady) {
    return <StudioLoading />;
  }

  return (
    <div ref={appShellRef} className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Image src="/logo.png" width={28} height={28} alt="Chitra" priority />
          </span>
          <div>
            <strong>Chitra</strong>
            <span>
              Studio
            </span>
          </div>
        </div>
        <div className="topbar-status">
          <div className="topbar-actions">
            <span className="inline-flex" title={!canExport ? "Generate a photo layout first to export" : "Export PNG"} tabIndex={!canExport ? 0 : undefined}>
              <button aria-label="Export PNG" className="chrome-button" disabled={!canExport} onClick={exportPng}>
                <DownloadCloud size={16} />
              </button>
            </span>
            <span className="inline-flex" title={!canExport ? "Generate a photo layout first to export" : "Export PDF"} tabIndex={!canExport ? 0 : undefined}>
              <button aria-label="Export PDF" className="chrome-button" disabled={!canExport} onClick={exportPdf}>
                <FileText size={16} />
              </button>
            </span>
            <span className="inline-flex" title={!canExport ? "Generate a photo layout first to print" : "Print"} tabIndex={!canExport ? 0 : undefined}>
              <button aria-label="Print" className="chrome-button" disabled={!canExport} onClick={print}>
                <Printer size={16} />
              </button>
            </span>
            <span className="topbar-action-sep" />
            <button className="chrome-button" title="Show tour" onClick={startStudioTour}>
              <HelpCircle size={16} />
            </button>
            <button className="chrome-button" title="Fullscreen" onClick={toggleFullscreen}><Maximize2 size={16} /></button>
            <span className="topbar-action-sep" />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="studio-layout">
        {showMobileWarning ? (
          <div
            role="note"
            style={{
              display: "grid",
              gap: 4,
              borderBottom: "1px solid #d7e0ee",
              background: "#f1f6ff",
              color: "#22314a",
              padding: "10px 16px",
            }}
          >
            <strong style={{ fontSize: 13, fontWeight: 760, lineHeight: 1.2 }}>Mobile preview is limited</strong>
            <span style={{ color: "#536176", fontSize: 12, lineHeight: 1.35 }}>
              Chitra is optimized for laptop or desktop. Explore from desktop for more features and a better editing workspace.
            </span>
          </div>
        ) : null}

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
          <div id="upload" data-section="upload">
            <ImageUploader fileName={fileName} imageUrl={imageUrl} onImage={handleImage} />
            <CustomerPhotosPanel onSelectPhoto={handleSelectCustomerPhoto} />
          </div>
          <div id="beautify" className="mobile-optional-section" data-section="beautify">
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
          <div id="cleanup" className="mobile-optional-section" data-section="cleanup">
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
          <div id="cloud" data-section="cloud">
            <div className="fluent-card">
              <div className="section-title">
                <div className="flex items-center gap-2">
                  <UploadCloud size={18} />
                  <span>Cloud Storage</span>
                </div>
              </div>
              <p className="text-muted text-xs mb-4">
                Store this photo in the cloud for future use. You can search and reload it anytime.
              </p>
              <button
                className="primary-action"
                disabled={!sourceImage}
                onClick={() => setSaveModalOpen(true)}
              >
                <Save size={16} />
                <span>Save Customer Photo</span>
              </button>
            </div>
          </div>
          <div id="export" className="mobile-optional-section" data-section="export"><ExportPanel canExport={canExport} onExportPng={exportPng} onExportPdf={exportPdf} onPrint={print} /></div>
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
          <button type="button" className="selected mobile-zoom-secondary" title="Drag photo"><Hand size={17} /></button>
          <button type="button" className="mobile-zoom-secondary" title="Fit canvas" onClick={() => updateCanvasZoom(1)}><Expand size={17} /></button>
          <span className="dock-divider mobile-zoom-secondary" />
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
          <span className="dock-divider mobile-zoom-secondary" />
          <button type="button" className="mobile-zoom-secondary" title="Fill view" onClick={() => updateCanvasZoom(1.35)}><Maximize size={17} /></button>
        </div>
      </footer>

      <ManualCleanupModal
        isOpen={cleanupModalOpen}
        subjectCanvas={subjectCanvas}
        onChange={updateManualCleanup}
        onReset={resetManualCleanup}
        onClose={() => setCleanupModalOpen(false)}
      />

      <SaveCustomerModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        imageBlob={currentImageBlob}
        onSaved={() => {
          // You could optionally refresh the customer list here if it had a ref
        }}
      />
      {tourWelcomeOpen ? (
        <div className="tour-welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="tour-welcome-title">
          <div className="tour-welcome">
            <span className="tour-welcome-mark">
              <Image src="/logo.png" width={34} height={34} alt="" aria-hidden="true" />
            </span>
            <div>
              <h2 id="tour-welcome-title">Welcome to Chitra Studio</h2>
              <p>A short guide can walk you through uploading, background removal, sizing, layout, and export.</p>
            </div>
            <div className="tour-welcome-actions">
              <button type="button" className="secondary-action" onClick={dismissTourWelcome}>
                Skip
              </button>
              <button type="button" className="primary-action tour-start-action" onClick={startStudioTour}>
                Start tour
              </button>
            </div>
          </div>
        </div>
      ) : null}
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

"use client";

import { useCallback, useState } from "react";
import { applyAlphaMask, imageToCanvas, resizeImageForInference } from "./useCanvasRenderer";
import { useONNXModel } from "./useONNXModel";

type SegmentationResult = {
  matteCanvas: HTMLCanvasElement;
  subjectCanvas: HTMLCanvasElement;
};

function waitForProcessingPaint() {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
      setTimeout(resolve, 0);
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function canvasToModnetTensor(canvas: HTMLCanvasElement, ort: typeof import("onnxruntime-web")) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const input = new Float32Array(1 * 3 * canvas.height * canvas.width);
  const mean = [0.5, 0.5, 0.5];
  const std = [0.5, 0.5, 0.5];
  const plane = canvas.width * canvas.height;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const i = y * canvas.width + x;
      const p = i * 4;
      input[i] = data[p] / 255 - mean[0];
      input[plane + i] = data[p + 1] / 255 - mean[1];
      input[plane * 2 + i] = data[p + 2] / 255 - mean[2];
      input[i] /= std[0];
      input[plane + i] /= std[1];
      input[plane * 2 + i] /= std[2];
    }
  }

  return new ort.Tensor("float32", input, [1, 3, canvas.height, canvas.width]);
}

export function useSegmentation() {
  const { isModelLoading, loadModel, modelError } = useONNXModel();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const removeBackground = useCallback(
    async (image: HTMLImageElement | HTMLCanvasElement, feather: number): Promise<SegmentationResult> => {
      setIsProcessing(true);
      setProcessingError(null);
      try {
        await waitForProcessingPaint();
        const [session, ort] = await Promise.all([loadModel(), import("onnxruntime-web")]);
        const sourceCanvas = imageToCanvas(image);
        const inferenceCanvas = resizeImageForInference(sourceCanvas, 1024);
        const tensor = canvasToModnetTensor(inferenceCanvas, ort);
        const inputName = session.inputNames[0];
        const output = await session.run({ [inputName]: tensor });
        const outputName = session.outputNames[0];
        const matte = output[outputName];
        const matteData = matte.data as Float32Array;
        const dims = matte.dims;
        const maskHeight = Number(dims[dims.length - 2]) || inferenceCanvas.height;
        const maskWidth = Number(dims[dims.length - 1]) || inferenceCanvas.width;
        const subjectCanvas = applyAlphaMask(sourceCanvas, matteData, maskWidth, maskHeight, feather);

        return {
          matteCanvas: inferenceCanvas,
          subjectCanvas,
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Background removal failed. The original photo is still available.";
        setProcessingError(message);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [loadModel],
  );

  return {
    isProcessing: isProcessing || isModelLoading,
    modelError,
    processingError,
    removeBackground,
  };
}

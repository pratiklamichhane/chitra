"use client";

import { useCallback, useRef, useState } from "react";

type OrtModule = typeof import("onnxruntime-web");
type InferenceSession = import("onnxruntime-web").InferenceSession;

const MODEL_PATH = "/models/modnet.onnx";
let cachedSession: InferenceSession | null = null;
let cachedOrt: OrtModule | null = null;

async function getOrt() {
  if (cachedOrt) return cachedOrt;
  const ort = await import("onnxruntime-web");
  ort.env.wasm.wasmPaths = "/ort/";
  ort.env.wasm.numThreads = 1;
  cachedOrt = ort;
  return ort;
}

async function createSession(ort: OrtModule) {
  if (cachedSession) return cachedSession;

  const providers = ["webgl", "wasm"];
  let lastError: unknown;
  for (const provider of providers) {
    try {
      cachedSession = await ort.InferenceSession.create(MODEL_PATH, {
        executionProviders: [provider],
        graphOptimizationLevel: "all",
      });
      return cachedSession;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to load MODNet model.");
}

export function useONNXModel() {
  const loadingRef = useRef(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const loadModel = useCallback(async () => {
    if (cachedSession) return cachedSession;
    if (loadingRef.current) {
      while (loadingRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      if (cachedSession) return cachedSession;
    }

    loadingRef.current = true;
    setIsModelLoading(true);
    setModelError(null);
    try {
      const ort = await getOrt();
      return await createSession(ort);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Background model could not be loaded.";
      setModelError(
        message.includes("404") || message.includes("not found")
          ? "Place a MODNet ONNX file at public/models/modnet.onnx to enable AI background removal."
          : message,
      );
      throw error;
    } finally {
      loadingRef.current = false;
      setIsModelLoading(false);
    }
  }, []);

  return {
    isModelLoading,
    loadModel,
    modelError,
  };
}

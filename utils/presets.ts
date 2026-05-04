import type { Unit } from "./sizeConversions";

export type PhotoPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  unit: Unit;
};

export type SheetPreset = {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
};

export const photoPresets: PhotoPreset[] = [
  { id: "passport", label: "Passport", width: 35, height: 45, unit: "mm" },
  { id: "visa", label: "Visa", width: 50, height: 50, unit: "mm" },
  { id: "2x2", label: "2 x 2", width: 2, height: 2, unit: "inch" },
  { id: "stamp", label: "Stamp", width: 25, height: 30, unit: "mm" },
];

export const sheetPresets: SheetPreset[] = [
  { id: "a4", label: "A4", widthMm: 210, heightMm: 297 },
  { id: "a3", label: "A3", widthMm: 297, heightMm: 420 },
  { id: "letter", label: "Letter", widthMm: 215.9, heightMm: 279.4 },
  { id: "4r", label: "4R", widthMm: 102, heightMm: 152 },
  { id: "5r", label: "5R", widthMm: 127, heightMm: 178 },
  { id: "6r", label: "6R", widthMm: 152, heightMm: 203 },
];

export const backgroundOptions = [
  { id: "white", label: "White", value: "#ffffff" },
  { id: "blue", label: "Blue", value: "#d8e8ff" },
  { id: "red", label: "Red", value: "#ffe1e1" },
  { id: "gray", label: "Gray", value: "#e8eaed" },
  { id: "transparent", label: "Clear", value: "transparent" },
] as const;

'use client';

import { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";

const IconBase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} {...props} />
);
const RotateCwIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <IconBase {...p}>
        <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </IconBase>
);
const RotateCcwIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <IconBase {...p}>
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.12-9.36L1 10" />
    </IconBase>
);
const GridIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <IconBase {...p}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </IconBase>
);
const GridOffIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <IconBase {...p}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </IconBase>
);

/**
 * getCroppedImg
 *  - Loads an image from `imageSrc`
 *  - Applies rotation
 *  - Crops to `crop` (pixels) and returns { file, url }
 *
 * IMPORTANT (CORS):
 * We intentionally DO NOT set `crossOrigin` on the image element by default.
 * When users upload files via input (blob: or data: URLs) it is same-origin
 * and safe. For remote URLs, ensure they allow CORS or proxy them; otherwise
 * the canvas becomes tainted and exporting will fail.
 */
export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Do NOT set crossOrigin by default — prevents sandbox/CORS errors.
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

function getRadianAngle(degree: number) {
    return (degree * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);
    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

async function getCroppedImg(
    imageSrc: string,
    crop: PixelCrop,
    rotation = 0,
    options?: { mimeType?: string; quality?: number; fileName?: string }
): Promise<{ file: File; url: string }> {
    const img = await loadImage(imageSrc);
    const mimeType = options?.mimeType ?? "image/jpeg";
    const quality = options?.quality ?? 0.92;
    const fileName = options?.fileName ?? "cropped.jpg";

    const rotRad = getRadianAngle(rotation);
    const { width: bBoxW, height: bBoxH } = rotateSize(img.width, img.height, rotation);

    // Step 1: Draw the rotated image to a temp canvas large enough to contain it
    const canvas = document.createElement("canvas");
    canvas.width = bBoxW;
    canvas.height = bBoxH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");

    ctx.translate(bBoxW / 2, bBoxH / 2);
    ctx.rotate(rotRad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // Step 2: Extract the crop area from the rotated image
    const data = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);

    // Step 3: Draw the crop to the output canvas
    const outCanvas = document.createElement("canvas");
    outCanvas.width = crop.width;
    outCanvas.height = crop.height;
    const outCtx = outCanvas.getContext("2d");
    if (!outCtx) throw new Error("Canvas 2D context not available");
    outCtx.putImageData(data, 0, 0);

    // Step 4: Export as Blob -> File
    const blob: Blob = await new Promise((resolve, reject) => {
        // toBlob can error on tainted canvases; give a friendly message
        outCanvas.toBlob((b) => {
            if (!b) return reject(new Error("Failed to export cropped image. If you passed a remote URL, ensure it allows CORS or use a blob/data URL."));
            resolve(b);
        }, mimeType, quality);
    });

    const file = new File([blob], fileName, { type: mimeType });
    const url = URL.createObjectURL(file);
    return { file, url };
}

interface CropModalProps {
    /** Whether the modal is visible */
    isOpen: boolean;
    /** Source URL for the image (blob:, data:, or same-origin URL strongly recommended) */
    imageSrc: string;
    /** If provided, the aspect ratio is fixed. If omitted, user can pick. */
    ratio?: number;
    /** Called when the user cancels/closes the modal */
    onClose: () => void;
    /** Receives the cropped File and a temporary object URL */
    onSave: (croppedFile: File, croppedUrl: string) => void;
}

const ControlButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...rest }) => (
    <button
        className={`p-2 border rounded-lg hover:bg-gray-100 active:scale-[0.98] transition ${className}`}
        {...rest}
    >
        {children}
    </button>
);

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...rest }) => (
    <button
        className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...rest}
    >
        {children}
    </button>
);

const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...rest }) => (
    <button
        className={`px-4 py-2 rounded-lg border hover:bg-gray-100 ${className}`}
        {...rest}
    >
        {children}
    </button>
);

const CropModal: React.FC<CropModalProps> = ({ isOpen, imageSrc, ratio, onClose, onSave }) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [showGrid, setShowGrid] = useState(true);
    const [aspect, setAspect] = useState<number | undefined>(ratio);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

    // UI States
    const [loading, setLoading] = useState<boolean>(false);

    const canSave = useMemo(() => !!croppedAreaPixels && !!imageSrc, [croppedAreaPixels, imageSrc]);

    const onCropComplete = useCallback((_: PixelCrop, areaPx: PixelCrop) => {
        setCroppedAreaPixels(areaPx);
    }, []);

    const handleSave = useCallback(async () => {
        if (!croppedAreaPixels) return;
        try {
            setLoading(true);
            const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            onSave(file, url);
            onClose();
        } catch (e) {
            console.error(e);
            alert((e as Error)?.message ?? "Failed to crop the image");
        } finally {
            setLoading(false);
        }
    }, [croppedAreaPixels, rotation, imageSrc, onSave, onClose]);

    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 flex flex-col overflow-hidden">
                {/* Canvas */}
                <div className="relative w-full h-[65vh] min-h-72 bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        showGrid={showGrid}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        restrictPosition
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t bg-white">
                    <div className="flex items-center gap-2">
                        <ControlButton aria-label="Rotate clockwise" onClick={() => setRotation((r) => r + 90)}>
                            <RotateCwIcon width={16} height={16} />
                        </ControlButton>
                        <ControlButton aria-label="Rotate counter-clockwise" onClick={() => setRotation((r) => r - 90)}>
                            <RotateCcwIcon width={16} height={16} />
                        </ControlButton>
                        <ControlButton aria-label={showGrid ? "Hide grid" : "Show grid"} onClick={() => setShowGrid((g) => !g)}>
                            {showGrid ? <GridOffIcon width={16} height={16} /> : <GridIcon width={16} height={16} />}
                        </ControlButton>

                        {/* Zoom slider (nice-to-have for usability) */}
                        <div className="flex items-center gap-2 ml-2">
                            <label className="text-sm text-gray-600">Zoom</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-28"
                                aria-label="Zoom"
                            />
                        </div>

                        {!ratio && (
                            <div className="flex items-center gap-2 ml-2">
                                <label className="text-sm text-gray-600">Ratio</label>
                                <select
                                    className="border rounded px-2 py-1 text-sm"
                                    value={String(aspect ?? "free")}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === "free") setAspect(undefined);
                                        else setAspect(Number(v));
                                    }}
                                    aria-label="Aspect ratio"
                                >
                                    <option value="free">Free</option>
                                    <option value={1 / 1}>1:1</option>
                                    <option value={4 / 3}>4:3</option>
                                    <option value={3 / 2}>3:2</option>
                                    <option value={16 / 9}>16:9</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                        <PrimaryButton onClick={handleSave} disabled={!canSave}>{!loading ? "Save" : "...."}</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
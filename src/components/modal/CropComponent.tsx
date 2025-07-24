import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type CroppedArea = {
    width: number;
    height: number;
    x: number;
    y: number;
};

const CropComponent = ({ image, onClose, cropDone }: { image: string, onClose: () => void, cropDone: (croppedAreaPixels: CroppedArea | null) => void }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="crop-container">
                <div className='w-full h-full p-10'>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
            </div>
            <div className="controls flex items-center justify-center">
                <div className='w-full h-10 flex justify-center items-center gap-2'>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => {
                            setZoom(+e.target.value)
                        }}
                        className="zoom-range"
                    />
                    <button
                        onClick={() => cropDone(croppedAreaPixels)}
                        className="hover:text-gray-800 bg-blue-500 text-white rounded p-1"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="hover:text-gray-800 bg-red-500 text-white rounded p-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropComponent;
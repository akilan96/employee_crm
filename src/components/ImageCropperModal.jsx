import React, { useState, useRef, useEffect } from 'react';
import { Crop, ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles, RefreshCw, Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react';

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scaleMode, setScaleMode] = useState('fit'); // 'fit' (entire image visible) | 'fill' (cover box)
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1' | '4:5' | 'free'
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Reset controls when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setScaleMode('fit');
      setIsProcessing(false);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // Wheel to zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(0.2, prev + zoomFactor), 3.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Quick action: use full original image without cropping
  const handleUseFullOriginal = () => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      canvas.toBlob((blob) => {
        setIsProcessing(false);
        if (blob) {
          const uniqueName = `profile_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`;
          const croppedFile = new File([blob], uniqueName, { type: 'image/jpeg' });
          onCropComplete(croppedFile, canvas.toDataURL('image/jpeg', 0.95));
        } else {
          onCropComplete(null, imageSrc);
        }
      }, 'image/jpeg', 0.95);
    };
    img.onerror = () => {
      setIsProcessing(false);
      onCropComplete(null, imageSrc);
    };
    img.src = imageSrc;
  };

  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsProcessing(true);

    const img = imageRef.current;
    const container = containerRef.current;

    const cropBox = container.getBoundingClientRect();
    const cropWidth = cropBox.width;
    const cropHeight = cropBox.height;

    // Create high-res canvas (e.g. 800x800 for 1:1 or 800x1000 for 4:5)
    const targetWidth = 800;
    const targetHeight = aspectRatio === '4:5' ? 1000 : 800;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate scale between preview container and export canvas
    const scaleFactor = targetWidth / cropWidth;

    // Fill background with clean white for neat profile borders
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    // Center point in canvas
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const imgNaturalW = img.naturalWidth || 800;
    const imgNaturalH = img.naturalHeight || 800;

    // Base rendered dimensions in preview (Fit full image vs Cover box)
    const baseScale = scaleMode === 'fit'
      ? Math.min(cropWidth / imgNaturalW, cropHeight / imgNaturalH)
      : Math.max(cropWidth / imgNaturalW, cropHeight / imgNaturalH);

    const drawnW = imgNaturalW * baseScale * zoom * scaleFactor;
    const drawnH = imgNaturalH * baseScale * zoom * scaleFactor;

    // Apply offset (accounting for rotation)
    let offsetX = position.x * scaleFactor;
    let offsetY = position.y * scaleFactor;

    if (rotation === 90) {
      const temp = offsetX;
      offsetX = offsetY;
      offsetY = -temp;
    } else if (rotation === 180) {
      offsetX = -offsetX;
      offsetY = -offsetY;
    } else if (rotation === 270) {
      const temp = offsetX;
      offsetX = -offsetY;
      offsetY = temp;
    }

    ctx.drawImage(img, -drawnW / 2 + offsetX, -drawnH / 2 + offsetY, drawnW, drawnH);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (blob) {
          const uniqueName = `cropped_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`;
          const croppedFile = new File([blob], uniqueName, { type: 'image/jpeg' });
          onCropComplete(croppedFile, canvas.toDataURL('image/jpeg', 0.95));
        } else {
          onCropComplete(null, imageSrc);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Frame & Position Photo
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fit full photo or drag & zoom to adjust
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Crop Workspace */}
        <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center relative select-none overflow-hidden">
          {/* Crop Container Box */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
            className={`relative overflow-hidden cursor-move select-none rounded-2xl border-2 border-indigo-500 shadow-2xl bg-slate-900 flex items-center justify-center ${
              aspectRatio === '4:5' ? 'w-[240px] h-[300px]' : 'w-[260px] h-[260px]'
            }`}
          >
            {/* The Image being transformed */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                maxWidth: scaleMode === 'fit' ? '100%' : 'none',
                maxHeight: scaleMode === 'fit' ? '100%' : 'none',
                minWidth: scaleMode === 'fill' ? '100%' : 'auto',
                minHeight: scaleMode === 'fill' ? '100%' : 'auto',
                objectFit: scaleMode === 'fit' ? 'contain' : 'cover'
              }}
              className="pointer-events-none"
            />

            {/* Rule-of-Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div />
            </div>

            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-2 border-b-2 border-l-2 border-white pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-2 border-b-2 border-r-2 border-white pointer-events-none" />
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2.5">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-indigo-400" />
              <span>Drag to center</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3 h-3 text-indigo-400" />
              <span>Scroll to zoom</span>
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 sm:p-5 space-y-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {/* Zoom Slider + Fit Mode Toggle */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Quick Buttons: Fit Full vs Fill Box, Rotate & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              {/* Fit Full Photo Toggle */}
              <button
                type="button"
                onClick={() => {
                  setScaleMode('fit');
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                  scaleMode === 'fit'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Minimize2 className="w-3 h-3" />
                <span>Fit Full Photo</span>
              </button>

              {/* Cover/Fill Toggle */}
              <button
                type="button"
                onClick={() => {
                  setScaleMode('fill');
                  setZoom(1);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                  scaleMode === 'fill'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fill Box</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90 degrees"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-semibold"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setPosition({ x: 0, y: 0 });
                  setScaleMode('fit');
                }}
                title="Reset zoom and position"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 text-xs"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleUseFullOriginal}
              disabled={isProcessing}
              title="Use the original complete image without framing"
              className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Use Full Photo</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCrop}
                disabled={isProcessing}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Apply Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

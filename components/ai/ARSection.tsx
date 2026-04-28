"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import PCView from "@/components/ar/PCView";
import MobileView from '@/components/ar/MobileView';
import { useHandAR } from "@/hooks/useHandAR";

export default function ARSection({
  videoRef,
  canvasRef,
  fingerNails,
  setFingerNails,
  activeFinger,
  setActiveFinger,
  modelSample,
  selectedCollection,
  setSelectedCollection,
  loading
}: any) {
  const [isMobile, setIsMobile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Nhận diện thiết bị
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // gọi AR engine ở đây
  const { captureImage, landmarker } = useHandAR({
    videoRef,
    canvasRef,
    fingerNails,
    modelSample,
  });

  const handleSelectNail = (finger: number, nailId: string) => {
    setFingerNails((prev: any) => ({
      ...prev,
      [finger]: nailId,
    }));
  };

  // useHandAR.ts - Thêm vào trongstartLoop hoặc ngoài class

  // Logic chụp ảnh
  const handleCapturePhoto = () => {
    // if (!canvasRef.current || !videoRef.current) return;
    // const canvas = canvasRef.current;
    // const video = videoRef.current;
    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;
    // const ctx = canvas.getContext('2d');

    // // handleDrawWatermark(ctx, canvas);

    // if (ctx) {
    //   ctx.drawImage(video, 0, 0);
    //   setCapturedImage(canvas.toDataURL('image/png'));
    // }
    // Thay vì tự xử lý canvas ở đây, hãy để hook làm
    const imageData = captureImage(); 
    
    if (imageData) {
      setCapturedImage(imageData); // Cập nhật state để hiển thị Preview
    }
  };

    // 4. Logic Lưu Ảnh xuống thiết bị
  const saveImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `nailsxanh-tryon-${new Date().toISOString()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="pt-32 pb-20 bg-[#F9FBF9] min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          
          <header className="text-center mb-16">
            <span className="text-[#5E7A5E] font-medium tracking-[0.3em] uppercase text-xs">Innovation</span>
            <h1 className="text-5xl md:text-6xl font-serif mt-4 text-[#2D3A2D]">Thử móng <span className="italic">Trực Tiếp</span></h1>
          </header>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 max-w-lg mx-auto mb-10">
                <AlertCircle /> {error}
              </motion.div>
            )}
          </AnimatePresence>

        {isMobile ? (
          <>
          <MobileView 
            videoRef={videoRef}
            canvasRef={canvasRef}
            fingerNails={fingerNails}
            activeFinger={activeFinger}
            setActiveFinger={setActiveFinger}
            onNailSelect={handleSelectNail}
            modelSample={modelSample}
            onCapture={handleCapturePhoto}
            capturedImage={capturedImage}
            onRetake={() => setCapturedImage(null)}
            onSave={saveImage}

            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            loading={loading}
          />

          </>
        ) : (
          <>
            <PCView
              videoRef={videoRef}
              canvasRef={canvasRef}
              fingerNails={fingerNails}
              activeFinger={activeFinger}
              setActiveFinger={setActiveFinger}
              onNailSelect={handleSelectNail}
              modelSample={modelSample}
              onCapture={handleCapturePhoto}
              capturedImage={capturedImage}
              onRetake={() => setCapturedImage(null)}
              onSave={saveImage}

              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              loading={loading}
            />
          </>
        )}
          {/* <canvas ref={canvasRef} className="hidden" /> */}
        </div>
      </div>
    </>
  );
}
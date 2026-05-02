"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Download, RefreshCw, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        // Draw the image
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Add a cute watermark/filter (example)
        context.font = "30px 'Arial'";
        context.fillStyle = "rgba(255, 255, 255, 0.7)";
        context.fillText("Nadiandra ❤️", 20, canvas.height - 30);

        setPhoto(canvas.toDataURL("image/png"));
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-primary)">
          Photo Booth Kita
        </h1>
        <p className="text-(--color-text-secondary)">
          Abadikan momen lucu bersama!
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass-panel p-4 md:p-6 rounded-3xl">
          <div className="relative aspect-video bg-black/10 rounded-2xl overflow-hidden flex items-center justify-center">
            {photo ? (
              <img src={photo} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            
            {!photo && !isCameraActive && (
              <p className="absolute text-(--color-text-secondary)">
              Menunggu izin kamera...
              </p>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            {!photo ? (
              <button
                onClick={takePhoto}
                disabled={!isCameraActive}
                className="flex items-center space-x-2 bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-text-primary) px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Camera className="w-5 h-5" />
                <span>Snap!</span>
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex space-x-3">
                <button
                  onClick={retakePhoto}
                  className="flex items-center space-x-2 bg-white/50 hover:bg-white/70 text-(--color-text-primary) px-4 py-2 rounded-full font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Foto Ulang</span>
                </button>
                <a
                  href={photo}
                  download="nadiandra-booth.png"
                  className="flex items-center space-x-2 bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-text-primary) px-6 py-2 rounded-full font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh</span>
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

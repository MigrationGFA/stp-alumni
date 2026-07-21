"use client"
import { X, FileText } from "lucide-react";

export default function ImageLightbox({ src, alt, isOpen, onClose, type }) {
  if (!isOpen) return null;

  const isVideo = type === "video" || /\.(mp4|webm|ogg|mov)$/i.test(src);
  const isPDF = type === "pdf" || (type === "document" && /\.pdf$/i.test(src)) || src.toLowerCase().split('?')[0].endsWith('.pdf');
  const isImage = type === "image" || (type !== "document" && type !== "pdf" && /\.(jpg|jpeg|png|gif|webp)$/i.test(src)) || (!type && !isPDF && !isVideo && /\.(jpg|jpeg|png|gif|webp)$/i.test(src));

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={src}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl bg-black"
          />
        ) : isPDF ? (
          <iframe
            src={src}
            className="w-[85vw] h-[80vh] rounded-lg shadow-2xl bg-white border-0"
            title={alt || "Document Preview"}
          />
        ) : isImage ? (
          <img
            src={src}
            alt={alt || "Full size image"}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-lg max-w-md text-center shadow-2xl text-card-foreground">
            <FileText className="h-16 w-16 text-stp-blue-light mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This file type cannot be previewed in the browser. Please download it to view the content.
            </p>
            <a
              href={src}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-stp-blue-light text-white rounded-lg hover:bg-stp-blue-light/90 transition-colors text-sm font-medium"
            >
              Download File
            </a>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-4 md:-right-12 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-50"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
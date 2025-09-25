"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, Check, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ImageCaptureProps {
  onCapture: (dataUri: string) => void;
  children: React.ReactNode;
}

export function ImageCapture({ onCapture, children }: ImageCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  const openCamera = useCallback(async () => {
    setLoading(true);
    setCapturedImage(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } else {
        throw new Error("Seu navegador não suporta acesso à câmera.");
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: 'Acesso à Câmera Negado',
        description: 'Por favor, habilite as permissões de câmera em seu navegador para usar esta funcionalidade.',
      });
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
    setHasCameraPermission(false);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      openCamera();
    } else {
      closeCamera();
    }
  };
  
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        closeCamera();
      }
    }
  };
  
  const retakeImage = () => {
    setCapturedImage(null);
    openCamera();
  };

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleOpenChange(false);
      toast({ title: 'Imagem Capturada', description: 'A imagem foi anexada ao formulário.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); setIsOpen(true); openCamera(); }}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Capturar Imagem da Ferida</DialogTitle>
          <DialogDescription>
            Posicione a câmera para obter uma imagem clara e bem iluminada.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            {loading && <Loader2 className="h-8 w-8 animate-spin" />}

            {!loading && capturedImage && (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            )}

            {!loading && !capturedImage && hasCameraPermission && (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            )}

            {!loading && !hasCameraPermission && !capturedImage && (
                <div className="text-center text-muted-foreground p-4">
                    <Camera className="h-10 w-10 mx-auto mb-2" />
                    <p>Aguardando permissão da câmera...</p>
                </div>
            )}
        </div>

        <DialogFooter>
          {capturedImage ? (
            <div className="w-full flex justify-between">
              <Button variant="outline" onClick={retakeImage}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tirar Novamente
              </Button>
              <Button onClick={confirmImage}>
                <Check className="mr-2 h-4 w-4" />
                Confirmar
              </Button>
            </div>
          ) : (
            <Button onClick={captureImage} disabled={!hasCameraPermission || loading} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Capturar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

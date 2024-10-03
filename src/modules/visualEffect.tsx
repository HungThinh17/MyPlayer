import * as React from 'react';
import { useYouTubeStore } from '../store/store';

interface SpinningDiskEffectProps {
  id?: string;
  className?: string;
  rotationSpeed?: number;
}

const SpinningDiskEffect: React.FC<SpinningDiskEffectProps> = ({ 
  id = 'defaultSpinningDiskEffect', 
  className = '',
  rotationSpeed = 0.005
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { videoId, isPlaying } = useYouTubeStore();
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const rotationRef = React.useRef(0);

  React.useEffect(() => {
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      const img = new Image();
      img.src = thumbnailUrl;
      img.onload = () => setImage(img);
    }
  }, [videoId]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);

      // Draw outer ring
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();

      // Draw album art
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, -radius * 0.9, -radius * 0.9, radius * 1.8, radius * 1.8);
      ctx.restore();

      // Draw inner ring
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();

      ctx.restore();

      if (isPlaying) {
        rotationRef.current += rotationSpeed;
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [image, isPlaying, rotationSpeed]);

  return <canvas id={id} ref={canvasRef} className={className} width="640" height="360" />;
};

export default SpinningDiskEffect;

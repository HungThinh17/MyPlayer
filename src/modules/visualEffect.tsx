import * as React from 'react';
import styles from '../styles/player.module.css';
import { useYouTubeStore } from '../store/store';

interface SpinningDiskEffectProps {
  id?: string;
  className?: string;
  rotationSpeed?: number; // Added rotationSpeed prop
}

const SpinningDiskEffect: React.FC<SpinningDiskEffectProps> = ({ 
  id = 'defaultSpinningDiskEffect', 
  className = '',
  rotationSpeed = 0.0001 // Default rotation speed
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>();
  const [rotation, setRotation] = React.useState(0);
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const { videoId, isPlaying } = useYouTubeStore();

  React.useEffect(() => {
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      const img = new Image();
      img.src = thumbnailUrl;
      img.onload = () => setImage(img);
    }
  }, [videoId]);

  React.useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const CENTER_X = canvas.width / 2;
    const CENTER_Y = canvas.height / 2;
    const DISK_RADIUS = Math.min(CENTER_X, CENTER_Y) * 0.8;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the vinyl record
      ctx.save();
      ctx.translate(CENTER_X, CENTER_Y);
      ctx.rotate(rotation);

      // Outer ring
      ctx.beginPath();
      ctx.arc(0, 0, DISK_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();

      // Album art
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, DISK_RADIUS * 0.9, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, -DISK_RADIUS * 0.9, -DISK_RADIUS * 0.9, DISK_RADIUS * 1.8, DISK_RADIUS * 1.8);
      ctx.restore();

      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, DISK_RADIUS * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();

      ctx.restore();

      if (isPlaying) {
        setRotation(prev => (prev + rotationSpeed) % (Math.PI * 2));
        animationRef.current = requestAnimationFrame(draw);
      }
    }

    draw();
    console.log('SpinningDiskEffect isPlaying:', isPlaying);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, image, rotation, rotationSpeed]);

  return <canvas id={id} ref={canvasRef} className={className} width="640" height="360" />;
};

export default SpinningDiskEffect;

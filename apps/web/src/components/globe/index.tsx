'use client';
import createGlobe, {type COBEOptions} from 'cobe';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useTheme} from 'next-themes';

import {cn} from '@formizee/ui';

const lightConfig: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0, 0, 0],
  glowColor: [0.9, 0.9, 0.9],
  markers: [
    {location: [37.7749, -122.4194], size: 0.06}, // San Francisco
    {location: [48.8566, 2.3522], size: 0.06}, // Paris
    {location: [35.6895, 139.6917], size: 0.06}, // Tokyo
    {location: [-33.8688, 151.2093], size: 0.06}, // Sydney
    {location: [55.7558, 37.6173], size: 0.06}, // Moscow
    {location: [-22.9068, -43.1729], size: 0.06}, // Rio de Janeiro
    {location: [40.7128, -74.006], size: 0.06}, // New York City
    {location: [19.076, 72.8777], size: 0.06}, // Mumbai
    {location: [51.5074, -0.1278], size: 0.06}, // London
    {location: [34.0522, -118.2437], size: 0.06}, // Los Angeles
    {location: [-1.2921, 36.8219], size: 0.06}, // Nairobi
    {location: [39.9042, 116.4074], size: 0.06}, // Beijing
    {location: [52.52, 13.405], size: 0.06}, // Berlin
    {location: [-34.6037, -58.3816], size: 0.06}, // Buenos Aires
    {location: [6.5244, 3.3792], size: 0.06}, // Lagos
    {location: [13.7563, 100.5018], size: 0.06}, // Bangkok
    {location: [31.2304, 121.4737], size: 0.06}, // Shanghai
    {location: [45.4642, 9.19], size: 0.06}, // Milan
    {location: [41.9028, 12.4964], size: 0.06}, // Rome
    {location: [43.6511, -79.347], size: 0.06} // Toronto
  ]
};

const darkConfig: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [1, 1, 1],
  glowColor: [0.1, 0.1, 0.1],
  markers: [
    {location: [37.7749, -122.4194], size: 0.06}, // San Francisco
    {location: [48.8566, 2.3522], size: 0.06}, // Paris
    {location: [35.6895, 139.6917], size: 0.06}, // Tokyo
    {location: [-33.8688, 151.2093], size: 0.06}, // Sydney
    {location: [55.7558, 37.6173], size: 0.06}, // Moscow
    {location: [-22.9068, -43.1729], size: 0.06}, // Rio de Janeiro
    {location: [40.7128, -74.006], size: 0.06}, // New York City
    {location: [19.076, 72.8777], size: 0.06}, // Mumbai
    {location: [51.5074, -0.1278], size: 0.06}, // London
    {location: [34.0522, -118.2437], size: 0.06}, // Los Angeles
    {location: [-1.2921, 36.8219], size: 0.06}, // Nairobi
    {location: [39.9042, 116.4074], size: 0.06}, // Beijing
    {location: [52.52, 13.405], size: 0.06}, // Berlin
    {location: [-34.6037, -58.3816], size: 0.06}, // Buenos Aires
    {location: [6.5244, 3.3792], size: 0.06}, // Lagos
    {location: [13.7563, 100.5018], size: 0.06}, // Bangkok
    {location: [31.2304, 121.4737], size: 0.06}, // Shanghai
    {location: [45.4642, 9.19], size: 0.06}, // Milan
    {location: [41.9028, 12.4964], size: 0.06}, // Rome
    {location: [43.6511, -79.347], size: 0.06} // Toronto
  ]
};

export function Globe({className}: {className?: string}) {
  let phi = 0;
  let width = 0;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteractionMovement = useRef(0);
  const pointerInteracting = useRef(null);
  const {resolvedTheme} = useTheme();
  const [r, setR] = useState(0);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback(
    (state: Record<string, number>) => {
      if (!pointerInteracting.current) {
        phi += 0.005;
      }
      state.phi = phi + r;
      state.width = width * 2;
      state.height = width * 2;
    },
    [r]
  );

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  const config = resolvedTheme === 'dark' ? darkConfig : lightConfig;

  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender
    });

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    setTimeout(() => (canvasRef.current!.style.opacity = '1'));
    return () => globe.destroy();
  }, [resolvedTheme]);

  return (
    <div
      className={cn(
        'absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]',
        className
      )}
    >
      <canvas
        className={cn(
          'size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]'
        )}
        ref={canvasRef}
        onPointerDown={e =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={e => updateMovement(e.clientX)}
        onTouchMove={e => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}

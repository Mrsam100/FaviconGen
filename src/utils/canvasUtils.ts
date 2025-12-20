/**
 * Canvas Utilities for Icon Editor
 * Handles rendering icons with transformations to canvas
 */

import { EditorState } from '../types';

/**
 * Renders an icon to canvas with all transformations applied
 * @param canvas - The canvas element to render to
 * @param ctx - The 2D rendering context
 * @param state - The editor state with all transformations
 */
export async function renderIconToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: EditorState
): Promise<void> {
  const size = state.iconSize;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // 1. Draw background
  if (state.backgroundColor !== 'transparent') {
    ctx.fillStyle = state.backgroundColor;

    if (state.borderRadius > 0) {
      const radius = (size * state.borderRadius) / 100;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }
  }

  // 2. Load original logo image
  const img = await loadImage(state.originalDataUrl);

  // 3. Apply transformations
  ctx.save();

  // Center point
  const centerX = size / 2;
  const centerY = size / 2;

  // Apply position offset
  ctx.translate(centerX + state.positionX, centerY + state.positionY);

  // Apply rotation
  ctx.rotate((state.rotation * Math.PI) / 180);

  // Apply scale and padding
  const padding = state.padding;
  const availableSize = (size - padding * 2) * state.scale;

  // Calculate dimensions to maintain aspect ratio
  const imgAspect = img.width / img.height;
  let drawWidth = availableSize;
  let drawHeight = availableSize;

  if (imgAspect > 1) {
    // Image is wider than tall
    drawHeight = availableSize / imgAspect;
  } else if (imgAspect < 1) {
    // Image is taller than wide
    drawWidth = availableSize * imgAspect;
  }

  // Draw logo centered
  ctx.drawImage(
    img,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );

  ctx.restore();
}

/**
 * Loads an image from a data URL
 * @param dataUrl - The base64 data URL of the image
 * @returns Promise that resolves with the loaded image
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

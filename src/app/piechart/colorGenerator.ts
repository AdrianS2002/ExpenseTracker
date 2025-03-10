export function generateColors(count: number): string[] {
  const colors: string[] = [];
  const hues = [220, 260]; // Blue-gray and pastel purple
  const minSaturation = 30, maxSaturation = 60; // Lower saturation for pastel tones
  const minLightness = 40, maxLightness = 80; // Higher lightness for pastel feel

  for (let i = 0; i < count; i++) {
      const hue = hues[i % hues.length] + (Math.random() * 20 - 10); // Subtle hue variation
      const saturation = Math.round(minSaturation + Math.random() * (maxSaturation - minSaturation));
      const lightness = Math.round(minLightness + Math.random() * (maxLightness - minLightness));

      colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

export function generateHoverColors(count: number, alpha = 0.8): string[] {
  const colors: string[] = [];
  const hues = [220, 260]; // Same hues as above
  const minSaturation = 40, maxSaturation = 70; // Slightly higher for hover effect
  const minLightness = 60, maxLightness = 85; // Slightly darker for contrast

  for (let i = 0; i < count; i++) {
      const hue = hues[i % hues.length] + (Math.random() * 20 - 10);
      const saturation = Math.round(minSaturation + Math.random() * (maxSaturation - minSaturation));
      const lightness = Math.round(minLightness + Math.random() * (maxLightness - minLightness));

      colors.push(`hsla(${Math.round(hue)}, ${saturation}%, ${lightness}%, ${alpha})`);
  }
  return colors;
}

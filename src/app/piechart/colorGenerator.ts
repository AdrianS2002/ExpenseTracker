export function generateColors(count: number): string[] {
  const colors: string[] = [];
  const baseHues = [260, 220]; // Purple (b38add) and Blue-gray (373c4f)
  const minSaturation = 30, maxSaturation = 60; // Lower saturation for pastel tones
  const minLightness = 40, maxLightness = 80; // Higher lightness for pastel feel

  for (let i = 0; i < count; i++) {
      // Blend hues between the two base colors
      const hue = baseHues[0] + (i / (count - 1)) * (baseHues[1] - baseHues[0]);
      const saturation = Math.round(minSaturation + Math.random() * (maxSaturation - minSaturation));
      const lightness = Math.round(minLightness + Math.random() * (maxLightness - minLightness));

      colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

export function generateHoverColors(count: number, alpha = 0.8): string[] {
  const colors: string[] = [];
  const baseHues = [260, 220]; // Same hues as above
  const minSaturation = 40, maxSaturation = 70; // Slightly higher for hover effect
  const minLightness = 60, maxLightness = 85; // Slightly darker for contrast

  for (let i = 0; i < count; i++) {
      // Blend hues between the two base colors
      const hue = baseHues[0] + (i / (count - 1)) * (baseHues[1] - baseHues[0]);
      const saturation = Math.round(minSaturation + Math.random() * (maxSaturation - minSaturation));
      const lightness = Math.round(minLightness + Math.random() * (maxLightness - minLightness));

      colors.push(`hsla(${Math.round(hue)}, ${saturation}%, ${lightness}%, ${alpha})`);
  }
  return colors;
}
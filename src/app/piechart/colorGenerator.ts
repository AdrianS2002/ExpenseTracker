export function  generateColors(count: number, saturation = 100, lightness = 50) {
    const colors: string[] = [];
    const step = 360 / count;
    for (let i = 0; i < count; i++) {
        const hue = Math.round(i * step);
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
      return colors;
}

export function  generateHoverColors(count: number, saturation = 70, lightness = 50, alpha = 0.7): string[] {
    const colors: string[] = [];
    const step = 360 / count;
    for (let i = 0; i < count; i++) {
      const hue = Math.round(i * step);
      colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
    }
    return colors;
  }
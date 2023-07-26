export function interpolateColor(t, color1, color2) {
    if (t === 0) {
        return color1;
    }
    if (t === 1) {
        return color2;
    }
    const interpolatedColor = color1
        .split(",")
        .map((c, i) => {
            const c1 = parseInt(c.trim());
            const c2 = parseInt(color2.split(",")[i].trim());
            return Math.round(c1 * (1 - t) + c2 * t);
        })
        .join(", ");
    return interpolatedColor;
}

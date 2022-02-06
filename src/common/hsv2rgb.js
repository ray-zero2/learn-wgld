export const hsv2rgb = (hue, saturation, value, alpha) =>  {
    if(saturation > 1 || value > 1 || alpha > 1) return;

    const th = hue % 360;
    const i = Math.floor(th / 60);
    const f = th / 60 - i;
    const m = value * (1 - saturation);
    const n = value * (1 - saturation * f);
    const k = value * (1 - saturation * (1 - f));
    const color = new Array();
    if(!saturation > 0 && !saturation < 0){
        color.push(value, value, value, alpha); 
    } else {
        const r = new Array(value, n, m, m, k, value);
        const g = new Array(k, value, value, n, m, m);
        const b = new Array(m, m, k, value, value, n);
        color.push(r[i], g[i], b[i], alpha);
    }
    return color;
}
export const getLuminosity = (rgb) => {
  return (rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114)
}

export const hsbToRGB = (h, s, v) => {
  h/=360
  s/=100
  v/=100

  let r, g, b

  let i = Math.floor(h * 6);
  let f = h * 6 - i
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)

  switch(i % 6) {
    case 0: r = v, g = t, b = p; break
    case 1: r = q, g = v, b = p; break
    case 2: r = p, g = v, b = t; break
    case 3: r = p, g = q, b = v; break
    case 4: r = t, g = p, b = v; break
    case 5: r = v, g = p, b = q; break
  }

  return [r * 255, g * 255, b * 255].join(",")
}
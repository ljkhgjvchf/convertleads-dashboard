/* eslint-disable @next/next/no-img-element -- tiny static avatars, next/image adds nothing here */

/** Photo avatar when `src` is set, otherwise initials with a colour derived from the name. */
export function Avatar({ name, size = 36, src }: { name: string; size?: number; src?: string }) {
  if (src) {
    return <img src={src} alt={name} width={size} height={size} style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover ring-2 ring-panel" />;
  }
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span
      style={{ width: size, height: size, background: `linear-gradient(135deg, hsl(${hue} 75% 88%), hsl(${hue + 30} 70% 78%))`, color: `hsl(${hue} 45% 26%)` }}
      className="grid shrink-0 place-items-center rounded-full text-xs font-semibold ring-2 ring-panel">
      {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
    </span>
  );
}

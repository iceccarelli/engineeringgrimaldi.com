import Image from "next/image";
export default function Plate({ src, alt, code, caption, priority = false, sizes = "(max-width: 980px) 100vw, 1152px" }: {
  src: string; alt: string; code: string; caption: string; priority?: boolean; sizes?: string;
}) {
  return (
    <figure className="hub-plate">
      <div className="hub-plate-frame">
        <Image src={src} alt={alt} width={1168} height={784} priority={priority} loading={priority ? "eager" : "lazy"} sizes={sizes} quality={84} className="hub-plate-img" />
      </div>
      <figcaption className="hub-plate-cap"><span className="hub-plate-code">{code}</span><span>{caption}</span></figcaption>
    </figure>
  );
}

const MESSAGE =
  'FREE SHIPPING FOR ORDERS ABOVE LKR 10,000 · AMOI FASHION · SRI LANKA       '

export default function AnnouncementBar() {
  return (
    <div className="bg-cta text-white overflow-hidden py-2.5">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="mx-12 text-xs tracking-[0.2em] uppercase shrink-0">
            {MESSAGE}
          </span>
        ))}
      </div>
    </div>
  )
}

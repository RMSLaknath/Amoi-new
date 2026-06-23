const MESSAGE =
  'FREE SHIPPING ABOVE LKR 10,000  ·  NEW ARRIVALS EVERY WEEK  ·  PROUDLY SRI LANKAN COUTURE  ·  EXCLUSIVELY FOR HER       '

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

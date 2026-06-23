export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="font-playfair italic text-4xl mb-8">Our Story</h1>
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <p>
          Amoi was born out of a simple belief: that fashion should feel effortless. Founded in Sri Lanka,
          we create pieces designed for the modern wardrobe — timeless silhouettes, quality fabrics, and
          meticulous attention to detail.
        </p>
        <p>
          Every collection is thoughtfully curated to blend understated elegance with everyday wearability.
          We believe clothing is a form of self-expression, and our aim is to give you the pieces that make
          getting dressed feel like a pleasure, not a chore.
        </p>
        <p>
          We are proudly Sri Lankan — from our design team to our supply chain — and committed to
          sustainable, responsible fashion practices.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-12">
        {[
          { value: '2019', label: 'Founded' },
          { value: '1,200+', label: 'Products Shipped' },
          { value: 'Sri Lanka', label: 'Home' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-playfair italic text-2xl mb-1">{stat.value}</p>
            <p className="text-xs tracking-widest uppercase text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="aspect-[3/4] bg-surface overflow-hidden">
        <Image
          src={images[active]}
          alt={name}
          width={600}
          height={800}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 aspect-[3/4] overflow-hidden border transition-colors ${
                i === active ? 'border-cta' : 'border-border hover:border-text-secondary'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${name} view ${i + 1}`}
                width={80}
                height={107}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

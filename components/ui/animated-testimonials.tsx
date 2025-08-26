"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

type Testimonial = {
  quote: string
  name: string
  designation: string
  src: string
}

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[]
  autoplay?: boolean
}) => {
  const [active, setActive] = useState(0)

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const isActive = (index: number) => {
    return index === active
  }

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay])

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.src}
                className={`absolute inset-0 origin-bottom transition-all duration-500 ${
                  isActive(index) ? "opacity-100 scale-100 z-40" : "opacity-70 scale-95 z-10"
                }`}
                style={{
                  transform: `rotateY(${isActive(index) ? 0 : randomRotateY()}deg) translateZ(${isActive(index) ? 0 : -100}px)`,
                }}
              >
                <img
                  src={testimonial.src || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <div key={active} className="transition-all duration-300">
            <h3 className="text-2xl font-bold text-black">{testimonials[active].name}</h3>
            <p className="text-sm text-gray-500">{testimonials[active].designation}</p>
            <p className="mt-8 text-lg text-gray-500">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline-block animate-fade-in"
                  style={{
                    animationDelay: `${0.02 * index}s`,
                  }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </p>
          </div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover:rotate-12" />
            </button>
            <button
              onClick={handleNext}
              className="group flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:-rotate-12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

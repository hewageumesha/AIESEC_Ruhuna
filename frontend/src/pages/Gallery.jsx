import React from 'react'

const ImageCard = ({ href, src, alt, label }) => {
  return (
    <a
      href={href}
      className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
    >
      <img
        src={src}
        loading="lazy"
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
      <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
        {label}
      </span>
    </a>
  );
};

const ResponsiveImageGallery = () => {
  const galleryItems = [
    {
      id: 1,
      href: "#",
      src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600",
      alt: "Photo by Minh Pham",
      label: "VR",
      colSpan: "",
    },
    {
      id: 2,
      href: "#",
      src: "https://images.unsplash.com/photo-1542759564-7ccbb6ac450a?auto=format&q=75&fit=crop&w=1000",
      alt: "Photo by Magicle",
      label: "Tech",
      colSpan: "md:col-span-2",
    },
    {
      id: 3,
      href: "#",
      src: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=1000",
      alt: "Photo by Martin Sanchez",
      label: "Dev",
      colSpan: "md:col-span-2",
    },
    {
      id: 4,
      href: "#",
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600",
      alt: "Photo by Lorenzo Herrera",
      label: "Retro",
      colSpan: "",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-12">
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">
              Gallery
            </h2>

            <p className="hidden max-w-screen-m text-gray-500 dark:text-gray-300 md:block">
              Discover captivating moments frozen in time. Each image tells a unique story - from cutting-edge technology to timeless retro vibes. Our visual collection inspires creativity and sparks imagination.
            </p>
          </div>

          <a
            href="#"
            className="inline-block rounded-lg border bg-white dark:bg-gray-700 dark:border-none px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base"
          >
            More
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
          {galleryItems.map((item) => (
            <div key={item.id} className={item.colSpan}>
              <ImageCard
                href={item.href}
                src={item.src}
                alt={item.alt}
                label={item.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveImageGallery;

"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
}

const ProductImages = ({ images }: Props) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[currentImage]}
        alt="product image"
        height={1000}
        width={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrentImage(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              currentImage === index && "border-orange-500"
            )}
          >
            <Image src={image} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;

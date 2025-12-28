// Custom image loader for Cloudflare Workers
// Use Cloudflare Images or an external image optimization service

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Option 1: Use Cloudflare Images
  // const params = [`width=${width}`];
  // if (quality) {
  //   params.push(`quality=${quality}`);
  // }
  // return `https://your-account.cloudflareimages.com/${src}?${params.join('&')}`;

  // Option 2: Use an external service like Cloudinary
  // return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_${quality || 75}/${src}`;

  // Option 3: Return original image (no optimization)
  // Not recommended for production
  return src;
}

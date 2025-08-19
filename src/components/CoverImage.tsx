export default function CoverImage() {
  return (
    <div
      className="w-full h-48 md:h-64 bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(/images/default-cover.png)',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
    </div>
  );
}
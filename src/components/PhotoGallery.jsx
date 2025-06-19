const PhotoGallery = ({ photos, onClick }) => (
  <div className="grid grid-cols-3 gap-2">
    {photos.map((url, i) => (
      <img
        key={i}
        src={url}
        alt={`Foto ${i+1}`}
        className="rounded-lg w-full h-20 object-cover cursor-pointer"
        onClick={onClick ? () => onClick(i) : undefined}
      />
    ))}
  </div>
)

export default PhotoGallery 
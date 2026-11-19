export default function Video({ id, titulo }) {
  if (!id) return null;
  return (
    <div className="video">
      <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
          title={titulo || "Video"}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
    </div>
  );
}

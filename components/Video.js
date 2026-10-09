export default function Video({ id, titulo }) {
  return (
    <div className="video">
      {id ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
          title={titulo || "Video"}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="vacio">Aquí va el video de Ani</div>
      )}
    </div>
  );
}

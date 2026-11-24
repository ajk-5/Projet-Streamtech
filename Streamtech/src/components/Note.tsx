interface NoteProps {
  valeur: number;
  max?: number;
}

function Note({ valeur, max = 10 }: NoteProps) {
  return (
    <span className="badge text-bg-warning">
      ★ {valeur.toFixed(1)}/{max}
    </span>
  );
}

export default Note;
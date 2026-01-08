"use client";

export default function FilterNotesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

"use client";

export default function Error({ error, reset }) {
  return (
    <div className="container mx-auto py-10">
      <p className="text-red-500">Error: {error.message}</p>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}

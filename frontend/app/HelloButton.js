"use client";

export default function HelloButton() {
  return (
    <button
      className="rounded-md bg-black text-white px-5 py-3 hover:opacity-90 transition"
      onClick={() => console.log("hello")}
    >
      Say hello
    </button>
  );
}

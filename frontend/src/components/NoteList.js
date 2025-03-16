"use client";

export default function NoteList({ notes, deleteNote }) {
  return (
    <ul className="mt-4 space-y-2">
      {notes.map((note, index) => (
        <li
          key={index}
          className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <p>{note.content}</p>
          </div>
          <button
            onClick={() => deleteNote(index)}
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

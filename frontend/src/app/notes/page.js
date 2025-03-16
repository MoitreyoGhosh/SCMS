// "use client";
// import { useState } from "react";
// import NoteForm from "../components/NoteForm";
// import NoteList from "../components/NoteList";

// export default function Home() {
//   const [notes, setNotes] = useState([
//     { title: "First Note", content: "This is my first note." },
//     { title: "Second Note", content: "This is my second note." },
//   ]);

//   const addNote = (newNote) => {
//     setNotes((prevNotes) => [...prevNotes, newNote]);
//   };

//   const deleteNote = (index) => {
//     setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4 text-center">Notes Management</h1>
//         <NoteForm addNote={addNote} />
//         <NoteList notes={notes} deleteNote={deleteNote} />
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState([
    {
      title: "Object Oriented Programming",
      content: "Inheritance, Interface",
      file: "teddy.png",
    },
    {
      title: "Artificial Intelligence",
      content: "Machine Learning",
      file: "Screenshot 2025-02-22 195758.png",
    },
  ]);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteFile, setNoteFile] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const addOrUpdateNote = (e) => {
    e.preventDefault();

    const newNote = {
      title: noteTitle,
      content: noteContent,
      file: noteFile ? noteFile.name : "",
    };

    if (isEditing) {
      // Update the existing note
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add a new note
      setNotes([...notes, newNote]);
    }

    // Reset the form
    setNoteTitle("");
    setNoteContent("");
    setNoteFile("");
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const editNote = (index) => {
    const note = notes[index];
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteFile({ name: note.file });
    setIsEditing(true);
    setEditIndex(index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl md:max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 uppercase text-slate-600">
          Notes Management
        </h2>

        {/* Faculty Info */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            value="Subha"
            readOnly
            className="border p-3 rounded bg-gray-50 text-gray-600 w-full"
          />
          <input
            type="text"
            value="AIML"
            readOnly
            className="border p-3 rounded bg-gray-50 text-gray-600 w-full"
          />
          <input
            type="text"
            value="IT567"
            readOnly
            className="border p-3 rounded bg-gray-50 text-gray-600 w-full"
          />
        </div>

        {/* Note Form */}
        <form onSubmit={addOrUpdateNote} className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="border p-3 w-full rounded bg-gray-200 text-slate-500"
            required
          />
          <textarea
            placeholder="Note Content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="border p-3 w-full rounded bg-gray-200 text-slate-500"
            required
          />
          <input
            type="file"
            onChange={(e) => setNoteFile(e.target.files[0])}
            className="border p-3 rounded bg-gray-200 text-slate-500 w-full"
          />
          <button
            type="submit"
            className={`w-full ${
              isEditing ? "bg-yellow-500" : "bg-blue-600"
            } text-white p-3 rounded hover:opacity-90 transition-transform transform hover:scale-105`}
          >
            {isEditing ? "Update Note" : "Add Note"}
          </button>
        </form>

        {/* Notes List */}
        <ul className="mt-6 space-y-3">
          {notes.map((note, index) => (
            <li
              key={index}
              className="border p-4 rounded bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{note.title}</h3>
                <p className="text-gray-600">{note.content}</p>
                {note.file && (
                  <p className="text-blue-600 font-medium italic">{note.file}</p>
                )}
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => editNote(index)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-transform transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-transform transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


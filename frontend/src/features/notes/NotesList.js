import React from 'react';
import { useGetNotesQuery } from "./notesApiSlice";
import NoteCard from "./NoteCard"; // Assuming you have a NoteCard component
import useAuth from "../../hooks/useAuth";
import PulseLoader from 'react-spinners/PulseLoader';

const NotesList = () => {
    const { username, isManager, isAdmin } = useAuth();
    const { team } = useAuth();
    const { data: notes, isLoading, isSuccess, isError, error } = useGetNotesQuery({ teamId: team }, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) content = <PulseLoader color={"#FFF"} />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        const { ids, entities } = notes;

        let filteredNotes;
        if (isManager || isAdmin) {
            filteredNotes = ids.map(noteId => entities[noteId]);
        } else {
            filteredNotes = ids.map(noteId => entities[noteId]).filter(note => note.username === username);
        }

        content = (
            <div className="card-container">
                {filteredNotes.map(note => (
                    <NoteCard key={note.id} note={note} />
                ))}
            </div>
        );
    }

    return content;
}

export default NotesList;

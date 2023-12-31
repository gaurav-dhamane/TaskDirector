import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetNotesQuery } from "./notesApiSlice";
import NoteCard from "./NoteCard";
import useAuth from "../../hooks/useAuth";
import PulseLoader from 'react-spinners/PulseLoader';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCircleInfo, 
    faClipboardList,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons"

const NotesList = () => {
    const [showInfo, setShowInfo] = useState(false);
    const { username, isManager, isAdmin } = useAuth();
    const { team } = useAuth();
    const { data: notes, isLoading, isSuccess, isError, error } = useGetNotesQuery({ teamId: team }, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) content = (
        <div className='min-h-screen p-4  bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90%'>
            <PulseLoader color={"#FFF"} />
        </div>)

    if (isError) {
        content = (<div className='min-h-screen p-4  bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90%'>
            <p className="errmsg pt-8">{error?.data?.message}</p>
            <h2 className=' text-emerald-800 mb-5'>Choose From Following Actions: </h2>
            <div className='flex gap-4'>
                
            <Link className='flex items-center gap-4 px-4 py-2 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' to="/dash/notes/new">
                <FontAwesomeIcon icon={faClipboardList} />
                New Task
            </Link>
            <Link className='flex items-center gap-4 px-4 py-2 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' to="/dash/users/new">
                <FontAwesomeIcon icon={faUserPlus}  />
                Add User
            </Link>
            </div>
        </div>)
    }

    if (isSuccess) {
        const { ids, entities } = notes;

        let filteredNotes;
        if (isManager || isAdmin) {
            filteredNotes = ids.map(noteId => entities[noteId]);
        } else {
            filteredNotes = ids.map(noteId => entities[noteId]).filter(note => note.username === username);
        }

        // Separate completed and pending notes
        const completedNotes = filteredNotes.filter(note => note.completed);
        const pendingNotes = filteredNotes.filter(note => !note.completed);

        // Sort notes by the last updated date in descending order
        completedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        pendingNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // Concatenate the sorted completed and pending notes
        filteredNotes = [...pendingNotes, ...completedNotes];



        content = (

            <div className=' p-4  bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90%'>
                <button className='info text-stone-950 mb-2' onClick={() => {
                    setShowInfo(true)
                }}><FontAwesomeIcon icon={faCircleInfo} /></button>

                <div className="column-container">
                    {filteredNotes.map(note => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>

                {/* Info Modal */}
                {showInfo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-0" onClick={() => setShowInfo(false)}></div>
                        <div className="bg-white p-8 rounded-md shadow-md relative">
                            <button className="absolute top-2 right-2 flex px-2 py-0 text-red-500" onClick={() => setShowInfo(false)}>
                                <b>x</b>
                            </button>
                            Tasks that have been completed will be moved to the bottom.
                        </div>
                    </div>
                )}
            </div>
        );

    }


    return content
}

export default NotesList;

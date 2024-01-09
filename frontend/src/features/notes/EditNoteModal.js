// EditNoteModal.js

import React, { useEffect,  useState } from 'react';
import { useUpdateNoteMutation } from "./notesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"


import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../../hooks/useAuth';

const EditNoteModal = ({ note, onClose, team }) => {
    const { username } = useAuth()
    const [updateNote, {
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation()


    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [userId, setUserId] = useState(note.user)


    useEffect(() => {
        if (isSuccess) {
            onClose()
        }
    }, [isSuccess, onClose])



    
    const handleSave = async () => {
            await updateNote({ id: note._id, assigned_to: userId, title:title, text:text, completed: note.completed });
            onClose()
        
    };

    const { data: users } = useGetUsersQuery(
        { username: username, teamId: team },
        {
            pollingInterval: 60000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true
        },

    );
    const data = users?.ids.map(id => users?.entities[id])

    const options = data.map(user => (
        <option
            key={user.id}
            value={user.id}
        >{user.username}</option>
    ))

    const onUserIdChanged = e => setUserId(e.target.value)

    const errClass = (isError) ? "text-red-500 mb-4" : "hidden"
    const errContent = (error?.data?.message) ?? '';




    return (
        <div className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center ">
            <div className="bg-slate-700 z-52 p-8 border rounded-md shadow-md w-96">
                <h2 className="text-lg font-semibold text-white mb-4">Edit Task</h2>
                <p className={`${errClass} text-red-500 mb-4`}>{errContent}</p>

                <label className="block text-gray-300 text-sm mt-3 mb-1" htmlFor='note-username'>Assign to:</label>
                <select
                    id="note-username"
                    name="username"
                    className="form__select w-full px-4 py-2 border rounded-md bg-slate-600 text-white"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

                <button
                    className={`icon-button mt-4 text-2xl text-slate-200 hover:text-slate-600 transition duration-300 ease-in-out 'cursor-pointer'`}
                    onClick={handleSave}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
            </div>
        </div>

    );
};

export default EditNoteModal;
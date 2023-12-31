// EditNoteModal.js

import React, { useEffect, useState } from 'react';
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"

import useAuth from "../../hooks/useAuth"

import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditNoteModal = ({ note, onClose }) => {
    const { isAdmin, isManager } = useAuth()
    const { team } = useAuth();
    const navigate = useNavigate()
    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation()

    const [deleteNote, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteNoteMutation()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [completed, setCompleted] = useState(note.completed)
    const [userId, setUserId] = useState(note.user)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const handleSave = async () => {
        if (canSave) {
            await updateNote({ id: note.id, user: userId, title, text, completed });
            onClose()
        }
    };

    const { users } = useGetUsersQuery({ teamId: team }, {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    const options = users.map(user => (
        <option
            key={user.id}
            value={user.id}
        >{user.username}</option>
    ))

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const errClass = (isError || isDelError) ? "text-red-500 mb-4" : "hidden"
    const validTitleClass = !title ? "border-red-500" : ''
    const validTextClass = !text ? "border-red-500" : ''
    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id })
        onClose();
    }

    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button mr-2 text-4xl text-orange-500 hover:text-orange-600 transition duration-300 ease-in-out"
                title="Delete"
                onClick={onDeleteNoteClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    return (
        <div className="edit-note-modal z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800  bg-opacity-50">
            <div className="bg-gradient-to-r from-yellow-200 from-10% via-yellow-300 via-30% to-orange-200 to-90% z-52 p-8 border rounded-md shadow-md w-96">
                <h2 className="text-sm font-semibold mb-4">Edit Task</h2>
                <p className={errClass}>{errContent}</p>

                <label htmlFor="title" className=" text-sm font-medium text-gray-700 mb-1">Title:</label>
                <input
                    className={`form__input ${validTitleClass} w-full px-3 py-2 border rounded-md `}
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label htmlFor="text" className="block  text-sm font-medium text-gray-700 mb-1 mt-3">Text:</label>
                <textarea
                    className={`form__input min-h-40 ${validTextClass} w-full px-3 py-2 border rounded-md`}
                    id="text"
                    type= "text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                ></textarea>

                

                <label className="block font-medium text-gray-700 text-sm mt-3 mb-1">Assign to:</label>
                <select
                    id="note-username"
                    name="username"
                    className="form__select w-full px-4 py-2 border rounded-md"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>
                

                <div className='items-center flex mt-2'>
                    <label htmlFor='note-completed' className="inline font-medium text-sm text-gray-700 mt-3 ">Done?:</label>
                    <input
                        className="mt-4 ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-transparent form__checkbox"
                        id="note-completed"
                        name="completed"
                        type="checkbox"
                        checked={completed}
                        onChange={onCompletedChanged}
                    />
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button className='icon-button mr-2 text-4xl text-orange-500 hover:text-orange-600 transition duration-300 ease-in-out' onClick={handleSave} disabled={!canSave}>
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                    {deleteButton}
                    <button className='flex px-4 py-2 text-stone-800 bg-orange-500 rounded hover:bg-orange-600 transition duration-300 ease-in-out' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditNoteModal;

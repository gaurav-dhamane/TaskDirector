// EditNoteModal.js
import React, { useEffect, useState } from 'react';
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"

import useAuth from "../../hooks/useAuth"

import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let teamId = ''
const EditNoteModal = ({ note, onClose }) => {
    const { isAdmin, isManager } = useAuth()
    const { team } = useAuth();
    teamId = team;
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
        // Call the onSave function with the edited note
        if (canSave) {
            await updateNote({ id: note.id, user: userId, title, text, completed });
            onClose()
        }
    };
    const { users } = useGetUsersQuery({ teamId }, {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })
    const options = users.map(user => {
        return (
            <option 
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id })
        onClose();
    }

    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteNoteClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }


    return (
        <div className="edit-note-modal">
            <h2>Edit Note</h2>
            <p className={errClass}>{errContent}</p>
            <label htmlFor="title">Title:</label>
            <input
                className={`form__input ${validTitleClass}`}
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={onTitleChanged}
            />
            <label htmlFor="text">Text:</label>
            <textarea
                className={`form__input form__input--text ${validTextClass}`}
                id="text"
                name="text"
                value={text}
                onChange={onTextChanged}
            ></textarea>

            <label className="form__label form__checkbox-container" htmlFor="note-completed">
                Done?:
                <input
                    className="form__checkbox"
                    id="note-completed"
                    name="completed"
                    type="checkbox"
                    checked={completed}
                    onChange={onCompletedChanged}
                />
            </label>

            <label className="form__label form__checkbox-container" htmlFor="note-username">
                Assign to:</label>
            <select
                id="note-username"
                name="username"
                className="form__select"
                value={userId}
                onChange={onUserIdChanged}
            >
                {options}
            </select>
            {/* Add other form fields based on your note object properties */}
            <button className='icon-button' onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
            <button className='icon-button' onClick={onClose}>Cancel</button>
        </div>
    );
};

export default EditNoteModal;

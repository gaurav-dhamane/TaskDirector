import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const NewNoteForm = ({ users }) => {
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation();

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [userId, setUserId] = useState(users[0].id);

    useEffect(() => {
        if (isSuccess) {
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dash/notes');
        }
    }, [isSuccess, navigate]);

    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onUserIdChanged = e => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;

    const onSaveNoteClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewNote({ user: userId, title, text });
        }
    };

    const options = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.username}
        </option>
    ));

    const errClass = isError ? "text-red-500" : "offscreen";
    const validTitleClass = !title ? "border-red-500" : '';
    const validTextClass = !text ? "border-red-500" : '';

    return (
        <section className="p-4 min-h-screen bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90%">
            <p className={`text-red-500 ${errClass}`}>{error?.data?.message}</p>

            <form className="w-full max-w-md mx-auto mt-4 bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-purple-900 p-4 md:p-8 rounded-md shadow-md" onSubmit={onSaveNoteClicked}>
                <div className="form__title-row flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">New Task</h2>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title:
                    </label>
                    <input
                        className={`form__input appearance-none border ${validTitleClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                        id="title"
                        name="title"
                        type="text"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="text">
                        Text:
                    </label>
                    <textarea
                        className={`form__input form__input--text min-h-32 appearance-none border ${validTextClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                        id="text"
                        name="text"
                        value={text}
                        onChange={onTextChanged}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Assign to:
                    </label>
                    <select
                        id="username"
                        name="username"
                        className="form__select appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={userId}
                        onChange={onUserIdChanged}
                    >
                        {options}
                    </select>
                </div>

                <div className="form__action-buttons flex gap-4">
                    <button
                        className=" px-4 py-2 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out"
                        title="Save"
                        disabled={!canSave}
                    >
                        <div >
                            <FontAwesomeIcon icon={faSave} />
                            <span> </span>
                            Save
                        </div>
                    </button>

                    <Link
                        className="flex px-4 py-2 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out"
                        title="Back"
                        to='/dash/notes'>
                        Back</Link>
                </div>
            </form>
        </section>
    );
};

export default NewNoteForm;

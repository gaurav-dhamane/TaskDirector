import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const NewNoteModal = ({ users, team, onClose }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] = useAddNewNoteMutation();
  const { id: creator } = useAuth();
  let usersData = []

  users.ids.map(userId => {
    usersData.push(users.entities[userId])
    return usersData
  })

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [assigned_to, setAssigned_to] = useState(usersData[0].id);


  const onTitleChanged = e => setTitle(e.target.value);
  const onTextChanged = e => setText(e.target.value);
  const onAssigned_toChanged = e => setAssigned_to(e.target.value);

  const canSave = [title, text, assigned_to, creator].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ assigned_to, title, text, team, creator });
    }
    onClose()
  };

  const options = users.ids.map(userId => (
    <option key={userId} value={userId}>
      {users.entities[userId].username}
    </option>
  ));

  const errClass = isError ? "text-red-500" : "offscreen";
  const validTitleClass = !title ? "border-red-500" : '';
  const validTextClass = !text ? "border-red-500" : '';

  // Ref for the modal
  const modalRef = useRef();

  useEffect(() => {
    // Function to handle clicks outside the modal
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Clicked outside the modal, close it
        onClose();
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleOutsideClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [modalRef, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="bg-slate-300 p-8 rounded-md shadow-md relative w-96" ref={modalRef}>
        <p className={`text-red-500 ${errClass}`}>{error?.data?.message}</p>
        <form className="w-full max-w-md mx-auto mt-4" onSubmit={onSaveNoteClicked}>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="text__description">
              Text:
            </label>
            <textarea
              className={`form__input form__input--text min-h-32 appearance-none border ${validTextClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
              id="text__description"
              name="text"
              value={text}
              onChange={onTextChanged}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username_">
              Assign to:
            </label>
            <select
              id="username_"
              name="username"
              className="form__select appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={assigned_to}
              onChange={onAssigned_toChanged}
            >
              {options}
            </select>
          </div>

          <div className="form__action-buttons flex gap-4">
            <button
              className="px-4 py-2 text-slate-200 bg-slate-700 rounded hover:bg-slate-800 transition duration-300 ease-in-out"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <div>
                <FontAwesomeIcon icon={faSave} />
                <span> </span>
                Save
              </div>
            </button>


          </div>
        </form>

      </div>
    </div>
  );
};

export default NewNoteModal;

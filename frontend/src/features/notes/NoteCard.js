import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faExchangeAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

import EditNoteModal from './EditNoteModal';
import { useDeleteNoteMutation } from './notesApiSlice';
import useAuth from '../../hooks/useAuth';

const NoteCard = ({ note, team, cardRef, updateNote }) => {
  const [isEditing, setEditing] = useState(false);
  const [completed, setCompleted] = useState(note.completed)
  const [isAssign, setAssign] = useState(false)
  const [editableContent, setEditableContent] = useState({
    title: note.title,
    text: note.text,
  });
  const {id} = useAuth()

  const titleRef = useRef(null);
  const textRef = useRef(null);


  const [deleteNote] = useDeleteNoteMutation()

  const onCompletedChanged = e => setCompleted(prev => !prev)
  useEffect(() => {
    setEditableContent({
      title: note.title,
      text: note.text,
    });
  }, [note]);



  useEffect(() => {
    const handleOutsideClick = async (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        if (isEditing) {
          console.log('Updating Note...');
          await updateNote({
            id: note.id,
            assigned_to: note.assigned_to,
            title: editableContent.title,
            text: editableContent.text,
            completed: completed,
          });
          setEditing(false);
          console.log('Note Updated!')
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [cardRef, note, editableContent, isEditing, updateNote, completed]);
 

  const startEditing = () => {
    setEditing(true);
  };

  const handleContentChange = () => {
    setEditableContent({
      title: titleRef.current.value,
      text: textRef.current.value,
    });
  };


  const time = new Date(note.updatedAt);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const noteStatusClass = note.completed ? 'bg-green-400 ' : 'bg-slate-600';
  const noteStatusClass2 = note.completed ? 'bg-green-300 ' : 'bg-slate-500';
  const noteTextClass1 = note.completed ? 'text-green-950' : 'text-slate-200';
  const noteTextClass2 = note.completed ? 'text-green-700' : 'text-slate-400';
  const orderClass = note.completed ? 'order-3' : 'order-1';

  const calculateRows = () => {
    const r = (editableContent.text).split('\n').length
    return r < 12 ? r : 12
  }

  const handleChangeUser = () => {
    setAssign(true)
  }

  const handleNoteDelete = () => {
      deleteNote({id:note.id, userId:id})
  }

  return (
    <>
      <div
        ref={cardRef}
        onClick={startEditing}
        className={`px-4 py-4 mb-6 rounded-md shadow-lg relative ${noteStatusClass} note-card ${orderClass} min-h-full md:max-w-md lg:max-w-lg`}
      >
        <div className="flex flex-col h-full">

          <div className='flex justify-between'>
            <div className={`flex w-fit   gap-2 mb-2 md:mb-4`}>
              <input
                className={`size-5 `}
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
              <label className={`${noteTextClass1} italic`} htmlFor="note-completed">Done ?</label>
            </div>

            <button onClick={handleNoteDelete} className={`px-2 h-fit ${noteTextClass1}  rounded-sm `}>
            <FontAwesomeIcon icon={faTrash} />
            </button>

          </div>

          <div className="flex-grow">
            <input
              type="text"
              className={`text-2xl ${noteTextClass1} font-bold mb-2 focus:outline-none w-full ${noteStatusClass}`}
              ref={titleRef}
              value={editableContent.title}
              onChange={handleContentChange}
              readOnly={!isEditing}
            />
            <textarea
              className={`max-h-screen resize-none p-2 overflow-auto ${noteStatusClass2} ${noteTextClass1} rounded-sm`}
              ref={textRef}
              value={editableContent.text}
              onChange={handleContentChange}
              readOnly={!isEditing}
              rows={calculateRows()}
            />
          </div>

          <div className="mt-4">

            <p className={`${noteTextClass2} text-xs mb-2`}>
              <i>updated: {time.toLocaleDateString('en-IN', options)}</i>
            </p>
            <div className={`${noteTextClass2} text-sm flex flex-col md:flex-row items-start md:items-center justify-between`}>
              <div className="flex gap-2 mb-2 md:mb-0">
                <p> <FontAwesomeIcon icon={faUserCircle} /> </p>
                <p>{note.username}</p>
                <button onClick={handleChangeUser}>
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </button>
              </div>
             
            </div>

          </div>
        </div>
      </div>
      <div>{isAssign && <EditNoteModal note={note} onClose={() => {
        setAssign(false)
      }} team={team}></EditNoteModal>}</div>
    </>

  );
};

export default NoteCard;

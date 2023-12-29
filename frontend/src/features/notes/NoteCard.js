import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditNoteModal from './EditNoteModal';

const NoteCard = ({ note }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const time = new Date(note.updatedAt);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    millisecond: 'numeric',
    timeZoneName: 'short'
  };
  
  return (
    <div className={`note-card ${note.completed ? 'note__completed' : 'note__pending'}`}>
      <h3 className="note-card__title">{note.title}</h3>
      <p className="note-card__description">{note.text.substring(0,100)}</p>
      <p>Assigned to: {note.username}</p>
      <p className='note__date'>last updated: {time.toLocaleDateString('en-IN', options)}</p>
      <button className='edit-note__button' onClick={handleEdit}>
        <FontAwesomeIcon  icon={faPenToSquare} />
      </button>

      {isModalOpen && <EditNoteModal note={note} onClose={handleCloseModal} />}
    </div>
  );
};

export default NoteCard;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faPenToSquare, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import EditNoteModal from './EditNoteModal';
import { useGetUsersQuery } from '../users/usersApiSlice';
import ViewNote from './ViewNote';

const useFetchUsers = () => {
  const { data: users } = useGetUsersQuery();
  return users;
};

const NoteCard = ({ note }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isviewOpen, setViewOpen] = useState(false);
  const users = useFetchUsers();

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleView = () => {
    setViewOpen(true);
  };

  const handleClose = () => {
    setViewOpen(false);
  };

  const time = new Date(note.updatedAt);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const noteStatusClass = note.completed ? 'bg-green-200' : 'bg-yellow-200';
  const orderClass = note.completed ? 'order-3' : 'order-1';

  return (
    <>
      <div
        className={`px-5 pt-5 pb-2 border-2 mb-6 rounded-md shadow-xl relative ${noteStatusClass} note-card ${orderClass}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
            <p className="text-gray-700 mb-4 overflow-hidden overflow-ellipsis" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
              {note.text}
            </p>
          </div>

          <div className="mt-auto">
            <p className="text-gray-500 text-xs mb-2">
              <i>updated: {time.toLocaleDateString('en-IN', options)}</i>
            </p>
            <p className="text-gray-500 text-xs">
              <i>assigned: </i> <br />
              <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
              {note.username}
            </p>
            <div className="absolute top-0 right-0 p-2">
              <button className="text-yellow-700 hover:text-yellow-800" onClick={handleEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
            <div className="absolute bottom-0 right-0 p-2">
              <button
                className=" text-yellow-700 hover:text-yellow-800 transition duration-300 ease-in-out"
                onClick={handleView}
              >
                <FontAwesomeIcon icon={faExpandAlt} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>{isModalOpen && <EditNoteModal note={note} onClose={handleCloseModal} users={users} />}</div>

      <div>{isviewOpen && <ViewNote note={note} onCloseView={handleClose} />} </div>
    </>
  );
};

export default NoteCard;

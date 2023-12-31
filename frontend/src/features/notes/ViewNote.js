import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const ViewNote = ({ note, onCloseView }) => {
  const complete = (isComplete) => {
    if (isComplete) {
      return <p className='text-green-800'>Completed !</p>;
    }
    return <p className='text-red-500'>Pending !</p>;
  };

  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-yellow-100 max-w-md p-4 overflow-y-auto max-h-full rounded-md">

        <div className="flex justify-end pt-2 pr-3">
          <button className='text-red-500 ' onClick={onCloseView}>
            <b>X</b>
          </button>
        </div>

        <p className="text-xl font-semibold mb-4 ">{note.title}</p>
        <p className="text-gray-700 p-2 rounded-md mb-4 bg-yellow-200">{note.text}</p>

        <div className='flex w-full mt-6 justify-between font-mono'>
          <p className="text-gray-800 text-xs pr-3">
            <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
            {note.username}
          </p>
          <p className="text-xs font-bold">{complete(note.completed)}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;

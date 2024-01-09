import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetNotesQuery } from "./notesApiSlice";
import NoteCard from "./NoteCard";
import useAuth from "../../hooks/useAuth";
import PulseLoader from 'react-spinners/PulseLoader';
import AddUserModal from './AddUserModal';
import NewNoteModal from './NewNoteModal';
import { useUpdateNoteMutation } from "./notesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStickyNote, faCheck, faTimes, faCircleInfo, faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import { useGetUsersQuery } from '../users/usersApiSlice';



const NotesList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const team = queryParams.get('teamId');
  const { username } = useAuth();

  const [isPollingActive, setIsPollingActive] = useState(true);

  const { data: notes, isLoading, isSuccess, isError, error } = useGetNotesQuery(
    { teamId: team },
    {
      pollingInterval: isPollingActive ? 1500 : null,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    }
  );

  const { data: usersData } = useGetUsersQuery(
    { username, teamId: team },
    {
      pollingInterval: isPollingActive ? 1500 : null,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    }
  );

  const modalRef = useRef();
  const infoModalRef = useRef();
  const usersModalRef = useRef();

  const cardRef = useRef();

  const [showInfo, setShowInfo] = useState(false);
  const [showNav, setShowNav] = useState(false)
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [addUsersModal, setAddUsersModal] = useState(false);
  const [usersIconPosition, setUsersIconPosition] = useState({ top: 0, left: 0 });


  const [updateNote] = useUpdateNoteMutation();

  useEffect(() => {
    const handleInfoModalOutsideClick = (event) => {
      if (infoModalRef.current && !infoModalRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };

    const handleUsersModalOutsideClick = (event) => {
      if (usersModalRef.current && !usersModalRef.current.contains(event.target)) {
        setShowUsersModal(false);
      }
    };

    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setAddUsersModal(false);
      }
    };

    document.addEventListener('mousedown', handleInfoModalOutsideClick);
    document.addEventListener('mousedown', handleUsersModalOutsideClick);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleInfoModalOutsideClick);
      document.removeEventListener('mousedown', handleUsersModalOutsideClick);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [infoModalRef, usersModalRef, modalRef, setShowInfo, setShowUsersModal, setAddUsersModal]);

  const handleNewNoteButtonClick = async (e) => {
    e.preventDefault();
    setShowNewNoteModal(true);
    setIsPollingActive(false);
  };

  const handleNewNoteModalClose = () => {
    setShowNewNoteModal(false);
    setIsPollingActive(false);
  };

  const handleUsersButtonClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setUsersIconPosition({ top: rect.bottom, left: rect.left });
    setShowUsersModal((prev) => !prev);
  };

  const isManager = true;
  const isAdmin = true;

  const handleClose = () => {
    setAddUsersModal(false);
  };

  useEffect(() => {
    if (window.innerWidth > 640) {
      setShowNav(true);
    }

  }, []);


  const buttonContent = <>
    <button
      className="flex items-baseline gap-2 px-2 py-1 text-green-500 hover:underline hover:text-green-600 "
      title="New Task"
      onClick={(e) => {
        handleNewNoteButtonClick(e)
        setShowNav(false)
      }}
    >
      <FontAwesomeIcon icon={faStickyNote} />
      New Task
    </button>
    <button className="flex items-baseline gap-2 px-2 py-1 text-green-500 hover:underline hover:text-green-600 "
      title="Add User" onClick={() => {
        setAddUsersModal(!addUsersModal)
        setShowNav(false)
      }}>
      <FontAwesomeIcon icon={faUserPlus} />
      Add User
    </button>
  </>;

  let content;

  if (isLoading) {
    content = (
      <div className='min-h-screen   bg-slate-800'>
        <PulseLoader color={"#FFF"} />
      </div>
    );
  }

  if (isError) {
    content = (
      <div className='min-h-screen p-4  bg-slate-800'>
        <p className="errmsg pt-8">{error?.data?.message}</p>
        <h2 className=' text-indigo-800 mb-5'>Choose From Following Actions: </h2>
        <div className='flex gap-4'>
          {buttonContent}
        </div>

        {showNewNoteModal && <NewNoteModal users={usersData} team={team} onClose={handleNewNoteModalClose} />}
        {addUsersModal && <AddUserModal teamId={team} onClose={handleClose} modalRef={modalRef}></AddUserModal>}
      </div>
    );
  }

  const handleNav = () => {
    setShowNav(!showNav)
  }

  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredNotes;
    if (isManager || isAdmin) {
      filteredNotes = ids.map(noteId => entities[noteId]);
    } else {
      filteredNotes = ids.map(noteId => entities[noteId]).filter(note => note.username === username);
    }



    const completedNotes = filteredNotes.filter(note => note.completed);
    const pendingNotes = filteredNotes.filter(note => !note.completed);

    completedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    pendingNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    filteredNotes = [...pendingNotes, ...completedNotes];
    content = (
      <div className='bg-slate-800 pt-14 '>

        <button onClick={handleNav} className='nav-bar__show fixed top-2 right-20 z-50 p-2 text-green-400 text-2xl'>
          <FontAwesomeIcon icon={faBars} />
        </button>

        {showNav &&
          <div className="nav-bar fixed  flex flex-col pt-1 md:flex-row  gap-1 z-50 top-1 right-28  bg-slate-900 items-baseline ">
            <button
              className={`text-green-500 text-xl hover:text-green-600 `}
              onClick={() => {
                setShowInfo(true)
                setShowNav(false)
              }}
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
            {buttonContent}
            <button
              className={'flex items-baseline gap-2 px-2 py-1 text-green-500 hover:underline hover:text-green-600 '}
              onClick={(e) => {
                handleUsersButtonClick(e)
                setShowNav(false)
              }}
            >
              <FontAwesomeIcon icon={faUsers} />
              Members
            </button>
          </div>}

        <div className="column-container p-4 md:p-8">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} cardRef={cardRef} updateNote={updateNote} team={team} note={note} />
          ))}
        </div>

        {showInfo && (
          <div ref={infoModalRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-fit max-w-fit z-50 flex bg-slate-500">
            <p className="bg-slate-200 p-4 md:p-8 rounded-md shadow-xl relative ">
              Completed tasks will be moved to the end.
            </p>
          </div>
        )}

        {showUsersModal && (
          <div
            className="fixed right-2 md:right-8 bg-slate-700 rounded-md pr-2 md:pr-5 shadow-md "
            ref={usersModalRef}
            style={{
              top: usersIconPosition.top,
            }}
          >
            <div className="p-2 md:p-4 rounded-sm shadow-md">
              {usersData &&
                usersData.ids.map((userId) => {
                  const user = usersData.entities[userId];
                  const activeClass = user.active ? 'text-green-500' : 'text-red-500';
                  const icon = user.active ? faCheck : faTimes;
                  return (
                    <div key={user.id} className="flex gap-2 md:gap-4 justify-between items-center mb-2">
                      <p className="text-md text-white">{user.username}</p>
                      <FontAwesomeIcon icon={icon} className={activeClass} />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {showNewNoteModal && <NewNoteModal users={usersData} team={team} onClose={handleNewNoteModalClose} />}
        {addUsersModal && <AddUserModal teamId={team} onClose={handleClose} modalRef={modalRef}></AddUserModal>}
      </div>

    );
  }

  return content;
}

export default NotesList;

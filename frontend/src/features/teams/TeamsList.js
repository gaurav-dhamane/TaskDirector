import { useGetTeamsQuery } from "../teams/teamsApiSlice";
import Team from './Team';
import PulseLoader from 'react-spinners/PulseLoader';
import useAuth from "../../hooks/useAuth";
import React, { useEffect, useRef, useState } from 'react';
import NewTeamForm from "./NewTeamForm";
import { Link } from "react-router-dom";

const TeamsList = () => {
    const { username } = useAuth();
    const [showNewTeamModal, setShowNewTeamModal] = useState(false);
    const modalRef = useRef();
    const messageModal = useRef()

    const [message, setmessage] = useState('')
    const [shoMessage, setShowMessage] = useState(false)

    useEffect(() => {

        if (message?.length) {
            setShowMessage(true)
        }


    }, [message])

    const closeMessage = () => {
        setShowMessage(false);
    }

    useEffect(() => {
        // Function to handle clicks outside the modal
        const handleOutsideClick = (event) => {
            if (messageModal.current && !messageModal.current.contains(event.target)) {
                // Clicked outside the modal, close it
                closeMessage();
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleOutsideClick);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [messageModal]);


    const { data: teams, isLoading, isSuccess, isError , error} = useGetTeamsQuery(
        { username },
        {
            pollingInterval: 15000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true
        }
    );

    let content;

    const handleButtonClick = () => {
        setShowNewTeamModal(true);
    };

    const handleClose = () => {
        setShowNewTeamModal(false);


    };

    const messageSet = (message) => {

        setmessage(message)
    }

    if (isLoading) {
        content = <PulseLoader color="#FFF" />;
    }

    



    if (isSuccess) {
        const { entities, ids } = teams;

        content = (
            <div className="min-h-screen bg-slate-800 ">
                {isLoading && <PulseLoader color="#FFF" />}

                {true && <p className="text-red-200">{message}</p>}

                {isSuccess && (
                    <>
                        <section >
                            <div className="column-container  pt-14 px-4">
                                {ids.map((teamId) => (
                                    <Team key={teamId} messageSet={messageSet} team={entities[teamId]} />
                                ))}
                                <button
                                    className="flex bg-slate-600 px-3 text-green-600 hover:text-green-700 text-3xl rounded-md shadow-green-800 shadow-md mb"
                                    onClick={handleButtonClick}
                                >
                                    +
                                </button>
                            </div>
                        </section>

                        {showNewTeamModal && <NewTeamForm modalRef={modalRef} onClose={handleClose} />}
                        {shoMessage && <div ref={messageModal} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-fit max-w-fit z-50 flex bg-slate-500">
                            <p className="bg-slate-200 p-4 md:p-8 rounded-md shadow-xl relative ">
                                {message}
                            </p>
                        </div>}
                    </>
                )}
            </div>
        );
    } else if(isError && error?.status===401){
        console.log(error)
            content = <>
            <div className="error-container ">
                <p className="errmsg m-20 p-10">
                    {`${error.data?.message} - `}
                    <Link to="/login">Please login again</Link>
                </p>
            </div>
            </>
    }
    
    else {
        content = (
            <section className="min-h-screen bg-slate-800">
    <div className="flex flex-col items-center justify-center h-full p-20">
        <button
            className="bg-slate-600 px-6 py-3 text-green-600 hover:text-green-700 text-3xl rounded-md shadow-green-800 shadow-md mb-4"
            onClick={handleButtonClick}
        >
            Create Team
        </button>
        {showNewTeamModal && <NewTeamForm modalRef={modalRef} onClose={handleClose} />}
        <p className="text-white text-xl mb-8">
    No teams created yet. Get started by clicking the "Create Team" button above.
</p>

    </div>
</section>


        );
    }

    return content;
};

export default TeamsList;

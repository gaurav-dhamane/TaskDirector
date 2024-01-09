import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUsersDataQuery } from '../users/usersApiSlice';
import { useDeleteTeamMutation } from './teamsApiSlice';
import useAuth from '../../hooks/useAuth';


const Team = ({ team, messageSet }) => {
    const { id, teamname, creator, notes } = team;
    const {id:userId} = useAuth()
    const navigate = useNavigate()

    const {
        data: creatorData
    } = useGetUsersDataQuery({ userId: creator }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });
    const [deleteTeam, {  isError, error }] = useDeleteTeamMutation()


    const handleDelete = async () => {
        await deleteTeam({ id, userId })
        if (isError) {
            messageSet(error.data?.message)
        }
        navigate('/dash')

    }

    const handleClick = () => {
        navigate(`/dash/notes?teamId=${id}`);
    };


    return (
        <div  className='px-5 pt-5 pb-2 mb-6 rounded-md shadow-lg bg-green-200 hover:bg-green-300 shadow-green-800 relative note-card'>
            <div onClick={handleClick}>
            <h2 className='text-xl font-semibold text-green-800'>{teamname}</h2>
            <div className='text-green-700'>
                <p>Creator: {creatorData?.username}</p>
                <p>Notes: {notes.length}</p>
              
            </div>
            </div>
            <button onClick={handleDelete} className='bg-green-700  text-white mt-4 py-1 px-2 rounded'>
                    Delete
                </button>
        </div>
    );
};

export default Team;

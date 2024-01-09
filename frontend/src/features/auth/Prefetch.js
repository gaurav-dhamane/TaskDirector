import { store } from '../../app/store'
import useAuth from '../../hooks/useAuth';
// import { notesApiSlice } from '../notes/notesApiSlice'
import { teamsApiSlice } from '../teams/teamsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';


const Prefetch = () => {
    const { username } = useAuth();
    useEffect(() => {
        // store.dispatch(notesApiSlice.util.prefetch('getNotes', { teamId: team }, { force: true }))
        store.dispatch(teamsApiSlice.util.prefetch('getTeams', {username:username}, { force: true }))
    }, [username])

    return <Outlet />
}
export default Prefetch
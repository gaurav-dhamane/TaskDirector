import { store } from '../../app/store'
import useAuth from '../../hooks/useAuth';
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';


const Prefetch = () => {
    const { team } = useAuth();

    useEffect(() => {
        store.dispatch(notesApiSlice.util.prefetch('getNotes', { teamId: team }, { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', {teamId: team}, { force: true }))
    }, [team])

    return <Outlet />
}
export default Prefetch
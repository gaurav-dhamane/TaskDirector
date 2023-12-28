import NewNoteForm from './NewNoteForm'
import { useGetUsersQuery } from "../users/usersApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hooks/useAuth"
let teamId = ''

const NewNote = () => {
  const { team } = useAuth();
  teamId = team;
  const { user } = useGetUsersQuery({ teamId }, {
    selectFromResult: ({ data }) => ({
      user: data?.ids.map(id => data?.entities[id])
    })
  })

  if (!user) return <PulseLoader color="#FFF" />

  const content = <NewNoteForm users={user} />

  return content
}

export default NewNote
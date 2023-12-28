import { useParams } from "react-router-dom"
import EditUserForm from "./EditUserForm"
import { useGetUsersQuery } from "./usersApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hooks/useAuth"
let teamId = ''

const EditUser = () => {
    const {id} = useParams()
    const { team } = useAuth();
    teamId = team;

    const {user} = useGetUsersQuery({teamId}, {
      selectFromResult: ({data}) => ({
        user: data?.entities[id]
      })
    })

    if(!user) return <PulseLoader color="#FFF"/>
  
    const content = <EditUserForm user={user} />
    return content
}

export default EditUser
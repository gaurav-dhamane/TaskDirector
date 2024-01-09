import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    // let isManager = false
    // let isAdmin = false
    // let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, teams, id } = decoded.UserInfo

        return { username, teams,id }
    }

    return { username: '', teams: [], id: '' }
}
export default useAuth
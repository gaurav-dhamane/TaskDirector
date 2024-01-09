import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
 
const DashFooter = () => {

    const { username} = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className=" text-green-700 text-xl"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="fixed  bottom-0 z-50 left-0 right-0 flex items-baseline justify-between px-4 gap-4 bg-slate-900">
            {goHomeButton}
            <p className=" text-sm text-green-600"> <FontAwesomeIcon icon={faUserCircle} /> {username}</p>
        </footer>
    )
    return content
}
export default DashFooter
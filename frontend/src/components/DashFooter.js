import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faUserCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
 
const DashFooter = () => {

    const { username, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="fixed bottom-0 left-0 z-10 ml-2 text-purple-950 text-xl"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="fixed bottom-0  left-0 right-0 z-10 flex flex-row justify-start pl-12 gap-4 bg-gradient-to-r from-indigo-400 from-10% via-sky-400 via-30% to-emerald-400 to-90% ">
            {goHomeButton}
            <p className=" text-xl text-purple-950"> <FontAwesomeIcon icon={faUserCircle} /> {username}</p>
            <p className=" text-xl text-purple-950"> <FontAwesomeIcon icon={faCircleInfo} />  {status} </p>
        </footer>
    )
    return content
}
export default DashFooter
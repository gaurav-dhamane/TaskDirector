import { useState, useEffect } from "react"
import { useAddNewTeamMutation } from "./teamsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useTitle from "../../hooks/useTitle"
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'



const TEAM_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewTeamForm = () => {
    useTitle('taskdirector: New Team')

    const [addNewTeam, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewTeamMutation()

    const navigate = useNavigate()

    const [teamname, setTeamname] = useState('')
    const [validTeamname, setValidTeamname] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => {
        setValidTeamname(TEAM_REGEX.test(teamname))
    }, [teamname])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setTeamname('')
            setPassword('')
            navigate('/login')
        }
    }, [isSuccess, navigate])

    const onTeamnameChanged = e => setTeamname(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)



    const canSave = [validTeamname, validPassword].every(Boolean) && !isLoading

    const onSaveTeamClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewTeam({ teamname, password })
        }
    }


    const errClass = isError ? "errmsg" : "offscreen"
    const validTeamClass = !validTeamname ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''


    const content = (
        <>

            <form className="form" onSubmit={onSaveTeamClicked}>
                <h2>New Team</h2>
                <div className="top-info">
                    <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                    <span className="tooltiptext">
                        After registering, log in with <b>'{teamname}-admin'</b> as the username, and use the same password you entered during registration.
                    </span>
                </div>
                <p className={errClass}>
                    <FontAwesomeIcon icon={faExclamationTriangle}  /> 
                    <span> </span>
                    {error?.data?.message}</p>
                <label className="form__label" htmlFor="teamname">
                    Teamname: <span className="nowrap"></span></label>
                <input
                    className={`form__input ${validTeamClass}`}
                    id="teamname"
                    name="teamname"
                    type="text"
                    autoComplete="off"
                    value={teamname}
                    onChange={onTeamnameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap"></span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <button
                    className="icon-button"
                    title="Submit"
                    disabled={!canSave}
                >

                    Submit
                </button>


            </form>
        </>
    )

    return content
}
export default NewTeamForm
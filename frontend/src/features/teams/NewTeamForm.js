import { useState, useEffect } from "react";
import { useAddNewTeamMutation } from "./teamsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useTitle from "../../hooks/useTitle";
import { faInfoCircle, faExclamationTriangle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const TEAM_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const NewTeamForm = () => {
    useTitle('taskdirector: New Team');

    const [addNewTeam, { isLoading, isSuccess, isError, error }] = useAddNewTeamMutation();
    const navigate = useNavigate();

    const [teamname, setTeamname] = useState('');
    const [validTeamname, setValidTeamname] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

    useEffect(() => {
        setValidTeamname(TEAM_REGEX.test(teamname));
    }, [teamname]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setTeamname('');
            setPassword('');
            navigate('/login');
        }
    }, [isSuccess, navigate]);

    const onTeamnameChanged = (e) => setTeamname(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const canSave = [validTeamname, validPassword].every(Boolean) && !isLoading;

    const onSaveTeamClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewTeam({ teamname, password });
        }
    };

    const errClass = isError ? "errmsg" : "offscreen";
    const validTeamClass = !validTeamname ? 'border-red-500' : '';
    const validPwdClass = !validPassword ? 'border-red-500' : '';

    const content = (
        <div className="bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90% min-h-screen flex items-center justify-center">
            <form className="w-full max-w-md mx-auto mt-10 bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-emerald-900 p-4 md:p-12 rounded-md shadow-md" onSubmit={onSaveTeamClicked}>
                <h2 className="text-2xl mb-6 font-bold">New Team</h2>
                <div className="mb-4">
                    <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                    <span className="tooltiptext">
                        After registering, log in with <b>'{teamname}-admin'</b> as the username, and use the same password you entered during registration.
                    </span>
                </div>
                <p className={`text-red-500 ${errClass}`}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span> </span>
                    {error?.data?.message}
                </p>
                <div className="mb-6">
                    <label htmlFor="teamname" className="block text-gray-700 text-sm font-bold mb-2">
                        Teamname:
                    </label>
                    <input
                        className={`form__input appearance-none border ${validTeamClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                        id="teamname"
                        name="teamname"
                        type="text"
                        autoComplete="off"
                        value={teamname}
                        onChange={onTeamnameChanged}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password:
                        <FontAwesomeIcon icon={faQuestionCircle} className="question-icon cursor-pointer ml-2" onClick={() => setShowPasswordInfo(true)} />
                    </label>
                    <input
                        className={`form__input appearance-none border ${validPwdClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={onPasswordChanged}
                    />
                </div>

                <button
                    className={`flex px-4 py-2 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out ${canSave ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    title="Submit"
                    disabled={!canSave}
                >
                    Submit
                </button>


                {/* Password Info Modal */}
                {showPasswordInfo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-0" onClick={() => setShowPasswordInfo(false)}></div>
                        <div className="bg-white p-8 rounded-md shadow-md relative">
                            <button className="absolute top-2 right-2 flex px-2 py-0 text-red-500" onClick={() => setShowPasswordInfo(false)}>
                                <b>x</b>
                            </button>
                            <p className="text-stone-950 pb-2">Password should be:</p>
                            <ul className="text-stone-600 pl-6">
                                <li>8-20 characters long</li>
                                <li>at least one lowercase letter (a-z)</li>
                                <li>at least one uppercase letter (A-Z)</li>
                                <li>at least one digit (0-9)</li>
                                <li>at least one of @$!%*?&</li>
                            </ul>
                        </div>
                    </div>
                )}


            </form>
        </div>
    );

    return content;
};

export default NewTeamForm;

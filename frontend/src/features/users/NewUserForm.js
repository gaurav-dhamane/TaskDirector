import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave , faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";

const USER_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const NewUserForm = () => {
    useTitle('taskdirector: New User');

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);
    const { team } = useAuth();
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, navigate]);

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, // HTMLCollection 
            (option) => option.value
        );
        setRoles(values);
    };

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ username, password, roles, team });
        }
    };

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >{role}</option>
        );
    });

    const errClass = isError ? "text-red-500" : "offscreen";
    const validUserClass = !validUsername ? 'border-red-500' : '';
    const validPwdClass = !validPassword ? 'border-red-500' : '';
    const validRolesClass = !Boolean(roles.length) ? 'border-red-500' : '';




    const content = (
        <>
            <div className="bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90% min-h-screen flex items-center justify-center">


                

                <form className="w-full max-w-md mx-auto mt-0 bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-emerald-900 p-4 md:p-12 rounded-md shadow-md" onSubmit={onSaveUserClicked}>
                    <div className="form__title-row flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">New User</h2>
                        
                    </div>
                    <p className={`text-red-500 ${errClass}`}>{error?.data?.message}</p>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Set Username: </label>

                    <input
                        className={`form__input appearance-none border ${validUserClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-4`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={onUsernameChanged}
                    />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Set Password: 
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

                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2" htmlFor="roles">
                        Assign Roles:</label>
                    <select
                        id="roles"
                        name="roles"
                        className={`form__select appearance-none border ${validRolesClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                        multiple={true}
                        size="3"
                        value={roles}
                        onChange={onRolesChanged}
                    >
                        {options}
                    </select>

                    <div className="form__action-buttons">
                            <button
                                className={`flex mt-4  py-2 text-emerald-800 text-3xl ${canSave ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                title="Save"
                                disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                        </div>

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
        </>
    );

    return content;
};

export default NewUserForm;

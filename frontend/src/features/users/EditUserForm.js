import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setRoles(values);
    };

    const onActiveChanged = () => setActive(prev => !prev);

    const onSaveUserClicked = async () => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active });
        } else {
            await updateUser({ id: user.id, username, roles, active });
        }
    };

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id });
    };

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >{role}</option>
        );
    });

    let canSave;
    if (password) {
        canSave = [roles?.length, validUsername, validPassword].every(Boolean) && !isLoading;
    } else {
        canSave = [roles?.length, validUsername].every(Boolean) && !isLoading;
    }

    const errClass = (isError || isDelError) ? "text-red-500" : "offscreen";
    const validUserClass = !validUsername ? 'border-red-500' : '';
    const validPwdClass = password && !validPassword ? 'border-red-500' : '';
    const validRolesClass = !Boolean(roles.length) ? 'border-red-500' : '';

    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

    const content = (
        <>
            <div className="bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90% min-h-screen flex items-center justify-center">
                <form className="w-full max-w-md mx-auto bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-purple-900 p-4 md:p-12 rounded-md shadow-md" onSubmit={e => e.preventDefault()}>
                    <div className="form__title-row flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Edit User</h2>
                        <div className="two__button flex gap-4">
                            <button
                                className="icon-button text-emerald-800 text-2xl"
                                title="Save"
                                onClick={onSaveUserClicked}
                                disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                                className="icon-icon-button text-emerald-800 text-2xl"
                                title="Delete"
                                onClick={onDeleteUserClicked}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>

                    <p className={`text-red-500 ${errClass}`}>{errContent}</p>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username:</label>
                    <input
                        className={`form__input appearance-none border ${validUserClass} rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={onUsernameChanged}
                    />
</div>
<div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
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
                    <div className="mb-2">
                    <label htmlFor="user-active" className="form__checkbox">
                        <input
                            type="checkbox"
                            className="form__checkbox-box"
                            id="user-active"
                            onChange={onActiveChanged}
                            checked={active}
                        />
                        Active
                    </label>
                    </div>

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roles">
                        Assigned roles:</label>
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

                    {/* Password Info Modal */}
                    {showPasswordInfo && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black opacity-0" onClick={() => setShowPasswordInfo(false)}></div>
                            <div className="bg-white p-8 rounded-md shadow-md relative">
                                <button className="absolute top-2 right-2 flex px-2 py-0 text-red-500" onClick={() => setShowPasswordInfo(false)}>x</button>
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

export default EditUserForm;

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    useTitle('Employee Login');

    const userRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { accessToken } = await login({ username, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setUsername('');
            setPassword('');
            navigate('/dash');
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    };

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist((prev) => !prev);

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    if (isLoading) return <PulseLoader color={'#FFF'} />;

    const content = (
        <section className="login min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90%">

            <main className="login p-8 rounded-md shadow-md bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-purple-900">

                <form className="form" onSubmit={handleSubmit}>

                    <h1 className="text-2xl mb-4 text-stone-900">User Login</h1>

                    <div className="top-info flex items-center mb-4 text-stone-900">
                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                        <span className="tooltiptext text-stone-900 ml-2">
                            For admin login, use Teamname-admin as the username; change it later.
                        </span>
                    </div>
                    <p ref={errRef} className={`error-message ${errClass}`} aria-live="assertive">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-secondary-color" />
                        <span className="ml-1">{errMsg}</span>
                    </p>
                    <label htmlFor="username" className="block text-sm font-medium text-stone-900 mt-2">Username:</label>
                    <input
                        className="form__input border rounded-md py-2 px-3 mt-1 w-full"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password" className="block text-sm font-medium text-stone-900 mt-2">Password:</label>
                    <input
                        className="form__input border rounded-md py-2 px-3 mt-1 w-full"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />


                    <div className="flex items-center mt-5">
                        <input
                            type="checkbox"
                            onChange={handleToggle}
                            checked={persist}
                            id="checked-checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-transparent"
                        />
                        <label htmlFor=".custom-checkbox " className="ms-2 text-sm font-medium text-stone-900">Trust This Device</label>
                    </div>



                    <section className='two__button mt-6 '>
                        <button className='flex px-4 py-2 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' >Sign In</button>
                    </section>

                </form>
            </main>
            <footer>

            </footer>
        </section>
    );

    return content;
};

export default Login;

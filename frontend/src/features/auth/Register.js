import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useRegisterMutation } from './authApiSlice';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  useTitle('User Registration');

  const userRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrMsg('Passwords do not match');
      confirmPasswordRef.current.focus();
      return;
    }

    try {
      const { accessToken } = await register({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      navigate('/');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 409) {
        setErrMsg('Username already exists');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleConfirmPwdInput = (e) => setConfirmPassword(e.target.value);

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  if (isLoading) return <PulseLoader color={'#FFF'} />;

  const content = (
    <section className="login min-h-screen flex items-center justify-center bg-slate-800">
      <main className="login p-8 w-96 rounded-md shadow-md bg-slate-700 text-green-200">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="text-3xl mb-4 font-bold">User Registration</h1>
          <p ref={errRef} className={`error-message ${errClass}`} aria-live="assertive" id="error-message">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-secondary-color" />
            <span className="ml-1">{errMsg}</span>
          </p>
          <label htmlFor="username" className="block text-sm font-medium mt-2">Username:</label>
          <input
            className="form__input border rounded-md py-2 px-3 mt-1 w-full text-green-900"
            type="text"
            id="username"
            name="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
            placeholder="Enter your username"
            aria-describedby="error-message"
          />
          <label htmlFor="password" className="block text-sm font-medium mt-2">Password:</label>
          <input
            className="form__input border rounded-md py-2 px-3 mt-1 w-full text-green-900"
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            value={password}
            onChange={handlePwdInput}
            required
            placeholder="Enter your password"
          />
          <label htmlFor="confirmPassword" className="block text-sm font-medium mt-2">Confirm Password:</label>
          <input
            className="form__input border rounded-md py-2 px-3 mt-1 w-full text-green-900"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChange={handleConfirmPwdInput}
            required
            placeholder="Confirm your password"
          />
          
          <section className="two__button mt-6 ">
            <button
              className={`flex px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition duration-300 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <PulseLoader color={'#FFF'} size={8} /> : 'Register'}
            </button>
          </section>
        </form>
      </main>
      <footer></footer>
    </section>
  );

  return content;
};

export default Register;

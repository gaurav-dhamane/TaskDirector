import React, {  useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();


    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);


    let dashClass = null;
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small";
    }




    const logoutButton = (
        <button
            className="icon-button text-green-500 text-2xl hover:text-green-600"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

    const errClass = isError ? "errmsg" : "offscreen";

    let buttonContent;
    if (isLoading) {
        buttonContent = <PulseLoader color={"#FFF"} />;
    } else {
        buttonContent = (
            <>
                {logoutButton}
            </>
        );
    }





    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header fixed top-0 z-20 w-screen p-0.5 bg-slate-900">
                <div className={`dash-header__container ${dashClass}`}>
                    
                    <Link to="/dash" className="no-underline m-1 ">
                        <p className='title text-2xl text-green-500'><b>Task Director</b></p>
                    </Link>
                    <nav className="flex flex-row justify-end mr-6 gap-8">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    );
    return content;
}

export default DashHeader 
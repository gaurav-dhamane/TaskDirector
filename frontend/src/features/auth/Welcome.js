import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks,
  faClipboardList,
  faUserCog,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth();

  const date = new Date();
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);

  return (
    <section className="welcome_home bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90% min-h-screen flex items-center justify-center">

      <div className="welcome_container bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 text-purple-900 p-8 md:p-12 rounded-md shadow-md w-full max-w-2xl">

        {/* Div for Date and Welcome Message */}
        <div className="text-center mb-6">
          <p className="welcome_date text-xs italic text-gray-600">{today}</p>
          <h1 className="welcome text-3xl font-bold mb-4">Welcome, {username}!</h1>
        </div>

        {/* Div for Links Grid */}
        <div className="grid mx-4 md:mx-16 my-12 grid-cols-1 md:grid-cols-2 gap-8 align-center">

            <Link className='flex items-center gap-4 px-6 py-4 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' to="/dash/notes">
              <FontAwesomeIcon icon={faTasks}/>
              View Tasks
            </Link>

          
            <Link className='flex items-center gap-4 px-6 py-4 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' to="/dash/notes/new">
              <FontAwesomeIcon icon={faClipboardList}  />
              New Task
            </Link>

          {(isManager || isAdmin) && (
            <>
              
                <Link className='flex items-center gap-4 px-6 py-4 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' to="/dash/users">
                  <FontAwesomeIcon icon={faUserCog}  />
                  User Settings
                </Link>

              
                <Link className='flex items-center gap-4 px-6 py-4 text-stone-900 bg-emerald-500 rounded hover:bg-emerald-600 transition duration-300 ease-in-out' to="/dash/users/new">
                  <FontAwesomeIcon icon={faUserPlus}  />
                  Add User
                </Link>
              
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;

import { useState, useEffect} from "react";
import { useAddNewTeamMutation } from "./teamsApiSlice";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";

const TEAM_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

const NewTeamForm = ({ onClose, modalRef }) => {
    useTitle('taskdirector: New Team');

    const { id } = useAuth();
    const [addNewTeam, { isLoading, isSuccess }] = useAddNewTeamMutation();
    const navigate = useNavigate();

    const [teamname, setTeamname] = useState('');
    const [validTeamname, setValidTeamname] = useState(false);

    useEffect(() => {
        setValidTeamname(TEAM_REGEX.test(teamname));
    }, [teamname]);

    useEffect(() => {
        if (isSuccess) {
            setTeamname('');
            navigate('/dash');
        }
    }, [isSuccess, navigate]);

    const onTeamnameChanged = (e) => setTeamname(e.target.value);

    const canSave = [validTeamname].every(Boolean) && !isLoading;

    const onSaveTeamClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewTeam({ teamname, adminId: id });
            onClose();
        }
    };

    const validTeamClass = !validTeamname ? 'border-red-500' : '';

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose, modalRef]);
    

    return (
        <form ref={modalRef} className="w-full max-w-fit fixed top-1/4 max-h-fit inset-0 px-8 py-4  z-50 mx-auto mt-10 text-slate-700 bg-slate-300 rounded-md shadow-md" onSubmit={onSaveTeamClicked}>
            <p className="text-xl  font-bold pb-2">New Team</p>

            <div className="mb-6">
                <label htmlFor="teamname" className="block text-sm font-bold mb-2">
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

            <button
                className={`flex px-4 py-2 text-slate-200 bg-slate-700 rounded hover:bg-slate-800 transition duration-300 ease-in-out ${canSave ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                title="Submit"
                disabled={!canSave}
            >
                Submit
            </button>
        </form>
    );
};

export default NewTeamForm;

// User.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import { memo } from 'react';
import useAuth from "../../hooks/useAuth";
import React from 'react';

const User = ({ userId, teamId }) => {
    const { team } = useAuth();
    teamId = team;

    const { user } = useGetUsersQuery({ teamId }, {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    });

    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);

        const userRolesString = user.roles.toString().replaceAll(',', ', ');

        const cellStatus = user.active ? 'table__cell--active' : 'table__cell--inactive';

        return (
            <>
            <tr className={`table__row user border-2 ${cellStatus}`}>
                <td className=" py-2 px-4">{user.username}</td>
                <td className="table__cell py-2 px-4">{userRolesString}</td>
                <td className="table__cell py-2 px-4">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
            
            </>
        );
    } else return null;
};

const memoizedUser = memo(User);
export default memoizedUser;

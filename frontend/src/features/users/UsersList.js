// UsersList.jsx
import { useGetUsersQuery } from "./usersApiSlice";
import User from './User';
import PulseLoader from 'react-spinners/PulseLoader';
import useAuth from "../../hooks/useAuth";
import React from 'react';

let teamId = '';

const UsersList = () => {
    const { team } = useAuth();
    teamId = team;

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery({ teamId }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) content = <PulseLoader color={"#FFF"} />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        const { ids } = users;

        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />);

        content = (
            <section className="p-4 h-screen bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90%">
                {isLoading && <PulseLoader color={"#FFF"} />}

                {isError && (
                    <p className="errmsg">{error?.data?.message}</p>
                )}

                {isSuccess && (
                    <div >
                        <table className="table-auto w-full bg-emerald-100 shadow-md">
                            <thead className="sticky top-0  z-1 bg-emerald-500 text-white">
                                <tr>
                                    <th className="text-start py-2 px-4">Username</th>
                                    <th className="text-start py-2 px-4">Roles</th>
                                    <th className="text-start py-2 px-4">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableContent}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        );
    }

    return content;
};

export default UsersList;


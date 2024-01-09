import React, { useState, useEffect } from 'react';
import { useGetAllUsersQuery } from '../users/usersApiSlice';
import { useUpdateTeamMutation } from '../teams/teamsApiSlice';
import { useDebounce } from 'use-debounce';

const AddUserModal = ({ teamId, onClose, modalRef }) => {
  const [userId, setUserId] = useState(null);
  const [addAsAdmin, setAddAsAdmin] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');


  const { data: usersSuggestions, isLoading, isError, isSuccess } = useGetAllUsersQuery();
  const [updateTeam, { isLoading: isUpdatingTeam }] = useUpdateTeamMutation();

  // Debounce the entered username to avoid making too many API requests
  const [debouncedUsername] = useDebounce(inputValue, 300);

  useEffect(() => {
    if (isSuccess && usersSuggestions) {
      // Filter the users based on the entered username
      const filteredUsers = usersSuggestions.ids
        .map((userId) => usersSuggestions.entities[userId])
        .filter((user) => user.username.toLowerCase().includes(debouncedUsername.toLowerCase()));

      setUserSuggestions(filteredUsers);
    }
  }, [isSuccess, usersSuggestions, debouncedUsername]);

  const handleUsernameChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    // Find the user with the matching username in userSuggestions
    const matchingUser = usersSuggestions.ids
      .map((userId) => usersSuggestions.entities[userId])
      .find((user) => user.username.toLowerCase() === newInputValue.toLowerCase());

    // Set the userId if a matching user is found
    setUserId(matchingUser ? matchingUser._id : null);
  };

  const handleAddAsAdminChange = () => {
    setAddAsAdmin(!addAsAdmin);
  };

  const handleSelectUser = (selectedUserId, selectedUser) => {
    setUserId(selectedUserId);
    setInputValue(selectedUser);
  };

  const handleAddUser = async () => {
    try {
      if (!updateTeam || !userId) {
        throw new Error('Mutation function or user ID not available');
      }

      await updateTeam({
        id: teamId,
        addUser: userId,
        addAdmin: addAsAdmin ? userId : undefined,
      });

      onClose(true);
    } catch (error) {
      console.error('Error adding user to team:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div ref={modalRef} className=" bg-slate-300 text-slate-800 p-8 rounded-md shadow-md relative w-96">
        <h2 className="text-2xl font-semibold mb-4">Add User to Team</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching user suggestions</p>}
        {isSuccess && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700" htmlFor='user__name'>Username</label>
              <input
                id='user__name'
                type="text"
                value={inputValue}
                onChange={handleUsernameChange}
                className="mt-1 p-2 border rounded-md w-full"
              />
              {userSuggestions.length > 0 && (
                <div>
                  <p className="mt-2">Suggestions:</p>
                  <ul className="list-disc pl-4">

                    {
                      Object.entries(userSuggestions).slice(0, 2).map(entry => (
                        <li
                          key={entry[1]._id}
                          onClick={() => handleSelectUser(entry[1]._id, entry[1].username)}
                          className="text-slate-500 list-none hover:underline cursor-pointer"
                        >
                          {entry[1].username}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="flex items-center" htmlFor='check__box'>
              </label>
                <input
                  id='check__box'
                  type="checkbox"
                  checked={addAsAdmin}
                  onChange={handleAddAsAdminChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-sm">Add as Admin</span>
              
            </div>
            <button
              onClick={handleAddUser}
              key={userId}
              disabled={!inputValue || isUpdatingTeam || isLoading}
              className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800"
            >
              {isUpdatingTeam ? 'Adding...' : 'Add User'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddUserModal;

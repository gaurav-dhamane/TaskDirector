import {
    createSelector,
    createEntityAdapter,
  } from "@reduxjs/toolkit";
  import { apiSlice } from "../../app/api/apiSlice";
  
  const teamsAdapter = createEntityAdapter({});
  
  const initialState = teamsAdapter.getInitialState();
  
  export const teamsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getTeams: builder.query({
        query: (username) => ({
          url: '/teams',
          params: username ,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        }),
        transformResponse: (responseData) => {
          const loadedTeams = responseData.map((team) => {
            team.id = team._id;
            return team;
          });
          return teamsAdapter.setAll(initialState, loadedTeams);
        },
        providesTags: (result, error, arg) => {
          if (result?.ids) {
            return [
              { type: 'Team', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Team', id })),
            ];
          } else return [{ type: 'Team', id: 'LIST' }];
        },
      }),
      addNewTeam: builder.mutation({
        query: (initialTeamData) => ({
          url: '/teams',
          method: 'POST',
          body: {
            ...initialTeamData,
          },
        }),
        invalidatesTags: [
          { type: 'Team', id: "LIST" },
        ],
      }),
      updateTeam: builder.mutation({
        query: (initialTeamData) => ({
          url: '/teams',
          method: 'PATCH',
          body: {
            ...initialTeamData,
          },
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Team', id: arg.id },
        ],
      }),
      deleteTeam: builder.mutation({
        query: ({ id, userId }) => ({
          url: `/teams`,
          method: 'DELETE',
          body: { id , userId},
        }),
        onError: (error, { queryArg, getState, dispatch, requestId, extra }) => {
          return { error, isError: true, isSuccess: false };
        },
        invalidatesTags: (result,error, arg) => [
          { type: 'Team', id: arg.id },
        ],
        
      }),
    }),
  });
  
  export const {
    useGetTeamsQuery,
    useAddNewTeamMutation,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
  } = teamsApiSlice;
  
  // returns the query result object
  export const selectTeamsResult = teamsApiSlice.endpoints.getTeams.select();
  
  // creates memoized selector
  const selectTeamsData = createSelector(
    selectTeamsResult,
    (teamsResult) => teamsResult.data // normalized state object with ids & entities
  );
  
  // getSelectors creates these selectors and we rename them with aliases using destructuring
  export const {
    selectAll: selectAllTeams,
    selectById: selectTeamById,
    selectIds: selectTeamIds,
    // Pass in a selector that returns the teams slice of state
  } = teamsAdapter.getSelectors((state) => selectTeamsData(state) ?? initialState);
  
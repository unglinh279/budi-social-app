import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL Queries and Mutations
const GET_USERS = gql`
  query GetUsers {
    getUsers {
      userId
      name
      email
    }
  }
`;

const GET_FRIENDS = gql`
  query GetFriends($userId: ID!) {
    getFriends(userId: $userId) {
      userId
      friendId
    }
  }
`;

const ADD_FRIEND = gql`
  mutation AddFriend($userId: ID!, $friendId: ID!) {
    addFriend(userId: $userId, friendId: $friendId) {
      userId
      friendId
    }
  }
`;

const REMOVE_FRIEND = gql`
  mutation RemoveFriend($userId: ID!, $friendId: ID!) {
    removeFriend(userId: $userId, friendId: $friendId) {
      userId
      friendId
    }
  }
`;

const SocialApp: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);

  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);
  const { loading: friendsLoading, error: friendsError, data: friendsData, refetch: refetchFriends } = useQuery(GET_FRIENDS, {
    variables: { userId: selectedUser?.userId },
    skip: !selectedUser, // Skip query until a user is selected
  });

  const [addFriendMutation] = useMutation(ADD_FRIEND);
  const [removeFriendMutation] = useMutation(REMOVE_FRIEND);

  useEffect(() => {
    if (selectedUser) {
      refetchFriends();
    }
  }, [selectedUser, refetchFriends]);

  if (usersLoading) return <p>Loading users...</p>;
  if (usersError) return <p>Error loading users: {usersError.message}</p>;
  if (!usersData || !usersData.getUsers) return <p>No users found</p>;

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const user = usersData.getUsers.find((u: any) => u.userId === event.target.value);
    setSelectedUser(user);
    setFriends([]);
  };

  const getFriendName = (friendId: string) => {
    const friend = usersData.getUsers.find((user: any) => user.userId === friendId);
    return friend ? friend.name : "Unknown";
  };

  const addFriend = async (friend: any) => {
    try {
      if (selectedUser.userId === friend.userId) {
        console.error("Cannot add yourself as a friend.");
        return;
      }

      await addFriendMutation({
        variables: {
          userId: selectedUser.userId,
          friendId: friend.userId
        },
      });
      refetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const removeFriend = async (friend: any) => {
    try {
      await removeFriendMutation({
        variables: {
          userId: selectedUser.userId,
          friendId: friend.friendId
        },
      });
      refetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const recommendedFriends = usersData.getUsers.filter((user: any) =>
    user.userId !== selectedUser?.userId &&  // Exclude the current user
    !friendsData?.getFriends?.some((friend: any) => friend.friendId === user.userId)
  );

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h1>Social App</h1>

      {/* Select User Section */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="user-select">Select User:</label>
        <select id="user-select" onChange={handleUserChange} value={selectedUser?.userId || ''}>
          <option value="" disabled>Select a user</option>
          {usersData.getUsers.map((user: any) => (
            <option key={user.userId} value={user.userId}>{user.name}</option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <>
          {/* User Profile Section */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2>{selectedUser.name}</h2>
            <p>Email: {selectedUser.email}</p>
          </div>

          {/* Friends List Section */}
          <div>
            <h2>Friends List</h2>
            {friendsLoading ? (
              <p>Loading friends...</p>
            ) : friendsError ? (
              <p>Error loading friends: {friendsError.message}</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {friendsData?.getFriends?.map((friend: any) => (
                  <li key={friend.friendId}>
                    {getFriendName(friend.friendId)} <button onClick={() => removeFriend(friend)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recommended Friends Section */}
          <div>
            <h2>Recommended Friends</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {recommendedFriends.map((friend: any) => (
                <li key={friend.userId}>
                  {friend.name} <button onClick={() => addFriend(friend)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialApp;

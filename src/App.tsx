import React, { useState } from 'react';

const SocialApp: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 4, name: 'Bob Brown', email: 'bob@example.com' },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [friends, setFriends] = useState<string[]>(['Jane Smith']);
  const recommendedFriends = users.filter(user => !friends.includes(user.name));

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const user = users.find(u => u.id === parseInt(event.target.value));
    if (user) {
      setSelectedUser(user);
      // Optionally, reset the friends list when a new user is selected
      setFriends([]);
    }
  };

  const addFriend = (friend: string) => {
    setFriends([...friends, friend]);
  };

  const removeFriend = (friend: string) => {
    setFriends(friends.filter(f => f !== friend));
  };

  return (
    <div>
      <h1>Social App</h1>

      {/* Select User Section */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="user-select">Select User:</label>
        <select id="user-select" onChange={handleUserChange} value={selectedUser.id}>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* User Profile Section */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>{selectedUser.name}</h2>
        <p>Email: {selectedUser.email}</p>
      </div>

      {/* Friends List Section */}
      <div>
        <h2>Friends List</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {friends.map(friend => (
            <li key={friend}>
              {friend} <button onClick={() => removeFriend(friend)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Friends Section */}
      <div>
        <h2>Recommended Friends</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {recommendedFriends.map(friend => (
            <li key={friend.name}>
              {friend.name} <button onClick={() => addFriend(friend.name)}>Add</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocialApp;

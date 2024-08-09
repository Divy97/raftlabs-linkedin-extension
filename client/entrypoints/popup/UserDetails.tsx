import React from "react";

interface User {
  picture: string;
  name: string;
  email: string;
}

interface UserDetailsProps {
  user: User | null;
  setPage: (page: string) => void;
  loading: boolean;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  setPage,
  loading,
}) => {
  return (
    <div className="user-details-container">
      {loading && <div>Loading...</div>}
      {user && !loading && (
        <>
          <img
            src={user.picture}
            alt={`${user.name}'s profile`}
            className="profile-pic"
          />
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
          <button className="post-button" onClick={() => setPage("postPage")}>
            Post on LinkedIn
          </button>
        </>
      )}
    </div>
  );
};

export default UserDetails;

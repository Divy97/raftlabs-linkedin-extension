import React from "react";

interface HomeProps {
  signInWithLinkedIn: () => void;
}

const Home: React.FC<HomeProps> = ({ signInWithLinkedIn }) => {
  return (
    <div className="home-container">
      <h1>LinkedIn Post Extension</h1>
      <button className="linkedin-button" onClick={signInWithLinkedIn}>
        Login with LinkedIn
      </button>
    </div>
  );
};

export default Home;

import React from "react";
import Post from "../components/Post";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileNavBar from "../components/ProfileNavBar";
import NavBar from "../components/NavBar.jsx";

function Profile(p) {
  return (
    <>
      <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
        <ProfileNavBar />
        <ProfileSidebar />
      </div>
    </>
  );
}

export default Profile;

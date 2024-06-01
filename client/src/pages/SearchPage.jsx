import React from "react";
import "../components/SearchPage.css";
import Logo from "../assets/luto-logo-gradient.png";
import "../pages/Search";
import SearchIcon from "../assets/search-icon.png";
import User from "../assets/profile-picture.png";
import item1 from "../assets/meaty.png";
import item2 from "../assets/vegie.png";
import item3 from "../assets/churros.png";
import item4 from "../assets/shawarma.png";
import item5 from "../assets/bsteak.png";
import item6 from "../assets/beffier.png";

function SearchPage() {
  return (
    <>
      <div>
        <div className="header">
          <div className="logo">
            <button>
              <img src={Logo} />
            </button>
          </div>
          <div className="search-bar">
            <div className="input">
              <h1>What are you looking up?</h1>
              <img src={SearchIcon} alt="" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="user-button">
            <button>
              <h1>User</h1>
              <img src={User} />
            </button>
          </div>
        </div>
        {/**Contents here */}
        <div className="content">
          <h1>Categories</h1>
          <div className="items">
            <img src={item1} alt="" />
          </div>
          <div className="items">
            <img src={item2} alt="" />
          </div>
          <div className="items">
            <img src={item3} alt="" />
          </div>
          <div className="items">
            <img src={item4} alt="" />
          </div>
          <div className="items">
            <img src={item5} alt="" />
          </div>
          <div className="items">
            <img src={item6} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
export default SearchPage;

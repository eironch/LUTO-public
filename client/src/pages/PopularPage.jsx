import React from "react";
import Logo from "../assets/luto-logo-gradient.png";
import SearchIcon from "../assets/search-icon.png";
import User from "../assets/profile-picture.png";
import "../components/Popular.css";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import SaveIcon from "../assets/saved.png";
import Comment from "../assets/comment.png";
import Like from "../assets/liked.png";

function PopularPage() {
  return (
    <>
      <div>
        <div className="navbar">
          <div className="logo">
            <button>
              <img src={Logo} />
            </button>
          </div>
          <div className="search">
            <img src={SearchIcon} alt="search" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user">
            <button>
              <h1>User</h1>
              <img src={User} />
            </button>
          </div>
        </div>

        {/**Contents */}
        <div className="contents">
          <h1>Saved Recipes</h1>
          <div className="item">
            <div className="saved">
              <button>
                <img src={SaveIcon} alt="" />
              </button>
            </div>
            <img src={image1} alt="" />
            <h2>Grill Master's Delight: Juicy Grilled Chop Recipe Revealed!</h2>
            <div className="comment">
              <button>
                <img src={Comment} alt="Comment" />
              </button>
              <button>
                <img src={Like} alt="Like" id="like" />
              </button>
            </div>
          </div>
          <div className="item">
            <div className="saved">
              <button>
                <img src={SaveIcon} alt="" />
              </button>
            </div>
            <img src={image2} alt="" />
            <h2>Special Churros serve with hot chocolate</h2>
            <div className="comment">
              <button>
                <img src={Comment} alt="Comment" />
              </button>
              <button>
                <img src={Like} alt="Like" id="like" />
              </button>
            </div>
          </div>
          <div className="item">
            <div className="saved">
              <button>
                <img src={SaveIcon} alt="" />
              </button>
            </div>
            <img src={image3} alt="" />
            <h2>Creamyyyyyy Beef with Mushroom and BBQ Sauce</h2>
            <div className="comment">
              <button>
                <img src={Comment} alt="Comment" />
              </button>
              <button>
                <img src={Like} alt="Like" id="like" />
              </button>
            </div>
          </div>
          <div className="item">
            <div className="saved">
              <button>
                <img src={SaveIcon} alt="" />
              </button>
            </div>
            <img src={image4} alt="" />
            <h2>One Pot Creamy Cajun Chimcken Pasta</h2>
            <div className="comment">
              <button>
                <img src={Comment} alt="Comment" />
              </button>
              <button>
                <img src={Like} alt="Like" id="like" />
              </button>
            </div>
          </div>
          <div className="item">
            <div className="saved">
              <button>
                <img src={SaveIcon} alt="" />
              </button>
            </div>
            <img src={image5} alt="" />
            <h2>Sauce ng burger steak sa Jollibee Molino</h2>
            <div className="comment">
              <button>
                <img src={Comment} alt="Comment" />
              </button>
              <button>
                <img src={Like} alt="Like" id="like" />
              </button>
            </div>
          </div>
          <div className="item">
            <div className="saved">
              <button>
                <img src={SaveIcon} alt="" />
              </button>
            </div>
            <img src={image6} alt="" />
            <h2>Calderata, Menudo, o Afritada? Description here</h2>
            <div className="comment">
              <button>
                <img src={Comment} alt="Comment" />
              </button>
              <button>
                <img src={Like} alt="Like" id="like" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default PopularPage;

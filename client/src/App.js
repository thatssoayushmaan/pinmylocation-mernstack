import { useState,useEffect } from 'react';
import ReactMapGL, { Marker,Popup } from 'react-map-gl';
import { Room, Star, StarBorder } from "@material-ui/icons";
import axios from 'axios'
import './App.css'
import {format} from 'timeago.js'
import Register from "./components/Register";
import Login from "./components/Login";

export default function Map() {
    const myStorage = window.localStorage
    const [currentUsername, setCurrentUsername] = useState(localStorage.getItem("user"));
    const [pins, setPins] = useState([])
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [star, setStar] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 28.7041,
        longitude: 77.1025,
        zoom: 4
      });

      useEffect(() => {
        const getPins = async () => {
          try {
            const allPins = await axios.get("/pins");
            setPins(allPins.data);
          } catch (err) {
            console.log(err);
          }
        };
        getPins();
      }, []);

      const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
      };

      const handleAddClick = (e) => {
        const [longitude, latitude] = e.lngLat;
        setNewPlace({
          lat: latitude,
          long: longitude,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault()
        const newPin = {
          username: currentUsername,
          title,
          desc,
          rating : star,
          lat: newPlace.lat,
          long: newPlace.long
        }

        try {
          const res = await axios.post('/pins', newPin)
          setPins([...pins, res.data]);
          setNewPlace(null);
        } catch (error) {
          console.log(error)
        }
      }

      const handleLogout = () => {
        setCurrentUsername(null);
        myStorage.removeItem("user");
      };

      // console.log(pins)
      //console.log(newPlace)
    return (
        <>
            <ReactMapGL
                {...viewport}
                width="100vw"
                height="100vh"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                onClick={currentUsername && handleAddClick}
                transitionDuration="200"
              >
                {pins.map((p) => {
                  return (
                  <>
                    <Marker 
                  latitude={p.lat} 
                  longitude={p.long} 
                  offsetLeft={-3.5 * viewport.zoom}
                  offsetTop={-7 * viewport.zoom}
                >
                  <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color : currentUsername === p.username ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id,p.lat,p.long)}
                
                  />
                </Marker>
                {p._id === currentPlaceId && (
                  <Popup
                  latitude={p.lat} 
                  longitude={p.long} 
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor="top" >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="desc">{p.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(p.rating).fill(<Star className="star" />)}
                    </div>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div> 
                </Popup>
                )}
                
                  </>
                  )
                })}

{newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option> 
                  </select>
                  <button type="submit" className="submitButton">
                    Pin this!
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}

{currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}

{showRegister && <Register setShowRegister={setShowRegister} />}

{showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}

            </ReactMapGL>
          

        </>
    )
}

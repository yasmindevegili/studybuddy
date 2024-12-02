import { useState } from "react";
import Modal from "./Modal";
import {useCookies} from "react-cookie"

function ListHeader({ listName, getData }) {
  const [showModal, setShowModal] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(null)  


  const signOut = () => {
    console.log('signOut')
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()
  };


  return (
    <>
      <div className="list-header">
        <h1>{listName}</h1>
        <div className="button-container">
          <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
          <button className="signout" onClick={signOut}>SIGN OUT</button>
        </div>
      </div>
      {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/>}
    </>
  );
  
}
export default ListHeader

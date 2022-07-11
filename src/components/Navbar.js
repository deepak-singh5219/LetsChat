
import react,{useState} from "react";
import { useNavigate } from 'react-router-dom';
import {app,auth,database} from "../firebaseConfig";
import {doc,setDoc,getDoc,addDoc,updateDoc,collection,query,where,onSnapshot, QuerySnapshot,orderBy,Timestamp } from "firebase/firestore";
import {
    Link
  } from "react-router-dom";

 
  import {signOut} from "firebase/auth";

const Navbar = ({setsectionFlag}) => {
    const userId = auth.currentUser.uid;
    const navigate = useNavigate();

    const usersignout = () => {

        signOut(auth)
        .then(()=>{
            updateDoc(doc(database,"users",userId),{
                isOnline:false,
            });
            navigate("/");
        })
        .catch((err)=>{
        console.log(err.message);
        })
    }
    
    const createRoom = () => {
      let roomname=prompt("Enter name for new room");
      
      const collectionRef=collection(database,"Rooms");
      addDoc(collectionRef,{
        roomname
      })
      .catch((err)=> console.log(err.message)
      )

    }

    const [drop,setdrop] = useState(true);
    return(
        <>
        
            <nav className={`z-40 sticky inset-x-0 flex items-center justify-between drop-shadow-3xl flex-wrap bg-gradient-to-r from-dark-100 via-dark-50 to-dark-10 p-4 ${drop?'h-20':''} `}>
  <div class="flex items-center flex-shrink-0 text-white mr-6">
     <img src={require('./assests/logo.png')} className=" transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 w-10 h-10 rounded-full mx-1 mr-3" />
    <span class="font-bold text-xl tracking-tight">LetsChat</span>
  </div>
  <div class="block lg:hidden">
    <button onClick={()=>setdrop(!drop)} class="flex items-center px-3 py-1 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
      <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </button>
  </div>
  <div class={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${drop?'hidden':''}`}>
    <div class="text-sm lg:flex-grow">
      <Link to="/home" class="px-3 md:py-0 sm:px-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 block mt-4 lg:inline-block lg:mt-0 text-lg text-white font-medium hover:text-teal-200 mr-4 cursor-pointer">
        Home
      </Link>
      <Link to="/profile" class="px-3 md:py-0 sm:px-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 block mt-4 lg:inline-block lg:mt-0 text-lg text-white font-medium hover:text-teal-200 mr-4 cursor-pointer">
        Profile
      </Link>
      <a onClick={createRoom} className="px-3 md:py-0 sm:px-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 block mt-4 lg:inline-block lg:mt-0 text-lg text-white font-medium hover:text-teal-200 mr-4 cursor-pointer">
        Create New Room
      </a>
      <a onClick={()=> setsectionFlag(true)} className="px-3 md:py-0 sm:px-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 block mt-4 lg:inline-block lg:mt-0 text-lg text-white font-medium hover:text-teal-200 mr-4 cursor-pointer">
        Rooms
      </a>
      <a onClick={()=> setsectionFlag(false)} className="px-3 md:py-0 sm:px-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 block mt-4 lg:inline-block lg:mt-0 text-lg text-white font-medium hover:text-teal-200 mr-4 cursor-pointer">
        Users
      </a>
      <a onClick={usersignout} class="px-3 md:py-0  sm:px-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 block mt-4 lg:inline-block lg:mt-0 text-lg text-white font-medium hover:text-teal-200 mr-4 cursor-pointer">
        Sign Out
      </a>
      
      
    </div>
    <div className="flex-col lg:py-0 md:py-0 py-3">
    <p className="text-lg text-white"> Time : {(new Date()).toLocaleTimeString()}</p>
            <p className="text-lg text-white"> {(new Date()).toDateString()}</p>
    </div>
  </div>
</nav>    
       
        </>
    )
}

export default Navbar;


import {app,auth,database,storage} from '../firebaseConfig';
import {confirmPasswordReset, signOut } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import {doc,setDoc,getDoc,addDoc,updateDoc,collection,query,where,onSnapshot, QuerySnapshot,orderBy,Timestamp } from "firebase/firestore";
import Userprofile from './Userprofile';
import {ref, uploadBytes, uploadBytesResumable, getDownloadURL,deleteObject} from "firebase/storage";
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import User from './User';
import Loading from './Loading';
import Message from './Message';
import InputEmoji from 'react-input-emoji';
import Room from './Room';
import RoomMessage from './RoomMessage';
import Camera from './svg/Camera';



const Profile = ({userDetails, visible,goback}) => {
    const photoUrl=(userDetails.photoUrl?(userDetails.photoUrl):(require("./assests/profile.png")));

    return(
        <div className={`${visible?'fixed lg:inset-y-1 md:inset-y-2 lg:right-4 lg:left-1/3 inset-x-4 visible duration-500 transform transition-all translate-y-12 ease-out':'invisible'} transition-y-0 overflow-hidden`}>

<div className={`flex items-center justify-center h-2/3 w-scrren mt-1 lg:mt-16 overflow-hidden`}>
        
        <div className={`card bg-slate-100 flex flex-col items-center justify-center p-1 lg:p-5 shadow-lg rounded-xl h-full w-full lg:w-3/5 lg:h-full md:w-2/5 md:h-full`}>
            
           <div className="image my-5 hover:cursor-pointer transform transition duration-500 hover:scale-110 flex items-center justify-center relative mx-auto rounded-full p-1 lg:p-2 w-36 h-36 md:h-44 md:w-44 lg:h-44 lg:w-44">
                 <img className="rounded-full w-full h-full opacity-90 hover:opacity-100" src={photoUrl} alt="profile"/>
             </div>
                
          
            
            <div class="name username text-gray-700 text-xl lg:text-2xl md:text-2xl p-1 hover:cursor-pointer">
                <p>{userDetails.username}</p>
            </div>
            
            <div class="username flex flex-col items-center justify-center p-1 hover:cursor-pointer">
                <p className="text-xl lg:text-2xl md:text-2xl">Email: </p> <p className="text-gray-800 text-2xl font-medium px-1">{userDetails.email}</p>
            </div>
            
            <div class="work flex p-1 flex-col items-center justify-center">
            <p className="text-xl lg:text-2xl md:text-2xl">Since: </p> <p className="text-gray-800 text-2xl font-medium px-1 hover:cursor-pointer">{userDetails.createDate}</p>
            <p className="text-gray-800 text-lg lg:text-xl md:text-2xl font-medium px-1 hover:cursor-pointer">{userDetails.createTime}</p>
            </div>
            <div onClick={goback} className="w-auto mt-4 p-1 my-1 lg:my-3 md:my-2 hover:cursor-pointer">
                        <img src={require('./assests/cross.png')} className="w-full rounded-full shadow-lg opacity-80 hover:opacity-100 transform transition duration-500 hover:scale-110"/>
                    </div>
        </div>
    </div>
        </div>
    
    )
}

const Home = () => {
    const navigate = useNavigate();
    
    const [users,setUsers] = useState({});
    const [flag,setflag] = useState(false);
    const [currentuser,setcurrentuser] = useState({});
    const [media,setmedia] = useState("");

    useEffect(()=>{

    // Fetching users from Firebase
    // creating collection ref
    const docRef=doc(database,"users",auth.currentUser.uid);
    getDoc(docRef)
    .then((response)=>{
        setcurrentuser(response.data());    
    })

    const collectionRef = collection(database,"users");
    // creating query object
    const q = query(collectionRef,where("userId","not-in",[auth.currentUser.uid]));
    // executing query
    const unsub = onSnapshot(q, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        setUsers(users);
        setflag(true);
    });
    
    return () => unsub();
   

    },[]);

 const [rooms,setrooms] = useState({});
 const [roomflag,setroomflag] = useState(false);

    useEffect(() => {

      // creating collection reference for rooms
    const collectionRef = collection(database,"Rooms");
    // creating query
    const q = query(collectionRef);
    const unsub= onSnapshot(q, (querySnapshot) => {
      let rooms = [];
      querySnapshot.forEach((doc) => {
         rooms.push(doc.data());
      });
      setrooms(rooms);
      setroomflag(true);
    })

    console.log(rooms);

    },[]);

    
    const [chat,setchat] = useState({});
    const [userDetails,setuserDetails] = useState({});
    const [visible,setvisible] = useState(false);
const getprofile = (user) => {
    setvisible(true);
    
    setuserDetails(user);
    console.log(user.username);

}

const [chatflag,setchatflag] = useState(false);
const [msgs, setmsgs] = useState({});
const [msgsflag,setmsgsflag] = useState(false);

const selectUser = (user) => {
    
    setchat(user);
    setchatflag(true);
    const user1 = currentuser.userId;
    const user2 = user.userId;
 
    const id = (user1)>(user2)? (`${user1+user2}`):(`${user2+user1}`);
 
    const msgsRef = collection(database,'messages',id,'chat');
    const q = query(msgsRef, orderBy('createdAt','asc'));

    onSnapshot(q, querySnapshot => {
       let msgs = [];
       querySnapshot.forEach(doc => {
          msgs.push(doc.data());
       })
       setmsgs(msgs);
       setmsgsflag(true);
      })   
      
      const docRef = doc(database,"lastMsg",id);

      getDoc(docRef)
      .then((response) => {
         ( (response.data()?.from!==auth.currentUser.uid) && (
         (updateDoc(doc(database,'lastMsg',id),{
            unRead:false
         }))

      )) 
      })
      .catch((err)=>{
         console.log(err.message);
      })
        
   }
   const [roomDetails,setroomDetails] = useState({});
   const [rmsgs,setrmsgs] = useState({});
   

   const selectRoom = (room) => {
      setroomDetails(room);
      setchatflag(true);

      const msgsRef = collection(database,'Rooms',roomDetails.roomname,'messages');
    const q = query(msgsRef, orderBy('createdAt','asc'));

    onSnapshot(q, querySnapshot => {
       let rmsgs = [];
       querySnapshot.forEach(doc => {
          rmsgs.push(doc.data());
          console.log(doc.data());
       })
       setrmsgs(rmsgs);
       
      }) 

   }
   
const [msg,usermsg] = useState('');

const handleSubmit = () => {





  
    
   
   
   const user1 = currentuser.userId;
   const user2 = chat.userId;

   const id = (user1)>(user2)? (`${user1+user2}`):(`${user2+user1}`);


   if(media){
      const mediaRef = ref(storage, `media/${new Date().getTime()}-${media.name}` );
      
      const uploadTask = uploadBytesResumable(mediaRef,media);
      
      uploadTask.on('state_changed',
      (snapshot) => {
          
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          console.log(`Upload is ${progress} % done`);
         
        },
      (error) => {
          console.log(error.message);
          
      },
      () => {
   
          
          console.log("The upload is successful");
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
              
              
            addDoc(collection(database,'messages',id,'chat'), {

               from:user1,
               to:user2,
               createdAt: Timestamp.fromDate(new Date()),
               media:downloadURL
            })
              
   
            
              
   
              })
              
          });
   
          setmedia("");
   
    }

    else {

      addDoc(collection(database,'messages',id,'chat'), {
         msg,
         from:user1,
         to:user2,
         createdAt: Timestamp.fromDate(new Date()),
         media:""
      })
      .catch((err)=>{
         console.log(err.message);
      })
   
      setDoc(doc(database,'lastMsg',id), {
         msg,
         from:user1,
         to:user2,
         unRead:true,
      })
      
      usermsg("");
    }
   

   



}

const [rmsg,setrmsg]=useState('');

const handleRoomSubmit = (e) => {

   e.preventDefault();

   
  

 if(media){
   const mediaRef = ref(storage, `media/${new Date().getTime()}-${media.name}` );
   
   const uploadTask = uploadBytesResumable(mediaRef,media);
   
   uploadTask.on('state_changed',
   (snapshot) => {
       
       const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
       console.log(`Upload is ${progress} % done`);
      
     },
   (error) => {
       console.log(error.message);
       
   },
   () => {

       
       console.log("The upload is successful");
       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
           
           
           
           addDoc(collection(database,'Rooms',roomDetails.roomname,'messages'),{
            
            from:auth.currentUser.uid,
            sender:currentuser.username,
            createdAt : Timestamp.fromDate(new Date()),
            media: downloadURL,
         })

         
           

           })
           
       });

       setmedia("");

 }

 else {
   addDoc(collection(database,'Rooms',roomDetails.roomname,'messages'),{
      rmsg,
      from:auth.currentUser.uid,
      sender:currentuser.username,
      createdAt : Timestamp.fromDate(new Date()),
      media:"",
      
   })
   .catch((err) => {
      console.log(err.message);
   })

   setrmsg("");


 }
   

  
   
   
}


const goback = () => {
    setvisible(false);
}

const [sectionFlag,setsectionFlag]= useState(false);

const photoUrl=(chat.photoUrl?(chat.photoUrl):(require("./assests/profile.png")));

    return(
        <div className="Home bg-white h-screen w-screen overflow-hidden">
            <Navbar setsectionFlag={setsectionFlag}/>
            {
                 (flag && roomflag)?
                  
                 
                 (<div className="app_body flex flex-row">
                
                   
                <div className={`users_section overflow-y-scroll overflow-x-hidden lg:basis-2/6 md:basis-2/6 lg:block lg:blur-none lg:h-200 h-screen border-right-2 bg-white ${chatflag?'hidden':''} ${visible?'blur-sm':''}`}>
                   
                   
                   {

                  (sectionFlag)?   

                 (


                  rooms.map((room) => 
                   <Room room={room} selectRoom={selectRoom}/>)

                 )
                 
                 :
                    
                 (
                     //users
                     users.map((user) => 
                        <User key={user.userId} user={user} getprofile={getprofile} selectUser={selectUser}/>)
        
                    )
                    }
                
                </div>
                <div className={`chat_area lg:basis-4/6 md:basis-4/6 ${chatflag?'':'w-0'}`}>
                 
                  { 
                  (chatflag)?

                   (
                   (sectionFlag)?
                   (
                     <div className={`chat_section flex-1 p-1 lg:p-4 justify-start overflow-hidden lg:w-full flex flex-col h-screen ${chatflag?'w-screen':'w-0'}`}>

                           
                       <div className="header sticky drop-shadow-xl">
                       <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200 bg-slate-200">
      <div class="relative flex items-center space-x-4">
         <div class="relative ml-3">
           
         <img className="h-16 w-16 rounded-full" src={require("./assests/group.png")}/>
         </div>
         <div class="flex flex-col leading-tight">
            <div class="text-2xl mt-1 flex items-center">
               <span class="text-gray-500 mr-3 font-semibold">{roomDetails.roomname}</span>
            </div>
           
         </div>
         <div className="h-6 w-6 fixed right-2" onClick={()=>setchatflag(false)}>
             <img src={require('./assests/cross.png')} className="rounded-full opacity-80 hover:opacity-100 transform transition duration-500 hover:scale-110"/>

         </div>

      </div>
     
   </div>
</div>

<div id="messages" class="flex flex-col space-y-3 lg:p-3 lg:m-3 overflow-y-scroll scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-3/4">
     { 
      
      (!rmsgs.length)?
      (
         null
      )
      :

     (

      rmsgs.map((msg)=>  <RoomMessage msg={msg}/>
      )

     )

     }
      
     
   </div>


<div class="footer sticky bottom-20 w-full m-1">
      <div class="relative flex items-center justify-center">

     

                    <div className="image flex items-center justify-center relative rounded-full" >
                        
                    
                    <img className="h-8 w-8 mx-1 rounded-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:opacity-80" src={require('./assests/uploadIcon.png')}/>
                        
                       
                       <div className="overlay flex items-center justify-center h-full w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 absolute opacity-0 hover:opacity-100">
                            <div>
                                <label htmlFor="photo">
                                    <Camera/>
                                </label>
                        <input className="hidden" accept="image/*" id='photo' type="file" onChange={(e)=> {
                            setmedia(e.target.files[0]);
                            
                        }}/> 
                        </div>
                        </div>
                        
                        
                    </div>
     
         
 <input type="text" placeholder="Write your message!" value={rmsg} onChange={(e)=> setrmsg(e.target.value)} class="w-full lg:mx-4 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 sm:pl-6 bg-gray-200 rounded-md py-3"/>
         
         
         <div class="absolute right-0 items-center inset-y-0 flex">
           <form onSubmit={handleRoomSubmit}>
            <button onClick={handleRoomSubmit} type="submit" class="inline-flex m-2 items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white focus:outline-none">
               <img className="h-8 w-8 lg:h-10 lg:w-10 opacity-80 hover:opacity-100 transform transition duration-500 hover:scale-110 rounded-full" src={require('./assests/send.png')}/>
            </button>
            </form>

         </div>
            
      </div>

{/* <InputEmoji
          value={rmsg}
          onChange={setrmsg}
          cleanOnEnter
          onEnter={handleRoomSubmit}
          placeholder="Type a message"
        /> */}
   </div>

     

       </div>

                   )
                   :
                   (
                     <div className={`chat_section flex-1 p-1 lg:p-4 justify-start overflow-hidden lg:w-full flex flex-col h-screen ${visible?'blur-sm':''} ${chatflag?'w-screen':'w-0'}`}>

                           
                       <div className="header sticky drop-shadow-xl">
                       <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200 bg-slate-200">
      <div class="relative flex items-center space-x-4">
         <div class="relative ml-3">
            <span class={`absolute ${chat.isOnline?'text-green-500':'text-red-500'} right-0 bottom-0`}>
               <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
               </svg>
            </span>
         <img className="h-16 w-16 rounded-full" src={photoUrl}/>
         </div>
         <div class="flex flex-col leading-tight">
            <div class="text-2xl mt-1 flex items-center">
               <span class="text-gray-500 mr-3 font-semibold">{chat.username}</span>
            </div>
            <span class="text-lg text-gray-600">{chat.isOnline?'Online':'Offline'}</span>
         </div>
         <div className="h-6 w-6 fixed right-2" onClick={()=>setchatflag(false)}>
             <img src={require('./assests/cross.png')} className="rounded-full opacity-80 hover:opacity-100 transform transition duration-500 hover:scale-110"/>

         </div>

      </div>
     
   </div>
</div>

<div id="messages" class="flex flex-col space-y-3 lg:p-3 lg:m-3 overflow-y-scroll scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-3/4">
     { 
      
      (!msgs.length)?
      (
         null
      )
      :

     (

      msgs.map((msg,i)=>  <Message msg={msg} key={i} currentuser={currentuser} chat={chat}/>
      )

     )

     }
      
     
   </div>


<div class="footer sticky bottom-20 w-full m-2">
      {/* <div class="relative flex">
         <span class="absolute inset-y-0 flex items-center">
         <button type="button" class="inline-flex items-center justify-center mx-3 rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
            </button>
         </span>
         
         <input type="text" placeholder="Write your message!" value={msg} onChange={(e)=> usermsg(e.target.value)} class="w-full lg:mx-4 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 sm:pl-6 bg-gray-200 rounded-md py-3"/>
         
         
         <div class="absolute right-0 items-center inset-y-0 flex">
            <button type="button" class="inline-flex items-center justify-center rounded-full h-8 w-8 lg:h-10 lg:w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
               </svg>
            </button>
            <button type="button" class="inline-flex items-center justify-center rounded-full h-8 w-8 lg:h-10 lg:w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
               </svg>
            </button>
            <form>
            <button onClick={handleSubmit} type="submit" class="inline-flex m-2 items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white focus:outline-none">
               <img className="h-8 w-8 lg:h-10 lg:w-10 opacity-80 hover:opacity-100 transform transition duration-500 hover:scale-110 rounded-full" src={require('./assests/send.png')}/>
            </button>
            </form>

         </div>
            
      </div> */}

<div className="flex items-center justify-center">
<div className="image flex items-center justify-center relative rounded-full" >
                        
                    
                        <img className="h-8 w-8 mx-1 rounded-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:opacity-80" src={require('./assests/uploadIcon.png')}/>
                            
                           
                           <div className="overlay flex items-center justify-center h-full w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 absolute opacity-0 hover:opacity-100">
                                <div>
                                    <label htmlFor="photo">
                                        <Camera/>
                                    </label>
                            <input className="hidden" accept="image/*" id='photo' type="file" onChange={(e)=> {
                                setmedia(e.target.files[0]);
                                
                            }}/> 
                            </div>
                            </div>
                            
                            
                        </div>
<InputEmoji
          value={msg}
          onChange={usermsg}
          cleanOnEnter
          onEnter={handleSubmit}
          placeholder="Type a message"
        />

    </div>    
   </div>

     

                   </div>

                   )

                   )
                   
                   :

                   (
                       <div className={`${visible?'blur-sm':''}`}>
                           <img className="lg:h-192 lg:w-full lg:overflow-y-hidden h-0 w-0 md:h-0 md:w-0 " src={require("./assests/intro.png")} alt="" />
                         
                       </div>
                   )

                   }
                   
                   <Profile userDetails={userDetails} visible={visible} goback={goback}/>
                   
                </div>
            </div>)
                 :

                 (
                  <div className="flex items-center justify-center mt-52">
                  <Loading/>
                  </div>
                  )
            
}

        </div>
                
    )
}

export default Home;


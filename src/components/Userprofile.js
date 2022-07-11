import react, { useEffect, useState } from "react";
import {auth,database,app,storage} from "../firebaseConfig";
import {Link} from "react-router-dom";
import {doc,getDoc, updateDoc} from "firebase/firestore";
import {ref, uploadBytesResumable, getDownloadURL,deleteObject} from "firebase/storage";
import Camera from './svg/Camera';
import Loading from './Loading';
import Navbar from './Navbar';

const Userprofile = () => {

    const userId = auth.currentUser.uid;
    const [userDetails,setuserDetails]=useState({});
    const photoUrl=(userDetails.photoUrl?(userDetails.photoUrl):(require("./assests/profile.png")));
    const [url,seturl] = useState("");
    const [flag,setflag] = useState(false);
    
    
    
    useEffect(()=>{
     
        const docRef = doc(database,"users",userId);
        getDoc(docRef)
        .then((response)=>{
            console.log(response.data());
            setuserDetails(response.data());
            setflag(true);
        })
        .catch((err)=>{
            console.log(err.message);
        })
      
    },[url]);
    
    
    const uploadphoto = (file) => {
        
        console.log(file);
        const storageRef = ref(storage,`avatars/${auth.currentUser.uid}`);
        if(userDetails.avatarPath)
        {
            deleteObject(ref(storage,userDetails.avatarPath));
        }
        const uploadTask = uploadBytesResumable(storageRef,file);
        
        uploadTask.on('state_changed',
        (snapshot) => {
            
            setflag(false);

         
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            console.log(`Upload is ${progress} % done`);
           
          },
        (error) => {
            console.log(error.message);
            
        },
        () => {

            
            console.log("The upload is successful");
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                
                seturl(downloadURL);
                console.log(`File available at:${downloadURL}`);
                
                updateDoc(doc(database,"users",userId),{
                    photoUrl:downloadURL,
                    avatarPath:`avatar/${auth.currentUser.uid}`,
                })
                
                setflag(true);
            });

        }
        )
        

    }
    return (

      <div className="bg-gradient-to-r from-gradient-1 to-gradient-2 main h-screen w-screen">
          <Navbar/>
      
        {
            (!flag?
                
            (
            <div className="flex items-center justify-center mt-52">
            <Loading/>
            </div>
            )
            
            :
            (
                <div className="flex items-center justify-center mt-1 lg:mt-8">
        
                <div className="card bg-white flex flex-col items-center justify-center p-1 lg:p-5 shadow-lg rounded-xl h-full w-5/6 lg:w-1/5 md:w-2/5 sm:w-auto ">
                    
                   <div className="image my-5 transform transition duration-500 hover:scale-110 flex items-center justify-center hover:opacity-70 relative mx-auto rounded-full p-2 w-44 h-44 md:h-52 md:w-52 lg:h-64 lg:w-64">
                        
                    
                         <img className="rounded-full w-full h-full hover:opacity-30" src={photoUrl} alt="profile"/>
                         
                        
                        <div className="overlay flex items-center justify-center h-full w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 absolute opacity-0 hover:opacity-100">
                             <div>
                                 <label htmlFor="photo">
                                     <Camera/>
                                 </label>
                         <input className="hidden" accept="image/*" id='photo' type="file" onChange={(e)=> {
                             uploadphoto(e.target.files[0])
                         }}/> 
                         </div>
                         </div>
                         
                         
                     </div>
                        
                  
                    
                    <div class="name username text-gray-700 text-2xl p-1 ">
                        <p>{userDetails.username}</p>
                    </div>
                    
                    <div class="username flex flex-col items-center justify-center  p-1">
                        <p className="text-2xl">Email: </p> <p className="text-gray-800 text-2xl font-medium px-1">{auth.currentUser.email}</p>
                    </div>
                    
                    <div class="work flex p-1 flex-col items-center justify-center">
                    <p className="text-2xl">Since: </p> <p className="text-gray-800 text-2xl font-medium px-1">{userDetails.createDate}</p>
                    <p className="text-gray-800 text-xl font-medium px-1 ">{userDetails.createTime}</p>
                    </div>
                    
                    <div className="w-auto mt-4 p-1 my-1 lg:my-3 md:my-2">
                        <Link to="/home" className="bg-blue-500 py-2 px-4 my-3 hover:bg-blue-600 text-white w-full font-semibold rounded-lg shadow-lg">Back</Link>
                    </div>
                </div>
            </div>

            ))
        
       
    }

    </div>
    )
}

export default Userprofile;

import react,{useState,useEffect} from "react";
import {auth} from '../firebaseConfig';
import {onSnapshot,doc} from 'firebase/firestore';
import {database} from '../firebaseConfig';


const User = ({user,getprofile,selectUser}) => {
  const user1 = auth.currentUser.uid;
   const user2 = user.userId;

   
  const [data,setdata] = useState({});

  useEffect(() => {
    const id = (user1)>(user2)? (`${user1+user2}`):(`${user2+user1}`);
    let unsub= onSnapshot(doc(database,'lastMsg',id), (doc) => {
      setdata(doc.data());
    });

    return () => unsub();

  },[]);

  
   return(
       
    
          <div className={`lg:h-28 md:h-28 h-20 m-1 w-screen lg:w-full hover:bg-slate-200 flex items-center gap-2 rounded-lg p-3 text-black shadow cursor-pointer ${(data && (data.from!==auth.currentUser.uid && data.unRead))?"bg-stone-300 font-bold":"bg-slate-100"}`}>
              
              <div onClick={() => getprofile(user)} className="mt-2 px-2">
                <img class="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:opacity-80 w-14 h-14 rounded-full shadow m-2 " src={user.photoUrl?user.photoUrl:(require("./assests/profile.png"))} alt="" srcset="" />
              </div>
              
              <div className="w-screen lg:w-5/6" onClick={() => selectUser(user)}>
               
                <div class="flex items-center justify-between w-full py-1 pr-2">
                  
                  
                    <div class="font-semibold lg:text-2xl md:text-xl text-lg tracking-tight text-slate-500">{user.username}</div>
                    <div className="">
                        {
                            (user.isOnline)?
                            (
                                <span className="pl-1 h-5 w-5 text-green-600 font-semibold rounded-full">
                                Online
                                </span>
                            ):
                            (<span className="pl-1 h-5 w-5 text-red-500 font-semibold rounded-full">
                            Offline
                            </span>)
 
                        }
                      </div>
                   
                 
                 
                </div>
               
                <div class="p-1">
                  <p class="text-gray-600 truncate px-1 text -md lg:text-lg md:text-lg font-small">{data?(data.from===auth.currentUser.uid?(<div className="flex"><p className="font-semibold text-sm flex flex-col px-1 items-center justify-center">Me: </p> <p>{data.msg}</p></div>):(data.msg)):(<p className="font-normal italic">Start Chat</p>)}</p>
                </div>
              </div>
            </div>

       
   )

}

export default User;
import { auth } from "../firebaseConfig";

const RoomMessage = ({msg}) => {
    return(
        <div class="chat-message">
           

        <div className={`flex ${(msg.from===auth.currentUser.uid)?'items-end justify-end':'items-start justify-start'}`}>
           <div class="flex flex-col space-y-2 text-sm lg:text-md max-w-xs mx-1 order-1 items-end">
             
              
                
                
                    <div className={`flex flex-col ${(msg.from===auth.currentUser.uid)?'items-end justify-end':'items-start justify-start'}`}>
                  <span className="text-xxs font-bold">{msg.sender}</span>
                  <span className="flex items-center justify-center">
                    {
                       msg.media?
                       (
                        

                            <a href={msg.media} target="_blank" >
                            <img className="h-56 w-56 lg:h-80 lg:w-80 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:opacity-80" src={msg.media}/>
                            </a>
                        
                       )
                       :
                       (null)
                    }
                  </span>
                  <span>
                    {
                        msg.rmsg?
                        (
                            <p className={`px-4 py-2 rounded-lg inline-block text-white ${(msg.from===auth.currentUser.uid)?'bg-blue-500':'bg-slate-500'}`}>{msg.rmsg}</p> 

                        )
                        :
                        (null)

                    }
                    
                    </span>
           
                  </div>


                
               
           </div>
        </div>
     </div>

    )
}

export default RoomMessage;
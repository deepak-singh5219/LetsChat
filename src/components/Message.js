import react, { useState,useEffect } from 'react';

const Message = ({msg,currentuser,chat,key}) => {

    
    return(

        <div class="chat-message">
           

        <div className={`flex ${(msg.from===currentuser.userId)?'items-end justify-end':'items-start justify-start'}`}>
           <div class="flex flex-col space-y-2 text-sm lg:text-md max-w-xs mx-1 order-1 items-end">
             
              {
                (msg.from===currentuser.userId)?
                (
                    <div className="flex flex-row items-end justify-end">

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
                      msg.msg?
                      (

                        <p class={`px-4 py-2 rounded-lg inline-block bg-blue-500 text-white`}>{msg.msg}</p>
                      )
                      :
                      (null)

                    }
                    
                  </span>
           <img src={currentuser.photoUrl?currentuser.photoUrl:require('./assests/profile.png')} className="h-8 w-8 ml-1 rounded-full"/>
           
                  </div>


                )
                :
                (

                    <div className="flex flex-row items-end justify-end">

           <img src={chat.photoUrl?chat.photoUrl:require('./assests/profile.png')} className="h-8 w-8 mr-1 rounded-full"/>
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
                      msg.msg?
                      (

                        <p class={`px-4 py-2 rounded-lg inline-block bg-green-500 text-white`}>{msg.msg}</p>
                      )
                      :
                      (null)

                    }
                    
                  </span>
           
                  </div>
          
                )
                
                }
           </div>
        </div>
     </div>

    )
}

export default Message;
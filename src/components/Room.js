

const Room = ({room,selectRoom}) => {
    return (

        <div className={`lg:h-28 md:h-28 h-20 m-1 w-screen lg:w-full hover:bg-slate-200 flex items-center gap-2 rounded-lg p-3 text-black shadow cursor-pointer bg-slate-100`}>
              
        
          <img class="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:opacity-80 w-14 h-14 rounded-full shadow m-2 " src={require("./assests/group.png")} alt="" srcset="" />
        
        
        <div className="w-screen lg:w-5/6" onClick={() => selectRoom(room)}>
         
          <div class="flex items-center justify-between w-full py-1 pr-2">
            
            
              <div class="font-semibold lg:text-2xl md:text-xl text-lg tracking-tight text-slate-500">{room.roomname}</div>
           
          </div>
        </div>
      </div>


    )
}

export default Room;
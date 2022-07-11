
import react,{useState} from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {app,auth,database,storage} from '../firebaseConfig';
import {collection,addDoc,updateDoc,setDoc,doc} from 'firebase/firestore';
import {
    BrowserRouter,
    Routes,
    Route,
    Link
  } from "react-router-dom";
  import Home from './Home';
  import Loading from './Loading';

  import { useNavigate } from 'react-router-dom';
import Userprofile from "./Userprofile";

  
  const loginFields=[
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
    {
        labelText:"Username",
        labelFor:"username",
        id:"username",
        name:"username",
        type:"text",
        autoComplete:"username",
        isRequired:true,
        placeholder:"Username"   
    },
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirm-password",
        id:"confirm-password",
        name:"confirm-password",
        type:"password",
        autoComplete:"confirm-password",
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

const Forgotpasswordpage = () => {
  return (
    <div className="bg-white px-8 py-8 rounded-lg">
<Header head="Reset Your Password" button="Login" text="Login Here" path="/" image={require("./assests/forgotPassword.png")}/>
</div>

  )
}

const Header = ({text,button,path,image,head}) => {
  return (
    <div className="mb-10">
            <div className="flex justify-center">
                <img 
                    alt=""
                    className="h-64 w-64"
                    src={image}/>
            </div>
            <h2 className="transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300 mt-6 text-center text-4xl font-extrabold ">
            <span className="">{head}</span>  
            
            </h2>
            <p className="mt-5 text-center text-md text-gray-600 lg:text-xl ">
            {text} 
            <Link to={path} className="transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300 font-medium">
            {button}
            </Link>
            </p>
        </div>

  ) 
}

const Input = ({handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired=false,
  placeholder,
  customClass}) => {

    const fixedInputClass="rounded-md appearance-none relative block w-full mx-2 my-2 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"

  return(
    <div className="my-5">
            <label htmlFor={labelFor} className="sr-only">
              {labelText}
            </label>
            <input
              onChange={handleChange}
              value={value}
              id={id}
              name={name}
              type={type}
              required={isRequired}
              className={fixedInputClass+customClass}
              placeholder={placeholder}
            />
          </div>
  )
}

const user = {};
const Login = () => {
  const fields=loginFields;
  let fieldsState = {};
  fields.forEach(field=>fieldsState[field.id]='');
  const [loginState,setLoginState]=useState(fieldsState);
  const [user, setuser] = useState({});
  const navigate = useNavigate();
  
  
  const handleChange=(e)=>{
    setLoginState({...loginState,[e.target.id]:e.target.value});
   
    
  }
  
  
  const handleSubmit=(e)=>{
    e.preventDefault();
    authenticateUser();
  }
  
  
  const authenticateUser = () =>{
    
    const email=loginState["email-address"];
      const password=loginState["password"];
    
    signInWithEmailAndPassword(auth, email, password)
    .then((response)=>{
    updateDoc(doc(database,"users",response.user.uid),{
      isOnline:true
    })
      console.log(response.user);
      navigate('/home');
    })
    .catch((err)=>{
      alert(err.message);
      console.log(err.message);
    })
}
    return(
        <form className="mt-8 space-y-6">
        <div className="">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
              )
            }

            
        </div>
        <FormExtra/>
        <FormAction handleSubmit={handleSubmit} text="Login"/>
      </form>
    )
}

const Signup = () => {

  const fields=signupFields;
  let fieldsState = {};
  fields.forEach(field=>fieldsState[field.id]='');
  const [loginState,setLoginState]=useState(fieldsState);
  const navigate = useNavigate();
  

  const handleChange= async (e)=>{
    setLoginState({...loginState,[e.target.id]:e.target.value});
   
    
    }

    const handleSubmit=(e)=>{
      e.preventDefault();
      createuser();
      

  }

  
  
  
  const createuser = () =>{

    const email=loginState["email-address"];
      const password=loginState["password"];
      const username = loginState["username"];
      
      createUserWithEmailAndPassword(auth,email,password)
      .then((response) => {
        
        const userId = (response.user).uid;
        
        setDoc(doc(database,"users",userId),{
          username,
          email,
          userId,
          createDate:new Date().toDateString(),
          createTime:new Date().toLocaleTimeString(),
          isOnline:false,
          photoUrl:"",
          
        })
        
        // TODo new collection for each user
    //     const collectionRef = collection (database,userId);
    //     addDoc(collectionRef,{
    //       username,
    //      email,
    //      userId,
    //      createdAt:(new Date()).toDateString()+ (new Date()).toLocaleTimeString(),
    //      isOnline:true
    //  })
     .then((response)=>{
       alert("Sign Up Successfull");
       navigate('/');
         
     })
     .catch((err) => {
         alert(err.message);
         
     });
   })
      .catch((err) => {
        alert(err.message);
        
      })
  }

  return (
   
        <form className="mt-8 space-y-6">
        <div className="">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }

            
        </div>

       
        <FormAction handleSubmit={handleSubmit} text="Sign Up"/>
        
      </form>

  )
}
const FormExtra = () => {
  return (
    <div className="flex items-center justify-end ">
       

        <div className="text-sm">
          <Link to="/forgotpassword" className="font-medium text-blue-500 hover:text-indigo-500">
            Forgot your password?
          </Link>
        </div>
      </div>
  )
}

const FormAction = ({ handleSubmit,text}) => {
  return(
    <>
        <button
            className="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onClick={handleSubmit}>

            {text}
        </button>
    </>
  )
}

const SignUpPage = () => {
    return (
      <div className="bg-white px-8 py-8 rounded-lg">
     <Header text="Already have an account?" head="Create your account" button="Login" path="/" image={require("./assests/login.png")}/>
     <Signup/>
      
      </div>
    )
}

const LoginPage = () => {
  return (
<div className="bg-white rounded-lg p-8 lg:p-10">
<Header text="Don't have an account yet?" head="Welcome to LetsChat" button="Sign Up" path="/signUp" image={require("./assests/login.png")}/>
<Login/>

</div>
  )

}


const Auth = () => {
    return (

      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="space-y-8">
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/signUp" element={<SignUpPage/>}/>
      <Route path="/home" element={<Home user={user}/>} />
      <Route path="/forgotpassword" element={<Forgotpasswordpage/>} />
       <Route path ="/profile" element={<Userprofile/>}/>
    </Routes>
    </BrowserRouter>
    </div>
    </div>
    
    )
}

export default Auth;


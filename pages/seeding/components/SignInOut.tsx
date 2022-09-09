import { GoogleAuthProvider, signInWithRedirect} from "firebase/auth";
const provider = new GoogleAuthProvider();
interface props {
    auth:any
    authState:any
}

export default function SignInOut({auth,authState}:props) {
    const logIn = async () => {
        await signInWithRedirect(auth,provider);
    }
    const logOut = async () => {
        await auth.signOut();
    }
    return (
        <div>
            {authState
                ?<button onClick={logOut}>Log out</button>
                :<button onClick={logIn}>Log in with Google</button>
            }
        </div>
    );
}
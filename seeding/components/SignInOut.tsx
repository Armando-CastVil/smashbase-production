import { GoogleAuthProvider, signInWithRedirect} from "firebase/auth";
import styles from '/styles/Home.module.css'
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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
            {authState
                ?<button  className="btn btn-outline-primary me-2" onClick={logOut}>Log out</button>
                :<button className="btn btn-primary" onClick={logIn}>Log in with Google</button>
            }
        </div>
    );
}
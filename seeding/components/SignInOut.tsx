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
            {authState
                ?<button className={styles.button} onClick={logOut}>Log out</button>
                :<button className={styles.button} onClick={logIn}>Log in with Google</button>
            }
        </div>
    );
}
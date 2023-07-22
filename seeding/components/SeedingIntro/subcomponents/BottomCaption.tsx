import Link from "next/link"
import introStyles from "../../../../styles/Intro.module.css"

const BottomCaption = () => {
    return (
        <div className={introStyles.bottomCaption}>
            <p>
                For more information, check out our algorithm writeup{" "}
                <Link
                    className={introStyles.navLink}
                    href={
                        "https://docs.google.com/document/d/11T_aOBnXXaRH4kFjuH-qUoKLZpaW9oW5ndJfoeLsF3M/edit"
                    }
                    target="_blank"
                >
                    here!
                </Link>
            </p>
            <p></p>
        </div>
    )
}
export default BottomCaption


import stepStyles from "../../../../styles/PlayerListDisplayStep.module.css"
interface props {
    skipToLast: () => void;
  }
export function SkipToLastStep({skipToLast}:props) {
    return (
        <div className={stepStyles.skipMessage} onClick={skipToLast}>
            <p>
                If your bracket is private or you would like to avoid
                separating by carpool or set history, you can &nbsp;
                <a>skip to the last step by clicking here.</a>{" "}
            </p>
        </div>
    )
}
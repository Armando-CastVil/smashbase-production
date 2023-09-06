import InlineMessage from "@atlaskit/inline-message";
import stepStyles from "../../../../styles/FinalStep.module.css"
export default function finalStepWarning()
{
    return(
        <div className={stepStyles.errorMessages}>
              <InlineMessage
                appearance="warning"
                title={
                  <div>
                    <p>
                      Pushing submit will upload this seeding to  your Start.gg event!
                    </p>
                  </div>
                }
              ></InlineMessage>
            </div>
    )
}
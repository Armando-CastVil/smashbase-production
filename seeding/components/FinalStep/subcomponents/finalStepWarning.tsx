import InlineMessage from "@atlaskit/inline-message";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css"
export default function finalStepWarning()
{
    return(
        <div className={globalStyles.errorMessages}>
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
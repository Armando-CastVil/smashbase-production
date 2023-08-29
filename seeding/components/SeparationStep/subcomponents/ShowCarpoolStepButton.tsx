import stepStyles from "../../../../styles/SeparationStep.module.css"
interface props {
    setShowCarpoolPage: (showCarpoolPage: boolean) => void
}
export default function ShowCarpoolStepButton({ setShowCarpoolPage }: props) {
    return (
        <button className={stepStyles.button} onClick={() => setShowCarpoolPage(true)}>
            Handle carpools
        </button>
    )

}
import stepStyles from "../../../../../styles/CarpoolStep.module.css"
interface props {
    setShowCarpoolPage: (showCarpoolPage: boolean) => void;
}
export default function ShowAdvancedSettingsButton({ setShowCarpoolPage }: props) {
    return (
        <button className={stepStyles.button} onClick={() => setShowCarpoolPage(false)}>
            Advanced Settings
        </button>
    )
}
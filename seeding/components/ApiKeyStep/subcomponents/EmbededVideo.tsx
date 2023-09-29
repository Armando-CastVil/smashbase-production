import stepStyles from "../../../../styles/ApiKeyStep.module.css"
const EmbeddedVideo = () => {
    return (
        <div className={stepStyles.vimembed}>
            <iframe
                src="https://player.vimeo.com/video/801722317?h=7bfa580f84&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                width="640"
                height="360"
                allow="autoplay; fullscreen"
                allowFullScreen
            ></iframe>
        </div>
    )
}
export default EmbeddedVideo
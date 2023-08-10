import globalStyles from "/styles/GlobalSeedingStyles.module.css";
export default function Heading()
{
    return(
        <div className={globalStyles.heading}>
        <p>
          Paste your API key from ‎{" "}
          <a href="https://www.start.gg"> Start.gg</a>
        </p>
      </div>
    )
}
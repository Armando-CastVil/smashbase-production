
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/PlayerListDisplayStep.module.css";
import * as imports from "./modules/playerListDisplayStepIndex"
import SeedingFooter from "../SeedingFooter";
import React, { useState } from "react";
import writeToFirebase from "../../modules/writeToFirebase";
import { getAuth } from "firebase/auth";
import { Player } from "../../definitions/seedingTypes";
  // Import the createPage function explicitly from the next module
  import createPage  from "next";
import { useRouter } from "next/router";
const auth = getAuth();


export default function PlayerListDisplayStep({ page, setPage, preavoidancePlayerList, setPreavoidancePlayerList, slug }: imports.playerListDisplayProps) {
  const [shareableLink, setShareableLink] = useState(""); // State to hold the shareable link
  const router = useRouter(); // Next.js router
  const auth = getAuth();
  console.log("Slug in PlayerListDisplayStep:", slug);

  console.log("Slug in PlayerListDisplayStep:", slug);

   // Function to generate a shareable link and navigate to it
  function generateShareableLink() {
    try {
      // Construct the shareable link using a custom path for local testing
      const baseUrl = "http://localhost:3000"; // Replace with your actual local development URL
      const customPath = "/share"; // Replace with the path you want for the shareable page
      console.log("Slug:"+ slug)
      const shareableLink = `${baseUrl}${customPath}?slug=${slug}`;
      setShareableLink(shareableLink); // Update the state with the link

      // Log the generated link to the console
      console.log("Shareable Link:", shareableLink);

      // Open the shareable link in a new window
      const newWindow = window.open(shareableLink, "_blank");
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  }
  
  
  
  
  
  
  

  // Function to copy the shareable link to the clipboard
  function copyShareableLink() {
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert("Shareable link copied to clipboard!");
    });
  }
  //handle submit function
  async function handleSubmit() {
    setPage(page + 1);

    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/skipped", false);
  }

  //handle submit function
  //remove


  return (

    <div className={globalStyles.content}>
      <div className={stepStyles.tableContainer}>
        <imports.PlayerListHeading />
        <imports.playerTable players={preavoidancePlayerList} setPreavoidancePlayerList={setPreavoidancePlayerList} />
      </div>
      {/* Add a button to generate a shareable link */}
      <button onClick={generateShareableLink}>Generate Shareable Link</button>

      <div className={globalStyles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          handleSubmit={handleSubmit}
          isDisabled={preavoidancePlayerList.length == 0}
        ></SeedingFooter>
      </div>
    </div>

  );
}

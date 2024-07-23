import React from 'react'

export default function MakeFrame() {
  return (
    <div>
        <p>The goal of this page is to be able to make a custom frame which each contribution of a project</p>
        <br></br>
        <p>Here is a list of things that need to be done:</p>
        <ul>
            <li>- It will have to be an option for a contribution</li>
            <li>- It will populate the information which is present inside of the contribution into the frame</li>
            <li>- At the start allow them to chose the background color</li>
            <li>- Have all the functionality to create an attestation at the end and connect to the db, i think this is going to be one of the biggest issues, making it so that the apps that spin up have access to the database</li>
        </ul>
        <br></br>
        <br></br>
        <p>
            It will be a template that is made,
            <br></br>
            the repo is cloned and the inputs are put into the template through an api call
            <br></br>
            this will be deployed on vercel, and it will be connected to our database. 
        </p>
        <br></br>
        <p>i think depending on the user that is logged in it will retrieve their projects and which contribution they would like to make the frame absolute
          , then it will have to show the preview using the opengraph images, then it will make the dyanmic route that it was talking about, hopefully
          that is enough to work. 
        </p>
    </div>
    
  )
}

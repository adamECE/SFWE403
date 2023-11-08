"use client";
import { useEffect, useState } from "react";
import SignatureBox from "../components/SignatureBox";
import SignatureCanvas from "react-signature-canvas";

export default function Testing() {
    
    const [sign, setSign] = useState();
    
    // use the url to store the signature, this will be passed back. 
    const [url, setUrl] = useState(); 

  return (
    <div>
        <SignatureBox 
            sign={sign} 
            setSign={setSign}
            setUrl={setUrl} />
        <img src={url}/>
    </div>
  );
}

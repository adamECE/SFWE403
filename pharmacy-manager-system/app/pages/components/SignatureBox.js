'use client'
import { useRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

// data should be initialized in page.js as 
// const [sign, setSign] = useState();
// const [url, setUrl] = useState(); 
export default function SignatureBox({sign, setSign, setUrl, setSigSaved, paid}) {

    const handleClear= () =>{
        sign.clear()
        setSigSaved(false);
        setUrl('')
    }

    const handleGenerate = () =>{
        setUrl(sign.getTrimmedCanvas().toDataURL('image/png'))
        setSigSaved(true);
        //console.log(sign.getTrimmedCanvas().toDataURL('image/png'))
    }

  return (
    <div className="h-80 m-1 items-center justify-center flex flex-col">
        <div style={{
            width:'652px', 
            height:'152px', 
            backgroundColor:'white',
            border: 'solid 2px black'
            }}>
            <SignatureCanvas
                ref = {data=>setSign(data)}
                penColor="black" 
                canvasProps={{
                    width:650, 
                    height: 150, 
                    className: 'signatureCanvas',
                }}
            />
        </div>    
        <div>
            {!paid && <button className="m-2 p-2 border rounded bg-blue-500 text-white"
                onClick={handleClear}
                type="button"
            >
                Clear Signature
            </button> }
            {!paid && <button className="m-2 p-2 border rounded bg-blue-500 text-white"
                onClick={handleGenerate}
                type="button"
            >
                Save Signature
            </button>}
        </div>
        
    </div>
    
  );
}

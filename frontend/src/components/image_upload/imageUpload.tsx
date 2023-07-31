import { useState } from "react";
import { uploadImage } from "../../services/imageHandling";
import { Spinner } from "../spinner/spinner";
import altImage from '../../assets/alt.jpg';

export function ImageUpload() {
    const [image, setImage] = useState<File | null>();
    const [source, setSource] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const img = e.target.files[0]
        setImage(img);
        const url = URL.createObjectURL(img);
        setSource(url);
      }
    };
  
    const onImageUpload = async () => {
      const formData = new FormData();
      if(!image) return
        formData.append('file', image);
        setIsLoading(true);
        await uploadImage(formData).then((res) => {
          if(!res) return
          const byteArray = new Uint8Array(res);
          const charString = byteArray.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          },'');
          const base64String = btoa(charString);
          const image = `data:image/jpeg;base64,${base64String}`;
          setImageData(image)
          setIsLoading(false)
        }).catch(()=>{
            console.error("Error Retreiving Image")
            setIsLoading(false);
        })
    };

    const onReset = () => {
      setImage(null)
      setSource(null)
      setImageData(null)
      const inputRef = document.getElementById('inputRef') as HTMLInputElement
      if(!inputRef) return
      inputRef.value = ''
    }
  
    return (
<div className="h-full flex flex-col gap-4 items-center justify-center">
{isLoading ? <Spinner /> : <></>}
  <div className="flex w-[80vw] justify-center gap-[1rem]">
      <img 
        src= {source ? source : altImage}
        alt= 'Selected Image'
        style={source ? {} : {opacity: 0.55}}
        className="object-contain h-[600px] w-full max-w-[40vw]" // Adjust dimensions as per your requirements
      />
    {imageData && (
      <img 
        src={imageData} 
        alt="Uploaded Image" 
        className="object-contain h-[600px] w-full max-w-[40vw]" // Adjust dimensions as per your requirements
      />
    )}
  </div>

  <input 
    type="file" 
    onChange={onImageChange}
    id="inputRef"
    className="py-3 px-4 rounded-md focus:outline-none uppercase font-bold text-white border-2 border-[#343536]" 
  />
  <div className="flex gap-4 justify-center">
    <button 
      disabled={isLoading}
      className="bg-[#ff4500] text-white rounded-[2rem] px-3 py-2 font-bold hover:bg-[#ff5525] "  
      onClick={onImageUpload}
    >
      Upload Image
    </button>
    <button 
      disabled={isLoading}
      className="bg-[#ff4500] text-white rounded-[2rem] px-3 py-2 font-bold hover:bg-[#ff5525] "  
      onClick={onReset}
    >
      Reset
    </button>
  </div>

</div>

    );
  }
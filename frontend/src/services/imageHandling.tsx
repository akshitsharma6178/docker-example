const url = "https://localhost:3000"

async function uploadImage(formData: FormData){
    try {
        const response = await fetch(`${url}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const arrayBuffer = await response.arrayBuffer();
          return arrayBuffer
        }
      } catch (error) {
        console.error('Error:', error);
      }
}

export { uploadImage }

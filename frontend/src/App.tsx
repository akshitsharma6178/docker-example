import { Header } from './components/header/header'
import { ImageUpload } from './components/image_upload/imageUpload'

function App() {

  return (
    <>
    <div className='bg-[#1A1A1B] flex h-screen justify-between items-center flex-col'>
      <Header/>
      <ImageUpload/>
    </div>
    </>
  )
}

export default App

import Image from "next/image"

const ScreenLoad = () => {
  return (
    <div className="vh-100 flex-column flex-center fs-2" style={{color: "grey"}}>
      <div className="mx-auto mb-5 position-relative" style={{width: "clamp(80px, 10vw, 150px)", aspectRatio: 1}}>
        <Image alt="logo image" priority fill src={"/logo.svg"}/>
      </div>
        Loading...
    </div>
  )
}

export default ScreenLoad
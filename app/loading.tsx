import loader from "@/assets/loader.gif";
import Image from "next/image";

const Loading = () => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Image src={loader} height={150} width={150} alt="loading" />
    </div>
  );
};

export default Loading;

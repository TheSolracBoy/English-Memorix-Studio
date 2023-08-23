import { Button } from "../../Components/Button";
import { SelectImageFolder as SIF } from "../../../wailsjs/go/app/App";
import { LogoSplash } from "../../Components/LogoSplash";
import { useNavigate } from "react-router-dom";

export const SelectImageFolder = () => {
  const navigate = useNavigate()
  async function handleClickSetImageFolder() {
    console.log("asd");

    const result = await SIF();
    if (result=="OK") {
      navigate("/selectMode")
    }
  }
  return (
    <div className="flex h-screen flex-col  items-center  justify-center bg-secondary  ">
      <div className="absolute left-4  top-4 w-32">
        <LogoSplash />
      </div>

      <div className="flex flex-1 flex-col  items-center justify-center">
        <div className="mt-2 flex max-w-md flex-col items-center  justify-center rounded-xl bg-gray-200 px-2 py-2 text-center text-cyan-900 shadow-xl">
          <h1 className="mt-2  text-5xl font-bold text-cyan-900 ">
            Select Image Folder
          </h1>
          <p className="mt-4">
            This is the folder where the system saved previous images for the
            games created.
          </p>
          <p className="mt-2">
            If you haven't created games previously you can create a new folder
            and select it.
          </p>

          <div className="mt-4 flex flex-col items-center justify-center">
            <Button onClick={handleClickSetImageFolder}>
              Select Image Folder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

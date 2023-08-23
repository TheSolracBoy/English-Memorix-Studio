import { redirect, useNavigate } from "react-router-dom";
import { CreateDatabase, SetDatabase } from "../../../wailsjs/go/app/App";
import { Button } from "../../Components/Button";
import { LogoSplash } from "../../Components/LogoSplash";

//
export const SelectDatabase = () => {
  const navigate = useNavigate();
  async function handleClickSetDatabae() {
    const result = await SetDatabase();
    if (result == "OK") {
      navigate("/selectImageFolder");
    }
  }

  async function handleClickCreateDatabase() {
    const result = await CreateDatabase();
    if (result == "OK") {
      navigate("/selectImageFolder");
    }
  }

  return (
    <div className="flex h-screen flex-col  items-center  justify-center bg-secondary  ">
      <div className="">
        <LogoSplash />
      </div>
      <div className=" flex flex-col items-center justify-center">
        <h1 className="mt-2  text-3xl font-bold text-cyan-900 ">
          Select database
        </h1>

        <div className="mt-4 flex flex-col items-center justify-center">
          <Button onClick={handleClickSetDatabae}>Select Database file</Button>
          <span className="font-semibold text-cyan-900">or</span>
          <Button onClick={handleClickCreateDatabase}>
            Create New Database file
          </Button>
        </div>
      </div>
    </div>
  );
};

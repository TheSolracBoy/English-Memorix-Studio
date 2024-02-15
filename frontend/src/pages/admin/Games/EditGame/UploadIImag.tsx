import { Coordinates, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { ChangeEvent, useRef, useState } from "react";
import { CropperRef } from "react-advanced-cropper";
import { Button, Input } from "@nextui-org/react";

import { Image } from "@/models/index";
import { LoadImageFromFile } from "../../../../../wailsjs/go/app/App";

interface Props {
  image: Image | null;
  handleSetImage: (image: Image | null) => void;
}
export default function UploadImage(props: Props) {
  const cropperRef = useRef<CropperRef>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [tempImage, setTempImage] = useState<Image | null>(props.image);

  const onCrop = () => {
    if (cropperRef.current) {
      setCoordinates(cropperRef.current.getCoordinates());
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        props.handleSetImage({
          src: canvas.toDataURL(canvas.toDataURL()),
          type: props.image?.type,
        });
      }
    }
  };

  const onLoadImage = async () => {

    const file = await LoadImageFromFile()
    console.log(file)

    const urlBase64 = "data:" +file.type +";base64," +file.base64


    props.handleSetImage({
      src: urlBase64,
      type: file.type
    });
    setTempImage({
      src: urlBase64,
      type: file.type
    });
  }



return (
  <div className="">
    {props.image !== null && (
      <Cropper
        ref={cropperRef}
        className=""
        src={tempImage && tempImage.src}
      />
    )}
      <div className="flex flex-col items-center">
    {props.image === null && (
      <Button onClick={onLoadImage} size="sm" className="w-44 self-center" >Select image</Button>
    )}
    <div className="mt-2 flex justify-center  gap-2 ">
      <Button
        size="sm"
        onClick={() => {
          props.handleSetImage(null);
        }}
      >
        Change image
      </Button>

      <Button
        size="sm"
        onClick={() => {
          onCrop();
        }}
      >
        Resize
      </Button>
      </div>
    </div>
  </div>
);
}

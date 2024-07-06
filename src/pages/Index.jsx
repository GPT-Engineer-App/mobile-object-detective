import React, { useRef, useCallback } from "react";
import { RNCamera } from "react-native-camera";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Button } from "@/components/ui/button";

const Index = () => {
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof cameraRef.current !== "undefined" &&
      cameraRef.current !== null &&
      cameraRef.current.state.isAuthorized
    ) {
      const options = { quality: 0.8, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const image = new Image();
      image.src = `data:image/jpeg;base64,${data.base64}`;

      const obj = await net.detect(image);

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  const drawRect = (detections, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    detections.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const text = prediction.class;

      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.font = "18px Arial";
      ctx.fillStyle = "#00FFFF";
      ctx.fillText(text, x, y);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-4">Object Detection</h1>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1, width: "100%" }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
      />
      <canvas
        ref={canvasRef}
        className="mx-auto object-cover w-full h-[400px] absolute"
      />
      <Button onClick={runCoco} className="mt-4">
        Start Detection
      </Button>
    </div>
  );
};

export default Index;
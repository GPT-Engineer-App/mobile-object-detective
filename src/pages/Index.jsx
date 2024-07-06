import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Coco SSD model loaded.");
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const obj = await net.detect(video);

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

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-4">Object Detection</h1>
      <Webcam
        videoConstraints={{ facingMode }}
        ref={webcamRef}
        style={{ width: "100%", height: "auto" }}
      />
      <canvas
        ref={canvasRef}
        className="mx-auto object-cover w-full h-[400px] absolute"
      />
      <Button onClick={runCoco} className="mt-4">
        Start Detection
      </Button>
    <Button onClick={toggleCamera} className="mt-4">
        Toggle Camera
      </Button>
    </div>
  );
};

export default Index;
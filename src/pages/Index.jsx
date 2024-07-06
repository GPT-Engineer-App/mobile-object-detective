import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Button } from "@/components/ui/button";

const Index = () => {
  const webcamRef = useRef(null);
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
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-4">Object Detection</h1>
      <Webcam
        ref={webcamRef}
        muted={true}
        className="mx-auto object-cover w-full h-[400px]"
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
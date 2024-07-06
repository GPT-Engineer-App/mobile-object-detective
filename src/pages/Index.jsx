import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setObjects } from "../store/slices/detectionSlice";

const Index = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const objects = useSelector((state) => state.detection.objects);
  const count = useSelector((state) => state.detection.count);

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
      dispatch(setObjects(obj));

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
      <Webcam ref={webcamRef} style={{ width: "100%", height: "auto" }} />
      <canvas
        ref={canvasRef}
        className="mx-auto object-cover w-full h-[400px] absolute"
      />
      <Button onClick={runCoco} className="mt-4">
        Start Detection
      </Button>
      <div className="mt-4">
        <h2 className="text-xl">Detected Objects: {count}</h2>
        <ul>
          {objects.map((obj, index) => (
            <li key={index}>{obj.class}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
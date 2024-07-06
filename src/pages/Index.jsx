import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [facingMode, setFacingMode] = useState("user");
  const [isCameraActive, setIsCameraActive] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      const net = await cocossd.load();
      setModel(net);
      console.log("Coco SSD model loaded.");
    };
    loadModel();
  }, []);

  const runCoco = () => {
    if (model) {
      setInterval(() => {
        if (isCameraActive) {
          detect(model);
        }
      }, 10);
    }
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
      trackObjects(obj);
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

  const trackObjects = (detections) => {
    const newTrackingData = detections.map((detection) => ({
      class: detection.class,
      bbox: detection.bbox,
      score: detection.score,
    }));
    setTrackingData((prevData) => [...prevData, ...newTrackingData]);
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Object Detection and Tracking</h1>
      {isCameraActive && (
        <Webcam
          videoConstraints={{ facingMode }}
          ref={webcamRef}
          style={{ width: "100%", height: "auto" }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="mx-auto object-cover w-full h-[400px] absolute"
      />
      <div className="flex flex-col space-y-4 mt-4">
        <Button onClick={runCoco}>Start Detection</Button>
        <Button onClick={toggleCamera}>Toggle Camera</Button>
        <Button onClick={stopCamera}>Stop Camera</Button>
      </div>
    </div>
  );
};

export default Index;
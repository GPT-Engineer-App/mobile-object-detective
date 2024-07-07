import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "../contexts/AnalyticsContext";

// Function to load the model
const loadModel = async () => {
  const modelJson = require('./model/model.json');
  const modelWeights = require('./model/weights.bin');
  const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
  return model;
};

// Function to detect objects
const detectObjects = async (imageData) => {
  const model = await loadModel();
  const inputTensor = tf.browser.fromPixels(imageData);
  const predictions = await model.executeAsync(inputTensor);
  return processPredictions(predictions);
};

// Function to process predictions
const processPredictions = (predictions) => {
  const objects = [];
  predictions.forEach(prediction => {
    const className = prediction.class;
    const count = prediction.count;
    objects.push({ class: className, count });
  });
  return objects;
};

// Function to preprocess image
const preprocessImage = (imageData) => {
  const enhancedImage = applyHistogramEqualization(imageData);
  return enhancedImage;
};

// Function to handle camera stream
const handleCameraStream = async ({ data }) => {
  const enhancedImage = preprocessImage(data);
  const objects = await detectObjects(enhancedImage);
  setDetections(objects);
};

const Index = () => {
  const { addAnalyticsData } = useAnalytics();
  const [facingMode, setFacingMode] = useState("user");
  const [isCameraActive, setIsCameraActive] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [trackingData, setTrackingData] = useState([]);

  const runCoco = () => {
    if (isCameraActive) {
      setInterval(() => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          handleCameraStream({ data: webcamRef.current.video });
        }
      }, 10);
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
    addAnalyticsData(newTrackingData);
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
import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "../contexts/AnalyticsContext";

const loadModel = async () => {
  const modelJson = require('./model/model.json');
  const modelWeights = require('./model/weights.bin');
  const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
  console.log("Custom model loaded.");
  return model;
};

const Index = () => {
  const { addAnalyticsData } = useAnalytics();
  const [facingMode, setFacingMode] = useState("user");
  const [isCameraActive, setIsCameraActive] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    const initializeModel = async () => {
      const loadedModel = await loadModel();
      setModel(loadedModel);
    };
    initializeModel();
  }, []);

  const detectObjects = async (imageData) => {
    const inputTensor = tf.browser.fromPixels(imageData);
    const predictions = await model.executeAsync(inputTensor);
    return processPredictions(predictions);
  };

  const processPredictions = (predictions) => {
    const objects = [];
    predictions.forEach(prediction => {
      const className = prediction.class;
      const count = prediction.count;
      objects.push({ class: className, count });
    });
    return objects;
  };

  const preprocessImage = (imageData) => {
    const enhancedImage = applyHistogramEqualization(imageData);
    return enhancedImage;
  };

  const handleCameraStream = async ({ data }) => {
    const enhancedImage = preprocessImage(data);
    const objects = await detectObjects(enhancedImage);
    setDetections(objects);
  };

  const applyHistogramEqualization = (imageData) => {
    return imageData; // Placeholder, replace with actual implementation
  };

  const setDetections = (objects) => {
    console.log(objects); // Placeholder, replace with actual implementation
  };

  const runCoco = () => {
    if (model) {
      setInterval(() => {
        if (isCameraActive) {
          handleCameraStream({ data: webcamRef.current.video });
        }
      }, 10);
    }
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
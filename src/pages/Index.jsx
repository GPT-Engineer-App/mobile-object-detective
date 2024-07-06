import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import modelJson from "../model/model.json";
import modelWeights from "../model/weights.bin";
import { useAnalytics } from "../contexts/AnalyticsContext";

const Index = () => {
  const { addAnalyticsData } = useAnalytics();
  const [facingMode, setFacingMode] = useState("user");
  const [isCameraActive, setIsCameraActive] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      const model = await tf.loadGraphModel(tf.io.browserFiles([modelJson, modelWeights]));
      setModel(model);
      console.log("TensorFlow model loaded.");
    };
    loadModel();
  }, []);

  const detectObjects = async (imageData) => {
    const model = await loadModel();
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

  const runCoco = () => {
    if (model) {
      setInterval(async () => {
        if (isCameraActive) {
          const video = webcamRef.current.video;
          const objects = await detectObjects(video);
          setTrackingData(objects);
        }
      }, 10);
    }
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
    </div>
  );
};

export default Index;
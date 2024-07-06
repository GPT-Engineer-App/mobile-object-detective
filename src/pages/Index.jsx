import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadGraphModel('path/to/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

  const detectObjects = async () => {
    if (webcamRef.current && model) {
      const video = webcamRef.current.video;
      const img = tf.browser.fromPixels(video);
      const predictions = await model.executeAsync(img);
      // Handle predictions
      img.dispose();
    }
  };

  useEffect(() => {
    const interval = setInterval(detectObjects, 1000);
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div className="camera-container">
      <Webcam ref={webcamRef} className="mx-auto object-cover w-full h-[400px]" />
    </div>
  );
};

const Index = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl">Object Detection App</h1>
      <CameraComponent />
    </div>
  );
};

export default Index;
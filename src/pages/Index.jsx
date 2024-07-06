import React, { useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const Index = () => {
  const webcamRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await cocoSsd.load();
    };

    loadModel();
  }, []);

  const handleFrame = useCallback(async () => {
    if (webcamRef.current && modelRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        const inputTensor = tf.browser.fromPixels(img);
        const predictions = await modelRef.current.detect(inputTensor);
        // Process the predictions as needed
      };
    }
  }, [webcamRef, modelRef]);

  return (
    <div className="text-center">
      <h1 className="text-3xl">Object Detection App</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="mx-auto object-cover w-full h-[400px]"
        onUserMedia={handleFrame}
      />
    </div>
  );
};

export default Index;

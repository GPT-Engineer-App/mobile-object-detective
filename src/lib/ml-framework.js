import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let model;

export const loadModel = async () => {
  model = await cocoSsd.load();
};

export const detectObjects = async (imageData) => {
  if (!model) {
    await loadModel();
  }

  const img = new Image();
  img.src = imageData;

  return new Promise((resolve) => {
    img.onload = async () => {
      const predictions = await model.detect(img);
      resolve(predictions.map(prediction => ({
        label: prediction.class,
        confidence: prediction.score,
      })));
    };
  });
};
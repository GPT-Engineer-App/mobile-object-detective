import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";

const TrainModel = () => {
  const [trainingStatus, setTrainingStatus] = useState("");

  const trainModel = async () => {
    setTrainingStatus("Training...");

    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Compile the model
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    // Prepare the training data
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // Train the model
    await model.fit(xs, ys, { epochs: 10 });

    setTrainingStatus("Training completed");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-4">Train Model</h1>
      <Button onClick={trainModel}>Start Training</Button>
      <p>{trainingStatus}</p>
    </div>
  );
};

export default TrainModel;
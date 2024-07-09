import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrainModel = () => {
  const [dataset, setDataset] = useState(null);
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(10);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();

  const handleDatasetUpload = (event) => {
    const file = event.target.files[0];
    setDataset(file);
    toast({
      title: "Dataset uploaded",
      description: `File: ${file.name}`,
    });
  };

  const handleTrainModel = () => {
    if (!dataset) {
      toast({
        title: "Error",
        description: "Please upload a dataset first.",
        variant: "destructive",
      });
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Mock training process
    const interval = setInterval(() => {
      setTrainingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast({
            title: "Training complete",
            description: "Your model has been successfully trained.",
          });
          return 100;
        }
        return prevProgress + 10;
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Train Model</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dataset Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="dataset-upload">Upload Dataset</Label>
            <Input
              id="dataset-upload"
              type="file"
              onChange={handleDatasetUpload}
              className="mt-2"
            />
            {dataset && (
              <p className="mt-2 text-sm text-gray-500">
                Selected dataset: {dataset.name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="learning-rate">Learning Rate: {learningRate}</Label>
              <Slider
                id="learning-rate"
                min={0.0001}
                max={0.01}
                step={0.0001}
                value={[learningRate]}
                onValueChange={(value) => setLearningRate(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="batch-size">Batch Size: {batchSize}</Label>
              <Slider
                id="batch-size"
                min={1}
                max={128}
                step={1}
                value={[batchSize]}
                onValueChange={(value) => setBatchSize(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="epochs">Epochs: {epochs}</Label>
              <Slider
                id="epochs"
                min={1}
                max={100}
                step={1}
                value={[epochs]}
                onValueChange={(value) => setEpochs(value[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={trainingProgress} className="mb-4" />
            <Button onClick={handleTrainModel} disabled={isTraining}>
              {isTraining ? "Training..." : "Start Training"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainModel;
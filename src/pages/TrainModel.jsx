import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const fetchDatasets = async () => {
  const response = await fetch("/api/datasets");
  if (!response.ok) {
    throw new Error("Failed to fetch datasets");
  }
  return response.json();
};

const TrainModel = () => {
  const { data: datasets, error, isLoading } = useQuery({
    queryKey: ["datasets"],
    queryFn: fetchDatasets,
  });
  const [selectedDataset, setSelectedDataset] = useState(null);

  const handleDatasetChange = (value) => {
    setSelectedDataset(value);
  };

  const handleTrainModel = () => {
    // Implement model training logic here
    console.log("Training model with dataset:", selectedDataset);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Train Model</h1>
      {isLoading && <p>Loading datasets...</p>}
      {error && <p>Error loading datasets: {error.message}</p>}
      {datasets && (
        <Select onValueChange={handleDatasetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a dataset" />
          </SelectTrigger>
          <SelectContent>
            {datasets.map((dataset) => (
              <SelectItem key={dataset.id} value={dataset.id}>
                {dataset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button onClick={handleTrainModel} className="mt-4">
        Train Model
      </Button>
    </div>
  );
};

export default TrainModel;
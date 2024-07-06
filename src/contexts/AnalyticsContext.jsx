import React, { createContext, useContext, useState } from "react";

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState([]);

  const addAnalyticsData = (data) => {
    setAnalyticsData((prevData) => [...prevData, data]);
  };

  const value = {
    analyticsData,
    addAnalyticsData,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};
import React, { useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import MapPresenter from "./MapPresenter";

const { width, height } = Dimensions.get("screen");

export default ({ rooms }) => {
  const mapRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const onScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }) => {
    const position = Math.abs(Math.round(x / width));
    setCurrentIndex(position);
  };
  useEffect(() => {
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: parseFloat(rooms[currentIndex].lat),
          longitude: parseFloat(rooms[currentIndex].lng),
        },
        altitude: 1000,
        pitch: 0,
        heading: 0,
        zoom: 15,
      },
      { duration: 1000 }
    );
  }, [currentIndex]);
  return (
    <MapPresenter
      rooms={rooms}
      mapRef={mapRef}
      currentIndex={currentIndex}
      onScroll={onScroll}
    />
  );
};

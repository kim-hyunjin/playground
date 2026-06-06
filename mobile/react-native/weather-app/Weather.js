import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const weatherOptions = {
  Haze: {
    iconName: "weather-hazy",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "Haze",
    subtitle: "연무가 짙게 낀 날씨입니다"
  },
  Thunderstorm: {
    iconName: "weather-lightning",
    gradient: ["#373B44", "#4286f4"],
    title: "Thunderstorm",
    subtitle: "번개가 칩니다"
  },
  Drizzle: {
    iconName: "cloud-drizzle",
    gradient: ["#89F7FE", "#66A6FF"],
    title: "Drizzle",
    subtitle: "이슬비가 내려요"
  },
  Rain: {
    iconName: "weather-rainy",
    gradient: ["#7DE2FC", "#B9B6E5"],
    title: "Rain",
    subtitle: "배가 내려요"
  },
  Snow: {
    iconName: "weather-snowy",
    gradient: ["#7DE2FC", "#B9B6E5"],
    title: "Snow",
    subtitle: "눈이 내려요"
  },
  Atmosphere: {
    iconName: "weather-windy",
    gradient: ["#89F7FE", "#66A6FF"],
    title: "Atmosphere",
    subtitle: "바람이 많이 부네요"
  },
  Clear: {
    iconName: "weather-sunny",
    gradient: ["#FF7300", "#FEF253"],
    title: "Clear",
    subtitle: "맑은 날씨입니다"
  },
  Clouds: {
    iconName: "weather-cloudy",
    gradient: ["#D7D2CC", "#304352"],
    title: "Clouds",
    subtitle: "구름이 잔뜩 낀 날씨입니다"
  },
  Mist: {
    iconName: "weather-fog",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "Mist",
    subtitle: "안개가 자욱하네요"
  },
  Dust: {
    iconName: "weather-cloudy",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "Dust",
    subtitle: "먼지 조심하세요"
  }
};

export default function Weather({temp, condition}) {
  return (
    <LinearGradient colors={weatherOptions[condition].gradient} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.halfContainer}>
        <MaterialCommunityIcons size={96} name={weatherOptions[condition].iconName} color="white" />
        <Text style={styles.temp}>{temp}℃</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{weatherOptions[condition].title}</Text>
        <Text style={styles.subtitle}>
          {weatherOptions[condition].subtitle}
        </Text>
      </View>
    </LinearGradient>
  );
}

Weather.propTypes = {
  temp: PropTypes.number.isRequired,
  condition: PropTypes.oneOf([
    "Thunderstorm",
    "Drizzle",
    "Rain",
    "Snow",
    "Atmosphere",
    "Clear",
    "Clouds",
    "Haze",
    "Mist",
    "Dust"
  ]).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  temp: {
    fontSize: 42,
    color: "white"
  },
  halfContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 44,
    fontWeight: "300",
    marginBottom: 10,
    textAlign: 'left'
  },
  subtitle: {
    fontWeight: "600",
    color: "white",
    fontSize: 24,
    textAlign: 'left'
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: "flex-start"
  }
});
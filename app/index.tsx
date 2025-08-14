import { Fontisto } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const icons = {
  "Clouds": "cloudy",
  "Clear": "day-sunny",
  "Rain": "rains",
  "Snow": "snow",
  "Drizzle": "rain",
  "Thunderstorm": "lightning",
  "Mist": "cloudy",
}

export default function Index() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWheather = async() => {
    await Location.requestForegroundPermissionsAsync();
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) setOk(false);

    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({latitude, longitude});
    setCity(location[0].city || "Loading...");

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.list.filter((weather: any) => weather.dt_txt.includes("00:00:00")));
  }

  useEffect(() => {
    getWheather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled indicatorStyle="black" contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{marginTop: 10}} />
          </View>
        ) : (
          days.map((day: any, index: number) => (
            <View style={styles.day} key={index}>
              <View style={{flexDirection: "row", alignItems: "center", width: "90%", justifyContent: "space-between"}}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main as keyof typeof icons]} size={68} color="white" />
              </View>
              <Text style={styles.main}>{day.weather[0].main}</Text>
              <Text style={styles.description}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 130,
    marginTop: 50,
  },
  main: {
    fontSize: 60,
  },
  description: {
    fontSize: 20,
  },
})
export const fetchWeather = async (lat, lon) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/weather?lat=${lat}&lon=${lon}`);
  // const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/weather?lat=51.5&lon=-0.1`); // Londres
  // const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/weather?lat=60.39&lon=5.32`); // Bergen
  if (!res.ok) {
    console.log("Unable to fetch weather");
    return null;
  }
  const data = await res.json();
  //console.log("weather data:", data); 
  return {
    temp: Math.round(data.temp),
    clouds: data.clouds,
    // clouds: 71,
    visibility: data.visibility,
  };
};
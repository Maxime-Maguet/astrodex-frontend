export const fetchWeather = async (lat, lon) => {
 const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/weather?lat=${lat}&lon=${lon}`);

  if (!res.ok) {
    console.log("Unable to fetch weather");
    return null;
  }

  const data = await res.json();

  return {
    temp: data.main.temp,
    clouds: data.clouds.all,
    visibility: data.visibility,
  };
};
export const fetchWeather = async (lat, lon) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/weather?lat=${lat}&lon=${lon}`,
  );

  if (!res.ok) {
    return null;
  }
  const data = await res.json();

  return {
    temp: Math.round(data.temp),
    clouds: data.clouds,
    // clouds: 71,
    visibility: data.visibility,
  };
};

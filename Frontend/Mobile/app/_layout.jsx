import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }}/>
      <Stack.Screen name="sign-in" options={{headerShown: true}}/>
      <Stack.Screen name="(Screens)" options={{headerShown: false}}/>
      <Stack.Screen name="register" options={{headerShown: true}}/>

    </Stack>
  );
}

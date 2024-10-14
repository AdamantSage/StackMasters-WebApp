// layout.jsx
import { Stack } from "expo-router";
import { AssignmentProvider } from '@/components/assignmentContext';

export default function RootLayout() {
  return (
    <AssignmentProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="sign-in" options={{ headerShown: true }} />
        <Stack.Screen name="(Screens)" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: true }} />
        <Stack.Screen name="exportMarks" options={{ headerShown: true }} />
      </Stack>
    </AssignmentProvider>
  );
}


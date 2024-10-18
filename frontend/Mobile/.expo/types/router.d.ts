/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(Screens)` | `/(Screens)/assignments` | `/(Screens)/home` | `/(Screens)/profile` | `/(Screens)/submission` | `/_sitemap` | `/assignments` | `/assignmentsDisplay` | `/comp/FeedbackDisplay` | `/exportMarks` | `/home` | `/profile` | `/register` | `/sign-in` | `/submission` | `/utils` | `/videoRecorder`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

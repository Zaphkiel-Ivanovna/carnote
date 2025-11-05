/**
 * Root Index - Redirects to CarNote App
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/carnote/(tabs)" />;
}

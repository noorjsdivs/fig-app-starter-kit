import { Redirect } from 'expo-router';

/** Every launch starts on sign in for now. The splash and onboarding take over this route next. */
export default function Index() {
  return <Redirect href="/login" />;
}

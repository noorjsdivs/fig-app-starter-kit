import { Redirect } from 'expo-router';

import { useApp } from '@/store/app-store';

// Until the sign-in screens exist, every launch starts signed in as the demo customer.
useApp.getState().signIn();

/** Straight to the tabs for now. The splash and onboarding take over this route later. */
export default function Index() {
  return <Redirect href="/home" />;
}

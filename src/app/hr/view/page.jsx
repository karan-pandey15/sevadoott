import { redirect } from 'next/navigation';

/**
 * /hr/view — Entry point for the HR Partner System.
 * Unconditionally redirects to the partner login page with the Login tab active.
 * Requirement 1.1
 */
export default function HRViewPage() {
  redirect('/partner/login?tab=login');
}

import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to market page as the main page
  redirect('/market')
}


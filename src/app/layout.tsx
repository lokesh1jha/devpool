
import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
// import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Job Portal',
  description: 'Find your dream job or perfect candidate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode  
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Can still use SessionProvider here */}
        {/* <SessionProvider> */}
          <Navbar />
          {children}
        {/* </SessionProvider> */}
      </body>
    </html>
  )
}


/*
use 
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <p>Signed in as {session.user?.email}</p>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
};


server-side rendering use like 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions);
  return {
    props: { session },
  };
}
*/
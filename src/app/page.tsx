import type { NextPage } from 'next'
import Head from 'next/head'
import TranscriptionComponent from '@/app/components/TranscriptionComponent'

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Deepgram Transcription Demo</title>
        <meta name="description" content="Deepgram transcription demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-8">
        <TranscriptionComponent />
      </main>
    </div>
  )
}

export default Home
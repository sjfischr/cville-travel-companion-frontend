export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-extrabold text-blue-600">Chat with Sam</h1>
      <p className="text-lg text-gray-600">
        Your beer-savvy Charlottesville travel companion is ready.
      </p>
      <a
        href="/chat"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Start Chatting
      </a>
    </main>
  )
}

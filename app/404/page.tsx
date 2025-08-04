// app/404/page.tsx
export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-2">😕 404 — Page Not Found</h1>
      <p className="text-lg text-gray-600">
        Sorry, that page doesn’t exist.
      </p>
    </div>
  );
}

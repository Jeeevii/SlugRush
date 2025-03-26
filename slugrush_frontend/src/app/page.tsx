import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to SlugRush</h1>
        <p className="text-lg text-gray-600 mt-4">
          Your real-time UCSC Gym crowd tracker. Plan your workouts with ease!
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Current Gym Status</h2>
        <div className="bg-green-100 p-4 rounded-md">
          <h3 className="text-xl text-green-700">The gym is currently not too crowded!</h3>
          <p className="text-gray-500">No lines, come on in and start your workout.</p>
        </div>

        <div className="mt-8 text-center">
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-600">
        <p>&copy; 2025 SlugRush | UCSC Gym Crowds</p>
      </footer>
    </div>
  );
}

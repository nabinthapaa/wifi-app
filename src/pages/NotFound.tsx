import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="text-white grid h-full place-items-center">
      <div className="text-center space-y-10">
        <p className="text-4xl">404 Not Found</p>
        <Link to="/" className="bg-purple-600 p-4 rounded-lg text-xl font-bold">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

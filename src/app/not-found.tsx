"use client";
import { useRouter } from "next/navigation";

const E404 = () => {
  const router = useRouter();

  const routeM = () => {
    router.push("/dashboard");
  };
  return (
    <div className="min-h">
      <section className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-none sm:rounded-md mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ab2323] to-[#1e3a8a]/30" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              404 - Page Not Found
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
              The page you are looking for does not exist.
            </p>
            <button
              onClick={routeM}
              className="mt-6 px-4 py-2 bg-white text-[#1e3a8a] font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default E404;

import Image from "next/image";
import AllBlogs from "@/sections/blogs/AllBlogs";

const dashboardCards = [
  {
    id: "1",
    title: "Write your first blog",
    description: "Kickstart your writing journey with a quick intro post.",
    image: "/window.svg",
  },
  {
    id: "2",
    title: "Explore ideas",
    description: "Browse topics and save ideas for your next article.",
    image: "/globe.svg",
  },
  {
    id: "3",
    title: "Update your blogs",
    description: "Keep your content fresh by editing existing posts.",
    image: "/file.svg",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="w-full">
        <div className="relative rounded-none sm:rounded-md overflow-hidden bg-gradient-to-b from-gray-800 to-gray-700 h-48 sm:h-56 md:h-64 lg:h-72 flex items-center">
          <div className="w-full px-4 sm:px-8">
            <div className="text-center">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                Welcome back to your Content Hub
              </h1>
              <p className="mt-2 sm:mt-3 text-white/90 text-xs sm:text-sm md:text-base max-w-3xl mx-auto">
                Create, organize, and publish your blogs with a seamless
                workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-6 py-8">
        <AllBlogs />
      </section>

      <section className="max-w-6xl mx-auto px-3 sm:px-6 py-8">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="group rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-36 overflow-hidden rounded-t-md">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain p-6 group-hover:scale-[1.02] transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

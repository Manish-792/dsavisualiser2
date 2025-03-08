import React from 'react';
import { Link } from 'react-router-dom';
import { SortAsc, Search } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div
      className="
        py-8
        px-4
        sm:px-6
        lg:px-8
        bg-transparent
        transition-colors
      "
    >
      {/* Hero-like heading section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1
          className="
            text-4xl
            sm:text-5xl
            font-bold
            mb-6
            text-indigo-900
            dark:text-white
          "
        >
          <span
            className="
              bg-gradient-to-r 
              from-purple-500 
              to-indigo-400 
              bg-clip-text 
              text-transparent
            "
          >
            Algorithm
          </span>{' '}
          Visualizer
        </h1>
        <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed">
          Explore and understand algorithms through interactive visualizations.
          Choose a category below to get started.
        </p>
      </div>

      {/* Card grid */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {/* Sorting Card */}
        <Link
          to="/sorting"
          className="
            group
            rounded-xl
            p-6 sm:p-8
            bg-white/5
            backdrop-blur-lg
            border border-white/10
            shadow-xl
            transform
            transition-all
            hover:-translate-y-1
            hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
          "
        >
          <div
            className="
              w-16
              h-16
              mx-auto
              rounded-full
              bg-gradient-to-br from-purple-600 to-indigo-700
              flex
              items-center
              justify-center
              transition-colors
              group-hover:from-purple-500 group-hover:to-indigo-600
              shadow-[0_0_15px_rgba(168,85,247,0.3)]
            "
          >
            <SortAsc size={28} className="text-white" />
          </div>
          <h2
            className="
              mt-4
              text-2xl
              font-semibold
              text-white
              dark:text-white
              text-indigo-900
              text-center
            "
          >
            Sorting Algorithms
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mt-3 text-base sm:text-lg">
            Visualize popular sorting algorithms like Bubble Sort, Quick Sort,
            and Merge Sort in action.
          </p>
        </Link>

        {/* Searching Card */}
        <Link
          to="/searching"
          className="
            group
            rounded-xl
            p-6 sm:p-8
            bg-white/5
            backdrop-blur-lg
            border border-white/10
            shadow-xl
            transform
            transition-all
            hover:-translate-y-1
            hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
          "
        >
          <div
            className="
              w-16
              h-16
              mx-auto
              rounded-full
              bg-gradient-to-br from-purple-600 to-indigo-700
              flex
              items-center
              justify-center
              transition-colors
              group-hover:from-purple-500 group-hover:to-indigo-600
              shadow-[0_0_15px_rgba(168,85,247,0.3)]
            "
          >
            <Search size={28} className="text-white" />
          </div>
          <h2
            className="
              mt-4
              text-2xl
              font-semibold
              text-white
              dark:text-white
              text-indigo-900
              text-center
            "
          >
            Searching Algorithms
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mt-3 text-base sm:text-lg">
            Explore searching algorithms like Linear Search and Binary Search
            with interactive demonstrations.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;

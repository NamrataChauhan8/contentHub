// import React from "react";

// const E403 = () => {
//   return (
//     <div>
//       <h1>403 - Forbidden</h1>
//       <p>You do not have permission to access this page.</p>
//       <button>
//         Go Back to Dashboard
//       </button>
//     </div>
//   );
// };

// export default E403;

// ** Next JS Imports
import { Metadata } from "next/types";
import E403 from "../e403";

export const metadata: Metadata = {
  title: `403 | Content Hub`,
};

const Page = () => <E403 />;

export default Page;

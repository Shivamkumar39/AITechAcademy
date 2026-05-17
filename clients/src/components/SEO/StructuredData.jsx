// import React from "react";
// import { Helmet } from "react-helmet-async";

// function StructuredData({ data }) {
//   if (!data) return null;

//   return (
//     <Helmet>
//       <script type="application/ld+json">{JSON.stringify(data)}</script>
//     </Helmet>
//   );
// }

// export default StructuredData;
import React from "react";
import { Helmet } from "react-helmet-async";

function StructuredData({
  data,
  id = "structured-data",
}) {
  if (!data) return null;

  // Ensure valid JSON-LD (Google-safe)
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      <script
        type="application/ld+json"
        id={id}
      >
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

export default StructuredData;
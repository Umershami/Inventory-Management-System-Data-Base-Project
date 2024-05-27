// import React, { useState } from 'react';

// const ProductTable = ({ products, handleDelete, loading }) => {
//   return (
//     <table className="table-auto w-full">
//       <thead>
//         <tr>
//           <th className="px-4 py-2">Product Name</th>
//           <th className="px-4 py-2">Quantity</th>
//           <th className="px-4 py-2">Price</th>
//           <th className="px-4 py-2">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {products.map((product) => (
//           <tr key={product.productName}>
//             <td className="border px-4 py-2">{product.productName}</td>
//             <td className="border px-4 py-2">{product.quantity}</td>
//             <td className="border px-4 py-2">₹{product.price}</td>
//             <td className="border px-4 py-2">
//               <button
//                 onClick={() => handleDelete(product.productName)}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                 disabled={loading}
//               >
//                 {loading ? 'Deleting...' : 'Delete'}
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default ProductTable;

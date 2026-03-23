// // import { motion } from 'framer-motion';
// // import { User, Package, Heart, Bell, Settings, LogOut } from 'lucide-react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { Layout } from '@/components/layout/Layout';
// // import { Button } from '@/components/ui/button';
// // import { useStore } from '@/lib/store';

// // export default function Dashboard() {
// //   const { user, isAuthenticated, setUser, orders, savedBouquets, reminders } = useStore();
// //   const navigate = useNavigate();

// //   if (!isAuthenticated) {
// //     return (
// //       <Layout>
// //         <div className="pt-24 section-padding text-center">
// //           <h1 className="text-2xl font-bold mb-4">Please login to view your dashboard</h1>
// //           <Link to="/login"><Button variant="hero">Login</Button></Link>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   const handleLogout = () => {
// //     setUser(null);
// //     navigate('/');
// //   };

// //   return (
// //     <Layout>
// //       <div className="pt-24 section-padding">
// //         <div className="container-custom mx-auto">
// //           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
// //             <h1 className="font-display text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
// //             <p className="text-muted-foreground">{user?.email}</p>
// //           </motion.div>

// //           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //             {[
// //               { icon: Package, label: 'Orders', value: orders.length, color: 'text-primary' },
// //               { icon: Heart, label: 'Saved Bouquets', value: savedBouquets.length, color: 'text-rose-500' },
// //               { icon: Bell, label: 'Reminders', value: reminders.length, color: 'text-gold' },
// //               { icon: User, label: 'Profile', value: 'Active', color: 'text-green-500' },
// //             ].map((stat, i) => (
// //               <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 border border-border">
// //                 <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
// //                 <p className="text-2xl font-bold text-foreground">{stat.value}</p>
// //                 <p className="text-muted-foreground">{stat.label}</p>
// //               </motion.div>
// //             ))}
// //           </div>

// //           <div className="grid md:grid-cols-2 gap-6">
// //             <div className="bg-card rounded-2xl p-6 border border-border">
// //               <h2 className="font-semibold text-foreground mb-4">Recent Orders</h2>
// //               {orders.length === 0 ? (
// //                 <p className="text-muted-foreground">No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link></p>
// //               ) : (
// //                 <div className="space-y-3">{orders.slice(0, 3).map((order) => (
// //                   <div key={order.id} className="flex justify-between p-3 bg-muted rounded-lg">
// //                     <span>Order #{order.id}</span>
// //                     <span className="text-primary font-medium">₹{order.total}</span>
// //                   </div>
// //                 ))}</div>
// //               )}
// //             </div>

// //             <div className="bg-card rounded-2xl p-6 border border-border">
// //               <h2 className="font-semibold text-foreground mb-4">Saved Bouquets</h2>
// //               {savedBouquets.length === 0 ? (
// //                 <p className="text-muted-foreground">No saved bouquets. <Link to="/custom-bouquet" className="text-primary hover:underline">Create one</Link></p>
// //               ) : (
// //                 <div className="space-y-3">{savedBouquets.slice(0, 3).map((b) => (
// //                   <div key={b.id} className="flex justify-between p-3 bg-muted rounded-lg">
// //                     <span>{b.name}</span>
// //                     <span className="text-primary font-medium">₹{b.totalPrice}</span>
// //                   </div>
// //                 ))}</div>
// //               )}
// //             </div>
// //           </div>

// //           <Button variant="outline" className="mt-8" onClick={handleLogout}>
// //             <LogOut className="w-4 h-4" /> Logout
// //           </Button>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // }




// import { motion } from "framer-motion";
// import { User, Package, Heart, Bell, LogOut } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { Layout } from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import { useStore } from "@/lib/store";

// export default function Dashboard() {
//   const { user, isAuthenticated, setUser, orders, savedBouquets, reminders } =
//     useStore();

//   const navigate = useNavigate();

//   if (!isAuthenticated) {
//     return (
//       <Layout>
//         <div className="pt-24 section-padding text-center">
//           <h1 className="text-2xl font-bold mb-4">
//             Please login to view your dashboard
//           </h1>

//           <Link to="/login">
//             <Button variant="hero">Login</Button>
//           </Link>
//         </div>
//       </Layout>
//     );
//   }

//   const handleLogout = () => {
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <Layout>
//       <div className="pt-24 section-padding">
//         <div className="container-custom mx-auto">

//           {/* HEADER */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <h1 className="font-display text-3xl font-bold text-foreground">
//               Welcome, {user?.name || "User"}!
//             </h1>

//             <p className="text-muted-foreground">{user?.email}</p>
//           </motion.div>

//           {/* STATS */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {[
//               {
//                 icon: Package,
//                 label: "Orders",
//                 value: orders?.length || 0,
//                 color: "text-primary",
//               },
//               {
//                 icon: Heart,
//                 label: "Saved Bouquets",
//                 value: savedBouquets?.length || 0,
//                 color: "text-rose-500",
//               },
//               {
//                 icon: Bell,
//                 label: "Reminders",
//                 value: reminders?.length || 0,
//                 color: "text-gold",
//               },
//               {
//                 icon: User,
//                 label: "Profile",
//                 value: "Active",
//                 color: "text-green-500",
//               },
//             ].map((stat, i) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 className="bg-card rounded-2xl p-6 border border-border"
//               >
//                 <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />

//                 <p className="text-2xl font-bold text-foreground">
//                   {stat.value}
//                 </p>

//                 <p className="text-muted-foreground">{stat.label}</p>
//               </motion.div>
//             ))}
//           </div>

//           {/* DASHBOARD CONTENT */}
//           <div className="grid md:grid-cols-2 gap-6">

//             {/* RECENT ORDERS */}
//             <div className="bg-card rounded-2xl p-6 border border-border">
//               <h2 className="font-semibold text-foreground mb-4">
//                 Recent Orders
//               </h2>

//               {orders?.length === 0 ? (
//                 <p className="text-muted-foreground">
//                   No orders yet.{" "}
//                   <Link to="/shop" className="text-primary hover:underline">
//                     Start shopping
//                   </Link>
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {orders.slice(0, 3).map((order) => (
//                     <div
//                       key={order.id}
//                       className="flex justify-between p-3 bg-muted rounded-lg"
//                     >
//                       <span>Order #{order.id}</span>

//                       <span className="text-primary font-medium">
//                         ₹{order.total}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* SAVED BOUQUETS */}
//             <div className="bg-card rounded-2xl p-6 border border-border">
//               <h2 className="font-semibold text-foreground mb-4">
//                 Saved Bouquets
//               </h2>

//               {savedBouquets?.length === 0 ? (
//                 <p className="text-muted-foreground">
//                   No saved bouquets.{" "}
//                   <Link
//                     to="/custom-bouquet"
//                     className="text-primary hover:underline"
//                   >
//                     Create one
//                   </Link>
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {savedBouquets.slice(0, 3).map((b) => (
//                     <div
//                       key={b.id}
//                       className="flex justify-between p-3 bg-muted rounded-lg"
//                     >
//                       <span>{b.name}</span>

//                       <span className="text-primary font-medium">
//                         ₹{b.totalPrice}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* LOGOUT */}
//           <Button variant="outline" className="mt-8" onClick={handleLogout}>
//             <LogOut className="w-4 h-4 mr-2" />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </Layout>
//   );
// }






import { useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function Dashboard() {
  const { user, isAuthenticated, setUser, orders, setOrders, savedBouquets, setSavedBouquets, reminders } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const fetchSavedBouquets = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/Dashboard/SavedBouquets/`);
          if (res.ok) {
            const data = await res.json();
            let bouquetsArray = [];

            if (Array.isArray(data)) {
              bouquetsArray = data;
            } else if (data.data && Array.isArray(data.data)) {
              bouquetsArray = data.data;
            } else if (data.bouquets && Array.isArray(data.bouquets)) {
              bouquetsArray = data.bouquets;
            }

            // Filter the fetched bouquets according to the logged in user's email
            const validBouquets = bouquetsArray.filter((b: any) => b.email === user.email);

            // Forcefully map backend payload keys into our precise frontend UI types 
            // Ensures b.id is strings for the === equality check when viewing Custom Bouquet page
            const mappedUserBouquets = validBouquets.map((b: any) => {
              const safeId = String(b.id || b.bouquet_id || Date.now() + Math.random());

              // Depending on API version, it might be in `selections` or `bouquet_details`
              let details = b.selections || b.bouquet_details || b;
              if (typeof details === 'string') {
                try { details = JSON.parse(details); } catch (e) { details = {}; }
              }

              let totalCalculated = 0;
              if (details?.flowers && Array.isArray(details.flowers)) {
                totalCalculated = details.flowers.reduce((acc: number, f: any) => {
                  return acc + (Number(f.qty || f.quantity || 1) * Number(f.price_per_stem || f.price || 0));
                }, 0);
              }

              // Capitalization helper to match exact constants in frontend (e.g "Rose" instead of "rose")
              const formatType = (t: string) => {
                if (!t) return t;
                return t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              };

              // Locate the flowers array whether it's nested in details or at the root
              let rawFlowers = details?.flowers || b.flowers;
              if (typeof rawFlowers === 'string') {
                try { rawFlowers = JSON.parse(rawFlowers); } catch (e) { rawFlowers = []; }
              }
              const flowersArray = Array.isArray(rawFlowers) ? rawFlowers : [];

              return {
                ...b,
                id: safeId,
                name: b.name || `Saved Bouquet #${b.id || ''}`.trim(),
                totalPrice: b.total_price || b.totalPrice || totalCalculated,
                flowers: flowersArray.map((f: any) => ({
                  type: formatType(f.category || f.type),
                  color: formatType(f.color),
                  quantity: Number(f.qty || f.quantity) || 1,
                  price: Number(f.price_per_stem || f.price) || 0
                })),
                wrapStyle: details?.wrap_style || details?.wrapStyle || b.wrap_style || b.wrapStyle || "Classic White",
                addOns: details?.special_touches || details?.addOns || b.special_touches || b.addOns || [],
                message: details?.message || b.message || ""
              };
            });

            setSavedBouquets(mappedUserBouquets);
          }
        } catch (err) {
          console.error("Failed to fetch saved bouquets", err);
        }
      };

      const fetchOrders = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/OrderHistory/?email=${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const data = await res.json();

            const extractAndMap = (rawOrders: any[]) => {
              return rawOrders.map((o: any) => ({
                ...o,
                id: String(o.order_id || o._id || o.id || Math.random()),
                total: Number(o.total_price || o.total || 0),
                status: o.status || 'pending',
                createdAt: new Date(o.created_at || Date.now()),
                address: o.address || { label: 'Default', street: '', city: '', state: '', pincode: '', isDefault: true },
                deliveryType: o.delivery_type || 'standard',
                items: o.cart_items || o.items || []
              }));
            };

            if (data.status === 200 && Array.isArray(data.Order_History)) {
              setOrders(extractAndMap(data.Order_History));
            } else if (Array.isArray(data)) {
              setOrders(extractAndMap(data));
            } else if (data.data && Array.isArray(data.data)) {
              setOrders(extractAndMap(data.data));
            } else if (data.orders && Array.isArray(data.orders)) {
              setOrders(extractAndMap(data.orders));
            }
          }
        } catch (e) {
          console.error('Failed to fetch recent orders:', e);
        }
      };

      fetchSavedBouquets();
      fetchOrders();
    }
  }, [isAuthenticated, user?.email, setSavedBouquets, setOrders]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="pt-24 section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your dashboard</h1>
          <Link to="/login">
            <Button variant="hero">Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Layout>
      <div className="pt-24 section-padding">
        <div className="container-custom mx-auto">
          {/* HEADER - Displays the name stored in the user object */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome, {user?.firstName || "User"}!
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </motion.div>

          {/* STATS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Package, label: "Orders", value: orders?.length || 0, color: "text-primary" },
              { icon: Heart, label: "Saved Bouquets", value: savedBouquets?.length || 0, color: "text-rose-500" },
              { icon: User, label: "Profile", value: "Active", color: "text-green-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Recent Orders</h2>
              {orders?.length === 0 ? (
                <p className="text-muted-foreground">
                  No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between p-3 bg-muted rounded-lg">
                      <span>Order #{order.id}</span>
                      <span className="text-primary font-medium">₹{order.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Saved Bouquets</h2>
              {savedBouquets?.length === 0 ? (
                <p className="text-muted-foreground">
                  No saved bouquets. <Link to="/custom-bouquet" className="text-primary hover:underline">Create one</Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {savedBouquets.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => navigate(`/custom-bouquet?id=${b.id}`)}
                      className="flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer group border border-transparent hover:border-primary/20"
                    >
                      <span className="font-medium group-hover:text-primary transition-colors">{b.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold">₹{b.totalPrice}</span>
                        <Button
                          variant="hero"
                          size="sm"
                          className="h-8 px-4 text-xs shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/custom-bouquet?id=${b.id}`);
                          }}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button variant="outline" className="mt-8" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
}
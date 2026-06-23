import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  runBackup,
  getStatus,
  getHistory,//////////////
  getDatabases,
  addDatabase,
} from "./services/api";

function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);///////////////
  const [databases, setDatabases] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [type, setType] = useState("postgresql");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetchAll();

    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [statusData, historyData, dbData] = await Promise.all([//////////////////
        getStatus(),
        getHistory(),
        getDatabases(),
      ]);

      setStatus(statusData);
      setHistory(historyData);
      setDatabases(dbData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDatabase = async (e) => {
    e.preventDefault();

    try {
      await addDatabase({ name, type, url });

      setName("");
      setUrl("");

      fetchAll();

      alert("Database added successfully!");
    } catch (err) {
      alert("Failed to add database");
    }
  };

  const handleBackup = async () => {
  setLoading(true);

  const toastId = toast.loading("Running backup...");

  try {
    await runBackup();

    fetchAll();

    toast.success("Backup completed successfully!", {
      id: toastId,
    });

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Backup failed",
      {
        id: toastId,
      }
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <Toaster position="top-right" />
      {/* ADD DATABASE FORM */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">Add Database</h2>

        <form onSubmit={handleAddDatabase} className="flex gap-2">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-1/4"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mongodb">MongoDB</option>
          </select>

          <input
            placeholder="Connection URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded w-1/2"
          />

          <button className="bg-green-600 text-white px-4 rounded">Add</button>
        </form>
      </div>

      {/* DATABASE LIST */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-2">Databases</h2>

        {databases.map((db, i) => (
          <div key={i} className="border-b py-2">
            <p>
              <b>{db.name}</b> ({db.type})
            </p>
          </div>
        ))}
      </div>

      {/* BACKUP BUTTON */}
      {/* <button
        onClick={handleBackup}
        className="hover:cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
      >
        Run Backup
      </button> */}

      <button
  onClick={handleBackup}
  disabled={loading}
  className="hover:cursor-pointer bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
>
  {loading && (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  )}

  {loading ? "Running Backup..." : "Run Backup"}
</button>
    </div>
  );
}

export default App;

// import { useEffect, useState } from "react";
// import { runBackup, getStatus } from "./services/api";

// function App() {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState(null);
//   const [lastRun, setLastRun] = useState(null);

//   // load status on start + refresh every 10s
//   useEffect(() => {
//     fetchStatus();

//     const interval = setInterval(fetchStatus, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchStatus = async () => {
//     try {
//       const data = await getStatus();
//       setStatus(data);
//     } catch (err) {
//       setStatus({ status: "offline" });
//     }
//   };

//   const handleBackup = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await runBackup();
//       setMessage(res.message);
//       setLastRun(new Date().toLocaleString());
//     } catch (error) {
//       setMessage("Backup failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* HEADER */}
//       <h1 className="text-3xl font-bold mb-6">Database Backup Dashboard</h1>

//       {/* STATUS CARDS */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="p-4 bg-white rounded shadow">
//           <p className="text-sm text-gray-500">System Status</p>
//           <p
//             className={`font-bold ${
//               status?.status === "online" ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {status?.status || "loading..."}
//           </p>
//         </div>

//         <div className="p-4 bg-white rounded shadow">
//           <p className="text-sm text-gray-500">Last Backup</p>
//           <p className="font-bold">{lastRun || "No backup yet"}</p>
//         </div>
//       </div>

//       {/* BUTTON */}
//       <button
//         onClick={handleBackup}
//         disabled={loading}
//         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Running Backup..." : "Run Backup Now"}
//       </button>

//       {/* MESSAGE */}
//       {message && <p className="mt-4 text-gray-700">{message}</p>}

//       {/* STATUS RAW VIEW */}
//       <div className="mt-8 p-4 bg-white rounded shadow">
//         <h2 className="font-bold mb-2">Raw System Data</h2>
//         <pre className="text-xs">{JSON.stringify(status, null, 2)}</pre>
//       </div>
//     </div>
//   );
// }

// export default App;

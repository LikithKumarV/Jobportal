// import React, { useState, useEffect } from 'react';
// import { Search, Briefcase, Users, MapPin, Clock, DollarSign, Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle, LogOut, LayoutDashboard } from 'lucide-react';

// // ============= 1. API SERVICE =============
// const API_BASE_URL = 'http://localhost:8080/api';

// const api = {
//   getToken() { return localStorage.getItem('token'); },
//   getUserEmail() { return localStorage.getItem('userEmail'); },
//   getUserRole() { return localStorage.getItem('userRole'); },
  
//   setSession(token, email, role) {
//     localStorage.setItem('token', token);
//     localStorage.setItem('userEmail', email);
//     localStorage.setItem('userRole', role);
//   },

//   clearSession() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userRole');
//   },

//   async request(endpoint, options = {}) {
//     const headers = { 'Content-Type': 'application/json', ...options.headers };
//     const token = this.getToken();
//     if (token) headers['Authorization'] = `Bearer ${token}`;

//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
//       if (response.status === 401) {
//         this.clearSession();
//         throw new Error('Session expired. Please login again.');
//       }
//       const contentType = response.headers.get('content-type');
//       let data;
//       if (contentType && contentType.includes('application/json')) {
//         data = await response.json();
//       } else {
//         data = { message: await response.text() };
//       }
//       if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
//       return data;
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   },

//   async login(email, password) {
//     const data = await this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
//     if (data.token) {
//       // Prioritize backend user object, fallback to token decode, fallback to hardcoded
//       let role = data.user?.role || 'JOB_SEEKER'; 
//       this.setSession(data.token, data.user?.email || email, role);
//     }
//     return data;
//   },

//   async register(userData) {
//     return await this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
//   },

//   async searchJobs(keyword = '', location = '') {
//     const params = new URLSearchParams();
//     params.append('keyword', keyword);
//     params.append('location', location);
//     const data = await this.request(`/jobs/search?${params.toString()}`);
//     return Array.isArray(data) ? data : (data.content || []);
//   },

//   async applyForJob(jobId, coverLetter, userEmail) {
//     return await this.request('/applications', {
//       method: 'POST',
//       body: JSON.stringify({ jobId, coverLetter, email: userEmail }),
//     });
//   },

//   async getJobSeekerStats(email) { return await this.request(`/jobseeker/dashboard/stats?email=${encodeURIComponent(email)}`); },
//   async getMyApplications(email) { return await this.request(`/jobseeker/applications?email=${encodeURIComponent(email)}`); },
  
//   async getEmployerStats() { return await this.request('/employer/dashboard/stats'); },
//   async getMyJobs() { return await this.request('/employer/jobs'); },
//   async createJob(jobData) { return await this.request('/employer/jobs', { method: 'POST', body: JSON.stringify(jobData) }); },
//   async deleteJob(id) { return await this.request(`/employer/jobs/${id}`, { method: 'DELETE' }); },
// };

// // ============= 2. SUB-COMPONENTS (DEFINED OUTSIDE TO FIX FOCUS BUG) =============

// const LoginForm = ({ setView, handleLoginSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const data = await api.login(email, password);
//       const role = api.getUserRole(); // Get role saved by api.login
//       const userEmail = data.user?.email || email;
//       handleLoginSuccess(userEmail, role);
//     } catch (err) { setError(err.message || 'Login failed.'); }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
//         {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={email} onChange={e=>setEmail(e.target.value)} required />
//           <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" value={password} onChange={e=>setPassword(e.target.value)} required />
//           <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">Login</button>
//         </form>
//         <div className="mt-4 text-center">
//           <button onClick={() => setView('register')} className="text-blue-600 text-sm hover:underline">Create Account</button>
//           <br/>
//           <button onClick={() => setView('home')} className="text-gray-500 text-sm hover:underline mt-2">Back to Home</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const RegisterForm = ({ setView }) => {
//   const [formData, setFormData] = useState({ email: '', password: '', fullName: '', role: 'JOB_SEEKER' });
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.register(formData);
//       alert("Registration successful! Please login.");
//       setView('login');
//     } catch (err) { alert("Registration failed: " + err.message); }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} required />
//           <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
//           <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
//           <select className="w-full p-3 border rounded-lg" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})}>
//             <option value="JOB_SEEKER">Job Seeker</option>
//             <option value="EMPLOYER">Employer</option>
//           </select>
//           <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">Register</button>
//         </form>
//         <div className="mt-4 text-center">
//           <button onClick={() => setView('login')} className="text-blue-600 text-sm hover:underline">Login</button>
//            <br/>
//           <button onClick={() => setView('home')} className="text-gray-500 text-sm hover:underline mt-2">Back to Home</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Dashboard = ({ user, setView, handleLogout }) => {
//   const isEmployer = user?.role === 'EMPLOYER';
//   const [items, setItems] = useState([]);
//   const [loading, setDashLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userEmail = user?.email || api.getUserEmail();
//         if (!userEmail) return;
//         const res = isEmployer ? await api.getMyJobs() : await api.getMyApplications(userEmail);
//         setItems(res.content || []);
//       } catch (e) { console.error(e); } 
//       finally { setDashLoading(false); }
//     };
//     if (user) fetchData();
//   }, [isEmployer, user]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
//         <div className="font-bold text-xl text-blue-600 flex items-center gap-2"><LayoutDashboard/> Dashboard</div>
//         <div className="flex gap-4">
//           <button onClick={() => setView('home')} className="text-gray-600 hover:text-blue-600 font-medium">Find Jobs</button>
//           <button onClick={handleLogout} className="text-red-600 font-medium">Logout</button>
//         </div>
//       </nav>
//       <div className="max-w-6xl mx-auto p-8">
//         <h2 className="text-3xl font-bold mb-8 text-gray-800">{isEmployer ? 'My Posted Jobs' : 'My Applications'}</h2>
//         {loading ? <p>Loading...</p> : items.length === 0 ? (
//           <div className="text-center text-gray-500 bg-white p-10 rounded shadow">
//               <Briefcase size={48} className="mx-auto mb-4 text-gray-300"/>
//               <p>No records found.</p>
//           </div>
//         ) : (
//           <div className="grid gap-4">
//             {items.map(item => {
//               const title = isEmployer ? item.title : item.job?.title;
//               const company = isEmployer ? 'Me' : item.job?.employer?.companyName;
//               const status = item.status || 'ACTIVE';
//               return (
//                 <div key={item.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
//                   <div>
//                     <h3 className="font-bold text-xl text-gray-800">{title || 'Unknown Job'}</h3>
//                     <p className="text-gray-600">{company || 'Company Confidential'}</p>
//                     <p className="text-xs text-gray-400 mt-1">Status: {status}</p>
//                   </div>
//                   <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">{status}</span>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const HomePage = ({ user, setView, handleLogout, jobs, loading, handleApply, keyword, setKeyword, location, setLocation, handleSearch }) => (
//   <div className="min-h-screen bg-gray-50">
//     <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
//       <div className="flex items-center gap-2 font-bold text-2xl text-gray-800"><Briefcase className="text-blue-600"/> JobPortal</div>
//       <div className="space-x-4 flex items-center">
//         {user ? (
//           <>
//             <span className="hidden md:inline text-gray-600 mr-2">Hi, {user.email}</span>
//             <button onClick={() => setView('dashboard')} className="text-blue-600 font-medium flex items-center gap-1"><LayoutDashboard size={18}/> Dashboard</button>
//             <button onClick={handleLogout} className="text-red-600 font-medium flex items-center gap-1"><LogOut size={18}/> Logout</button>
//           </>
//         ) : (
//           <>
//             <button onClick={() => setView('login')} className="text-blue-600 font-medium">Login</button>
//             <button onClick={() => setView('register')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Register</button>
//           </>
//         )}
//       </div>
//     </nav>
//     <div className="bg-blue-600 py-20 px-4 text-center">
//       <h1 className="text-5xl font-bold text-white mb-6">Find Your Dream Job</h1>
//       <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2 bg-white p-2 rounded-xl shadow-2xl">
//         <div className="flex-1 flex items-center px-4 border-r"><Search className="text-gray-400"/><input type="text" placeholder="Job title or keyword" className="flex-1 p-3 outline-none" value={keyword} onChange={e=>setKeyword(e.target.value)}/></div>
//         <div className="flex-1 flex items-center px-4"><MapPin className="text-gray-400"/><input type="text" placeholder="Location" className="flex-1 p-3 outline-none" value={location} onChange={e=>setLocation(e.target.value)}/></div>
//         <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold transition">Search</button>
//       </div>
//     </div>
//     <div className="max-w-6xl mx-auto p-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-3">Latest Jobs</h2>
//       <div className="grid gap-6">
//         {jobs.map(job => (
//           <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex justify-between items-start">
//             <div className="flex-1">
//               <h3 className="text-xl font-bold text-gray-900">{job.title || "Untitled"}</h3>
//               <p className="text-gray-600 font-medium">{job.employer?.companyName || "Confidential Company"}</p>
//               <div className="flex gap-4 mt-3 text-sm text-gray-500">
//                 <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><MapPin size={14}/> {job.location || 'Remote'}</span>
//                 <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><Briefcase size={14}/> {job.jobType || 'Full Time'}</span>
//                 <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><DollarSign size={14}/> {job.salaryRange || 'Negotiable'}</span>
//               </div>
//             </div>
//             <button onClick={() => handleApply(job.id)} className="bg-blue-50 text-blue-600 border border-blue-200 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium">Apply Now</button>
//           </div>
//         ))}
//         {jobs.length === 0 && <p className="text-center text-gray-500">No jobs found.</p>}
//       </div>
//     </div>
//   </div>
// );

// // ============= 3. MAIN CONTAINER (STATE HOLDER) =============
// const JobPortal = () => {
//   const [user, setUser] = useState(null);
//   const [view, setView] = useState('home');
//   const [jobs, setJobs] = useState([]);
//   const [keyword, setKeyword] = useState('');
//   const [location, setLocation] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadJobs();
//     const token = api.getToken();
//     const email = api.getUserEmail();
//     const role = api.getUserRole();
//     if (token && email) setUser({ email, role });
//   }, []);

//   const loadJobs = async (k = '', l = '') => {
//     setLoading(true);
//     try {
//       const res = await api.searchJobs(k, l);
//       setJobs(res);
//     } catch (e) { setJobs([]); } 
//     finally { setLoading(false); }
//   };

//   const handleSearch = () => loadJobs(keyword, location);

//   const handleApply = async (jobId) => {
//     if (!user) { alert("Please login to apply!"); setView('login'); return; }
//     const coverLetter = prompt("Write a short note for the recruiter:");
//     if (coverLetter === null) return; 
//     try {
//       const userEmail = user.email || api.getUserEmail();
//       if (!userEmail) { alert("User email missing. Login again."); return; }
//       await api.applyForJob(jobId, coverLetter || "Interested.", userEmail);
//       alert("Application Sent Successfully!");
//       setView('dashboard'); 
//     } catch (err) { alert("Failed to apply: " + err.message); }
//   };

//   const handleLoginSuccess = (email, role) => {
//     setUser({ email, role });
//     setView('home');
//   };

//   const handleLogout = () => {
//     setUser(null);
//     api.clearSession();
//     setView('home');
//   };

//   if (view === 'login') return <LoginForm setView={setView} handleLoginSuccess={handleLoginSuccess} />;
//   if (view === 'register') return <RegisterForm setView={setView} />;
//   if (view === 'dashboard' && user) return <Dashboard user={user} setView={setView} handleLogout={handleLogout} />;
  
//   return (
//     <HomePage 
//       user={user} 
//       setView={setView} 
//       handleLogout={handleLogout} 
//       jobs={jobs} 
//       loading={loading} 
//       handleApply={handleApply}
//       keyword={keyword}
//       setKeyword={setKeyword}
//       location={location}
//       setLocation={setLocation}
//       handleSearch={handleSearch}
//     />
//   );
// };

// export default JobPortal;
import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Users, MapPin, Clock, DollarSign, Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle, LogOut, LayoutDashboard, XCircle } from 'lucide-react';

// ============= 1. API SERVICE =============
const API_BASE_URL = 'http://localhost:8080/api';

const api = {
  // --- Storage Helpers ---
  getToken() { return localStorage.getItem('token'); },
  getUserEmail() { return localStorage.getItem('userEmail'); },
  getUserRole() { return localStorage.getItem('userRole'); },
  
  setSession(token, email, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
  },

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  },

  // --- Generic Request Handler ---
  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Pass the backend error message (like "You have already applied") to the UI
        throw new Error(data.message || data || `Error ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // --- Auth ---
  async login(email, password) {
    const data = await this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data.token) {
      // Prioritize backend user object
      let role = data.user?.role || 'JOB_SEEKER'; 
      this.setSession(data.token, data.user?.email || email, role);
    }
    return data;
  },

  async register(userData) {
    return await this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  },

  // --- Jobs ---
  async searchJobs(keyword = '', location = '') {
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    params.append('location', location);
    const data = await this.request(`/jobs/search?${params.toString()}`);
    return Array.isArray(data) ? data : (data.content || []);
  },

  // --- Applications ---
  async applyForJob(jobId, coverLetter, userEmail) {
    return await this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, coverLetter, email: userEmail }),
    });
  },

  // --- Dashboard ---
  async getJobSeekerStats(email) { return await this.request(`/jobseeker/dashboard/stats?email=${encodeURIComponent(email)}`); },
  async getMyApplications(email) { return await this.request(`/jobseeker/applications?email=${encodeURIComponent(email)}`); },
  
  async getEmployerStats() { return await this.request('/employer/dashboard/stats'); },
  async getMyJobs() { return await this.request('/employer/jobs'); },
  async createJob(jobData) { return await this.request('/employer/jobs', { method: 'POST', body: JSON.stringify(jobData) }); },
  async deleteJob(id) { return await this.request(`/employer/jobs/${id}`, { method: 'DELETE' }); },
};

// ============= 2. SUB-COMPONENTS =============

const LoginForm = ({ setView, handleLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(email, password);
      const userEmail = data.user?.email || email;
      const role = data.user?.role || 'JOB_SEEKER';
      handleLoginSuccess(userEmail, role);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">Login</button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setView('register')} className="text-blue-600 text-sm hover:underline">Create Account</button>
          <br/>
          <button onClick={() => setView('home')} className="text-gray-500 text-sm hover:underline mt-2">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = ({ setView }) => {
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', role: 'JOB_SEEKER' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.register(formData);
      alert("Registration successful! Please login.");
      setView('login');
    } catch (err) { alert("Registration failed: " + err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
          <select className="w-full p-3 border rounded-lg" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})}>
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">Register</button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setView('login')} className="text-blue-600 text-sm hover:underline">Login</button>
           <br/>
          <button onClick={() => setView('home')} className="text-gray-500 text-sm hover:underline mt-2">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, setView, handleLogout }) => {
  const isEmployer = user?.role === 'EMPLOYER';
  const [items, setItems] = useState([]);
  const [loading, setDashLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = user?.email || api.getUserEmail();
        if (!userEmail) return;
        
        const res = isEmployer ? await api.getMyJobs() : await api.getMyApplications(userEmail);
        setItems(res.content || []);
      } catch (e) { console.error(e); } 
      finally { setDashLoading(false); }
    };
    if (user) fetchData();
  }, [isEmployer, user]);

  // Calculate Stats locally for immediate feedback
  const stats = {
    total: items.length,
    pending: items.filter(i => i.status === 'PENDING').length,
    rejected: items.filter(i => i.status === 'REJECTED').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2"><LayoutDashboard/> Dashboard</div>
        <div className="flex gap-4">
          <button onClick={() => setView('home')} className="text-gray-600 hover:text-blue-600 font-medium">Find Jobs</button>
          <button onClick={handleLogout} className="text-red-600 font-medium">Logout</button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-8">
        
        {/* DASHBOARD STATS ROW */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium">Total {isEmployer ? 'Jobs' : 'Applications'}</p><p className="text-3xl font-bold text-gray-800">{stats.total}</p></div>
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Briefcase size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium">Pending</p><p className="text-3xl font-bold text-gray-800">{stats.pending}</p></div>
              <div className="bg-yellow-50 p-3 rounded-full text-yellow-600"><Clock size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium">Rejected</p><p className="text-3xl font-bold text-gray-800">{stats.rejected}</p></div>
              <div className="bg-red-50 p-3 rounded-full text-red-600"><XCircle size={24} /></div>
            </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-gray-800">{isEmployer ? 'My Posted Jobs' : 'Application History'}</h2>
        {loading ? <p>Loading...</p> : items.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-10 rounded shadow">
              <Briefcase size={48} className="mx-auto mb-4 text-gray-300"/>
              <p>No records found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map(item => {
              const title = isEmployer ? item.title : item.job?.title;
              const company = isEmployer ? 'Me' : item.job?.employer?.companyName;
              const status = item.status || 'ACTIVE';
              const dateStr = new Date(item.appliedDate || item.postedDate || Date.now()).toLocaleDateString();
              
              return (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{title || 'Unknown Job'}</h3>
                    <p className="text-gray-600">{company || 'Company Confidential'}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                         <span className="flex items-center gap-1"><Clock size={14}/> {dateStr}</span>
                         <span className="flex items-center gap-1"><MapPin size={14}/> {item.location || item.job?.location || 'Remote'}</span>
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                        status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage = ({ user, setView, handleLogout, jobs, loading, handleApply, keyword, setKeyword, location, setLocation, handleSearch }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2 font-bold text-2xl text-gray-800"><Briefcase className="text-blue-600"/> JobPortal</div>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <span className="hidden md:inline text-gray-600 mr-2">Hi, {user.email}</span>
            <button onClick={() => setView('dashboard')} className="text-blue-600 font-medium flex items-center gap-1"><LayoutDashboard size={18}/> Dashboard</button>
            <button onClick={handleLogout} className="text-red-600 font-medium flex items-center gap-1"><LogOut size={18}/> Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setView('login')} className="text-blue-600 font-medium">Login</button>
            <button onClick={() => setView('register')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Register</button>
          </>
        )}
      </div>
    </nav>
    <div className="bg-blue-600 py-20 px-4 text-center">
      <h1 className="text-5xl font-bold text-white mb-6">Find Your Dream Job</h1>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2 bg-white p-2 rounded-xl shadow-2xl">
        <div className="flex-1 flex items-center px-4 border-r"><Search className="text-gray-400"/><input type="text" placeholder="Job title or keyword" className="flex-1 p-3 outline-none" value={keyword} onChange={e=>setKeyword(e.target.value)}/></div>
        <div className="flex-1 flex items-center px-4"><MapPin className="text-gray-400"/><input type="text" placeholder="Location" className="flex-1 p-3 outline-none" value={location} onChange={e=>setLocation(e.target.value)}/></div>
        <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold transition">Search</button>
      </div>
    </div>
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-3">Latest Jobs</h2>
      <div className="grid gap-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{job.title || "Untitled"}</h3>
              <p className="text-gray-600 font-medium">{job.employer?.companyName || "Confidential Company"}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><MapPin size={14}/> {job.location || 'Remote'}</span>
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><Briefcase size={14}/> {job.jobType || 'Full Time'}</span>
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><DollarSign size={14}/> {job.salaryRange || 'Negotiable'}</span>
              </div>
            </div>
            <button onClick={() => handleApply(job.id)} className="bg-blue-50 text-blue-600 border border-blue-200 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium">Apply Now</button>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-center text-gray-500">No jobs found.</p>}
      </div>
    </div>
  </div>
);

// ============= 3. MAIN CONTAINER =============
// ============= 3. MAIN CONTAINER =============
const JobPortal = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
    const token = api.getToken();
    const email = api.getUserEmail();
    const role = api.getUserRole();
    if (token && email) setUser({ email, role });
  }, []);

  const loadJobs = async (k = '', l = '') => {
    setLoading(true);
    try {
      const res = await api.searchJobs(k, l);
      setJobs(res);
    } catch (e) { setJobs([]); } 
    finally { setLoading(false); }
  };

  const handleSearch = () => loadJobs(keyword, location);

  // --- NEW FUNCTION: Resets search and loads all jobs ---
  const handleReset = () => {
    setKeyword('');
    setLocation('');
    loadJobs('', '');
  };

  const handleApply = async (jobId) => {
    if (!user) { alert("Please login to apply!"); setView('login'); return; }
    const coverLetter = prompt("Write a short note for the recruiter:");
    if (coverLetter === null) return; 
    try {
      const userEmail = user.email || api.getUserEmail();
      if (!userEmail) { alert("User email missing. Login again."); return; }
      await api.applyForJob(jobId, coverLetter || "Interested.", userEmail);
      alert("Application Sent Successfully!");
      setView('dashboard'); 
    } catch (err) { alert(err.message); }
  };

  const handleLoginSuccess = (email, role) => {
    setUser({ email, role });
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    api.clearSession();
    setView('home');
  };

  if (view === 'login') return <LoginForm setView={setView} handleLoginSuccess={handleLoginSuccess} />;
  if (view === 'register') return <RegisterForm setView={setView} />;
  if (view === 'dashboard' && user) return <Dashboard user={user} setView={setView} handleLogout={handleLogout} />;
  
  return (
    <HomePage 
      user={user} 
      setView={setView} 
      handleLogout={handleLogout} 
      jobs={jobs} 
      loading={loading} 
      handleApply={handleApply}
      keyword={keyword}
      setKeyword={setKeyword}
      location={location}
      setLocation={setLocation}
      handleSearch={handleSearch}
      handleReset={handleReset} // <--- PASS THE NEW FUNCTION HERE
    />
  );
};

export default JobPortal;
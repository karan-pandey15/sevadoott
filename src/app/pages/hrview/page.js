// app/partner/hr/page.js
"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// ---------- STORE HELPERS (localStorage) ----------
const STORES = {
  users: "hr_users",
  session: "hr_session",
  candidates: "hr_candidates",
  interviews: "hr_interviews",
  offerLetters: "hr_offer_letters",
};

const readStore = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const getArrayStore = (key) => {
  const data = readStore(key);
  if (Array.isArray(data)) return data;
  return [];
};

// ---------- AUTH STORE INIT (default HR user) ----------
const ensureDefaultHR = () => {
  if (typeof window === "undefined") return;
  const users = getArrayStore(STORES.users);
  const exists = users.some((u) => u.email.toLowerCase() === "hr@gmail.com");
  if (!exists) {
    users.push({
      id: crypto.randomUUID ? crypto.randomUUID() : "hr-default-" + Date.now(),
      fullName: "HR Manager",
      email: "hr@gmail.com",
      passwordHash: btoa("123456"),
      role: "HR",
      createdAt: new Date().toISOString(),
    });
    writeStore(STORES.users, users);
  }
};

// ---------- ROLE -> DASHBOARD PATH ----------
const roleDashboard = {
  HR: "/partner/hr/dashboard",
  Admin: "/partner/admin/dashboard",
  "Team Leader": "/partner/tl/dashboard",
  Employee: "/partner/employee/dashboard",
};

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#11707B]/20 border-t-[#11707B]" />
    </div>
  );
}

// ---------- MAIN COMPONENT ----------
function HRPartnerPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // ---- URL-based tab & routing ----
  const [currentTab, setCurrentTab] = useState(() => {
    // Only set to 'login' if tab=login, otherwise default to 'knowmore'
    return tabParam === "login" ? "login" : "knowmore";
  });
  const [subForm, setSubForm] = useState("login");

  // ---- Auth state ----
  const [session, setSession] = useState(() => {
    if (typeof window === "undefined") return null;
    const s = readStore(STORES.session);
    return s && typeof s === "object" ? s : null;
  });

  // ---- dashboard navigation ----
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 768;
  });

  // ---- data stores ----
  const [candidates, setCandidates] = useState(() => {
    if (typeof window === "undefined") return [];
    return getArrayStore(STORES.candidates);
  });
  const [interviews, setInterviews] = useState(() => {
    if (typeof window === "undefined") return [];
    return getArrayStore(STORES.interviews);
  });
  const [offerLetters, setOfferLetters] = useState(() => {
    if (typeof window === "undefined") return [];
    return getArrayStore(STORES.offerLetters);
  });

  // ---- form states ----
  const [signupFields, setSignupFields] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "HR",
    secretKey: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [loginFields, setLoginFields] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [interviewForm, setInterviewForm] = useState({
    candidateName: "",
    position: "",
    dateTime: "",
    interviewer: "",
  });
  const [interviewErrors, setInterviewErrors] = useState({});

  const [offerForm, setOfferForm] = useState({
    candidateName: "",
    position: "",
    salary: "",
    joiningDate: "",
    companyName: "",
  });
  const [offerErrors, setOfferErrors] = useState({});
  const [lastOffer, setLastOffer] = useState(null);

  const [settingsName, setSettingsName] = useState("");
  const [settingsMsg, setSettingsMsg] = useState({ type: "", text: "" });

  // ---- filter state ----
  const [filterStage, setFilterStage] = useState("");

  // ---- ensure default HR user ----
  useEffect(() => {
    ensureDefaultHR();
  }, []);

  // ---- session guard for dashboard ----
  useEffect(() => {
    if (!session || session.role !== "HR") {
      if (window.location.pathname.includes("/partner/hr/dashboard")) {
        router.push("/partner/login?tab=login");
      }
    }
  }, [session, router]);

  // ---- if session exists and on login page, redirect to dashboard ----
  useEffect(() => {
    if (session && session.role) {
      const path = roleDashboard[session.role] || "/partner/hr/dashboard";
      if (window.location.pathname.includes("/partner/login")) {
        router.push(path);
      }
    }
  }, [session, router]);

  // ---- sidebar responsive ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---- write stores on data change ----
  useEffect(() => {
    if (typeof window !== "undefined") {
      writeStore(STORES.candidates, candidates);
    }
  }, [candidates]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      writeStore(STORES.interviews, interviews);
    }
  }, [interviews]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      writeStore(STORES.offerLetters, offerLetters);
    }
  }, [offerLetters]);

  // ---- LOGIC: signup ----
  const handleSignup = (e) => {
    e.preventDefault();
    const { fullName, email, password, role, secretKey } = signupFields;
    const errors = {};

    if (!fullName || fullName.trim().length < 1 || fullName.length > 100)
      errors.fullName = "Full name 1-100 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Valid email required";
    if (!password || password.length < 8 || password.length > 128)
      errors.password = "Password 8-128 characters";
    if (!role || !["Admin", "HR", "Team Leader", "Employee"].includes(role))
      errors.role = "Select a role";
    if (!secretKey || secretKey.length < 1 || secretKey.length > 200)
      errors.secretKey = "Secret key required";

    const secretMap = {
      Admin: "admin123",
      HR: "hr456",
      "Team Leader": "tl789",
      Employee: "emp000",
    };
    if (secretKey && secretMap[role] !== secretKey) {
      errors.secretKey = "Invalid secret key for selected role";
    }

    const users = getArrayStore(STORES.users);
    if (email && users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      errors.email = "Email already registered";
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : "u-" + Date.now(),
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      passwordHash: btoa(password),
      role,
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    if (writeStore(STORES.users, updated)) {
      setSignupFields({ fullName: "", email: "", password: "", role: "HR", secretKey: "" });
      setSignupErrors({});
      setSubForm("login");
    } else {
      setSignupErrors({ general: "Failed to create account. Please try again." });
    }
  };

  // ---- LOGIC: login ----
  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginFields;
    setLoginError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLoginError("Invalid email format");
      return;
    }
    if (!password || password.length < 1) {
      setLoginError("Password required");
      return;
    }
    const users = getArrayStore(STORES.users);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || btoa(password) !== user.passwordHash) {
      setLoginError("Invalid email or password");
      return;
    }
    const { passwordHash, ...sessionUser } = user;
    writeStore(STORES.session, sessionUser);
    setSession(sessionUser);
    const path = roleDashboard[sessionUser.role] || "/partner/hr/dashboard";
    router.push(path);
  };

  // ---- LOGIC: schedule interview ----
  const handleScheduleInterview = (e) => {
    e.preventDefault();
    const { candidateName, position, dateTime, interviewer } = interviewForm;
    const errors = {};
    if (!candidateName || candidateName.trim().length === 0 || candidateName.length > 100)
      errors.candidateName = "Required, max 100";
    if (!position || position.trim().length === 0 || position.length > 100)
      errors.position = "Required, max 100";
    if (!interviewer || interviewer.trim().length === 0 || interviewer.length > 100)
      errors.interviewer = "Required, max 100";
    if (!dateTime) {
      errors.dateTime = "Date & time required";
    } else {
      const dt = new Date(dateTime);
      if (dt <= new Date()) errors.dateTime = "Must be in the future";
    }
    if (Object.keys(errors).length > 0) {
      setInterviewErrors(errors);
      return;
    }

    const newInterview = {
      id: crypto.randomUUID ? crypto.randomUUID() : "i-" + Date.now(),
      candidateName: candidateName.trim(),
      position: position.trim(),
      dateTime,
      interviewer: interviewer.trim(),
      createdAt: new Date().toISOString(),
    };
    const newCandidate = {
      id: crypto.randomUUID ? crypto.randomUUID() : "c-" + Date.now(),
      name: candidateName.trim(),
      position: position.trim(),
      interviewer: interviewer.trim(),
      stage: "Interview Scheduled",
      createdAt: new Date().toISOString(),
    };
    setInterviews((prev) => [newInterview, ...prev]);
    setCandidates((prev) => [newCandidate, ...prev]);
    setInterviewForm({ candidateName: "", position: "", dateTime: "", interviewer: "" });
    setInterviewErrors({});
  };

  // ---- LOGIC: update candidate stage ----
  const updateCandidateStage = (id, newStage) => {
    const updated = candidates.map((c) => {
      if (c.id === id) {
        return { ...c, stage: newStage };
      }
      return c;
    });
    setCandidates(updated);
  };

  // ---- LOGIC: generate offer letter ----
  const handleGenerateOffer = (e) => {
    e.preventDefault();
    const { candidateName, position, salary, joiningDate, companyName } = offerForm;
    const errors = {};
    if (!candidateName || candidateName.trim().length === 0 || candidateName.length > 100)
      errors.candidateName = "Required, max 100";
    if (!position || position.trim().length === 0 || position.length > 100)
      errors.position = "Required, max 100";
    if (!companyName || companyName.trim().length === 0 || companyName.length > 150)
      errors.companyName = "Required, max 150";
    if (!salary) {
      errors.salary = "Salary required";
    } else {
      const num = parseFloat(salary);
      if (isNaN(num) || num < 0.01 || num > 9999999.99 || !/^\d+(\.\d{1,2})?$/.test(salary)) {
        errors.salary = "Must be 0.01 - 9,999,999.99 (max 2 decimals)";
      }
    }
    if (!joiningDate) {
      errors.joiningDate = "Joining date required";
    } else {
      const jd = new Date(joiningDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (jd <= today) errors.joiningDate = "Must be after today";
    }
    if (Object.keys(errors).length > 0) {
      setOfferErrors(errors);
      return;
    }

    const newOffer = {
      id: crypto.randomUUID ? crypto.randomUUID() : "o-" + Date.now(),
      candidateName: candidateName.trim(),
      position: position.trim(),
      salary: parseFloat(salary),
      joiningDate,
      companyName: companyName.trim(),
      generatedAt: new Date().toISOString(),
    };
    setOfferLetters((prev) => [newOffer, ...prev]);
    setLastOffer(newOffer);
    setOfferForm({ candidateName: "", position: "", salary: "", joiningDate: "", companyName: "" });
    setOfferErrors({});
  };

  // ---- LOGIC: settings update name ----
  const handleUpdateName = (e) => {
    e.preventDefault();
    setSettingsMsg({ type: "", text: "" });
    const newName = settingsName.trim();
    if (newName.length < 1 || newName.length > 100) {
      setSettingsMsg({ type: "error", text: "Name must be 1-100 characters" });
      return;
    }
    const users = getArrayStore(STORES.users);
    const idx = users.findIndex((u) => u.id === session.id);
    if (idx === -1) {
      setSettingsMsg({ type: "error", text: "User not found in store" });
      return;
    }
    const updatedUsers = [...users];
    updatedUsers[idx] = { ...updatedUsers[idx], fullName: newName };
    if (writeStore(STORES.users, updatedUsers)) {
      const newSession = { ...session, fullName: newName };
      writeStore(STORES.session, newSession);
      setSession(newSession);
      setSettingsMsg({ type: "success", text: "Name updated successfully" });
      setSettingsName("");
    } else {
      setSettingsMsg({ type: "error", text: "Failed to update name" });
    }
  };

  // ---- logout ----
  const handleLogout = () => {
    localStorage.removeItem(STORES.session);
    setSession(null);
    router.push("/partner/login?tab=login");
  };

  // ---- compute stats ----
  const stats = useMemo(() => {
    const stages = ["Interview Scheduled", "In Interview", "Selected", "Rejected"];
    const counts = stages.map((s) => candidates.filter((c) => c.stage === s).length);
    return {
      "Interview Scheduled": counts[0],
      "In Interview": counts[1],
      "Selected": counts[2],
      "Rejected": counts[3],
    };
  }, [candidates]);

  // ---- filter candidates ----
  const filteredCandidates = useMemo(() => {
    if (!filterStage) return candidates;
    return candidates.filter((c) => c.stage === filterStage);
  }, [candidates, filterStage]);

  // ---- handle tab change ----
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    // Only update URL for login tab, otherwise remove tab parameter
    if (tab === "login") {
      router.push("/partner/login?tab=login");
    } else {
      router.push("/partner/login");
    }
  };

  // ---- RENDER: login page ----
  const isDashboard = pathname?.includes("/partner/hr/dashboard");
  if (!session || !isDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {["Register Now", "Know More", "Contact Us", "Login"].map((tab) => {
              const isLogin = tab === "Login";
              const tabKey = isLogin ? "login" : tab.toLowerCase().replace(" ", "");
              const active = currentTab === tabKey;
              
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tabKey)}
                  className={`px-5 py-3 font-medium text-sm whitespace-nowrap ${
                    active
                      ? "border-b-2 border-[#11707B] text-[#11707B]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {currentTab === "login" ? (
              <div>
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setSubForm("login")}
                    className={`px-4 py-2 rounded-md ${
                      subForm === "login"
                        ? "bg-[#11707B] text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setSubForm("signup")}
                    className={`px-4 py-2 rounded-md ${
                      subForm === "signup"
                        ? "bg-[#11707B] text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
                {subForm === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={loginFields.email}
                        onChange={(e) =>
                          setLoginFields({ ...loginFields, email: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Password</label>
                      <input
                        type="password"
                        value={loginFields.password}
                        onChange={(e) =>
                          setLoginFields({ ...loginFields, password: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    {loginError && (
                      <div className="text-red-600 text-sm">{loginError}</div>
                    )}
                    <button
                      type="submit"
                      className="bg-[#11707B] text-white px-6 py-2 rounded-md hover:bg-[#0e5a63]"
                    >
                      Log In
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Full Name</label>
                      <input
                        value={signupFields.fullName}
                        onChange={(e) =>
                          setSignupFields({ ...signupFields, fullName: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                      {signupErrors.fullName && (
                        <span className="text-red-600 text-xs">{signupErrors.fullName}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={signupFields.email}
                        onChange={(e) =>
                          setSignupFields({ ...signupFields, email: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                      {signupErrors.email && (
                        <span className="text-red-600 text-xs">{signupErrors.email}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Password</label>
                      <input
                        type="password"
                        value={signupFields.password}
                        onChange={(e) =>
                          setSignupFields({ ...signupFields, password: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                      {signupErrors.password && (
                        <span className="text-red-600 text-xs">{signupErrors.password}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Role</label>
                      <select
                        value={signupFields.role}
                        onChange={(e) =>
                          setSignupFields({ ...signupFields, role: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        {["Admin", "HR", "Team Leader", "Employee"].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      {signupErrors.role && (
                        <span className="text-red-600 text-xs">{signupErrors.role}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Secret Key</label>
                      <input
                        value={signupFields.secretKey}
                        onChange={(e) =>
                          setSignupFields({ ...signupFields, secretKey: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                      {signupErrors.secretKey && (
                        <span className="text-red-600 text-xs">{signupErrors.secretKey}</span>
                      )}
                    </div>
                    {signupErrors.general && (
                      <div className="text-red-600 text-sm">{signupErrors.general}</div>
                    )}
                    <button
                      type="submit"
                      className="bg-[#11707B] text-white px-6 py-2 rounded-md hover:bg-[#0e5a63]"
                    >
                      Create Account
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-gray-600">
                {currentTab === "knowmore" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Know More</h3>
                    <p>Our HR Partner System helps you manage recruitment efficiently.</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Schedule and manage interviews</li>
                      <li>Track candidates through hiring pipeline</li>
                      <li>Generate professional offer letters</li>
                      <li>Monitor recruitment statistics</li>
                    </ul>
                  </div>
                )}
                {currentTab === "contactus" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> support@sevadoot.com</p>
                      <p><strong>Phone:</strong> +91 9879790705</p>
                      <p><strong>Address:</strong> Surat, Gujarat</p>
                      <p className="mt-4 text-sm text-gray-500">Our support team is available 24/7 to assist you.</p>
                    </div>
                  </div>
                )}
                {currentTab === "registernow" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Register Now</h3>
                    <p className="mb-3">Create your account to access the HR Partner System.</p>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="font-medium text-[#11707B]">Benefits of registering:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Full access to HR dashboard</li>
                        <li>Manage candidates and interviews</li>
                        <li>Generate offer letters</li>
                        <li>Track hiring progress</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- HR DASHBOARD ----------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-[#11707B] text-white flex flex-col sidebar-transition no-print`}
      >
        <div className="p-4 font-bold text-lg flex items-center gap-2">
          <span className="text-xl">⚡</span>
          {sidebarOpen && <span>HR Partner</span>}
        </div>
        <nav className="flex-1 mt-6">
          {["Dashboard", "Interview Schedule", "Candidates", "Offer Letters", "Settings"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#0e5a63] ${
                  activeNav === item ? "bg-[#0a444b]" : ""
                }`}
              >
                <span className="text-xl">
                  {item === "Dashboard"
                    ? "📊"
                    : item === "Interview Schedule"
                    ? "📅"
                    : item === "Candidates"
                    ? "👤"
                    : item === "Offer Letters"
                    ? "📄"
                    : "⚙️"}
                </span>
                {sidebarOpen && <span>{item}</span>}
              </button>
            )
          )}
        </nav>
        <div className="p-4 border-t border-[#0e5a63] flex items-center gap-2">
          <span className="text-sm truncate">{session?.fullName}</span>
          <button
            onClick={handleLogout}
            className="ml-auto text-xs bg-[#0a444b] px-3 py-1 rounded hover:bg-opacity-80"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-600"
            >
              ☰
            </button>
            <h2 className="text-lg font-semibold">{activeNav}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {session?.fullName} ({session?.role})
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeNav === "Dashboard" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["Interview Scheduled", "In Interview", "Selected", "Rejected"].map(
                  (label) => (
                    <div
                      key={label}
                      className="bg-white p-4 rounded shadow border-l-4 border-[#11707B]"
                    >
                      <div className="text-sm text-gray-500">{label}</div>
                      <div className="text-2xl font-bold">{stats[label] || 0}</div>
                    </div>
                  )
                )}
              </div>
              <div className="mt-6 bg-white p-4 rounded shadow">
                <p className="text-gray-500">Recent activity overview</p>
              </div>
            </div>
          )}

          {activeNav === "Interview Schedule" && (
            <div>
              <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-3">Schedule Interview</h3>
                <form
                  onSubmit={handleScheduleInterview}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm">Candidate Name</label>
                    <input
                      value={interviewForm.candidateName}
                      onChange={(e) =>
                        setInterviewForm({ ...interviewForm, candidateName: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {interviewErrors.candidateName && (
                      <span className="text-red-600 text-xs">{interviewErrors.candidateName}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Position</label>
                    <input
                      value={interviewForm.position}
                      onChange={(e) =>
                        setInterviewForm({ ...interviewForm, position: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {interviewErrors.position && (
                      <span className="text-red-600 text-xs">{interviewErrors.position}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={interviewForm.dateTime}
                      onChange={(e) =>
                        setInterviewForm({ ...interviewForm, dateTime: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {interviewErrors.dateTime && (
                      <span className="text-red-600 text-xs">{interviewErrors.dateTime}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Interviewer</label>
                    <input
                      value={interviewForm.interviewer}
                      onChange={(e) =>
                        setInterviewForm({ ...interviewForm, interviewer: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {interviewErrors.interviewer && (
                      <span className="text-red-600 text-xs">{interviewErrors.interviewer}</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-[#11707B] text-white px-4 py-2 rounded hover:bg-[#0e5a63]"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3">Upcoming Interviews</h3>
                {interviews.length === 0 ? (
                  <p className="text-gray-400">No interviews scheduled</p>
                ) : (
                  interviews.map((i) => (
                    <div key={i.id} className="border-b py-2 flex justify-between">
                      <div>
                        <span className="font-medium">{i.candidateName}</span> – {i.position} with{" "}
                        {i.interviewer}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(i.dateTime).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeNav === "Candidates" && (
            <div>
              <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-center">
                <label className="text-sm font-medium">Filter by stage:</label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">All</option>
                  {["Interview Scheduled", "In Interview", "Selected", "Rejected"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white p-4 rounded shadow">
                {candidates.length === 0 ? (
                  <p className="text-gray-400">No candidates added yet</p>
                ) : filteredCandidates.length === 0 ? (
                  <p className="text-gray-400">No candidates match the selected filter</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th>Position</th>
                          <th>Interviewer</th>
                          <th>Stage</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCandidates.map((c) => {
                          const stageColors = {
                            "Interview Scheduled": "bg-blue-500",
                            "In Interview": "bg-yellow-500",
                            "Selected": "bg-green-500",
                            "Rejected": "bg-red-500",
                          };
                          return (
                            <tr key={c.id} className="border-b">
                              <td className="py-2">{c.name}</td>
                              <td>{c.position}</td>
                              <td>{c.interviewer}</td>
                              <td>
                                <span
                                  className={`px-2 py-0.5 rounded text-white text-xs ${
                                    stageColors[c.stage] || "bg-gray-400"
                                  }`}
                                >
                                  {c.stage}
                                </span>
                              </td>
                              <td>
                                <select
                                  value={c.stage}
                                  onChange={(e) => updateCandidateStage(c.id, e.target.value)}
                                  className="border rounded px-1 py-0.5 text-xs"
                                >
                                  {["Interview Scheduled", "In Interview", "Selected", "Rejected"].map(
                                    (s) => (
                                      <option key={s}>{s}</option>
                                    )
                                  )}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeNav === "Offer Letters" && (
            <div>
              <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-3">Generate Offer Letter</h3>
                <form
                  onSubmit={handleGenerateOffer}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm">Candidate Name</label>
                    <input
                      value={offerForm.candidateName}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, candidateName: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {offerErrors.candidateName && (
                      <span className="text-red-600 text-xs">{offerErrors.candidateName}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Position</label>
                    <input
                      value={offerForm.position}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, position: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {offerErrors.position && (
                      <span className="text-red-600 text-xs">{offerErrors.position}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Salary</label>
                    <input
                      value={offerForm.salary}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, salary: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                      placeholder="0.00"
                    />
                    {offerErrors.salary && (
                      <span className="text-red-600 text-xs">{offerErrors.salary}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Joining Date</label>
                    <input
                      type="date"
                      value={offerForm.joiningDate}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, joiningDate: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {offerErrors.joiningDate && (
                      <span className="text-red-600 text-xs">{offerErrors.joiningDate}</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm">Company Name</label>
                    <input
                      value={offerForm.companyName}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, companyName: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    {offerErrors.companyName && (
                      <span className="text-red-600 text-xs">{offerErrors.companyName}</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-[#11707B] text-white px-4 py-2 rounded hover:bg-[#0e5a63]"
                    >
                      Generate Offer
                    </button>
                  </div>
                </form>
              </div>

              {lastOffer && (
                <div className="bg-white p-6 rounded shadow mb-6 offer-letter-preview">
                  <div className="text-right text-sm text-gray-400">
                    Generated: {new Date(lastOffer.generatedAt).toLocaleString()}
                  </div>
                  <h2 className="text-2xl font-bold text-[#11707B]">{lastOffer.companyName}</h2>
                  <div className="mt-4 border-t pt-4">
                    <p>
                      <span className="font-semibold">To:</span> {lastOffer.candidateName}
                    </p>
                    <p>
                      <span className="font-semibold">Position:</span> {lastOffer.position}
                    </p>
                    <p>
                      <span className="font-semibold">Salary:</span>{" "}
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(lastOffer.salary)}
                    </p>
                    <p>
                      <span className="font-semibold">Joining Date:</span> {lastOffer.joiningDate}
                    </p>
                    <div className="mt-4 text-gray-700">
                      <p>Dear {lastOffer.candidateName},</p>
                      <p className="mt-2">
                        We are pleased to offer you the position of <strong>{lastOffer.position}</strong> at{" "}
                        {lastOffer.companyName}. Your salary will be{" "}
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD",
                        }).format(lastOffer.salary)}{" "}
                        and your joining date is set for {lastOffer.joiningDate}.
                      </p>
                      <p className="mt-2">We look forward to welcoming you to our team.</p>
                      <p className="mt-4">
                        Sincerely,
                        <br />
                        {lastOffer.companyName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="mt-4 bg-[#11707B] text-white px-4 py-2 rounded hover:bg-[#0e5a63] no-print"
                  >
                    Print / Download PDF
                  </button>
                </div>
              )}

              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3">Generated Offers</h3>
                {offerLetters.length === 0 ? (
                  <p className="text-gray-400">No offer letters generated</p>
                ) : (
                  offerLetters.map((o) => (
                    <div key={o.id} className="border-b py-2 flex justify-between">
                      <span>
                        {o.candidateName} – {o.position}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(o.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeNav === "Settings" && (
            <div className="bg-white p-6 rounded shadow max-w-xl">
              <h3 className="font-semibold mb-4">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <div className="text-gray-700">{session?.fullName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <div className="text-gray-700">{session?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <div className="text-gray-700">{session?.role}</div>
                </div>
              </div>
              <hr className="my-4" />
              <form onSubmit={handleUpdateName} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Update Name</label>
                  <input
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="New name"
                  />
                </div>
                {settingsMsg.text && (
                  <div
                    className={`text-sm ${
                      settingsMsg.type === "error" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {settingsMsg.text}
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-[#11707B] text-white px-4 py-2 rounded hover:bg-[#0e5a63]"
                >
                  Update Name
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .sidebar-transition {
          transition: width 0.2s ease, padding 0.2s ease;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .offer-letter-preview,
          .offer-letter-preview * {
            visibility: visible;
          }
          .offer-letter-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function HRPartnerPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HRPartnerPageInner />
    </Suspense>
  );
}
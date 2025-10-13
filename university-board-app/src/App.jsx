import React, { useState, useEffect, useMemo } from 'react';

// --- MOCK DATA ---
// In a real application, this data would come from a database.
const MOCK_ANNOUNCEMENTS = [
    { id: 1, title: "Mid-Semester Break Announced", date: "2025-10-20", content: "The university will be on mid-semester break from October 27th to October 31st. Classes will resume on November 3rd.", category: "Academic" },
    { id: 2, title: "Annual Tech Fest 'Innovate 2025'", date: "2025-10-18", content: "Get ready for the biggest tech event of the year! Innovate 2025 will feature coding competitions, workshops, and guest speakers. Register by October 25th.", category: "Events" },
    { id: 3, title: "Library Opening Hours Extended", date: "2025-10-15", content: "To facilitate students during the exam period, the main library will be open 24/7 from November 1st until the end of the semester.", category: "Facilities" },
    { id: 4, title: "Scholarship Applications Now Open", date: "2025-10-12", content: "Applications for the new academic session scholarships are now open. The deadline for submission is November 15th.", category: "Academic" },
    { id: 5, title: "Guest Lecture on Artificial Intelligence", date: "2025-10-10", content: "Join us for an insightful lecture by Dr. Ada Lovelace on 'The Future of AI' this Friday at the main auditorium.", category: "Events" },
];

const MOCK_EVENTS = [
    { id: 1, name: "Innovate 2025 Tech Fest", date: "2025-11-05", time: "09:00 AM", location: "Main Auditorium", description: "Annual technology festival with various competitions and workshops." },
    { id: 2, name: "University Sports Day", date: "2025-11-12", time: "08:00 AM", location: "University Stadium", description: "Track and field events, team sports, and fun activities." },
    { id: 3, name: "Career Fair", date: "2025-11-20", time: "10:00 AM", location: "Exhibition Hall", description: "Meet with top companies from various industries and explore job opportunities." },
    { id: 4, name: "Alumni Homecoming", date: "2025-12-05", time: "06:00 PM", location: "University Grand Hall", description: "A special evening to reconnect with old friends and faculty." },
    { id: 5, name: "End of Semester Concert", date: "2025-12-15", time: "07:00 PM", location: "Open Air Theatre", description: "Celebrate the end of the semester with live music and performances." },
];

const MOCK_USER = {
    id: 'U001',
    name: 'Alex Doe',
    email: 'alex.doe@university.edu',
    studentId: 'CSC/2022/001',
    department: 'Computer Science',
    year: '3rd Year',
    avatar: `https://placehold.co/200x200/6366f1/ffffff?text=AD`,
};

const MOCK_TIMETABLE = {
    Monday: [{ time: "09:00-11:00", course: "Advanced Algorithms", code: "CSC301", venue: "Hall A" }, { time: "13:00-15:00", course: "Operating Systems", code: "CSC303", venue: "Lab 2" }],
    Tuesday: [{ time: "10:00-12:00", course: "Software Engineering", code: "CSC305", venue: "Hall B" }],
    Wednesday: [{ time: "09:00-11:00", course: "Advanced Algorithms", code: "CSC301", venue: "Hall A" }, { time: "14:00-16:00", course: "Computer Networks", code: "CSC307", venue: "Hall C" }],
    Thursday: [{ time: "10:00-12:00", course: "Software Engineering", code: "CSC305", venue: "Hall B" }],
    Friday: [{ time: "11:00-13:00", course: "Operating Systems", code: "CSC303", venue: "Lab 2" }, { time: "15:00-17:00", course: "Computer Networks", code: "CSC307", venue: "Hall C" }],
    Saturday: [],
    Sunday: [],
};

const MOCK_RESULTS = [
    { code: "CSC201", title: "Data Structures", grade: "A", score: 85 },
    { code: "CSC202", title: "Digital Logic Design", grade: "B", score: 72 },
    { code: "MTH201", title: "Linear Algebra", grade: "A", score: 91 },
    { code: "PHY201", title: "General Physics II", grade: "C", score: 65 },
];


// --- ICONS ---
// In a real project, you would install a library like lucide-react.
// Here, we define simple SVG components for demonstration.
const HomeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const AnnounceIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const EventIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const TimetableIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="10" x2="10" y1="5" y2="19"/></svg>
);

const ResultIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 13-2 2 2 2"/><path d="m14 13 2 2-2 2"/></svg>
);

const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const LogOutIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const MenuIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const SearchIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const ChevronLeftIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);


// --- Reusable Components ---
const Card = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, className, variant = 'primary' }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </button>
    );
};


// --- Page Components ---

const LandingPage = ({ setPage }) => (
    <div className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Welcome to the <span className="text-indigo-600">University Student Board</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Your central hub for announcements, events, timetables, and results. Stay connected with campus life.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button onClick={() => setPage('announcements')}>View Announcements</Button>
            <Button onClick={() => setPage('events')} variant="secondary">Upcoming Events</Button>
        </div>
    </div>
);

const SearchAndFilter = ({ searchTerm, setSearchTerm, filter, setFilter, filterOptions, placeholder }) => (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm sticky top-16 z-10">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder={placeholder || "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {filterOptions && (
                 <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                    <option value="all">All Categories</option>
                    {filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            )}
        </div>
    </div>
);

const AnnouncementsPage = ({ announcements, setPage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredAnnouncements = useMemo(() => {
        return announcements
            .filter(a => searchTerm === '' || a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.content.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(a => categoryFilter === 'all' || a.category === categoryFilter);
    }, [searchTerm, categoryFilter, announcements]);
    
    const categories = [...new Set(announcements.map(a => a.category))];

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Announcements</h2>
            <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={categoryFilter}
                setFilter={setCategoryFilter}
                filterOptions={categories}
                placeholder="Search announcements..."
            />
            <div className="space-y-6">
                {filteredAnnouncements.length > 0 ? filteredAnnouncements.map(ann => (
                    <Card key={ann.id}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-indigo-600">{ann.category}</p>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1">{ann.title}</h3>
                                </div>
                                <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{new Date(ann.date).toLocaleDateString()}</p>
                            </div>
                            <p className="mt-3 text-gray-600">{ann.content}</p>
                        </div>
                    </Card>
                )) : (
                    <p className="text-center text-gray-500 py-10">No announcements found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};


const EventsPage = ({ events, setPage, title, archive = false }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter(e => {
                const eventDate = new Date(e.date);
                return archive ? eventDate < now : eventDate >= now;
            })
            .filter(e => searchTerm === '' || e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => archive ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
    }, [events, archive, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                 <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                 { !archive && <Button onClick={() => setPage('events-archive')} variant="secondary">View Archive</Button> }
            </div>
             <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search events..."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.length > 0 ? filteredEvents.map(event => (
                    <Card key={event.id} className="flex flex-col">
                        <div className="p-6 flex-grow">
                            <p className="text-sm font-semibold text-indigo-600">{new Date(event.date).toDateString()}</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">{event.name}</h3>
                            <p className="text-gray-500 text-sm mt-2">{event.time} @ {event.location}</p>
                            <p className="mt-3 text-gray-600 text-sm">{event.description}</p>
                        </div>
                        <div className="bg-gray-50 p-4">
                            <Button className="w-full">Event Details</Button>
                        </div>
                    </Card>
                )) : (
                     <p className="text-center text-gray-500 py-10 md:col-span-2 lg:col-span-3">No events found.</p>
                )}
            </div>
        </div>
    );
};

const CalendarPage = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
    const daysInMonth = endOfMonth.getDate();

    const days = Array.from({ length: startDay }, (_, i) => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    
    const eventsByDate = useMemo(() => {
        const map = {};
        events.forEach(event => {
            const d = new Date(event.date);
            if (d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth()) {
                const day = d.getDate();
                if (!map[day]) map[day] = [];
                map[day].push(event);
            }
        });
        return map;
    }, [events, currentDate]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const today = new Date();

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Events Calendar</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={prevMonth} variant="secondary"><ChevronLeftIcon className="h-5 w-5"/></Button>
                    <h3 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <Button onClick={nextMonth} variant="secondary"><ChevronRightIcon className="h-5 w-5"/></Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        const isToday = day && currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth() && day === today.getDate();
                        return (
                            <div key={index} className={`border rounded-md min-h-[120px] p-2 ${day ? 'bg-white' : 'bg-gray-50'}`}>
                                {day && (
                                    <>
                                        <span className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${isToday ? 'bg-indigo-600 text-white font-bold' : ''}`}>
                                            {day}
                                        </span>
                                        <div className="mt-1 space-y-1">
                                            {eventsByDate[day]?.map(e => (
                                                <div key={e.id} className="bg-indigo-100 text-indigo-800 text-xs rounded px-1 py-0.5 truncate" title={e.name}>
                                                    {e.name}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const TimetablePage = () => (
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">My Timetable</h2>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Day</th>
                        <th className="p-4 font-semibold text-gray-600">Schedule</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {Object.entries(MOCK_TIMETABLE).map(([day, classes]) => (
                        <tr key={day}>
                            <td className="p-4 font-semibold w-1/5 align-top">{day}</td>
                            <td className="p-4">
                                {classes.length > 0 ? (
                                    <div className="space-y-3">
                                        {classes.map((c, i) => (
                                            <div key={i} className="p-3 bg-indigo-50 rounded-lg">
                                                <p className="font-bold text-indigo-800">{c.course} ({c.code})</p>
                                                <p className="text-sm text-gray-600">{c.time} @ {c.venue}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No classes scheduled.</p>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ResultsPage = () => {
    const calculateGPA = () => {
        // Simple GPA calculation (A=5, B=4, C=3, D=2, E=1, F=0)
        const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
        const totalPoints = MOCK_RESULTS.reduce((acc, result) => acc + (gradePoints[result.grade] || 0), 0);
        return (totalPoints / MOCK_RESULTS.length).toFixed(2);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">My Results</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Last Semester Performance</h3>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b">
                                    <tr>
                                        <th className="p-3 font-semibold text-gray-600">Course Code</th>
                                        <th className="p-3 font-semibold text-gray-600">Course Title</th>
                                        <th className="p-3 font-semibold text-gray-600 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_RESULTS.map(result => (
                                        <tr key={result.code} className="border-b">
                                            <td className="p-3">{result.code}</td>
                                            <td className="p-3">{result.title}</td>
                                            <td className="p-3 font-bold text-center">{result.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6 text-center bg-indigo-600 text-white h-full flex flex-col justify-center">
                        <h3 className="text-xl font-bold">Semester GPA</h3>
                        <p className="text-6xl font-extrabold my-4">{calculateGPA()}</p>
                        <p className="text-indigo-200">Well done, Alex! Keep up the great work.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const DashboardPage = ({ user, setPage }) => (
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome back, {user.name.split(' ')[0]}!</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Links */}
            <Card className="lg:col-span-1">
                 <div className="p-6">
                    <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                    <div className="space-y-3">
                        <a href="#" onClick={(e) => {e.preventDefault(); setPage('timetable');}} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <TimetableIcon className="h-6 w-6 text-indigo-600"/>
                            <span>My Timetable</span>
                        </a>
                         <a href="#" onClick={(e) => {e.preventDefault(); setPage('results');}} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <ResultIcon className="h-6 w-6 text-indigo-600"/>
                            <span>Check Results</span>
                        </a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setPage('calendar');}} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <EventIcon className="h-6 w-6 text-indigo-600"/>
                            <span>Events Calendar</span>
                        </a>
                    </div>
                </div>
            </Card>
            {/* Recent Announcements */}
            <Card className="md:col-span-2">
                 <div className="p-6">
                    <h3 className="font-bold text-lg mb-4">Recent Announcements</h3>
                    <div className="space-y-4">
                        {MOCK_ANNOUNCEMENTS.slice(0, 3).map(ann => (
                            <div key={ann.id} className="border-b pb-3 last:border-b-0">
                                <p className="font-semibold">{ann.title}</p>
                                <p className="text-sm text-gray-500">{ann.content.substring(0, 70)}...</p>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => setPage('announcements')} className="mt-4">View All</Button>
                </div>
            </Card>
        </div>
    </div>
);

const ProfilePage = ({ user, setUser, setPage }) => (
     <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">My Profile</h2>
        <Card>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src={user.avatar} alt="User Avatar" className="h-32 w-32 rounded-full ring-4 ring-indigo-200" />
                    <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-2xl font-bold">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-500 text-sm mt-2">{user.studentId}</p>
                    </div>
                    <Button onClick={() => { setUser(null); setPage('landing'); }} variant="danger">Logout</Button>
                </div>
                <div className="mt-8 border-t pt-6">
                    <h4 className="font-bold text-lg mb-4">Academic Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-500">Department</p>
                            <p className="text-lg text-gray-800">{user.department}</p>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-500">Year of Study</p>
                            <p className="text-lg text-gray-800">{user.year}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
);

const LoginPage = ({ setUser, setPage }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, you would verify credentials
        setUser(MOCK_USER);
        setPage('dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Login to your Account</h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" defaultValue="alex.doe@university.edu" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" defaultValue="password" />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Don't have an account? <a href="#" onClick={(e) => {e.preventDefault(); setPage('register');}} className="font-medium text-indigo-600 hover:text-indigo-500">Register</a>
                </p>
            </div>
        </div>
    );
};

const RegisterPage = ({ setUser, setPage }) => {
    const handleRegister = (e) => {
        e.preventDefault();
        // In a real app, you would create a new user
        setUser(MOCK_USER); // Log in the new user immediately
        setPage('dashboard');
    };
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Create an Account</h2>
                <form className="space-y-6" onSubmit={handleRegister}>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); setPage('login');}} className="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
                </p>
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    const [page, setPage] = useState('landing');
    const [user, setUser] = useState(null); // null if logged out, user object if logged in
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Redirect to login if trying to access protected pages while logged out
    useEffect(() => {
        const protectedPages = ['dashboard', 'profile', 'timetable', 'results'];
        if (!user && protectedPages.includes(page)) {
            setPage('login');
        }
        if (user && (page === 'login' || page === 'register')){
            setPage('dashboard');
        }
    }, [page, user]);
    
    const handleSetPage = (newPage) => {
        setPage(newPage);
        setIsMenuOpen(false); // Close menu on navigation
    }

    const renderPage = () => {
        switch(page) {
            case 'landing':
                return <LandingPage setPage={handleSetPage} />;
            case 'announcements':
                return <AnnouncementsPage announcements={MOCK_ANNOUNCEMENTS} setPage={handleSetPage} />;
            case 'events':
                return <EventsPage events={MOCK_EVENTS} setPage={handleSetPage} title="Upcoming Events" />;
            case 'events-archive':
                 return <EventsPage events={MOCK_EVENTS} setPage={handleSetPage} title="Events Archive" archive={true} />;
            case 'calendar':
                return <CalendarPage events={MOCK_EVENTS} />;
            case 'timetable':
                return <TimetablePage />;
            case 'results':
                return <ResultsPage />;
            case 'dashboard':
                return user ? <DashboardPage user={user} setPage={handleSetPage} /> : null;
            case 'profile':
                return user ? <ProfilePage user={user} setUser={setUser} setPage={handleSetPage} /> : null;
            case 'login':
                return <LoginPage setUser={setUser} setPage={handleSetPage} />;
            case 'register':
                return <RegisterPage setUser={setUser} setPage={handleSetPage} />;
            default:
                return <LandingPage setPage={handleSetPage} />;
        }
    }

    const NavLink = ({ target, children }) => (
        <a 
            href="#"
            onClick={(e) => { e.preventDefault(); handleSetPage(target); }}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === target ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'}`}
        >
            {children}
        </a>
    );
    
    const MobileNavLink = ({ target, children, icon }) => (
         <a 
            href="#"
            onClick={(e) => { e.preventDefault(); handleSetPage(target); }}
            className={`flex items-center gap-3 px-4 py-2 text-base font-medium rounded-lg transition-colors ${page === target ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        >
            {icon}
            {children}
        </a>
    );
    
    const mainNavLinks = [
        {target: 'announcements', label: 'Announcements'},
        {target: 'events', label: 'Events'},
        {target: 'calendar', label: 'Calendar'},
    ];
    
     const userNavLinks = [
        {target: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5"/>},
        {target: 'timetable', label: 'Timetable', icon: <TimetableIcon className="h-5 w-5"/>},
        {target: 'results', label: 'Results', icon: <ResultIcon className="h-5 w-5"/>},
        {target: 'profile', label: 'Profile', icon: <UserIcon className="h-5 w-5"/>},
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-indigo-600 sticky top-0 z-20 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSetPage(user ? 'dashboard' : 'landing'); }} className="text-white font-bold text-xl flex-shrink-0">
                                UniBoard
                            </a>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                   {mainNavLinks.map(link => <NavLink key={link.target} target={link.target}>{link.label}</NavLink>)}
                                   {user && <NavLink target="timetable">Timetable</NavLink>}
                                   {user && <NavLink target="results">Results</NavLink>}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                             {user ? (
                                <div className="flex items-center gap-4">
                                    <NavLink target="profile">
                                        <div className="flex items-center gap-2">
                                            <img src={user.avatar} className="h-8 w-8 rounded-full" />
                                            <span>{user.name}</span>
                                        </div>
                                    </NavLink>
                                    <button onClick={() => { setUser(null); setPage('landing'); }} className="p-2 rounded-full text-gray-300 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                        <LogOutIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Button onClick={() => handleSetPage('login')} variant="secondary">Login</Button>
                                    <Button onClick={() => handleSetPage('register')}>Register</Button>
                                </div>
                            )}
                        </div>
                         <div className="-mr-2 flex md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                                <span className="sr-only">Open main menu</span>
                                <MenuIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {user ? (
                                <>
                                 {userNavLinks.map(link => <MobileNavLink key={link.target} target={link.target} icon={link.icon}>{link.label}</MobileNavLink>)}
                                 <hr className="my-2"/>
                                </>
                            ): null}
                            <MobileNavLink target="announcements" icon={<AnnounceIcon className="h-5 w-5"/>}>Announcements</MobileNavLink>
                            <MobileNavLink target="events" icon={<EventIcon className="h-5 w-5"/>}>Events</MobileNavLink>
                            <MobileNavLink target="calendar" icon={<EventIcon className="h-5 w-5"/>}>Calendar</MobileNavLink>
                        </div>
                         <div className="pt-4 pb-3 border-t border-gray-200">
                             {user ? (
                                 <div className="px-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                         <img className="h-10 w-10 rounded-full" src={user.avatar} alt=""/>
                                         <div>
                                            <div className="text-base font-medium leading-none text-gray-800">{user.name}</div>
                                            <div className="text-sm font-medium leading-none text-gray-500">{user.email}</div>
                                         </div>
                                     </div>
                                     <button onClick={() => { setUser(null); setPage('landing'); setIsMenuOpen(false); }} className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <LogOutIcon className="h-6 w-6" />
                                     </button>
                                 </div>
                             ) : (
                                <div className="px-2 space-y-2">
                                     <Button onClick={() => handleSetPage('login')} className="w-full">Login</Button>
                                     <Button onClick={() => handleSetPage('register')} className="w-full" variant="secondary">Register</Button>
                                </div>
                             )}
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {renderPage()}
            </main>
            
            <footer className="bg-white border-t mt-12">
                <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} University Student Board. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}


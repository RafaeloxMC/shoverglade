"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Slot {
    _id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    userId: string | null;
    bookedBy?: {
        name: string;
        avatar: string;
    };
}

interface User {
    _id: string;
    slackId: string;
    name: string;
    avatar: string;
    isAdmin: boolean;
}

export default function Dashboard() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch slots
    const fetchSlots = async (silent = false) => {
        if(!silent) setLoading(true);
        try {
            const res = await fetch("/api/v1/slots");
            if (res.ok) {
                const data = await res.json();
                setSlots(data.slots);
            }
        } catch (error) {
            console.error("Failed to fetch slots", error);
            toast.error("Failed to load shower slots.");
        } finally {
            if(!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
        fetch("/api/v1/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if(data.user) {
                    setUser(data.user);
                } else {
                    handleLogout();
                }
            })
            .catch(() => {
                handleLogout();
            });
    }, []);

    const handleLogout = async () => {
         await fetch("/api/v1/auth/logout", { method: "POST" });
         window.location.href = "/";
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) return;
        
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/v1/slots/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slotId: selectedSlot._id })
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Booking failed");
            } else {
                toast.success("Shower booked successfully!");
                setSelectedSlot(null);
                fetchSlots(true); 
            }
        } catch (e) {
            toast.error("Network error while booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async (slotId: string) => {
         if (!confirm("Are you sure you want to cancel this booking?")) return;
         
         setIsSubmitting(true);
         try {
            const res = await fetch("/api/v1/slots/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slotId })
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Cancel failed");
            } else {
                toast.success("Booking cancelled.");
                fetchSlots(true);
            }
        } catch (e) {
            toast.error("Network error while cancelling");
        } finally {
            setIsSubmitting(false);
        }
    };

    const myBooking = slots.find(s => s.userId === user?._id);

    if (loading && !slots.length) return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-t-blue-500 border-zinc-800 animate-spin" />
                <p className="text-zinc-500 text-sm">Loading schedule...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-blue-100">
            {/* Header */}
            <header className="flex justify-between items-center p-6 md:p-8 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                        Shoverglade
                    </h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-zinc-500">Hack Clubber</span>
                    </div>
                    {user?.avatar && (
                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full border border-zinc-200" />
                    )}
                     <button 
                        onClick={handleLogout}
                        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors ml-2"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-20">
                
                {/* Status Card */}
                {myBooking ? (
                     <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 mb-2">You have a spot reserved!</h2>
                                <p className="text-zinc-600">
                                    Your shower is scheduled for <span className="font-semibold text-zinc-900">{format(new Date(myBooking.startTime), "EEEE h:mm a")}</span>.
                                </p>
                            </div>
                            <button 
                                onClick={() => handleCancel(myBooking._id)}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 hover:border-red-300 transition-all text-sm"
                            >
                                {isSubmitting ? "Cancelling..." : "Cancel Reservation"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Time to freshen up?</h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                Choose an available slot below to lock in your shower time. 
                                Slots are 15 minutes each to keep the line moving!
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                {slots.filter(s => !s.isBooked).length} slots available today
                            </div>
                        </div>
                        
                        {/* Decorative Background */}
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-12 right-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
                    </div>
                )}

                {/* Slots Grid */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                        Available Slots
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.map((slot) => {
                            const startTime = new Date(slot.startTime);
                            const isMyBooking = slot.userId === user?._id;
                            
                            return (
                                <button
                                    key={slot._id}
                                    disabled={slot.isBooked}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={cn(
                                        "group relative flex flex-col items-start p-5 rounded-xl border transition-all duration-200",
                                        slot.isBooked 
                                            ? isMyBooking
                                                ? "bg-green-50 border-green-200 cursor-default" 
                                                : "bg-zinc-50 border-zinc-100 opacity-60 cursor-not-allowed"
                                            : "bg-white border-zinc-200 hover:border-blue-400 hover:shadow-md cursor-pointer hover:-translate-y-1"
                                    )}
                                >
                                    <div className="text-lg font-bold text-zinc-900 mb-1">
                                        {format(startTime, "h:mm a")}
                                    </div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">
                                        {format(startTime, "EEE, MMM d")}
                                    </div>

                                    <div className="mt-auto w-full pt-4 border-t border-zinc-100 flex items-center justify-between">
                                        {slot.isBooked ? (
                                            isMyBooking ? (
                                                <span className="text-green-600 font-bold text-sm flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                    Reserved
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {slot.bookedBy?.avatar ? (
                                                        <img src={slot.bookedBy.avatar} alt="User" className="w-6 h-6 rounded-full grayscale opacity-70" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-zinc-200" />
                                                    )}
                                                    <span className="text-zinc-400 text-sm font-medium">Taken</span>
                                                </div>
                                            )
                                        ) : (
                                            <span className="text-blue-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Book Now
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Confirm Reservation</h3>
                            <p className="text-zinc-600">
                                You are about to book the shower for <br/>
                                <strong className="text-zinc-900">{format(new Date(selectedSlot.startTime), "EEEE, h:mm a")}</strong>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Confirming..." : "Yes, Book It"}
                            </button>
                            <button
                                onClick={() => setSelectedSlot(null)}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

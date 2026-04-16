"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MiniCalendar = () => {
	return (
		<div className="bg-revDeskBlack-dark rounded-xl p-5 flex-1 flex flex-col">
			<h2 className="text-sm font-bold text-white mb-4">Calendar</h2>
			<Calendar className="revdesk-calendar" />
		</div>
	);
};

export default MiniCalendar;

import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(utc);
dayjs.extend(timezone);

interface EventCardProps {
  title: string;
  note: string;
  dayLeft: string; // ISO string จาก backend
}

function EventCard({ title, note, dayLeft }: EventCardProps) {
  const today = dayjs().tz("Asia/Bangkok").startOf("day");
  const targetDate = dayjs(dayLeft).tz("Asia/Bangkok").startOf("day");
  const diffDays = targetDate.diff(today, "day");

  let displayText = "";
  let badgeColor = "bg-gray-100 text-gray-800"; // default

  if (diffDays > 0) {
    displayText = `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
    if (diffDays <= 1) badgeColor = "bg-red-100 text-red-600";
    else if (diffDays <= 3) badgeColor = "bg-yellow-100 text-yellow-800";
    else badgeColor = "bg-blue-100 text-blue-800";
  } else if (diffDays === 0) {
    displayText = "Today";
    badgeColor = "bg-orange-100 text-orange-800";
  } else {
    displayText = `${Math.abs(diffDays)} day${
      Math.abs(diffDays) > 1 ? "s" : ""
    } ago`;
    badgeColor = "bg-gray-200 text-gray-500";
  }

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-md p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Title */}
      <h6 className="text-lg font-semibold text-gray-800 mb-1">{title}</h6>

      {/* Note */}
      <span className="text-gray-500 text-sm mb-3">{note}</span>

      {/* Bottom row: clock & badge */}
      <div className="flex justify-between items-center">
        {/* Time icon */}
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <FontAwesomeIcon icon={faClock} />
          <span>{dayjs(dayLeft).fromNow()}</span>
        </div>

        {/* DayLeft Badge */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
        >
          {displayText}
        </span>
      </div>
    </div>
  );
}

export default EventCard;

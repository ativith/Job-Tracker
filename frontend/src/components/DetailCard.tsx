import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
dayjs.extend(relativeTime);

type Status = "applied" | "interview" | "offer" | "rejected" | "noresponse";

const statusStyles: Record<Status, string> = {
  applied: "bg-blue-100 text-blue-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  noresponse: "bg-gray-100 text-gray-800",
};

interface DetailCardProps {
  company: string;
  role: string;
  date: string;
  status: Status;
  children?: React.ReactNode;
}

function DetailCard({
  company,
  role,
  date,
  status,
  children,
}: DetailCardProps) {
  return (
    <div className="flex flex-col rounded-xl bg-white shadow-md p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Company */}
      <h6 className="text-lg font-semibold text-gray-800 mb-1">{company}</h6>

      {/* Role */}
      <span className="text-gray-500 text-sm mb-3">{role}</span>

      {/* Bottom Row: Time & Status */}
      <div className="flex justify-between items-center mb-3">
        {/* Time */}
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <FontAwesomeIcon icon={faClock} />
          <span>{dayjs(date).fromNow()}</span>
        </div>

        {/* Status */}
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* Children Content */}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default DetailCard;

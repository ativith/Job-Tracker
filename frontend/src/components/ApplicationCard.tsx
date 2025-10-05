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
  status: Status; // เปลี่ยนจาก Props เป็น Status
  tags: string;
}

function ApplicationCard({
  company,
  role,
  date,
  status,
  tags,
}: DetailCardProps) {
  return (
    <div className="flex flex-col rounded-lg  bg-white py-4 px-2 shadow-md">
      <h6>{company}</h6>
      <span className="text-gray-500">{role}</span>
      <div className="flex justify-between items-center">
        <div>
          <FontAwesomeIcon icon={faClock} />
          <span className="text-center">{dayjs(date).fromNow()}</span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
        >
          {status}
        </div>
      </div>
      <div className="flex flex-1 justify-between mt-2">
        {tags && (
          <div className="rounded-lg border-0 bg-sky-700 text-black px-2 text-center">
            {tags}
          </div>
        )}
        <div>
          <button className="rounded-sm border-1 px-2 mx-2">Edit</button>
          <button className="rounded-sm border-1 border-red-500 px-2 text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;

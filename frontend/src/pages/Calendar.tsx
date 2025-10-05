import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import type {
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventChangeArg,
} from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayOut from "../layouts/MainLayOut";
import Modal from "../components/ModalScreen";
import dayjs from "dayjs";
interface BackendEvent {
  id: number;
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  allDay: Boolean;
  note: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: Boolean;
  note: string;
}

const fetchEvents = async (): Promise<BackendEvent[]> => {
  const response = await axiosInstance.get<{ events: BackendEvent[] }>(
    API_PATH.EVENTS.GETEVENTS
  );
  return response.data.events;
};

function Test() {
  const queryClient = useQueryClient();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedEvent, setSelectedEvent] =
    useState<Partial<BackendEvent> | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
  useEffect(() => {
    if (data) {
      const formatted: CalendarEvent[] = data.map((ev) => ({
        id: ev.id.toString(),
        title: ev.title,
        start: ev.startDate,
        end: ev.endDate,
        allDay: ev.allDay,
        note: ev.note,
      }));
      setEvents(formatted);
    }
  }, [data]);

  const addEventsMutation = useMutation({
    mutationFn: (newEvents: Partial<BackendEvent>) =>
      axiosInstance.post(API_PATH.EVENTS.ADDEVENTS, newEvents),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const updateEventsMutation = useMutation({
    mutationFn: (events: BackendEvent) =>
      axiosInstance.put(API_PATH.EVENTS.UPDATEEVENTS(events.id), events),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
  const deleteEventsMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(API_PATH.EVENTS.DELETEEVENTS(id), {
        data: { eventId: id },
      }),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setModalMode("add");

    // ตรวจสอบว่าเป็น all-day event หรือ timed event
    const allDay = selectInfo.allDay;

    const tz = dayjs.tz.guess();

    // แปลงเป็น ISO string
    let startIso: string;
    let endIso: string;

    if (allDay) {
      // สำหรับ all-day event FullCalendar ให้ selectInfo.end เป็นวันถัดไป // เราต้องลบ 1ms หรือใช้ end - 1 วันถ้าอยากให้ครอบวันที่เลือกเท่านั้น
      const startDate = new Date(selectInfo.start);
      const endDate = new Date(selectInfo.end);
      endDate.setMilliseconds(endDate.getMilliseconds()); // ปรับ end ให้รวมวันสุดท้าย startIso = startDate.toISOString(); endIso = endDate.toISOString(); setSelectedEvent({ title: "", note: "", startDate: startIso, endDate: endIso, allDay: selectInfo.allDay, }); setIsModalOpen(true); } else {
      // timed event
      startIso = startDate.toISOString();
      endIso = endDate.toISOString();

      setSelectedEvent({
        title: "",
        note: "",
        startDate: startIso,
        endDate: endIso,
        allDay: selectInfo.allDay,
      });
      setIsModalOpen(true);
    } else {
      startIso = selectInfo.start.toISOString();
      endIso = selectInfo.end?.toISOString() || selectInfo.start.toISOString();

      setSelectedEvent({
        title: "",
        note: "",
        startDate: startIso,
        endDate: endIso,
        allDay: selectInfo.allDay,
      });
      setIsModalOpen(true);
    }
  };
  const handleEventClick = (clickInfo: EventClickArg) => {
    setModalMode("edit");
    const event = clickInfo.event;

    // แปลง start/end เป็น ISO string
    const startIso = event.start?.toISOString() || "";
    const endIso = event.end?.toISOString() || "";

    setSelectedEvent({
      id: Number(event.id),
      title: event.title,
      startDate: startIso,
      endDate: endIso,
      allDay: event.allDay,
      note: (clickInfo.event.extendedProps.note as string) || "",
    });

    setIsModalOpen(true);
  };

  const handleEventChange = (changeInfo: EventChangeArg) => {
    const event = changeInfo.event;

    // ส่งข้อมูลไป backend ทุกครั้งที่ลากหรือ resize
    const startIso = event.start?.toISOString() || "";
    const endIso = event.end?.toISOString() || "";
    const updatedEvent: BackendEvent = {
      id: Number(event.id),
      title: event.title,
      startDate: startIso,
      endDate: endIso,
      allDay: event.allDay,
      note: (event.extendedProps.note as string) || "",
    };
    updateEventsMutation.mutate(updatedEvent);
  };
  const handleDelete = () => {
    if (selectedEvent && selectedEvent.id) {
      deleteEventsMutation.mutate(selectedEvent.id);
      setIsModalOpen(false);
    }
  };
  const handleSave = () => {
    if (!selectedEvent) return;

    if (modalMode === "add") {
      addEventsMutation.mutate(selectedEvent);
    } else if (modalMode === "edit" && selectedEvent.id) {
      updateEventsMutation.mutate(selectedEvent as BackendEvent);
    }
    setIsModalOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading events</p>;
  return (
    <MainLayOut>
      <div className="relative z-[1]">
        <FullCalendar
          timeZone="local"
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          selectable={true}
          editable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          eventContent={(arg) => {
            return (
              <div className="p-1">
                <strong>{arg.event.title}</strong>
                {arg.event.extendedProps.note && (
                  <div className="text-sm">{arg.event.extendedProps.note}</div>
                )}
              </div>
            );
          }}
        />
      </div>
      <div className="absolute z-10">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">
            {modalMode === "add" ? "Add Event" : "Edit Event"}
          </h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              value={selectedEvent?.title || ""}
              onChange={(e) =>
                setSelectedEvent((prev) => ({
                  ...prev!,
                  title: e.target.value,
                }))
              }
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Note"
              value={selectedEvent?.note || ""}
              onChange={(e) =>
                setSelectedEvent((prev) => ({ ...prev!, note: e.target.value }))
              }
              className="border p-2 rounded"
            />
          </div>

          <div className="flex justify-between mt-4 gap-2">
            {/* ปุ่ม Delete ซ้ายล่าง */}
            {modalMode === "edit" && ( // แสดงเฉพาะตอนแก้ไข
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}

            {/* ปุ่ม Cancel + Save ขวาล่าง */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayOut>
  );
}

export default Test;

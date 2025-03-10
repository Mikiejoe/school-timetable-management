import { useEffect, useState } from "react";

const TIME_SLOTS_A = [
  "08:00 - 08:40",
  "08:40 - 09:20",
  "09:20 - 10:00",
  "10:00 - 10:40",
  "10:40 - 11:20",
  "11:20 - 12:00",
  "12:00 - 12:40",
  "12:40 - 13:20",
  "14:00 - 14:40",
  "14:40 - 15:20",
  "15:20 - 16:00",
  "16:00 - 16:40",
  "16:40 - 17:20",
];
const TIME_SLOTS = [
    "08:00:00 - 08:40:00",
    "08:40:00 - 09:20:00",
    "09:20:00 - 10:00:00",
    "10:00:00 - 10:40:00",
    "10:40:00 - 11:20:00",
    "11:20:00 - 12:00:00",
    "12:00:00 - 12:40:00",
    "12:40:00 - 13:20:00",
    "14:00:00 - 14:40:00",
    "14:40:00 - 15:20:00",
    "15:20:00 - 16:00:00",
    "16:00:00 - 16:40:00",
    "16:40:00 - 17:20:00",
  ];
  

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TeacherTimetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [timetable, setTimetable] = useState({});

  // Fetch teachers
  useEffect(() => {
    fetch("https://school-timetable-management.vercel.app/api/teachers/")
      .then((response) => response.json())
      .then((data) =>{ setTeachers(data);
        setSelectedTeacher(data[0].id)
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  // Fetch timetable for selected teacher
  useEffect(() => {
    if (selectedTeacher) {
      fetch(`https://school-timetable-management.vercel.app/api/timetable/teacher/${selectedTeacher}/`)
        .then((response) => response.json())
        .then((data) => {
          const formattedTimetable = {};
          DAYS_OF_WEEK.forEach((day) => {
            formattedTimetable[day] = {};
            TIME_SLOTS.forEach((slot) => {
              formattedTimetable[day][slot] = null;
            });
          });

          data.forEach((entry) => {
            const slot = `${entry.start_time} - ${entry.end_time}`;
            console.log("slot",slot)
            if (formattedTimetable[entry.day]) {
              formattedTimetable[entry.day][slot] = entry;
             console.log(formattedTimetable[entry.day][slot]) 
            }
          });
          console.log(formattedTimetable)
          setTimetable(formattedTimetable);
        })
        .catch((error) => console.error("Error fetching timetable:", error));
    }
  }, [selectedTeacher]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Teacher's Timetable</h1>

      {/* Teacher Selector */}
      <label className="block mb-2 font-semibold">Select Teacher:</label>
      <select
        className="border p-2 rounded mb-4 w-full"
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        <option value="">Select a teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.id}
          </option>
        ))}
      </select>

      {/* Timetable Display */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Day</th>
              {TIME_SLOTS_A.map((slot) => (
                <th key={slot} className="border px-4 py-2">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS_OF_WEEK.map((day) => (
              <tr key={day}>
                <td className="border px-4 py-2 font-bold bg-gray-100">{day}</td>
                {TIME_SLOTS.map((slot) => (
                  <td key={slot} className="border px-4 py-2">
                    {timetable[day]?.[slot] ? (
                      <>
                        <span className="block font-semibold">
                          {timetable[day][slot].subject_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {timetable[day][slot].classroom_name}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTimetable;

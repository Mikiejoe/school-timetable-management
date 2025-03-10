import { useEffect, useState } from "react";

const Timetable = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/timetables/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTimetableData(data);
        if (data.length > 0) setSelectedClass(data[0].id); // Set first class as default
      })
      .catch((error) => console.error("Error fetching timetable:", error));

    fetch("http://127.0.0.1:8000/api/teachers/") // Fetch teachers list
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  // Define time slots (40-minute intervals)
  const timeSlots = [
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
    "15:20 - 16:00"
  ];

  // Define weekdays
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Filter timetable based on selected class
  const filteredTimetable = timetableData.find((cls) => cls.id === selectedClass);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">School Timetable</h1>

      {/* Class Selector */}
      <label className="block mb-2 font-semibold">Select Class:</label>
      <select
        className="border p-2 rounded mb-4 w-full"
        value={selectedClass}
        onChange={(e) => setSelectedClass(Number(e.target.value))}
      >
        {timetableData.map((classItem) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.name}
          </option>
        ))}
      </select>

      {/* Teacher Selector */}
      <label className="block mb-2 font-semibold">Filter by Teacher:</label>
      <select
        className="border p-2 rounded mb-4 w-full"
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        <option value="">All Teachers</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.name}>
            {teacher.id}
          </option>
        ))}
      </select>

      {/* Timetable Table */}
      {filteredTimetable && (
        <div>
          <h2 className="text-lg font-semibold bg-gray-300 p-2 rounded">{filteredTimetable.name}</h2>
          <table className="table-auto w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Day</th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="border px-4 py-2">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day) => (
                <tr key={day}>
                  <td className="border px-4 py-2 font-semibold">{day}</td>
                  {timeSlots.map((slot) => {
                    const [start, end] = slot.split(" - ");
                    let entry = filteredTimetable.timetable.find(
                      (item) =>
                        item.day === day &&
                        item.start_time === start + ":00" &&
                        item.end_time === end + ":00"
                    );
                    

                    // Apply teacher filter if a teacher is selected
                    if (selectedTeacher && entry && entry.teacher !== selectedTeacher) {
                      entry = null;
                    }
                    // console.log("selse",selectedTeacher, "SE", "en",entry)

                    return (
                      <td key={slot} className="border px-4 py-2 text-center">
                        {entry ? (
                          <div>
                            {/* {entry} */}
                            <strong>{entry.subject_name}</strong> <br />
                            <span className="text-sm">{entry.teacher}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Timetable;

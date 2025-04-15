import { FaUserTie, FaUsers, FaBook } from 'react-icons/fa'

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <FaUserTie className="text-blue-600 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold">Total Teachers</h2>
          <p className="text-gray-600">42</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <FaUsers className="text-green-600 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-gray-600">2,150</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <FaBook className="text-purple-600 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold">Total Exams</h2>
          <p className="text-gray-600">18</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardCards

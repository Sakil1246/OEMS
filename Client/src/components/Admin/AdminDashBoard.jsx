import Navbar from '../Navbar'
import Footer from '../Footer'
// import Sidebar from './Sidebar'
import DashboardCards from './DashboardCards'
//import StudentStats from './StudentStats'

const AdminDashBoard = () => {
  return (
    <div className="min-h-screen flex flex-col fixed w-full">
      <Navbar />
      <div className="flex flex-grow">
        
        <main className="flex-grow p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <DashboardCards />
          
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashBoard

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = "http://localhost:8000";

function User() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  const loadData = async () => {
    try {
      console.log('On load');
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      await loadData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <div className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg'>
        <div className='flex h-14 px-2.5 md:px-20 items-center justify-between'>
          <span className='text-xl'>
            User management
          </span>
          <Link to="/">Register form</Link>
        </div>
      </div>
      <div className='border border-gray-200 w-full rounded-xl p-4 mx-auto gap-4' id='user'>
        <div className='space-y-4'>
          {users.map(user => (
            <div key={user.id} className='p-4 border rounded-md shadow-sm'>
              <span>{user.id}. {user.firstname} {user.lastname}</span>
              <Link to={`/?id=${user.id}`}>
                <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              </Link>
              <button
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default User;

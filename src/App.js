import { useEffect, useState } from 'react';
import './App.css';
import { Toaster } from '@blueprintjs/core';

const AppToaster = Toaster.create(); // Create a Toaster instance

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);  
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [count, setCount] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setUsers(data);
        setCount(data.length); // Set the initial count to match the fetched users
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  function addUser() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedWebsite = website.trim();
    if (trimmedName && trimmedEmail && trimmedWebsite) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: "POST",
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          website: trimmedWebsite
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      })
        .then((res) => res.json())
        .then(data => {
          setUsers([...users, data]);
          setName('');
          setEmail('');
          setWebsite('');
          setCount(prevCount => prevCount + 1); // Increment count after adding a user
        })
        .catch(error => {
          setError(error.message);
        });
    }
  }

  function onchangeHandler(id, key, value) {
    setUsers(users => {
      return users.map(user => {
        return user.id === id ? { ...user, [key]: value } : user;
      });
    });
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT", // use PUT to update instead of POST
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    })
      .then((res) => res.json())
      .then(data => {
        setUsers(users.map(u => u.id === id ? data : u)); // Replace the updated user in the state
        AppToaster.show({
          message: "User updated Successfully",
          intent: "success",
          timeout: 3000
        });
      })
      .catch(error => {
        setError(error.message);
      });
  }

  function DeleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setUsers(users => {
          return users.filter(user => user.id !== id);
        });
        setCount(prevCount => prevCount - 1); // Decrement count after deleting a user
      })
      .catch(error => {
        setError(error.message);
      });
  }

  return (
    <div className="App">
      {error ? (
        <p>Error fetching users: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Website</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <textarea className='textarea1'
                    onChange={(e) => onchangeHandler(user.id, 'email', e.target.value)}
                    value={user.email}
                  />
                </td>
                <td>
                  <textarea className='textarea1'
                    onChange={(e) => onchangeHandler(user.id, 'website', e.target.value)}
                    value={user.website}
                  />
                </td>
                <td>
                  <button onClick={() => updateUser(user.id)}>Edit</button>
                </td>
                <td><button onClick={() => DeleteUser(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>{count}</td>
              <td>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  className='inputbox'
                />
              </td>
              <td>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className='inputbox'
                />
              </td>
              <td>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Enter Website"
                  className='inputbox'
                />
              </td>
              <td>
                <button onClick={addUser}>Add User</button>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default App;

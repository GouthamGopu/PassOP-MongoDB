import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const ref = useRef();
  const [form, setForm] = useState({ url: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPassword = async () => {
    if (form.url.length > 3 && form.username.length > 3 && form.password.length > 3) {
      if (isEditing) {
        // Delete the old password from the database
        await fetch("http://localhost:3000/", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: form.id }),
        });
      }

      const newPassword = { ...form, id: isEditing ? form.id : uuidv4() };
      setPasswordArray([...passwordArray.filter(item => item.id !== form.id), newPassword]);

      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPassword),
      });

      // Clear the form and reset editing state
      setForm({ url: "", username: "", password: "" });
      setIsEditing(false);

      toast.success('Password Saved!', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.error('Error: Password not saved!');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyText = (text) => {
    toast.success('Copied To Clipboard!', {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    navigator.clipboard.writeText(text);
  };

  const deletePassword = async (id) => {
    if (window.confirm("Do you really want to delete this password?")) {
      setPasswordArray(passwordArray.filter(item => item.id !== id));
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success('Password Deleted!', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(item => item.id === id);
    setForm(passwordToEdit);
    setIsEditing(true);
  };

  return (
    <>
      <ToastContainer />
      <div className="text-white items-center flex flex-col md:w-1/2 md:mx-auto justify-center p-4">
        <div className="heading flex flex-col items-center my-6">
          <div className='text-2xl'>
            <span className='text-red-700'>&lt;</span>
            <span className='font-bold'>Pass</span>
            <span className='font-bold text-red-700'>OP/&gt;</span>
          </div>
          <p>Your own Password Manager</p>
        </div>
        <div className='website-url w-full flex justify-center gap-4 mb-2'>
          <input
            value={form.url}
            onChange={handleChange}
            placeholder='Enter Website Url'
            className='sm:w-full w-auto text-black rounded-full min-w-[200px] px-2'
            type="text"
            name="url"
            id="url"
          />
        </div>
        <div className="username-password flex-col justify-center w-full md:flex-row flex md:gap-4 mb-6 items-center">
          <input
            value={form.username}
            onChange={handleChange}
            placeholder='Enter Username'
            className='sm:w-full w-auto text-black rounded-full min-w-[200px] px-2 my-2'
            type="text"
            name="username"
            id="username"
          />
          <div className="relative sm:w-full w-auto">
            <input
              value={form.password}
              onChange={handleChange}
              placeholder='Enter Password'
              className='w-full text-black rounded-full px-2 my-2 md:my-0'
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
            />
            <img
              ref={ref}
              onClick={togglePasswordVisibility}
              className='absolute cursor-pointer md:top-1 md:right-2 right-2 top-3 w-4 h-4'
              src={showPassword ? "/eye.png" : "/eyecross.png"}
              alt="eye-icon"
            />
          </div>
        </div>
        <div className="addbutton">
          <button onClick={addPassword} className='flex items-center border gap-2 border-red-700 px-4 bg-red-700 rounded-full py-1'>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover">
            </lord-icon>
            {isEditing ? "Update" : "Save"}
          </button>
        </div>

        <div className="passwords w-full">
          <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
          {passwordArray.length === 0 && <div> No passwords to show</div>}
          {passwordArray.length !== 0 && <div className="overflow-x-auto">
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className='bg-red-700 text-white'>
                <tr>
                  <th className='py-2'>Website</th>
                  <th className='py-2'>Username</th>
                  <th className='py-2'>Password</th>
                  <th className='py-2'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-red-50 text-neutral-800'>
                {passwordArray.map((item, index) => (
                  <tr key={index}>
                    <td className='py-2 px-1 border border-white text-center'>
                      <div className='flex items-center justify-between'>
                        <a href={item.url} target='_blank' rel="noopener noreferrer">{item.url}</a>
                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.url) }}>
                          <lord-icon
                            style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover">
                          </lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='py-2 px-1 border border-white text-center'>
                      <div className='flex items-center justify-between'>
                        <span>{item.username}</span>
                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                          <lord-icon
                            style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover">
                          </lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='py-2 px-1 border border-white text-center'>
                      <div className='flex items-center justify-between'>
                        <span>{"*".repeat(item.password.length)}</span>
                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                          <lord-icon
                            style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover">
                          </lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='py-2 px-1 border border-white text-center'>
                    <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                        <lord-icon
                          src="https://cdn.lordicon.com/gwlusjdu.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </span>
                      <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>
      </div>
    </>
  );
};

export default Manager;

import React from 'react'
import { useEffect,useState } from 'react';

function Dashboard() {

  const BASE_URL = "http://localhost:8000";

  const [mode, setMode] = useState('CREATE'); //default
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      console.log('id', id);
      if (id) {
        setMode('EDIT');
        setSelectedId(id);

        try {
          const response = await axios.get(`${BASE_URL}/users/${id}`);
          console.log('data', response.data);
          const user = response.data

          let firstNameDOM = document.querySelector('input[name=firstname]')
          let lastNameDOM = document.querySelector('input[name=lastname]')
          let ageDOM = document.querySelector('input[name=age]')
          let descriptionDOM = document.querySelector('textarea[name=description]')

          firstNameDOM.value = user.firstname
          lastNameDOM.value = user.lastname
          ageDOM.value = user.age
          descriptionDOM.value = user.description

          let genderDOMs = document.querySelectorAll('input[name=gender]')
          let interestDOMs = document.querySelectorAll('input[name=interest]')

          for(let i=0;i<genderDOMs.length;i++){
            if(genderDOMs[i].value == user.gender) genderDOMs[i].checked = true
          }
          for(let i=0;i<interestDOMs.length;i++){
            if(user.interests.includes(interestDOMs[i].value)) interestDOMs[i].checked = true
          }

        } catch (error) {
          console.log('error', error);
        }
      }
    };

    fetchData();
  }, []);

  const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname) {
      errors.push("Add your name");
    }
    if (!userData.lastname) {
      errors.push("Add your lastname");
    }
    if (!userData.age) {
      errors.push("Add your age");
    }
    if (!userData.gender) {
      errors.push("Select your gender");
    }
    if (!userData.interests) {
      errors.push("Select your interests");
    }
    if (!userData.description) {
      errors.push("Add your description");
    }
    return errors;
  };

  const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')

    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}

    let descriptionDOM = document.querySelector('textarea[name=description]')

    let messageDOM = document.getElementById('message')

    try{
      let interest = ''
      for(let i=0 ; i<interestDOMs.length ; i++){
        interest += interestDOMs[i].value
        if(i != interestDOMs.length-1 ) interest += ', '
      }

      let userData = {
        firstname: firstNameDOM.value,
        lastname: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        interests: interest,
        description: descriptionDOM.value
      }

      console.log('summit data', userData)

      // const errors = validateData(userData)

      // if(errors.length > 0){
      //   throw {
      //     message: "Data incomplete from frontend",
      //     errors: errors
      //   }
      // }

      let message = 'Successful'
      if(mode == 'CREATE'){
        const response = await axios.post(`${BASE_URL}/users`, userData)
        console.log('response', response.data)
      } else {
        const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData)
        message = 'Edit successful'
        console.log('response', response.data)
      }
      // const response = await axios.post(`${BASE_URL}/users`, userData)
      // console.log('response', response.data)
      messageDOM.innerText = message

    } catch (error){
      console.log('error message', error.message)
      console.log('error',error.errors)
      if(error.response){
        console.log(error.response)
        error.message = error.response.data.message
        error.errors = error.response.data.errors
      }
      
      let htmlData = '<div>'
      htmlData += `<div>${error.message}</div>`
      htmlData += '<ul>'
      for(let i=0 ; i<error.errors.length ; i++){
          htmlData += `<li>${error.errors[i]}</li>`
      }
      htmlData += '</ul>'
      htmlData += '</div>'

      // messageDOM.innerText = 'Failed'
      messageDOM.innerHTML = htmlData
    }
    
  }

  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto my-4'>
        <div className='border border-gray-200 w-full rounded-xl p-4 mx-auto gap-4'>

          <div>
            <div className='text-lg'>
              FirstName
            </div>
            <input type='text' className='border rounded-md border-gray-200 w-full mx-auto' name='firstname' />
          </div>

          <div>
            <div className='text-lg'>
              SurName
            </div>
            <input type='text' className='border rounded-md border-gray-200 w-full mx-auto' name='lastname' />
          </div>
          <div>
            <div className='text-lg'>
              Age
            </div>
            <input type='text' className='border rounded-md border-gray-200 w-full mx-auto' name='age' />
          </div>

          <div>
            <div className='text-lg'>
              Gender
            </div>
            <div>
              <input name='gender' type='radio' value="male" /> <span>Male</span>
            </div>
            <div>
              <input name='gender' type='radio' value="female" /> <span>Female</span>
            </div>
            <div>
              <input name='gender' type='radio' value="undefined" /> <span>Undefined</span>
            </div>
          </div>

          <div>
            <div className='text-lg'>
              Interest
            </div>
            <div>
              <input name="interest" type="checkbox" value="Full Stack" /> Full Stack
            </div>
            <div>
              <input name="interest" type="checkbox" value="Blockchain" /> Blockchain
            </div>
            <div>
              <input name="interest" type="checkbox" value="Cyber Security" /> Cyber Security
            </div>
          </div>

        </div>
        <div className='border border-gray-200 w-full rounded-xl p-4 mx-auto gap-4'>
          <div>
            <div className='text-lg'>
              Details
            </div>
            <div>
            <textarea
              name='description'
              id=""
              className='border border-gray-200 rounded-md w-full h-80'
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className='text-center my-4' id='message'>

      </div>  
      <div className='text-center my-4'>
        <button className='py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-md active:bg-gray-400' onClick={submitData}>Submit</button>
      </div>
    </div>
  )
}

export default Dashboard
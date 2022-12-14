import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function Create() {
 const [form, setForm] = useState({
  meta: "",
  submitter: ""
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newMeta = { ...form };
 
   await fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newMeta),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ meta: "", submitter: ""});
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
  <div class="container-lg">
    <br />
     <h3>Add New Meta</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="Meta">Meta</label>
         <input
           type="text"
           className="form-control"
           id="Meta"
           value={form.meta}
           onChange={(e) => updateForm({ meta: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="Submitter">Submitter</label>
         <input
           type="text"
           className="form-control"
           id="submitter"
           value={form.submitter}
           onChange={(e) => updateForm({ submitter: e.target.value })}
         />
       </div>
       <br />
       <div className="form-group">
         <input
           type="submit"
           value="Add to the meta"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
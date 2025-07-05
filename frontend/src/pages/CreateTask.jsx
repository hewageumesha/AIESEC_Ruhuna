import React, { useEffect, useState } from 'react';

const CreateTask: React.FC = () => {
    const [departments, setDepartments] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedFunction, setSelectedFunction] = useState('');
    const [assignTo, setAssignTo] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/departments')
            .then(res => res.json())
            .then(data => setDepartments(data));
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetch(`http://localhost:8080/api/functions/${selectedDepartment}`)
                .then(res => res.json())
                .then(data => setFunctions(data));
        }
    }, [selectedDepartment]);

    useEffect(() => {
        if (selectedDepartment && selectedFunction) {
            fetch(`http://localhost:8080/api/users/${selectedDepartment}/${selectedFunction}`)
                .then(res => res.json())
                .then(data => setUsers(data));
        }
    }, [selectedDepartment, selectedFunction]);

    return (
        <div>
            <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                <option value="">Select Department</option>
                {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>

            <select value={selectedFunction} onChange={e => setSelectedFunction(e.target.value)}>
                <option value="">Select Function</option>
                {functions.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                ))}
            </select>

            <select value={assignTo} onChange={e => setAssignTo(e.target.value)}>
                <option value="">Select User</option>
                {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                ))}
            </select>
        </div>
    );
};

export default CreateTask;

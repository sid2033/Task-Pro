import React, {useState} from 'react'
import './Card.css';
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function Card({cName, cInfo, cUser, cTask, delFunc, editFunc}) {

    const [open, setOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editInfo, setEditInfo] = useState("");

    async function deleteCard() {

        const response = await fetch (`http://localhost:5000/delData`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                name : cName,
                info : cInfo,
                user_id : cUser,
                task_id : cTask
            })
        });
        delFunc();
    }

    const editNameSearch = e => {
        setEditName(e.target.value);
    }

    const editInfoSearch = e => {
        setEditInfo(e.target.value);
    }

    const makeChanges = async () => {
        setOpen(false);
        const response = await fetch (`http://localhost:5000/editData`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                name: editName,
                info: editInfo,
                user_id : cUser,
                task_id : cTask,
            })
        });
        setEditName("");
        setEditInfo("");
        editFunc();
    }
    
    return (
        <div className = "Card">
            <div id = "card-modal">
                <Modal
                closeIcon
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                >
                <Header icon="edit" content="Edit Task" />
                <Modal.Content>
                    <h1>Enter the new Task Name and Info</h1>
                    <h3>Name</h3>
                    <input type="text" placeholder="Task Name" value ={editName} onChange = {editNameSearch}></input>
                    <h3>Info</h3>
                    <input type="text" placeholder="Task Info" value = {editInfo} onChange = {editInfoSearch}></input>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="yellow" onClick={makeChanges}>
                    <Icon name="edit" /> Edit
                    </Button>
                </Modal.Actions>
                </Modal>
            </div>
            <h1 className = "taskname">{cName}</h1>
            <p className = "taskinfo">{cInfo}</p>
            <div className = "mainbuttons">
                <button id = "edit-button" onClick = {() => setOpen(true)}>Edit</button>
                <button id = "delete-button" onClick = {deleteCard}>Delete</button>
            </div>
        </div>
    );
}

export default Card;
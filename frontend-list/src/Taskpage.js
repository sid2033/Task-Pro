import React, {useEffect, useState} from 'react'
import './Taskpage.css';
import Card from "./Card";
import { useHistory, withRouter, Redirect } from "react-router-dom";

function Taskpage() {

    let history = useHistory();
    let curUser = localStorage.getItem("userID");

    const [cards, setCards] = useState({cards:[] , error: false});
    const [nameSearch, setNameSearch] = useState("");
    const [infoSearch, setInfoSearch] = useState("");
    const [added, setAdded] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        getMainData();
    },[added, deleted, edited]);

    async function getMainData() {
        let mainAuth = localStorage.getItem("authed")
        if (mainAuth === null || curUser === null) {
            history.push("/");
        }
        else {
            const response = await fetch (`http://localhost:5000/getData`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify({
                    user_id : curUser
                })
            });
            const mainData = await response.json();
            setCards({cards: mainData, error: false});
        }
    }

    const updateNameSearch = e => {
        setNameSearch(e.target.value);
    }

    const updateInfoSearch = e => {
        setInfoSearch(e.target.value);
    }

    const getSearch = e => {
        e.preventDefault();
        addMainData();
        setNameSearch("");
        setInfoSearch("");
    }

    const removeCard = () => {
        setDeleted(!deleted);
    }

    const editCard = () => {
        setEdited(!edited);
    }

    async function addMainData() {
        const response = await fetch (`http://localhost:5000/addData`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                name : nameSearch,
                info : infoSearch,
                user_id : curUser
            })
        });
        setAdded(!added);
        //const data = await response.json();
        //spread operator
        //setCards({...cards, cards: [...cards.cards, data]});
    }

    function retMenu() {
        localStorage.removeItem('authed');
        localStorage.removeItem('userID');
        history.push("/");
    }

    return (
    <div className="Taskpage">
        <div className = "menubar">
            <h1 className = "main-heading2">Your Tasks</h1>
            <button className = "main-menu" onClick = {retMenu}> Logout </button>
        </div>
        <form className = "add-task" onSubmit = {getSearch}>
            <div className = "text-input">
                <input type = "text" placeholder = "Enter Task Name" className = "inputs" onChange = {updateNameSearch} value = {nameSearch}></input>
                <input type = "text" placeholder = "Enter Task Info" className = "inputs" onChange = {updateInfoSearch} value = {infoSearch}></input>
            </div>
            <button type = "submit" className = "plus">+</button>
        </form>
        <div className = "cards">
        {
            cards.cards.map(card => {
                return (
                    <Card
                        cName = {card.name}
                        cInfo = {card.info}
                        cUser = {card.user_id}
                        cTask = {card.task_id}
                        delFunc = {removeCard}
                        editFunc = {editCard}
                    />
                );
            })
        }
        </div>
    </div>
    );
}

export default Taskpage;

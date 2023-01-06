import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

export default function SignUp() {

    const navigate = useNavigate()
    const body = {
        email: "",
        password: "",
        username: "",
        profilePicture: ""
    }

    function sign_up(e) {
        e.preventDefault()


        const promise = axios.post("https://linkr-api-cmhm.onrender.com/sign-up", body)
        promise.then(res => {

            console.log(res.data);
            navigate("/")
        })
        promise.catch(err => {

            console.log(err.response.data.message)
            alert("Dados cadastrais inválidos!")
        })
    }

    return (

        <ContainerSignup>
            <ContainerLeft>
                <p>linkr</p>
                <h1>save, share and discover the best links on the web</h1>
            </ContainerLeft>
            <ContainerRight>
                <ContainerInput>
                    <form onSubmit={sign_up}>
                        <input placeholder="e-mail" type="email" onChange={e => body.email = e.target.value} required></input>
                        <input placeholder="password" type="password" onChange={e => body.password = e.target.value} required></input>
                        <input placeholder="username" type="text" onChange={e => body.username = e.target.value} required></input>
                        <input placeholder="picture url" type="text" onChange={e => body.profilePicture = e.target.value} required></input>
                        <button type="submit" >Sign Up</button>
                    </form>
                </ContainerInput>
                <ContainerSwitch>
                    <Link to="/">
                        <h1>Switch back to log in</h1>
                    </Link>
                </ContainerSwitch>
            </ContainerRight>
        </ContainerSignup>
    )
}

//Styled Components
const ContainerSignup = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #151515;
`

const ContainerLeft = styled.div`
    background-color:  black;
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 250px;
    

    p{
        color: white;
        font-family: 'Passion One', sans-serif;
        font-weight: 700;
        font-size: 106px;
        padding-left: 50px;
    }

    h1{
        color: white;
        font-family: 'Passion One', sans-serif;
        font-weight: 700;
        font-size: 43px;
        line-height: 66px;
        padding-left: 50px;
    }
`

const ContainerRight = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
`

const ContainerInput = styled.div`

    form{
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    }

    input{
    border: 2px solid black;
    width: 300px;
    height: 55px;
    margin-bottom: 16px;
    border-radius: 7px;
    padding-left: 14px;
    font-family: 'Oswald', sans-serif;
    font-style: bold;
    font-weight: 700;
    font-size: 20px;
    }

    ::placeholder{
    font-family: 'Oswald', sans-serif;
    font-style: bold;
    font-weight: 700;
    font-size: 27px;
    margin-left: 55px;
    }

    button{
    width: 300px;
    height: 52px;
    background-color: #1877F2;
    border-radius: 7px;
    border: none;
    color: white;
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
    }
`
const ContainerSwitch = styled.div`
    margin-top: 25px;
    color: white;
    font-family: 'Oswald', sans-serif;

    h1{
        color: white;
        text-decoration: 1px solid white;
        
    }
`
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import searchIcon from "../assets/images/searchIcon.png"
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import { BASE_URL } from "./url";

export default function Header () {
    const [rotate, setRotate] = useState(false)
    const [name, setName] = useState("");
    const [profiles, setProfiles] = useState([])
    const token = "TEMP"
    const { data, setToken, config } = useContext(MyContext)

    useEffect(() => {
        if (name.length < 3) {
            setProfiles([])
            return
        }

        axios.get(`${BASE_URL}/users/${name}`, config)
        .then((res) => {
            setProfiles(res.data)
        })

    }, [name])

    function turnArrow () {
        if (rotate === false) {
            setRotate(true)
        } else {
            setRotate(false)
        }
    }

    return (
        <Container>
            <Link to={"/timeline"}>linkr</Link>

            <InputContainer profiles={profiles}>
                <img src={searchIcon} alt="Search Icon" />
                <DebounceInput 
                    placeholder="Search for people"
                    minLength={3}
                    debounceTimeout={300}
                    onChange={e => setName(e.target.value)} 
                />

                <div>
                    {profiles.map((p) => {
                        return (
                            <StyledLink to={`/user/${p.id}`} key={p.id}> 
                                <span>
                                    <img src={p.photo} alt="Profile Pic" />
                                    <h2>{p.name}</h2>
                                </span>
                            </StyledLink>
                        )
                    })}             
                </div>
                
            </InputContainer>
            
            <LogoutCase>
                {rotate ? <MdKeyboardArrowUp onClick={turnArrow}/> : <MdKeyboardArrowDown onClick={turnArrow}/>}
                
                <img onClick={turnArrow} src={data.user.photo} alt="user"/>

                <LogoutDiv rotate={rotate.toString()}> 
                    <Link 
                        onClick={() => { 
                            localStorage.removeItem("token"); 
                            localStorage.removeItem("data");
                            setToken('')
                        }} 
                        to={"/"}
                    >
                        Logout
                    </Link>
                </LogoutDiv>

                <LogoutBackground rotate={rotate.toString()} onClick={turnArrow}/> 
            </LogoutCase>
        </Container>
    )
}

//Styled Components
const Container = styled.header`
    position: relative;
    box-sizing: border-box;
    height: 70px;
    background-color: #151515;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-family: 'Passion One', cursive;
    padding: 0 30px;

    a {
        color: #ffffff;
        text-decoration: none;
        font-family: 'Passion One';
        font-style: normal;
        font-weight: 700;
        font-size: 49px;
        line-height: 54px;
        letter-spacing: 0.05em;
    }
`
const LogoutCase = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
    gap: 16px;
    
    svg {
        cursor: pointer;
        font-size: 35px;
    }

    img {
        cursor: pointer;
        width: 45px;
        height: 45px;
        border-radius: 500px;
    }
`
const LogoutDiv = styled.div`
    position: absolute;
    display: ${props => props.rotate === 'false' ? 'none' : 'flex'};
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 43px;
    bottom: -43px;
    right: 0px;
    background: #171717;
    border-radius: 0px 0px 0px 20px;
    cursor: pointer;

    a { 
        z-index: 2;
        cursor: pointer;  
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0.05em;
        color: #FFFFFF;
    }
`
const LogoutBackground = styled.div`
    z-index: 1;
    position: absolute;
    display: ${props => props.rotate === 'false' ? 'none' : 'flex'};
    left: 0;
    top: 0;
    width: 99.20vw;
    height: 100vh;
`
const InputContainer = styled.div`
    position: absolute;
    z-index: 1;
    right: 35%;

    input {
        width: 563px;
        height: 45px;
        border-radius: 8px;
        padding: 16px;
        font-size: 19px;
        border: none;

        &::placeholder {
            color: #C6C6C6;
            font-size: 19px;
        }
    }

    > * {
        &:first-child {
            position: absolute;
            right: 16px;
            bottom: 5px;
        }
    }

    div {
        width: 100%;
        height: 176px;
        position: absolute;
        top: 0;
        background-color: #E7E7E7;
        padding-top: 46px;
        border-radius: 8px;
        z-index: -1;
        top: 0;
        display: ${(props) => props.profiles.length === 0 ? 'none' : 'flex'};
        flex-direction: column;
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        span {
            display: flex;
            align-items: center;
            padding-left: 16px;
            padding: 8px;

            &:hover {
                cursor: pointer;
                background-color: #C6C6C6;
            }

            img {
                width: 39px;
                height: 39px;
                border-radius: 100%;
                margin-right: 12px;
            }

            h2 {
                color: #515151;
                font-size: 19px;
                font-family: 'Lato';
            }
        }
    }
`

const StyledLink = styled(Link)`
    text-decoration: none;
`
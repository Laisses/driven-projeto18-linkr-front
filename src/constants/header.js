import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import searchIcon from "../assets/images/searchIcon.png"
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import { BASE_URL } from "./url";

export default function Header () {
    const [name, setName] = useState("");
    const [profiles, setProfiles] = useState([])
    const { config } = useContext(MyContext)

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

    return (
        <Container>
            <h1>linkr</h1>

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
                <div>aqui vem a setinha</div>
                <img src="" alt="user"/>
            </LogoutCase>
        </Container>
    )
}

//Styled Components
const Container = styled.header`
    box-sizing: border-box;
    height: 70px;
    background-color: #151515;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-family: 'Passion One', cursive;
    padding: 0 30px;

    h1 {
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
    margin-left: 17px;
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
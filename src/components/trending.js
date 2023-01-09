import axios from "axios"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BASE_URL } from "../constants/url"
import MyContext from "../contexts/MyContext"
import { Oval } from "react-loader-spinner"

export default function TrendingList () {
    const [list, setList] = useState([])
    const { config, setCounter, counter } = useContext(MyContext)
    
    async function getTrending () {
        try {
            const res = await axios.get(`${BASE_URL}/hashtag`, config);
            setList(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getTrending()
    }, [counter])

    return (
        <Container>
            <h1>trending</h1>

            <ul>
                {
                list.length === 0
                    ?
                <Oval
                    color="white"
                    secondaryColor="gray"
                />
                    :
                list.map((t, idx) => 
                    <Link onClick={() => setCounter(counter + 1)} to={`/hashtag/${t.name}`} key={idx.toString()}>
                        <li> # {t.name}</li>
                    </Link>)}
            </ul>
        </Container>
    )
}

//Styled Components
const Container = styled.div`
    background-color: #171717;
    width: 301px;
    height: 406px;
    right: 260px;
    border-radius: 16px;
    margin-top: 155px;

    svg {
        width: 100%;
    }

    h1 {
        cursor: default;
        padding: 9px 16px;
        font-family: 'Oswald';
        font-style: normal;
        font-weight: 700;
        font-size: 27px;
        line-height: 40px;
        color: #FFFFFF;
        border-bottom: 1px solid #484848;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 22px 16px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 19px;
        line-height: 23px;
        letter-spacing: 0.05em;
        color: #FFFFFF;
    }
    
    a { 
        width: fit-content;
        text-decoration: none;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 19px;
        line-height: 23px;
        letter-spacing: 0.05em;
        color: #FFFFFF;
    }
`
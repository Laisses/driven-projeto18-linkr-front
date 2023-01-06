import styled from "styled-components";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { Link, useParams } from "react-router-dom";
import Header from "../constants/header";
import TrendingList from "../components/trending";
import { useContext, useEffect, useState } from "react";
import MyContext from "../contexts/MyContext";

export default function HashtagPage () {
    const { hashtag } = useParams()
    const { config } = useContext(MyContext)
    const [feed, setFeed] = useState([])

    console.log(feed)

    async function getFeed () {
        try {
            const res = await axios.get(`${BASE_URL}/hashtag/${hashtag}`, config)
            setFeed(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getFeed()
    }, [])

    return (
        <>
            <Header/>

            <Container>
                <LeftPart>
                    <h1># {hashtag}</h1>

                    <ul>
                        {feed.map((t, idx) => 
                            <li key={idx}> 
                                # {t.description}
                            </li>
                        )}
                    </ul>
                </LeftPart>

                <TrendingList/>
            </Container>
        </>
    )
}

//Styled Components
const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`
//"LeftPart" é o componente dos post, só fiz isso pra ver como fica
const LeftPart = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-right: 50px;
    margin-top: 50px;

    h1 {
        font-family: 'Oswald', cursive;
        color: #ffffff;
        font-style: normal;
        font-weight: 700;
        font-size: 43px;
        line-height: 64px;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 30px;
    }

    li {
        width: 611px;
        height: 276px;
        background: #171717;
        border-radius: 16px;
    }
`
import styled from "styled-components";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../constants/header";
import TrendingList from "../components/trending";
import { useContext, useEffect, useState } from "react";
import MyContext from "../contexts/MyContext";
import { ReactTagify } from "react-tagify"

export default function HashtagPage () {
    const { hashtag } = useParams()
    const { config, setCounter, counter } = useContext(MyContext)
    const [feed, setFeed] = useState([])
    const navigate = useNavigate()

    //Estilo da hashtag
    const tagStyle = {
        color: 'white',
        fontWeight: 700,
        cursor: 'pointer'
      };
    
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
    }, [counter])

    return (
        <>
            <Header/>

            <Container>
                <LeftPart>
                    <h1># {hashtag}</h1>

                    <ul>
                        {feed.map((t, idx) => 
                            <li key={idx}>
                                <div>
                                    <img src={t.photo} alt="user"/>
                                    {t.likes}
                                </div>

                                <span>
                                    {'t.name'}
                                    <ReactTagify
                                        tagStyle={tagStyle}
                                        tagClicked={(tag) => {
                                            setCounter(counter + 1)
                                            navigate(`/hashtag/${tag.replace('#', '')}`)
                                        }}
                                    >
                                        <p>
                                            {'t.description Olá meu nome é esdrinhas e tenho uma #react #javascript'}
                                        </p>
                                    </ReactTagify>

                                    {'t.link'}
                                </span>
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
        display: flex;
        padding: 17px;
        width: 611px;
        height: 276px;
        background: #171717;
        border-radius: 16px;

        div {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 70px;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 11px;
            line-height: 13px;
            text-align: center;
            color: #FFFFFF;
            margin-right: 18px;
        }

        span {
            width: 100%;
            gap: 7px;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 19px;
            line-height: 23px;
            color: #FFFFFF;

            p {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 17px;
                line-height: 20px;
                color: #B7B7B7;
                margin: 7px 0px;
            }
        }
    }
`
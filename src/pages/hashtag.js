import styled from "styled-components";
import axios from "axios";
import BASE_URL from "../constants/url";
import { Link, useParams } from "react-router-dom";
import Header from "../constants/header";

const trendings = ['react', 'html', 'css', 'js', 'angular', 'vue', 'php', 'c++', 'node', 'python']

export default function HashtagPage () {
    const { hashtag } = useParams()

    return (
        <>
            <Header/>

            <Container>
                <LeftPart>
                    <h1># {hashtag}</h1>

                    <ul>{trendings.map((t, idx) => <li key={idx}> # {t}</li>)}</ul>
                </LeftPart>

                <RigthPart>
                    <h1>trending</h1>

                    <ul>{trendings.map((t, idx) => <Link to={`/hashtag/${t}`}><li key={idx}> # {t}</li></Link>)}</ul>
                </RigthPart>
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
//"RightPart" é o componente da caixa "trending", fiz assim pra ver como fica 
const RigthPart = styled.div`
    background-color: #171717;
    width: 301px;
    height: 406px;
    right: 260px;
    border-radius: 16px;
    margin-top: 155px;

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
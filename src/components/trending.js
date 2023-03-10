import axios from "axios"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { BASE_URL } from "../constants/url"
import { MyContext } from "../contexts/MyContext"
import { Oval } from "react-loader-spinner"
import { device } from "../constants/device"

export default function TrendingList () {
    const [list, setList] = useState()
    const { config, setCounter, counter, token, setFollowingIds } = useContext(MyContext)
    const navigate = useNavigate()
    const { userId } = useParams()
    
    async function getTrending () {
        if (token === null) return "You must be logged in to access this page"

        try {
            const res = await axios.get(`${BASE_URL}/hashtag`, config);
            setList(res.data)
        } catch (err) {
            console.log(err)
            alert("You must login to access this page");
            navigate("/");
        }
    }

    useEffect(() => {
        getTrending()
    }, [counter])

    useEffect(() => {
        axios.get(`${BASE_URL}/following`, config)
        .then((res) => {
            setFollowingIds(res.data)
            
        })
    }, [counter])

    return (
        <Container userId={userId}>
            <h1>trending</h1>

            {
                list === undefined
                    ?
                <Oval
                    color="white"
                    secondaryColor="gray"
                />
                    :
                <ul>
                    {
                    list.length === 0
                        ?
                    <p>No hashtags have been tagged yet</p>
                        :
                    list.map((t, idx) =>
                        <Link onClick={() => setCounter(counter + 1)} to={`/hashtag/${t.name}`} key={idx.toString()}>
                            <li> # {t.name}</li>
                        </Link>)
                    }
                </ul>
            }
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
    margin-top: ${props => props.userId ? "54px" : "155px"};

    @media (max-width: 840px) {
        display: none;
    }

    svg {
        width: 100%;
        margin-top: 30px;
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

    @media ${device.laptop} {
        display: none;
    }
`
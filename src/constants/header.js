import styled from "styled-components";

export default function Header () {
    return (
        <Container>
            <h1>linkr</h1>

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
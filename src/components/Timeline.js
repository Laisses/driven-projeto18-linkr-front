import styled from "styled-components";

export const Timeline = () => {
    return (
        <TimelineBackground>
            <TimelineContainer>
                <Title>timeline</Title>
                <PublishContainer>
                    <ProfilePicture
                        src="https://i.pinimg.com/736x/aa/02/78/aa02780bbc7e6c5e2d52d9b0e919fbf6.jpg"
                        alt="profile picture"
                    />
                    <Form>
                        <FormTitle>What are you going to share today?</FormTitle>
                        <LinkInput
                            type="text"
                            id="link"
                            name="link"
                            placeholder="http://..."
                            required
                        />
                        <TextInput
                            id="description"
                            name="description"
                            placeholder="Awesome article about #javascript"
                        />
                        <Button>Publish</Button>
                    </Form>
                </PublishContainer>
                <PostsContainer>
                    <ProfilePicture
                        src="https://i.pinimg.com/736x/aa/02/78/aa02780bbc7e6c5e2d52d9b0e919fbf6.jpg"
                        alt="profile picture"
                    />
                    <Post>
                        <Username>Juvenal Juvêncio</Username>
                        <Description>Muito maneiro esse tutorial de Material UI com React, deem uma olhada!</Description>
                        <LinkContainer>
                            <LinkMetaData>
                                <LinkTitle>
                                    Como aplicar o Material UI em um
                                    projeto React
                                </LinkTitle>
                                <LinkDescription>
                                    Hey! I have moved this tutorial to my personal blog. Same content, new location. Sorry about making you click through to another page.
                                </LinkDescription>
                                <LinkUrl>
                                https://medium.com/@pshrmn/a-simple-react-router
                                </LinkUrl>
                            </LinkMetaData>
                            <LinkImage
                                src=""
                                alt="alt da foto do link"
                            />
                        </LinkContainer>
                    </Post>
                </PostsContainer>
            </TimelineContainer>
        </TimelineBackground>
    );
};

const TimelineBackground = styled.div`
    background-color: #333333;
`;

const TimelineContainer = styled.div`
    width: 616px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 78px;
`;

const Title = styled.h1`
    font-family: 'Oswald', sans-serif;
    font-size: 43px;
    color: #ffffff;
    margin-bottom: 43px;
`;

const PublishContainer = styled.div`
    width: 611px;
    height: 209px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 16px;
    display: flex;
    margin-bottom: 30px;
`;

const ProfilePicture = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const Form = styled.form`
    padding-left: 18px;
    display: flex;
    flex-direction: column;
`;

const FormTitle = styled.h2`
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    font-weight: 300;
    color: #707070;
    padding-top: 6px;
    padding-bottom: 10px;
`;

const LinkInput = styled.input`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
    width: 503px;
    height: 30px;
    border-radius: 3px;
    background-color: #EFEFEF;
    border: none;
    margin-top: 5px;
    padding-left: 10px;
    &:focus {
        outline: none;
    }
`;

const TextInput = styled.textarea`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
    width: 503px;
    height: 66px;
    border-radius: 3px;
    background-color: #EFEFEF;
    border: none;
    margin-top: 5px;
    padding-top: 5px;
    padding-left: 10px;
    resize: none;
    &:focus {
        outline: none;
    }
`;

const Button = styled.button`
    width: 112px;
    height: 31px;
    border: none;
    border-radius: 5px;
    margin-top: 5px;
    color: #ffffff;
    background-color: #1877F2;
    align-self: flex-end;
`;

const PostsContainer = styled.div`
    width: 611px;
    height: 276px;
    padding: 16px;
    margin-top: 16px;
    border-radius: 16px;
    color: #ffffff;
    background-color: #171717;
    display: flex;
`;

const Post = styled.div`
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    padding-left: 18px;
`;

const Username = styled.h3`
    font-size: 19px;
    padding-top: 6px;
`;

const Description = styled.div`
    font-size: 17px;
    color: #B7B7B7;
    padding-top: 10px;
`;

const LinkContainer = styled.div`
    width: 503px;
    height: 155px;
    border: 1px solid #4D4D4D;
    border-radius: 11px;
    margin-top: 10px;
    display: flex;
`;

const LinkMetaData = styled.div`
    width: 349px;
    padding: 24px;
`;

const LinkImage = styled.img`
    background-color: white;
    width: 154px;
    height: 155px;
    border-radius: 0px 12px 13px 0px;
`;

const LinkTitle = styled.h4`
    font-size: 16px;
    color: #CECECE;
`;

const LinkDescription = styled.p`
    font-size: 11px;
    color: #9B9595;
    margin-top: 10px;
`;

const LinkUrl = styled.p`
    font-size: 11px;
    color: #CECECE;
    margin-top: 16px;
`;

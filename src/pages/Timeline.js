import axios from "axios";
import { BASE_URL } from "../constants/url";
import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import MyContext from '../components/MyContext';

export const Timeline = () => {
    const [posts, setPosts] = useState(undefined);
    const {config, user} = useContext(MyContext);
    const [form, setForm] = useState({description: "", link: ""});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        getPosts();
    }, [setErrorMessage]);

    const getPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/imeline`, config);
            setPosts(res.data);
        } catch (error) {
            setErrorMessage(true);
        }
    };

    const ListofPosts = post => {
        const {description, link, user} = post;

        return (
            <PostsContainer>
                <ProfilePicture
                    src={user.photo}
                    alt="profile picture"
                />
                <Post>
                    <Username>{user.name}</Username>
                    <Description>{description}</Description>
                    <LinkContainer>
                        <LinkMetaData>
                            <LinkTitle>{link.title}</LinkTitle>
                            <LinkDescription>{link.hint}</LinkDescription>
                            <LinkUrl>{link.address}</LinkUrl>
                        </LinkMetaData>
                        <LinkImage
                            src={link.image}
                            alt="icon of text"
                        />
                    </LinkContainer>
                </Post>
            </PostsContainer>

        );
    };

    const Posts = () => {
        if (!posts) {
            return <Message>Loading...</Message>
        } else if (posts.length === 0) {
            return <Message>There are no posts yet</Message>
        } else if (posts) {
            return (
                <ul>
                    {posts.map(p => <ListofPosts
                        key={p.id}
                        {...p}
                    />)}
                </ul>
            );
        }
    };

    const handleForm = e => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const validateURL = url => {
        const regex = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

        return regex.test(url);
    };

    //async quando usar axios
    const submitForm = async () => {
        setLoading(true);

        const validURL = validateURL(form.link);

        if (!validURL) {
            setLoading(false);
            return alert("You must choose a valid link!");
        }

        //setLoading(false)
        //setForm({description: "", link: ""})
    };

    return (
        <TimelineBackground>
            <TimelineContainer>
                <Title>timeline</Title>
                <PublishContainer>
                    <ProfilePicture
                        src={user.photo}
                        alt="profile picture"
                    />
                    <Form>
                        <FormTitle>What are you going to share today?</FormTitle>
                        <LinkInput
                            type="text"
                            id="link"
                            name="link"
                            placeholder="http://..."
                            value={form.link}
                            onChange={handleForm}
                            disabled={loading}
                            required
                        />
                        <TextInput
                            id="description"
                            name="description"
                            placeholder="Awesome article about #javascript"
                            value={form.description}
                            onChange={handleForm}
                            disabled={loading}
                        />
                        {!loading
                            ? <Button onClick={submitForm}>Publish</Button>
                            : <Button disabled={loading}>Publishing</Button>
                        }
                    </Form>
                </PublishContainer>
                {!errorMessage
                    ? <Posts />
                    : <Message>An error occured while trying to fetch the posts, please refresh the page</Message>
                }
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

const Message = styled.p`
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    color: #ffffff;
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
    background-color: ${props => !props.disabled ? "#1877F2" : "#1154ab"};
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

const Post = styled.li`
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
    overflow: hidden;
    text-overflow: ellipsis;
`;

const LinkDescription = styled.p`
    font-size: 11px;
    color: #9B9595;
    margin-top: 10px;
    max-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const LinkUrl = styled.p`
    font-size: 11px;
    color: #CECECE;
    margin-top: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

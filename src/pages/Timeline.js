import { BASE_URL } from "../constants/url";
import styled from "styled-components";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { TiDelete, TiPencil, TiTrash } from "react-icons/ti";
import { useContext, useEffect, useState } from "react";
import MyContext from '../contexts/MyContext';
import TrendingList from "../components/trending";
import Header from "../constants/header";
import axios from "axios";
import { Link } from "react-router-dom";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ReactTagify } from "react-tagify"
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import { device } from "../constants/device";


export const Timeline = () => {
    const { config, counter, setCounter, data } = useContext(MyContext);
    const [posts, setPosts] = useState([]);
    const [postsLikes, setPostsLikes] = useState([])
    const [form, setForm] = useState({description: "", link: ""});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPostId, setModalPostId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [postsLikesUserId, setPostsLikesUserId] = useState([])
    const navigate = useNavigate()

    if (data === null) {
        window.location.reload()
    }

    const getPostsLikes = () => {
        const newPostsLikes = {}
        const newPostsLikesUserId = {}
        const promisses = []
        posts.forEach( (post) => {
            const request = axios.get(`${BASE_URL}/likes?post_id=${post.id}`, config);
            promisses.push(request)
            request.then((res)=>{
                newPostsLikes[post.id] = res.data.map(user => user)
                newPostsLikesUserId[post.id] = res.data.map(user => user.id)
            }).catch(error => {
                    alert("Algo deu errado e a culpa é nossa. =/");
                console.log(error);
            })
        })
        Promise.all(promisses).then(()=>setPostsLikes(newPostsLikes)).then(()=>setPostsLikesUserId(newPostsLikesUserId))
    }

    const deletePostHandler = async (postId) => {
        try {
            await axios.delete(`${BASE_URL}/timeline/${postId}`, config);
            setIsModalOpen(false);
            setModalPostId(null)
            getPosts();
        } catch (error) {
            setErrorMessage(true);
        }
    }

    const getPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/timeline`, config);
            setPosts(res.data);
        } catch (error) {
            setErrorMessage(true);
        }
    };

    const openNewTab = url => {
        window.open(url, '_blank').focus();
    };

    useEffect(() => {
        getPosts();
    }, [setErrorMessage]);

    useEffect(() => {
        getPostsLikes();
    }, [posts]);

    const likeHandler = (postId) => {
        const request = axios.post(`${BASE_URL}/likes`, {id: postId}, config);
            request.then((res) => {
                getPostsLikes();
            });
        request.catch((err) => {
            alert("Algo deu errado e a culpa é nossa. =/");
            console.log(err);
        });
    }

    const addHashtag = async (name, post_id) => {
        try {
            await axios.post(`${BASE_URL}/hashtag`, { name, post_id }, config);
            setCounter(counter + 1)
        } catch (err) {
            console.log(err);
        }
    }

    const editHashtag = async (post_id, text) => {
        try {
            await axios.delete(`${BASE_URL}/hashtag/${post_id}`, config);
            setCounter(counter + 1)
        } catch (err) {
            console.log(err);
        }

        const descriptionWords = text.split(" ")

        descriptionWords.map((w) => {
            if (w.includes("#")) {
                addHashtag(w.replace("#", ""), post_id)
            }
        })
    }

    const submitNewDesc = async (id, text, onErrorFn) => {
        try {
            await axios.put(`${BASE_URL}/timeline`, {post_id: id, description: text}, config);
            getPosts();
        } catch (err) {
            alert("Sorry! Something went wrong, please try again later!")
            onErrorFn();
        }
    };

    

    const ListofPosts = post => {
        const { id, description, link, user: u, likes } = post;
        const [editing, setEditing] = useState(false);
        const [edit, setEdit] = useState(false);
        const [text, setText] = useState(description);

        
        const tooltipInfo = (postId) => {
            const result = postsLikes[postId]?.map((like) => {
                return (
                <TooltipLike key={like.id}>
                <TooltipImg src={like.photo}/>
                <TooltipName>{like.name}</TooltipName>
                </TooltipLike>)
            }, [])
            return <TooltipContainer>{result}</TooltipContainer>
        }

        //Estilo da hashtag
        const tagStyle = {
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer'
        };

        return (
            <PostsContainer>
                <ProfilePicture
                    src={u.photo}
                    alt="profile picture"
                />
                <Post>
                    <PostHeader>
                        <StyledLink to={`/user/${u.id}`}><Username>{u.name}</Username></StyledLink>
                        {
                            data.user.id === u.id
                                ?
                                <HeaderIcons>
                                <div>
                                    <EditIcon onClick={() => {
                                        setEdit(!edit);
                                        setText(description);
                                    }}>
                                        <TiPencil size={"20px"} />
                                    </EditIcon>
                                </div>
                                <div>
                                    <DeleteIcon onClick={() => {
                                        openModal(id)
                                    }}>
                                        <TiTrash size={"20px"} />
                                    </DeleteIcon>
                                </div>
                                </HeaderIcons>
                                :
                                <></>
                        }
                    </PostHeader>
                    {
                        !edit
                            ?
                            <ReactTagify
                                tagStyle={tagStyle}
                                tagClicked={(tag) => {
                                    navigate(`/hashtag/${tag.replace('#', '')}`)
                                }}
                            >
                                <Description>{description}</Description>
                            </ReactTagify>
                            :
                            <EditInput
                                id="edit"
                                name="edit"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                disabled={editing}
                                autoFocus={true}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        editHashtag(id, text)
                                        setEditing(true);
                                        submitNewDesc(id, text, () => setEditing(false));
                                    } else if (e.key === "Escape") {
                                        setEdit(false);
                                        setText(description);
                                    }
                                }}
                            />
                    }
                    <LinkContainer>
                        <LinkMetaData onClick={() => openNewTab(link.address)}>
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
                <LikeIcon id={`anchor-element${id}`} onClick={()=>{
                    getPosts()
                    likeHandler(id)
                    }}>
                    {postsLikesUserId[id]?.includes(data.user.id) ? <IoIosHeart color="red" size={"30px"} /> : <IoIosHeartEmpty size={"30px"} />}
                    <LikeText>{`${likes} likes`}</LikeText>
                </LikeIcon>
                <Tooltip anchorId={`anchor-element${id}`} place="bottom">{tooltipInfo(id)}</Tooltip>
            </PostsContainer>
        );
    };

    const Posts = () => {
        if (!posts) {
            return <Message>Loading...</Message>
        } else if (posts.length === 0) {
            return <Message>There are no posts yet</Message>
        } else if (!Object.keys(postsLikes).length) {
            return <Message>Loading...</Message>
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
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validateURL = url => {
        const regex = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

        return regex.test(url);
    };

    const submitForm = async () => {
        setLoading(true);

        const validURL = validateURL(form.link);
        const descriptionWords = form.description.split(" ")

        if (!validURL) {
            setLoading(false);
            return alert("You must choose a valid link!");
        }

        try {
            const res = await axios.post(`${BASE_URL}/timeline`, form, config);

            descriptionWords.map((w) => {
                if (w.includes("#")) {
                    addHashtag(w.replace("#", ""), res.data.post_id)
                }
            })

            setLoading(false);
            setForm({ description: "", link: "" });
            getPosts();
        } catch (error) {
            setLoading(false);
            alert("Houve um erro ao publicar seu link");
        }
    };

    const openModal = (id) => {
        setIsModalOpen(true)
        setModalPostId(id)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <Header />
            <ReactModal
                    isOpen={isModalOpen}
                    contentLabel="Minimal Modal Example"
                    style={{overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      },
                      content: {
                        position: 'absolute',
                        width: '497px',
                        height: '262px',
                        top: '30%',
                        bottom: '30%',
                        left: '30%',
                        right: '30%',
                        border: '1px solid #333333',
                        background: '#333333',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '50px',
                        outline: 'none',
                        padding: '20px',

                      }}}
                >
                    <ModalContainer>
                        <ModalText>Are you sure you want to delete this post?</ModalText>
                        <ModalButtons>
                        <ModalButtonCancel onClick={closeModal}>Cancelar</ModalButtonCancel>
                        <ModalButtonConrfirm onClick={() => deletePostHandler(modalPostId)}>Confirmar</ModalButtonConrfirm>
                        </ModalButtons>
                    </ModalContainer>
            </ReactModal>
            <TimelineBackground>
                <TimelineContainer>
                    <Title>timeline</Title>
                    <PublishContainer>
                        <ProfilePictureForm
                            src={data.user.photo}
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
                <TrendingList/>
            </TimelineBackground>
        </>
    );
};

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #FFFFFF;
`

const TimelineBackground = styled.div`
    background-color: #333333;
    display: flex;
    justify-content: center;
`;

const TimelineContainer = styled.div`
    margin-right: 50px;
    padding-top: 70px;
    max-width: 611px;
    min-width: 611px;

    @media ${device.laptop} {
        margin-right: 0;
        min-width: 0;
    }

    @media ${device.tablet} {
        width: 100%;
        min-width: 0;
    }
`;

const Title = styled.h1`
    font-family: 'Oswald', sans-serif;
    font-size: 43px;
    color: #ffffff;
    margin-bottom: 43px;

    @media ${device.mobileL} {
        padding-left: 16px;
    }
`;

const PublishContainer = styled.div`
    height: 209px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 16px;
    display: flex;
    margin-bottom: 30px;

    @media ${device.tablet} {
        border-radius: 0;
    }
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
    width: 90%;

    @media ${device.mobileL} {
        width: 100%;
        padding-left: 0;
    }
`;

const ProfilePictureForm = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;

    @media ${device.mobileL} {
        display: none;
    }
`;

const FormTitle = styled.h2`
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    font-weight: 300;
    color: #707070;
    padding-top: 6px;
    padding-bottom: 10px;

    @media ${device.mobileL} {
        text-align: center;
    }
`;

const LinkInput = styled.input`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
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

const EditInput = styled.textarea`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
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
    cursor: pointer;
`;

const PostsContainer = styled.div`
    position: relative;
    width: 611px;
    height: 276px;
    padding: 16px;
    margin-top: 16px;
    border-radius: 16px;
    color: #ffffff;
    background-color: #171717;
    display: flex;

    @media (max-width: 840px) {
        border-radius: 0;
        width: 100%;
    }
`;

const Post = styled.li`
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    padding-left: 18px;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
`;

const Username = styled.div`
    font-size: 19px;
`;

const HeaderIcons = styled.div`
    display: flex;
`

const EditIcon = styled.div`
    width: 24px;
`;

const DeleteIcon = styled.div`
    width: 24px;
`;

const Description = styled.div`
    font-size: 17px;
    color: #B7B7B7;
    padding-top: 10px;
`;

const LinkContainer = styled.div`
    height: 155px;
    border: 1px solid #4D4D4D;
    border-radius: 11px;
    margin-top: 10px;
    display: flex;
`;

const LinkMetaData = styled.div`
    width: 70%;
    padding: 24px;

    @media ${device.mobileL} {
        width: 60%;
    }
`;

const LinkImage = styled.img`
    background-color: white;
    width: 30%;
    border-radius: 0px 12px 13px 0px;

    @media ${device.mobileL} {
        width: 40%;
    }
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

const LikeIcon = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 30%;
    left: 25px;
    width: auto;
    height: auto;
    gap: 5px;
`;

const LikeText = styled.span`
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #FFFFFF;
    width: 35px;
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`

const ModalText = styled.span`
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 34px;
    line-height: 41px;
    text-align: center;
    color: #FFFFFF;
margin-bottom: 35px;
margin-top: 10px;
`

const ModalButtons = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`

const ModalButtonCancel = styled.button`
    width: 134px;
    height: 37px;
    left: 733px;
    top: 509px;
    background: #FFFFFF;
    border-radius: 5px;
    border: none;
`

const ModalButtonConrfirm = styled.button`
    width: 134px;
    height: 37px;
    background: #1877F2;
    border-radius: 5px;
    border: none;
`

const TooltipContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100px;
`

const TooltipLike = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 15px;
`

const TooltipImg = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
`

const TooltipName = styled.span`
    font-family: 'Lato', sans-serif;
    text-align: center;
    color: #FFFFFF;
`